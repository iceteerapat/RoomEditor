<script setup>
import { RouterLink } from 'vue-router';

import Button from 'primevue/button';
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
                    <RouterLink to="/price">Pricing</RouterLink>
                    <RouterLink to="/service">Service</RouterLink>
                    <Button asChild v-slot="slotProps">
                        <RouterLink to="/login" :class="slotProps.class">Login</RouterLink>
                    </Button>
                </ul>
            </nav>
        </header>
        <mian>
            <section class="homepage">
                <h1>Room Visualizer</h1>
                <h2>Make your idea be cleared</h2>
                <Button asChild v-slot="slotProps">
                    <RouterLink to="/login" :class="slotProps.class">Get Start</RouterLink>
                </Button>
            </section>
        </mian>
        <footer>

        </footer>
    </div>
</template>