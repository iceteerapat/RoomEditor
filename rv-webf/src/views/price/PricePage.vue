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
                        <RouterLink to="/login" :class="`${slotProps.class} login-button`">Login</RouterLink>
                    </Button>
                </ul>
            </nav>
        </header>
        <main>
            <section class="pricepage">
                <div class="price-container">
                    <div class="price-card">
                        <h3>Basic</h3>
                        <p class="price">$19/month</p>
                        <p>Ideal for individuals</p>
                        <Button>Choose</Button>
                    </div>
                    <div class="price-card">
                        <h3>Standard</h3>
                        <p class="price">$29/month</p>
                        <p>Best for small teams</p>
                        <Button>Choose</Button>
                    </div>
                    <div class="price-card">
                        <h3>Professional</h3>
                        <p class="price">$49/month</p>
                        <p>Great for growing companies</p>
                        <Button>Choose</Button>
                    </div>
                    <div class="price-card">
                        <h3>Enterprise</h3>
                        <p class="price">Contact us</p>
                        <p>Custom solutions</p>
                        <Button>Contact</Button>
                    </div>
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