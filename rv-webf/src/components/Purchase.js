import { decodeJwt } from './DecodeJwt.js';
import { useMessageDialog } from './MessageDialog.js'; 
import RepositoriesFactory from '@/apis/repositories/RepositoriesFactory.js';

const repository = RepositoriesFactory.get('PurchaseRepository');

const priceOneAtATimeId = 'price_1RlTryGbnW1BWWOPg14TrN5d';
const priceSubscribeMonthlyId = 'price_1RlTryGbnW1BWWOPuDtA2xkg';
const priceSubscribeAnnuallyId = 'price_1RlTryGbnW1BWWOPV3nxeIJN';
const messageDialog = useMessageDialog();

export async function handlePlanSelection(planName, billingCycle, router) {
  const token = localStorage.getItem('token');
  const data = decodeJwt(token);
  let selectedPriceId = null;
  let checkoutMode = 'payment';

  if (planName === 'Subscription') {
    checkoutMode = 'subscription';
    if (billingCycle === 'Monthly') {
      selectedPriceId = priceSubscribeMonthlyId;
    } else if (billingCycle === 'Annually') {
      selectedPriceId = priceSubscribeAnnuallyId;
    } else {
      console.error("Internal Error Occured, please refresh page");
      return;
    }
  } else if (planName === 'Enterprise') {
    router.push('/contact');
    return; 
  } else if (planName === 'One at a time') { 
    selectedPriceId = priceOneAtATimeId;
  } else {
    console.error("Internal Error Occured, please refresh page");
    return; 
  }

  if(selectedPriceId){
    try{
      const response = await repository.create({priceId: selectedPriceId, userEmail: data?.email, checkoutMode: checkoutMode});
      const session = response.data;
      if (session && session.url) {
        window.location.href = session.url;
      } else {
        console.error("Backend did not return a valid Stripe Checkout Session URL.", session);
        messageDialog.show("Failed to initiate checkout. Please try again.", 'error');
      }
    }catch(error){
      console.error("Error creating Stripe Checkout Session:", error.response?.data || error.message);
      messageDialog.show("Please login or sign-up to access our service.", 'error');
      // router.push('/login');
    }
  }
}
