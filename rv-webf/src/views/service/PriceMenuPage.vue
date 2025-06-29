<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { handlePlanSelection } from '../../components/Purchase.js';
import { useAuthStore } from '@/store/AuthStore';
import { useServiceStore } from '@/store/ServiceStore';

import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import Repositories from '../../apis/repositories/RepositoriesFactory.js';
import Menu from 'primevue/menu';
import Drawer from 'primevue/drawer';
import GlobalDialog from '../../components/GlobalDialog.vue';

const billingCycle = ref('Monthly');
const options = ref(['Monthly', 'Annually']);

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

const messageDialog = ref(null);
const repository = Repositories.get('PurchaseRepository');
const visibleLeft = ref(false);
const authStore = useAuthStore();

const isLoggedIn = computed(() => 
    !!authStore.token || !!localStorage.getItem('token')
);

const router = useRouter();
const showMenu = (event) => {
    menu.value.toggle(event);
};
const menu = ref();
const items = computed(() => [
  {
    label: 'Profile Setting',
    items: [
      {
        label: 'Account',
        command: () => {
          onManage();
        }
      },
      {
        label: 'Logout',
        command: () => {
          authStore.logout();
          router.push('/home');
        }
      }
    ]
  }

]);

async function onManage(){
    try{
        const response = await repository.manage({withCredentials: true});
        const portalUrl = response.data.url;
        window.location.href = portalUrl;
    }catch(error){
        messageDialog.value.show(error.response.data?.message, 'Error');
    }

}

</script>

<template>
    <div class="wrapper">
        <div v-if="!isLoggedIn" class="login-overlay">
            <div class="login-content">
                <h2>Please log in to access this feature</h2>
                <RouterLink to="/login">
                    <Button class="login-button">Go to Login</Button>
                </RouterLink>
            </div>
        </div> 
        <header class="servicepage-menu">
            <div class="icon" @click="showMenu">
                <i class="fas fa-user"/>
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" style="align-items: flex-end;" />
            </div>
            <div class="logo-servicepage">
                <h1>Room Visualizer</h1>
            </div>
            <div class="profile-info">
                <p>Username: {{ authStore.getUsername }}</p>
                <p>Subscription: {{ authStore.getServiceName }}</p>
                <p>Credits: {{ authStore.getImageGeneratedFromToken }}</p>
            </div>
        </header>
        <main>
            <div class="drawer-toggle-btn">
                <Button icon="fa-solid fa-arrow-right" @click="visibleLeft = true" />
            </div>
            <Drawer v-model:visible="visibleLeft" header="Menu">
                <RouterLink to="/service/create">Create Room</RouterLink>
                <RouterLink to="/service/renovate">Renovate Room</RouterLink>
                <RouterLink to="/service/creditAndSubscription">Credits & Subscription</RouterLink>
            </Drawer>
            <section class="pricepage" style="height: 875px;">
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
                        style="display: block; text-align: left; line-height: 1.8; padding-bottom: 46.5px;"
                        >
                        {{ plan.features[0] }}
                        </p>
                        <Button @click="handlePlanSelection(plan.name, billingCycle, router)" style="font-weight: 780;">
                        {{ plan.name === 'Enterprise' ? 'Contact us' : 'Purchase' }}
                        </Button>
                    </div>
                </div>
            </section>
        </main>
        <footer class="footerpage">
            <div class="footerpage-container">
                <h3>Room Visualizer</h3>
                <div class="footerpage-column">
                    <RouterLink to="/home">Home</RouterLink>
                    <RouterLink to="/service/create">Create Room</RouterLink>
                    <RouterLink to="/price">Pricing</RouterLink>
                </div>
                <div class="footerpage-legal">
                    <p>© 2025 Room Visualizer. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
</template>