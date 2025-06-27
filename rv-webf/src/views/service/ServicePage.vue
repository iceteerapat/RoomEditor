<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref } from "vue";
import { useAuthStore } from '@/store/AuthStore';
import { useServiceStore } from '@/store/ServiceStore';
import { computed } from 'vue';

import Repositories from '../../apis/repositories/RepositoriesFactory.js';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Drawer from 'primevue/drawer';
import GlobalDialog from '../../components/GlobalDialog.vue';

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
            </Drawer>
            <section class="servicepage">

            </section>
        </main>
        <footer class="footerpage" style="height: 160px;" >
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
        <GlobalDialog ref="messageDialog" />
    </div>
</template>