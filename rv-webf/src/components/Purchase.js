import { decodeJwt } from './DecodeJwt.js';

import RepositoriesFactory from '@/apis/repositories/RepositoriesFactory.js';

const repository = RepositoriesFactory.get('PurchaseRepository');

const priceOneAtATimeId = 'price_1Rbm2FGbnW1BWWOPK94CLqcK';
const priceSubscribeMonthlyId = 'price_1RVD30GbnW1BWWOPKd9A3usu';
const priceSubscribeAnnuallyId = 'price_1RVD30GbnW1BWWOPvZGgp2LN';

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
        alert("Failed to initiate checkout. Please try again.");
      }
    }catch(error){
      console.error("Error creating Stripe Checkout Session:", error.response?.data || error.message);
      alert("Please login or sign-up to access our service.");
      router.push('/login');
    }
  }
}
