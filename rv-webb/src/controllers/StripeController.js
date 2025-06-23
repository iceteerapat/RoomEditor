import Stripe from "stripe";
import Service from "../models/rvService.js";
import AccountService from "../models/rvAccountService.js";
import Account from "../models/rvAccount.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.WEBHOOK_SECRET_KEY;

export const purchased = async(req, res) => {
    const auth = localStorage.getItem('token');
    if(!auth){
        return res.status(401).jason({ message: 'Token required'});
    }
    const data = decodeJwt(token);
    const customerId = data.customerId || '';

    const event = req.body;
    if(endpointSecret){
        const signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return response.sendStatus(400);
        }
    }
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            console.log(session);
            if(session.mode === 'subscription'){
                const service = await AccountService.findOne({ where: { customerId: customerId}});
            }
            
            break;
        }

        case 'customer.subscription.deleted': {
            const paymentMethod = event.data.object;

            break;
        }

        default:
        console.log(`Unhandled event type ${event.type}`);
    }
    response.status(200).json({received: true});
}