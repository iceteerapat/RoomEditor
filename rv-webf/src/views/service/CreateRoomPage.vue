<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref } from "vue";
import { useAuthStore } from '@/store/AuthStore';
import { computed } from 'vue';

import RepositoriesFactory from '../../apis/repositories/RepositoriesFactory'
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Drawer from 'primevue/drawer';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import InputNumber from 'primevue/inputnumber';

const respository = RepositoriesFactory.get('RoomServiceRepository');
const visibleLeft = ref(false);
const authStore = useAuthStore();

const roomSize = ref('');
const roomStyle = ref('');
const roomType = ref('');
const pictureSize = ref('');
const etc = ref('');


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
          router.push('/service/account');
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
const username = localStorage.getItem('username');
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
                <p>Username: {{ username }}</p>
                <p>Subscription: </p>
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
            <section class="createimage-page">
                <div class="input-properties">
                    <h2>Input Properties</h2>
                    <div class="input-roomsize">
                        <label for="roomsize">Room Size</label>
                        <InputNumber inputId="roomsize" v-model="roomSize" aria-describedby="roomsize-help" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="500"fluid />
                        <Message size="small" severity="secondary" variant="simple">Enter your room size required (m²)</Message>
                    </div>
                    <div class="input-roomstyle">
                        <label for="roomstyle">Room Styles</label>
                        <InputText id="roomstyle" v-model="roomStyle" aria-describedby="roomstyle-help" fluid/>
                        <Message size="small" severity="secondary" variant="simple">Enter your room style such as Italian-American style</Message>
                    </div>
                </div>
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
    </div>
</template>