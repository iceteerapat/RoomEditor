<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { handlePlanSelection } from '../../components/Purchase.js';

import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import Sidebar from 'primevue/sidebar';

const mobileVisible = ref(false);
function toggleMobileMenu() {
    mobileVisible.value = !mobileVisible.value;
}
const billingCycle = ref('Monthly');
const options = ref(['Monthly', 'Annually']);
const router = useRouter();

const pricingPlans = [
  {
    name: 'One at a time',
    monthlyPrice: '$6.99',
    annualPrice: '$6.99',
    features: [
      'Generate up to 35 Full HD images',
      'Picture size up to 1920 X 1080 pixels',
      'Access to Create Room Service',
      'Access to Renovate Room Service'
    ]
  },
  {
    name: 'Subscription',
    monthlyPrice: '$14.99 / month',
    annualPrice: '$140.99 / year',
    features: [
      'Generate up to 200 Full HD images per month',
      'Picture size up to 1920 X 1080 pixels',
      'Access to Create Room Service',
      'Access to Renovate Room Service'
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
    currentPrice: billingCycle.value === 'Monthly' ? plan.monthlyPrice : plan.annualPrice,
  }));
});

const purchasePlan = (planName, cycle) => {
  handlePlanSelection(planName, cycle, router);
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white-800 text-black shadow-md">
        <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
            <div class="text-2xl font-bold text-white-800">
                Room Visualizer
            </div>
            <ul class="hidden md:flex space-x-6 items-center">
                <RouterLink to="/home" class="hover:text-green-600 transition-colors duration-200">Home</RouterLink>
                <RouterLink to="/service/create" class="hover:text-green-600 transition-colors duration-200">Create Room</RouterLink>
                <RouterLink to="/price" class="hover:text-green-600 transition-colors duration-200">Pricing</RouterLink>
                <RouterLink to="/contact" class="hover:text-green-600 transition-colors duration-200">Contact Us</RouterLink>
                <Button asChild v-slot="slotProps" class="!text-white"> <RouterLink to="/login" :class="`${slotProps.class} bg-green-600 hover:bg-green-600 focus:ring-green-600`">Login</RouterLink>
                </Button>
            </ul>

            <div class="md:hidden">
                <Button class="text-gray-700 focus:outline-none p-2" @click="toggleMobileMenu">
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </Button>
            </div>
        </nav>
    </header>

    <Sidebar v-model:visible="mobileVisible" position="right" class="w-72"> 
        <div class="flex flex-col gap-4 p-4 text-lg">
            <RouterLink to="/home" @click="mobileVisible = false" class="text-gray-700 hover:text-green-600 transition-colors">Home</RouterLink>
            <RouterLink to="/service/create" @click="mobileVisible = false" class="text-gray-700 hover:text-green-600 transition-colors">Create Room</RouterLink>
            <RouterLink to="/price" @click="mobileVisible = false" class="text-gray-700 hover:text-green-600 transition-colors">Pricing</RouterLink>
            <RouterLink to="/contact" class="hover:text-white transition-colors duration-200">Contact Us</RouterLink>
            <div class="mt-4 border-t pt-4"> 
                <Button @click="$router.push('/login'); mobileVisible = false;" class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors">Login</Button>
            </div>
        </div>
    </Sidebar>

    <main class="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-8 text-center">Flexible Pricing Plans</h1>
      <p class="text-lg text-gray-600 mb-10 text-center max-w-3xl">Choose the plan that best fits your needs, whether you're an individual or a large enterprise.</p>

      <div class="mb-12">
        <SelectButton v-model="billingCycle" :options="options"
          :pt="{
            button: { class: 'px-6 py-3 text-lg font-semibold transition-colors duration-200' },
            root: 'rounded-lg shadow-md'
          }"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15  w-full  max-w-7xl">
        <div
          v-for="plan in selectedPlans"
          :key="plan.name"
          class="price-card flex flex-col bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 border-2 border-transparent"
          :class="{ 'border-blue-500': plan.name === 'Subscription' }"
        >
          <h3 class="text-3xl font-bold text-gray-900 mb-4">{{ plan.name }}</h3>
          <p class="text-4xl font-bold text-green-700 mb-6">{{ plan.currentPrice }}</p>

          <ul class="flex-grow space-y-3 mb-8 text-gray-700 text-lg">
            <template v-if="plan.name !== 'Enterprise'">
              <li v-for="(feature, index) in plan.features" :key="index" class="flex items-start">
                <svg class="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span>{{ feature }}</span>
              </li>
            </template>
            <template v-else>
              <li class="flex items-start">
                <svg class="h-6 w-6 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span class="text-justify leading-relaxed">{{ plan.features[0] }}</span>
              </li>
            </template>
          </ul>

          <Button
            @click="purchasePlan(plan.name, billingCycle)"
            :label="plan.name === 'Enterprise' ? 'Contact us' : 'Purchase'"
            severity="primary"
            class="w-full mt-auto py-3 text-xl font-bold"
            :class="{
              'p-button-outlined': plan.name === 'Enterprise',
              'bg-blue-600 hover:bg-blue-700 text-white': plan.name !== 'Enterprise',
              'border-blue-600 text-blue-600 hover:bg-blue-50': plan.name === 'Enterprise'
            }"
          />
        </div>
      </div>
    </main>

    <footer class="bg-gray-800 text-gray-300 py-8 px-4 mt-auto">
        <div class="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <h3 class="text-xl font-bold mb-4 md:mb-0 text-white">Room Visualizer</h3>
            <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0 md:pl-30">
                <RouterLink to="/home" class="hover:text-white transition-colors duration-200">Home</RouterLink>
                <RouterLink to="/service/create" class="hover:text-white transition-colors duration-200">Create Room</RouterLink>
                <RouterLink to="/price" class="hover:text-white transition-colors duration-200">Pricing</RouterLink>
                <RouterLink to="/contact" class="hover:text-white transition-colors duration-200">Contact Us</RouterLink>
            </div>
            <div class="text-sm">
                <p>© 2025 Room Visualizer. All rights reserved.</p>
            </div>
        </div>
    </footer>
  </div>
</template>
