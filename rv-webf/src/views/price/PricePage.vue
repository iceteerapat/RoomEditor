<script setup>
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';

import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';

const billingCycle = ref('Monthly');
const options = ref(['Monthly', 'Annually']);

const pricingPlans = [
  {
    name: 'Basic',
    monthlyPrice: '$19 / month',
    annualPrice: '$190 / year', 
    features: [
      '250 Full HD images / month',
      'Picture size up to 1920 X 1080 pixels',
      'Batch generation 1',
      'Standard queue speed',
      'Save last 25 images',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: '$29 / month',
    annualPrice: '$290 / year',
    features: [
      '600 2k images / month',
      'Picture size up to 2048 X 1080 pixels',
      'Batch generation 3',
      'Faster queue speed',
      'Save up to 100 images',
    ],
  },
  {
    name: 'Premium',
    monthlyPrice: '$49 / month',
    annualPrice: '$490 / year',
    features: [
      'Unlimited HD images / month',
      'Picture size up to 3840 X 2160 pixels',
      'Batch generation 5',
      'Priority generation queue',
      'Unlimited image history + folders',
    ],
  },
  {
    name: 'Enterprise',
    monthlyPrice: 'Contact Us',
    annualPrice: 'Contact Us',
    features: [
      'For businesses, agencies, or platforms needing high-volume AI-powered room generation, custom tools, or API access.',
    ],
  },
];

const selectedPlans = computed(() => {
  return pricingPlans.map(plan => ({
    ...plan,
    currentPrice:
      billingCycle.value === 'Monthly' ? plan.monthlyPrice : plan.annualPrice,
  }));
});
</script>

<template>
    <div class="wrapper">
        <header>
            <nav class="navbar">
                <div class="logo">
                    Room Visualizer
                </div>
                <ul class="nav-links">
                    <RouterLink to="/home">Home</RouterLink>
                    <RouterLink to="/service">Create Room</RouterLink>
                    <RouterLink to="/price">Pricing</RouterLink>
                    <Button asChild v-slot="slotProps">
                        <RouterLink to="/login" :class="`${slotProps.class} login-button`">Login</RouterLink>
                    </Button>
                </ul>
            </nav>
        </header>
        <main>
            <section class="pricepage">
                <SelectButton v-model="billingCycle" :options="options"/>
                <div class="price-container">
                    <div class="price-card" v-for="plan in selectedPlans" :key="plan.name">
                        <h3>{{ plan.name }}</h3>
                        <p class="price">{{ plan.currentPrice }}</p>
                        <template v-if="plan.name !== 'Enterprise'">
                            <p v-for="(feature, index) in plan.features" :key="index">
                                {{ feature }}
                            </p>
                        </template>
                        <p
                        v-if="plan.name === 'Enterprise'"
                        style="display: block; text-align: left; line-height: 1.8; padding-bottom: 83px;"
                        >
                        {{ plan.features[0] }}
                        </p>
                        <Button style="font-weight: 780;">
                        {{ plan.name === 'Enterprise' ? 'Contact us' : 'Purchase' }}
                        </Button>
                        <!-- <p>250 Full HD images / month </p>
                        <p>Picture size up to 1920 X 1080 pixels</p>
                        <p>Batch generation 1</p>
                        <p>Standard queue speed</p>
                        <p>Save last 25 images</p>
                        <Button style="font-weight: 780;">Purchase</Button> -->
                    </div>
                    <!-- <div class="price-card">
                        <h3>Pro</h3>
                        <p class="price">$29 / month</p>
                        <p>600 2k images / month </p>
                        <p>Picture size up to 2048 X 1080 pixels</p>
                        <p>Batch generation 3</p>
                        <p>Faster queue speed</p>
                        <p>Save up to 100 images</p>
                        <Button style="font-weight: 780;">Purchase</Button>
                    </div> -->
                    <!-- <div class="price-card">
                        <h3>Premium</h3>
                        <p class="price">$49 / month</p>
                        <p>Unlimited HD images / month </p>
                        <p>Picture size up to 3840 X 2160 pixels</p>
                        <p>Batch generation 5</p>
                        <p>Priority generation queue</p>
                        <p>Unlimited image history + folders</p>
                        <Button style="font-weight: 780;">Purchase</Button>
                    </div> -->
                    <!-- <div class="price-card">
                        <h3>Enterprise</h3>
                        <p class="price">Contact Us</p>
                        <p style="display: block; text-align: left; line-height: 1.8; padding-bottom: 83px;">For businesses, agencies, or platforms needing high-volume AI-powered room generation, custom tools, or API access.</p>
                        <Button style="font-weight: 780;">Contact us</Button>
                    </div> -->
                </div>
            </section>
        </main>
        <footer class="footerpage">
            <div class="footerpage-container">
                <h3>Room Visualizer</h3>
                <div class="footerpage-column">
                    <RouterLink to="/home">Home</RouterLink>
                    <RouterLink to="/service">Create Room</RouterLink>
                    <RouterLink to="/price">Pricing</RouterLink>
                </div>
                <div class="footerpage-legal">
                    <p>© 2025 Room Visualizer. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
</template>