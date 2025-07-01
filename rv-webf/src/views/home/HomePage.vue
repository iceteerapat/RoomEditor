<script setup>
import { RouterLink } from 'vue-router';
import { onMounted, ref } from 'vue';

import Button from 'primevue/button';
import Image from 'primevue/image';

const slider = ref(null);
const images = [
    'src/assets/picture/one.jpg',
    'src/assets/picture/four.jpg',
    'src/assets/picture/two.jpg',
    'src/assets/picture/five.jpg',
    'src/assets/picture/three.jpg',
    'src/assets/picture/six.jpg',
    'src/assets/picture/seven.jpg',
];

let currentIndex = 0;

onMounted(() => {
  setInterval(() => {
    const sliderEl = slider.value;
    if (!sliderEl) return;

    currentIndex = (currentIndex + 1) % images.length;
    const scrollAmount = sliderEl.clientWidth * currentIndex;
    sliderEl.scrollTo({
      left: scrollAmount,
      behavior: 'smooth',
    });
  }, 6000);
});
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <header class="bg-white-800 text-black shadow-md">
            <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
                <div class="text-2xl font-bold text-white-800">
                    Room Visualizer
                </div>
                <ul class="hidden md:flex space-x-6 items-center">
                    <RouterLink to="/home" class="hover:text-green-600 transition-colors duration-200">Home</RouterLink>
                    <RouterLink to="/service/create" class="hover:text-green-600 transition-colors duration-200">Create Room</RouterLink>
                    <RouterLink to="/price" class="hover:text-green-600 transition-colors duration-200">Pricing</RouterLink>
                    <Button asChild v-slot="slotProps" class="!text-white"> <RouterLink to="/login" :class="`${slotProps.class} bg-green-600 hover:bg-green-600 focus:ring-green-600`">Login</RouterLink>
                    </Button>
                </ul>

                <button class="md:hidden text-black focus:outline-none">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </nav>
        </header>

        <main class="flex-grow">
            <section class="bg-gradient-to-r from-grey-900 to-green-800 text-white text-center py-20 px-4">
                <h1 class="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in-up">Room Visualizer</h1>
                <h2 class="text-xl md:text-2xl font-light mb-8 animate-fade-in-up delay-200">Turn your imagination into reality with our simple room visualizer.</h2>
                <Button asChild v-slot="slotProps" class="animate-fade-in-up delay-400">
                    <RouterLink to="/login" :class="`${slotProps.class} bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300`">Get Started</RouterLink>
                </Button>
            </section>

            <section class="py-16 px-4 bg-gray-50">
                <div class="container mx-auto">
                    <h1 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Why Choose Room Visualizer?</h1>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                            <h3 class="text-xl font-semibold mb-2 text-black-600">Easy to Use</h3>
                            <p class="text-gray-600">No experience needed & start designing in seconds.</p>
                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                            <h3 class="text-xl font-semibold mb-2 text-black-600">Realistic Previews</h3>
                            <p class="text-gray-600">Visualize your room in stunning detail and 3D.</p>
                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                            <h3 class="text-xl font-semibold mb-2 text-black-600">Save & Share</h3>
                            <p class="text-gray-600">Download and share your room designs easily.</p>
                        </div>
                    </div>

                    <div class="relative w-100 h-full overflow-hidden rounded-lg shadow-xl md:w-385 h-full" ref="slider">
                        <div class="flex" :style="{ width: `${images.length * 100}%` }">
                            <img
                                v-for="(img, index) in images"
                                :key="index"
                                :src="img"
                                class="w-100 h-full object-cover flex-shrink-0 md:w-385 h-full"
                                :alt="`Room Visualizer Image ${index + 1}`"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section class="py-16 px-4 bg-white">
                <div class="container mx-auto text-center">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-12">How Does It Work?</h1>

                    <h2 class="text-2xl md:text-3xl font-semibold text-left mb-6 md:mb-8 text-black-600">Create Service</h2>
                    <div class="flex flex-col md:flex-row items-center justify-between mb-16 md:space-x-12">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:w-1/2 mb-8 md:mb-0">
                            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <h3 class="text-xl font-semibold mb-1 text-gray-800">Imagine your room</h3>
                                <p class="text-gray-600">Fill the box with desired.</p>
                            </div>
                            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <h3 class="text-xl font-semibold mb-1 text-gray-800">Customize Style</h3>
                                <p class="text-gray-600">Try different styles such as Luxury, Minimal, etc..</p>
                            </div>
                            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <h3 class="text-xl font-semibold mb-1 text-gray-800">Visualize & Save</h3>
                                <p class="text-gray-600">Preview your new room and save or share your design.</p>
                            </div>
                        </div>
                        <Image src="src/assets/picture/create.png" alt="createService" class="md:w-1/2 rounded-lg shadow-lg" />
                    </div>

                    <h2 class="text-2xl md:text-3xl font-semibold text-left mb-6 md:mb-8 text-black-600">Renovate Service</h2>
                    <div class="flex flex-col md:flex-row-reverse items-center justify-between md:space-x-reverse md:space-x-12">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:w-1/2 mb-8 md:mb-0">
                            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <h3 class="text-xl font-semibold mb-1 text-gray-800">Upload Your Room</h3>
                                <p class="text-gray-600">Take a photo or upload a floor plan to get started.</p>
                            </div>
                            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <h3 class="text-xl font-semibold mb-1 text-gray-800">Customize Style</h3>
                                <p class="text-gray-600">Tell the system what your desired</p>
                            </div>
                            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <h3 class="text-xl font-semibold mb-1 text-gray-800">Visualize & Save</h3>
                                <p class="text-gray-600">Preview your new room and save or share your design.</p>
                            </div>
                        </div>
                        <Image src="src/assets/picture/renovate.png" alt="renovateService" class="md:w-1/2 rounded-lg shadow-lg" />
                    </div>
                </div>
            </section>

            <section class="py-16 px-4 bg-gray-50">
                <div class="container mx-auto text-center">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-12">Who It's For</h1>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                            <img src="/src/assets/picture/homeowner.jpg" alt="Homeowners Icon" class="w-24 h-24 rounded-full mb-4 object-cover" />
                            <h3 class="text-xl font-semibold mb-2 text-black-600">Homeowners</h3>
                            <p class="text-gray-600">Visualize your renovation ideas before spending a dime.</p>
                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                            <img src="/src/assets/picture/interior-designer.jpg" alt="Interior Designers Icon" class="w-24 h-24 rounded-full mb-4 object-cover" />
                            <h3 class="text-xl font-semibold mb-2 text-black-600">Interior Designers</h3>
                            <p class="text-gray-600">Create mockups quickly to present your vision to clients.</p>
                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                            <img src="/src/assets/picture/real-estate.jpg" alt="Real Estate Agents Icon" class="w-24 h-24 rounded-full mb-4 object-cover" />
                            <h3 class="text-xl font-semibold mb-2 text-black-600">Real Estate Agents</h3>
                            <p class="text-gray-600">Help clients see the potential of a space with interactive visuals.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="bg-gradient-to-r from-green-800 to-grey-800 text-white text-center py-16 px-4">
                <h1 class="text-3xl md:text-4xl font-bold mb-8">Ready to Design Your Dream Room?</h1>
                <div>
                    <Button asChild v-slot="slotProps" severity="danger">
                        <RouterLink to="/login" :class="`${slotProps.class} bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300`">Try Now!</RouterLink>
                    </Button>
                </div>
            </section>
        </main>

        <footer class="bg-gray-800 text-gray-300 py-8 px-4 mt-auto">
            <div class="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <h3 class="text-xl font-bold mb-4 md:mb-0 text-white">Room Visualizer</h3>
                <div class="flex flex-col pl-30 md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
                    <RouterLink to="/home" class="hover:text-white transition-colors duration-200">Home</RouterLink>
                    <RouterLink to="/service/create" class="hover:text-white transition-colors duration-200">Create Room</RouterLink>
                    <RouterLink to="/price" class="hover:text-white transition-colors duration-200">Pricing</RouterLink>
                </div>
                <div class="text-sm">
                    <p>© 2025 Room Visualizer. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
</template>