<script setup>
import { RouterLink } from 'vue-router';
import { ref } from "vue";

import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Drawer from 'primevue/drawer';

const showMenu = (event) => {
    menu.value.toggle(event);
};
const menu = ref();
const items = ref([
    {
        label: localStorage.getItem('email'),
        items: [
            {
                label: 'Setting',
            },
            {
                label: 'Account',
            },
            {
                label: 'Logout'
            }
        ]
    }
]);

const visibleLeft = ref(false);

</script>

<template>
    <div class="wrapper">
        <header class="servicepage-menu">
            <div class="bar" @click="showMenu">
                <i class="fas fa-user"/>
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" style="align-items: flex-end"/>
            </div>
            <div class="logo-servicepage">
                <h1>Room Visualizer</h1>
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
    </div>
</template>