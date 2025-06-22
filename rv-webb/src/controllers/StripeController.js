import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.WEBHOOK_SECRET_KEY;

export const purchased = async(req, res) => {
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
            const session = await stripe.checkout.sessions.retrieve();
            
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