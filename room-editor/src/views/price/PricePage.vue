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
                    <RouterLink to="/service">Create Room</RouterLink>
                    <RouterLink to="/price">Pricing</RouterLink>
                    <Button asChild v-slot="slotProps">
                        <RouterLink to="/login" :class="slotProps.class">Login</RouterLink>
                    </Button>
                </ul>
            </nav>
        </header>
        <main>
            <section>

            </section>
        </main>
        <footer>

        </footer>
    </div>
</template>