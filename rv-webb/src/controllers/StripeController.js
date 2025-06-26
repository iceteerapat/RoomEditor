import Stripe from "stripe";
import Service from "../models/rvService.js";
import AccountService from "../models/rvAccountService.js";
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.WEBHOOK_SECRET_KEY;

export const purchased = async(req, res) => {
    const { priceId, userEmail, checkoutMode } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    }catch(error){
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        console.error('JWT verification error:', error);
        return res.status(500).json({ message: 'Authentication failed' });
    }
    const customerId = decodedToken.customerId;

    try{
        const session = await stripe.checkout.sessions.create({
            line_items:[
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            mode: checkoutMode,
            success_url: `${process.env.BASE_URL}/service`,
            cancel_url: `${process.env.BASE_URL}/cancel`,
            customer_email: userEmail,
            metadata: {
                internalCustomerId: customerId,
            }
        });
    res.status(200).json({ url: session.url });
    }catch(error){
        console.error('Stripe Checkout Session creation failed:', error);
        res.status(500).json({ message: 'Error creating checkout session.' });
    }
}

export const handleWebhook = async(req, res) => {
    let event = req.body;
    if (endpointSecret) {
        const signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return res.sendStatus(400).json({ message: 'Error, please re-login.' });
        }
    }
    try{
        switch(event.type){
            case 'checkout.session.completed': {
                const session = event.data.object;
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
                    expand: ['data.price.product']
                });

                const internalCustomerId = session.metadata?.internalCustomerId;
                if (!internalCustomerId) {
                    console.error(`Missing metadata for session ${session.id}. Cannot link to internal user.`);
                    return res.sendStatus(400).json({ message: 'Error, please re-login.' });
                }

                const userService = await AccountService.findOne({ where: { customerId: internalCustomerId } });
                if (!userService) {
                    console.error(`Account not found for internalUserId: ${internalCustomerId}`);
                    return res.sendStatus(404).json({ message: 'Account not found.' });
                }
                if (!userService.stripeCustomerId) {
                    await AccountService.update(
                        { stripeCustomerId: session.customer }, // session.customer is Stripe's cus_ID
                        { where: { customerId: internalCustomerId } }
                    );
                    console.log(`Updated user ${internalCustomerId} with Stripe Customer ID: ${session.customer}`);
                }

                if (session.mode === 'subscription') {
                    const subscriptionId = session.subscription; 
                    const purchasedPrice = lineItems.data[0]?.price;

                    if (!purchasedPrice) {
                        console.error(`Price not found in line items for subscription session ${session.id}`);
                        return res.sendStatus(400).json({ message: 'Price not found.' });
                    }
                    console.log(`Subscription ${subscriptionId} created for user ${internalCustomerId} with Price: ${purchasedPrice.id}`);
                    console.log(`Plan: ${purchasedPrice.product.name}, Interval: ${purchasedPrice.recurring.interval}`);

                    if(purchasedPrice.recurring.interval === 'year'){
                        const service = await Service.findOne({ where :{ recId: 3}});
                        userService.serviceName = service.serviceName;
                        userService.serviceAccess = 'Y';
                        userService.serviceId = service.recId;
                        userService.imageGenerated = userService.imageGenerated + service.serviceUsage;
                        await userService.save();
                    }else {
                        const service = await Service.findOne({ where :{ recId: 2}});
                        userService.serviceName = service.serviceName;
                        userService.serviceAccess = 'Y';
                        userService.serviceId = service.recId;
                        userService.imageGenerated = userService.imageGenerated + service.serviceUsage;
                        await userService.save();
                    }
                    console.log(`AccountService updated for customer ${internalCustomerId} with new subscription.`);

                } else if (session.mode === 'payment') {
                    const service = await Service.findOne({ where :{ recId: 1 }});
                    userService.serviceName = service.serviceName;
                    userService.serviceAccess = 'Y';
                    userService.serviceId = service.recId;
                    await AccountService.increment('imageGenerated', { by: 35, where: { customerId: internalCustomerId } });
                    console.log(`User ${internalCustomerId} granted credits.`);
                    await userService.save();
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const stripeCustomerId = subscription.customer;
                const userService = await AccountService.findOne({ where: { stripeCustomerId: stripeCustomerId } });

                if (userService) {
                    const service = await Service.findOne({ where :{ recId: 1 }});
                    userService.serviceName = service.serviceName;
                    userService.serviceAccess = 'N';
                    userService.serviceId = service.recId;
                    userService.imageGenerated = 0;
                    await userService.save();
                    console.log(`AccountService marked as canceled for customer ${userService.customerId}.`);
                }
                break;
            }
        }        
    }catch(error){
        console.log("Internal Error: ", error);
        res.status(200).json({ message: 'Internal Error'})
    }
}

export const managed = async(req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    }catch(error){
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        console.error('JWT verification error:', error);
        return res.status(500).json({ message: 'Authentication failed' });
    }
    
    const customerId = decodedToken.customerId;
    const email = decodedToken.email;
    try{
        const userService = await AccountService.findOne({ where: {customerId: customerId}});
        if (!userService) {
            return res.status(404).json({ message: 'User account not found.' });
        }
        
        let stripeCustomerId = userService.stripeCustomerId;
        if(!stripeCustomerId){
            const customer = await stripe.customers.create({
                email: email,
                metadata: {customerId}
            });
            
            stripeCustomerId = customer.id;
            await userService.update({ stripeCustomerId: stripeCustomerId});
        }
        
        const session = await stripe.billingPortal.sessions.create({
        customer: userService.stripeCustomerId,
        return_url: `${process.env.BASE_URL}/service`
        });

        res.json({ url: session.url });
    }catch(error){
        console.error('Error creating billing portal session:', error);
        res.status(500).json({ message: error.message });
    }
}