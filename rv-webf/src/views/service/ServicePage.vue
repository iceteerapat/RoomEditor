<script setup>
import { RouterLink } from 'vue-router';
import { ref } from "vue";

import Menu from 'primevue/menu';
import Button from 'primevue/button';

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
</script>

<template>
    <div class="wrapper">
        <header class="servicepage-menu">
            <div class="bar" @click="showMenu">
                <i class="fas fa-user"/>
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" style="align-items: flex-end"/>
            </div>
        </header>
        <main>
            <section class="servicepage">

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