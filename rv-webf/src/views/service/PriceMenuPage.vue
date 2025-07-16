<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { handlePlanSelection } from '../../components/Purchase.js';
import { useAuthStore } from '@/store/AuthStore';
import { useServiceStore } from '@/store/ServiceStore';
import { useMessageDialog } from '../../components/MessageDialog.js'; 

import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import Repositories from '../../apis/repositories/RepositoriesFactory.js';
import Menu from 'primevue/menu';
import Drawer from 'primevue/drawer';

const billingCycle = ref('Monthly');
const options = ref(['Monthly', 'Annually']);
const serviceStore = useServiceStore();

const pricingPlans = [
    {
        name: 'One at a time',
        monthlyPrice: '$7.99',
        annualPrice: '$7.99',
        features: [
            'Generate up to 35 Full HD images',
            'Picture size up to 1920 X 1080 pixels',
            'Access to Create Room Service',
            'Access to Renovate Room Service'
        ]
    },
    {
        name: 'Subscription',
        monthlyPrice: '$16.99 / month',
        annualPrice: '$160.99 / year', 
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

const messageDialog = useMessageDialog(); 
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
        messageDialog.show(error.response.data?.message, 'Error');
    }
}

</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col"> 
        <div v-if="!isLoggedIn" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="bg-white p-8 rounded-lg shadow-xl text-center">
                <h2 class="text-2xl font-semibold mb-4 text-gray-800">Please log in to access this feature</h2>
                <RouterLink to="/login">
                    <Button class="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Go to Login</Button>
                </RouterLink>
            </div>
        </div> 
        
        <header class="flex items-center justify-between p-4 bg-white shadow-md">
            <div class="hidden md:block text-left text-sm text-gray-600 space-y-1">
                <p>Username: <span class="font-medium">{{ authStore.getUsername }}</span></p>
                <p>Subscription: <span class="font-medium">{{ authStore.getProductName }}</span></p>
                <p>Credits: <span class="font-medium">{{ serviceStore.getCreditsCount }}</span></p>
            </div>
            <div class="md:hidden "> 
                <Button icon="fa-solid fa-bars" @click="visibleLeft = true" class="p-button-rounded p-button-text" />
            </div>
            <div class="translate-x-30 md:hidden dark:text-black">
                <p>Credits: <span class="font-medium">{{ serviceStore.getCreditsCount }}</span></p>
            </div>
            <div class="flex-grow text-center">
                <h1 class="hidden md:block text-3xl font-bold text-gray-800 transform translate-x-5">Room Visualizer</h1>
            </div>
            <div class="cursor-pointer p-2" @click="showMenu">
                <i class="fas fa-user text-2xl text-gray-700"/>
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" class="mt-2" />
            </div>
        </header>

        <main class="flex-grow flex flex-col md:flex-row p-4 gap-6">
            <Drawer v-model:visible="visibleLeft" header="Menu" position="left" class="md:hidden">
                <div class="flex flex-col gap-4 p-4">
                    <RouterLink to="/service/create" class="text-lg text-green-600 hover:text-green-800 transition-colors">Create Room</RouterLink>
                    <RouterLink to="/service/renovate" class="text-lg text-green-600 hover:text-green-800 transition-colors">Renovate Room</RouterLink>
                    <RouterLink to="/service/creditAndSubscription" class="text-lg text-green-600 hover:text-green-800 transition-colors">Credits & Subscription</RouterLink>
                </div>
            </Drawer>

            <aside class="hidden md:block w-64 bg-white p-4 rounded-lg shadow-md">
                <nav class="flex flex-col gap-4">
                    <RouterLink to="/service/create" class="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors py-2 px-3 rounded-md hover:bg-green-50">Create Room</RouterLink>
                    <RouterLink to="/service/renovate" class="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors py-2 px-3 rounded-md hover:bg-green-50">Renovate Room</RouterLink>
                    <RouterLink to="/service/creditAndSubscription" class="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors py-2 px-3 rounded-md hover:bg-green-50">Credits & Subscription</RouterLink>
                </nav>
            </aside>

            <section class="flex-grow flex flex-col items-center p-6 bg-white rounded-lg shadow-md min-h-[calc(100vh-200px)] lg:min-h-[calc(100vh-240px)]">
                <SelectButton v-model="billingCycle" :options="options" class="mb-8" />
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                    <div class="bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center border-2 border-gray-200 hover:shadow-lg transition-shadow" 
                         v-for="plan in selectedPlans" :key="plan.name">
                        <h3 class="text-2xl font-semibold text-gray-800 mb-4">{{ plan.name }}</h3>
                        <p class="text-4xl font-bold text-green-600 mb-6 price">{{ plan.currentPrice }}</p>
                        
                        <template v-if="plan.name !== 'Enterprise'">
                            <p v-for="(feature, index) in plan.features" :key="index" class="text-gray-700 mb-2 last:mb-4">
                                {{ feature }}
                            </p>
                        </template>
                        <p v-else class="text-gray-700 text-left leading-relaxed mb-6">
                            {{ plan.features[0] }}
                        </p>
                        
                        <Button @click="handlePlanSelection(plan.name, billingCycle, router)" 
                                class="mt-auto px-8 py-3 rounded-md text-lg font-bold w-full
                                       bg-blue-600 text-white hover:bg-blue-700 transition-colors
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            {{ plan.name === 'Enterprise' ? 'Contact us' : 'Purchase' }}
                        </Button>
                    </div>
                </div>
            </section>
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