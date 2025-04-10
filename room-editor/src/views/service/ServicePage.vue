<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="wrapper">
        <header>
            <nav class="navbar">
                <div class="logo">
                    Room Visualizer
                </div>
                <ul class="nav-links">
                    <RouterLInk to="/home">Home</RouterLInk>
                    <RouterLink to="/price">Pricing</RouterLink>
                    <RouterLink to="/service">Service</RouterLink>
                    <RouterLink to="/login">Login</RouterLink>
                </ul>
            </nav>
            <h1>
                Service Page
            </h1>
        </header>
    </div>
</template>