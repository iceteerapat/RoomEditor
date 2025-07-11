<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Sidebar from 'primevue/sidebar';

const mobileVisible = ref(false);

function toggleMobileMenu() {
    mobileVisible.value = !mobileVisible.value;
}

</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col font-inter">
        <header class="bg-white text-black shadow-md">
            <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
                <RouterLink to="/home" class="text-2xl font-bold text-white-800">
                    Room Visualizer
                </RouterLink>

                <ul class="hidden md:flex space-x-6 items-center">
                    <RouterLink to="/home" class="hover:text-green-600 transition-colors duration-200">Home</RouterLink>
                    <RouterLink to="/service/create" class="hover:text-green-600 transition-colors duration-200">Create Room</RouterLink>
                    <RouterLink to="/price" class="hover:text-green-600 transition-colors duration-200">Pricing</RouterLink>
                    <RouterLink to="/contact" class="hover:text-green-600 transition-colors duration-200">Contact Us</RouterLink>
                  <Button v-slot="slotProps" asChild>
                      <button v-bind="slotProps.a11yAttrs" class="rounded-md px-3 py-1.5 bg-emerald-600 hover:bg-emerald-400">
                          <RouterLink to="/login" class="text-white font-bold hover:text-gray-800">Login</RouterLink>
                      </button>
                  </Button>
                </ul>

                <div class="md:hidden">
                    <Button class="text-gray-700 focus:outline-none p-2" @click="toggleMobileMenu">
                        <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </Button>
                </div>
                <Sidebar md:hidden v-model:visible="mobileVisible" position="right" class="w-72"> 
                    <div class="flex flex-col gap-4 p-4 text-lg">
                        <RouterLink to="/home" @click="mobileVisible = false" class="text-gray-700 hover:text-green-600 transition-colors dark:text-white">Home</RouterLink>
                        <RouterLink to="/service/create" @click="mobileVisible = false" class="text-gray-700 hover:text-green-600 transition-colors dark:text-white">Create Room</RouterLink>
                        <RouterLink to="/price" @click="mobileVisible = false" class="text-gray-700 hover:text-green-600 transition-colors dark:text-white">Pricing</RouterLink>
                        <RouterLink to="/contact" @click="mobileVisible = false" class="text-gray-700 hover:text-green-600 transition-colors dark:text-white">Contact Us</RouterLink>
                        <div class="mt-4 border-t pt-4"> 
                            <Button @click="$router.push('/login'); mobileVisible = false;" class="w-full bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-700 transition-colors dark:text-white dark:font-bold">Login</Button>
                        </div>
                    </div>
                </Sidebar>
            </nav>
        </header>

        <main class="flex-grow p-4 md:p-8 bg-gray-50">
            <div class="container mx-auto bg-white rounded-lg shadow-md p-6 md:p-10 md:w-2xl">
                <h1 class="text-4xl font-bold text-gray-800 text-center mb-6">Contact Us</h1>
                <p class="text-lg text-gray-600 text-center mb-10 max-w-2xl mx-auto">
                    Have questions, feedback, or need assistance? We're here to help!
                    Reach out to us through the form below or using our contact details.
                </p>

                <div class="grid grid-cols-1 lg:grid-cols-1 gap-8 md:gap-12 max-w-md mx-auto">
                    <div class="space-y-6">
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4 pb-2">Our Details</h2>
                        <div class="flex items-center gap-3 text-gray-700">
                            <i class="fas fa-envelope text-xl text-green-600"></i>
                            <p><span class="font-medium">Email:</span> support@roomvisualizer.com</p>
                        </div>
                        <div class="flex items-center gap-3 text-gray-700">
                            <i class="fas fa-phone-alt text-xl text-green-600"></i>
                            <p><span class="font-medium">Phone:</span> +66 82-219-5643</p>
                        </div>
                        <div class="flex items-start gap-3 text-gray-700">
                            <i class="fas fa-map-marker-alt text-xl text-green-600 pt-1"></i>
                            <p><span class="font-medium">Address:</span> 18/244 Floor 22 Bangkok Thailand</p>
                        </div>
                        <div class="flex items-start gap-3 text-gray-700">
                            <i class="fas fa-clock text-xl text-green-600 pt-1"></i>
                            <p><span class="font-medium">Hours:</span> Mon-Fri: 9:00 AM - 5:00 PM (EST)</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <footer class="bg-gray-800 text-gray-300 py-8 px-4 mt-auto">
            <div class="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <h3 class="text-xl font-bold mb-4 md:mb-0 text-white">Room Visualizer</h3>
                <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
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