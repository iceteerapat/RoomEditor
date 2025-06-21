import { useRouter } from "vue-router";

const router = useRouter();

export function handlePlanSelection(planName, billingCycle) {
    console.log("billingCycle: ", billingCycle);
  if (planName === 'Subscription') {
    if (billingCycle === 'Monthly') {
     window.location.href ='https://buy.stripe.com/test_5kQ4gzfwIfGs9aV8S7a3u01';
    } else {
      window.location.href = 'https://buy.stripe.com/test_bJecN5aco3XK5YJ2tJa3u02';
    }
  } else if (planName === 'Enterprise') {
    router.push('/contact');
  } else {
   window.location.href = 'https://buy.stripe.com/test_6oUaEXesE1PCgDn1pFa3u00';
  }
}