import Stripe from "stripe";
import Product from "../models/Product.js";
import Service from "../models/Service.js";
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

    const service = await Service.findOne({ where: {customerId: customerId}});
    if(!service.stripeCustomerId){
        console.error(`Service not found for internalUserId: ${customerId}`);
        return res.sendStatus(404).json({ message: 'Account not found.' });
    }

    try{
        const session = await stripe.checkout.sessions.create({
            line_items:[
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            mode: checkoutMode,
            success_url: `${process.env.BASE_URL}/service/create`,
            cancel_url: `${process.env.BASE_URL}/service/create`,
            customer: service.stripeCustomerId,
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

                const userService = await Service.findOne({ where: { customerId: internalCustomerId } });
                if (!userService) {
                    console.error(`Account not found for internalUserId: ${internalCustomerId}`);
                    return res.sendStatus(404).json({ message: 'Account not found.' });
                }
                if (!userService.stripeCustomerId) {
                    await Service.update(
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
                        const product = await Product.findOne({ where :{ recId: 4}});
                        userService.serviceName = product.productName;
                        userService.serviceAccess = 'Y';
                        userService.serviceId = product.recId;
                        userService.credits = userService.credits + product.creditGrant;
                        await userService.save();
                    }else {
                        const product = await Product.findOne({ where :{ recId: 3}});
                        userService.serviceName = product.productName;
                        userService.serviceAccess = 'Y';
                        userService.serviceId = product.recId;
                        userService.credits = userService.credits + product.creditGrant;
                        await userService.save();
                    }
                    console.log(`Service updated for customer ${internalCustomerId} with new subscription.`);

                } else if (session.mode === 'payment') {
                    const product = await Product.findOne({ where :{ recId: 2 }});
                    userService.serviceName = product.productName;
                    userService.serviceAccess = 'Y';
                    userService.serviceId = product.recId;
                    await Service.increment('credits', { by: 35, where: { customerId: internalCustomerId } });
                    console.log(`User ${internalCustomerId} granted credits.`);
                    await userService.save();
                }

                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const stripeCustomerId = subscription.customer;
                const userService = await Service.findOne({ where: { stripeCustomerId: stripeCustomerId } });

                if (userService) {
                    const product = await Product.findOne({ where :{ recId: 1 }});
                    userService.serviceName = product.serviceName;
                    userService.serviceAccess = 'N';
                    userService.serviceId = product.recId;
                    userService.credits = 0;
                    await userService.save();
                    console.log(`Service marked as canceled for customer ${userService.customerId}.`);
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
        const userService = await Service.findOne({ where: {customerId: customerId}});
        if (!userService) {
            return res.status(404).json({ message: 'User account not found.' });
        }
        
        // let stripeCustomerId = userService.stripeCustomerId;
        // if(!stripeCustomerId){
        //     const customer = await stripe.customers.create({
        //         email: email,
        //         metadata: {customerId}
        //     });
            
        //     stripeCustomerId = customer.id;
        //     await userService.update({ stripeCustomerId: stripeCustomerId});
        // }
        
        const session = await stripe.billingPortal.sessions.create({
        customer: userService.stripeCustomerId,
        return_url: `${process.env.BASE_URL}/service/create`
        });

        res.json({ url: session.url });
    }catch(error){
        console.error('Error creating billing portal session:', error);
        res.status(500).json({ message: error.message });
    }
}