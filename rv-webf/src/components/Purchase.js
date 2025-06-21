import { useRouter } from "vue-router";

const router = useRouter();

const baseLinkOneAtATime = 'https://buy.stripe.com/test_6oUaEXesE1PCgDn1pFa3u00';
const baseLinkSubscribeMonthly = 'https://buy.stripe.com/test_5kQ4gzfwIfGs9aV8S7a3u01';
const baseLinkSubscribeAnnually = 'https://buy.stripe.com/test_bJecN5aco3XK5YJ2tJa3u02';

export function handlePlanSelection(planName, billingCycle) {
  const email = localStorage.getItem('email');
  
  const linkOneAtATime = email ? `${baseLinkOneAtATime}?prefilled_email=${email}` : baseLinkOneAtATime;
  const linkSubscribeMonthly = email ? `${baseLinkSubscribeMonthly}?prefilled_email=${email}` : baseLinkSubscribeMonthly;
  const linkSubscribeAnnually = email ? `${baseLinkSubscribeAnnually}?prefilled_email=${email}` : baseLinkSubscribeAnnually;

  if (planName === 'Subscription') {
    if (billingCycle === 'Monthly') {
      window.location.href = linkSubscribeMonthly;
    } else {
      window.location.href = linkSubscribeAnnually;
    }
  } else if (planName === 'Enterprise') {
    router.push('/contact');
  } else {
    window.location.href = linkOneAtATime;
  }
}
