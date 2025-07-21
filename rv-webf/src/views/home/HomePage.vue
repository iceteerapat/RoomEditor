<script setup>
import { RouterLink } from 'vue-router';
import { onMounted, ref } from 'vue';

import Button from 'primevue/button';
import Image from 'primevue/image';
import Sidebar from 'primevue/sidebar';

const slider = ref(null);
const mobileVisible = ref(false);
const createPng = new URL('../../assets/picture/create.png', import.meta.url).href;
const renovatePng = new URL('../../assets/picture/renovate.png', import.meta.url).href;
const imageNames = [
    'one.jpg',
    'four.jpg',
    'two.jpg',
    'five.jpg',
    'three.jpg',
    'six.jpg',
    'seven.jpg',
];
const images = ref([]);
let currentIndex = 0;

function getImageUrl(name) {
  return new URL(`../../assets/picture/${name}`, import.meta.url).href;
}

function toggleMobileMenu() {
    mobileVisible.value = !mobileVisible.value;
}

onMounted(() => {
  images.value = imageNames.map(name => getImageUrl(name));

  setInterval(() => {
    const sliderEl = slider.value;
    if (!sliderEl) return;

    currentIndex = (currentIndex + 1) % images.value.length;
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
        <header class="bg-white text-black shadow-md">
            <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
                <RouterLink to="/" class="text-2xl font-bold text-black" aria-label="Room Visualizer - Home">
                    Room Visualizer
                </RouterLink>
                <ul class="hidden md:flex space-x-6 items-center">
                    <RouterLink to="/" class="hover:text-green-600 transition-colors duration-200 dark:text-white-800">Home</RouterLink>
                    <RouterLink to="/service/create" class="hover:text-green-600 transition-colors duration-200">Create Your Room Design</RouterLink>
                    <RouterLink to="/price" class="hover:text-green-600 transition-colors duration-200">Pricing Plans</RouterLink>
                    <RouterLink to="/contact" class="hover:text-green-600 transition-colors duration-200">Contact Us</RouterLink>
                    <Button v-slot="slotProps" asChild>
                        <button v-bind="slotProps.a11yAttrs" class="rounded-md px-3 py-1.5 bg-emerald-600 hover:bg-emerald-400">
                            <RouterLink to="/login" class="text-white font-bold hover:text-gray-800">Login</RouterLink>
                        </button>
                    </Button>
                </ul>

                <div class="md:hidden">
                    <Button class="text-gray-700 focus:outline-none p-2" @click="toggleMobileMenu" aria-label="Toggle Mobile Menu">
                        <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </Button>
                </div>
                <Sidebar md:hidden v-model:visible="mobileVisible" position="right" class="w-72"> 
                    <div class="flex flex-col gap-4 p-4 text-lg">
                        <RouterLink to="/" @click="mobileVisible = false" class="text-gray-700 hover:text-green-600 transition-colors dark:text-white">Home</RouterLink>
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

        <main class="flex-grow">
            <section class="bg-gradient-to-r from-gray-900 to-green-800 text-white text-center py-20 px-4">
                <h1 class="text-4xl md:text-6xl font-extrabold mb-4">Room Visualizer: Design & Renovate Your Space</h1>
                <h2 class="text-xl md:text-2xl font-light mb-8">Turn your imagination into reality with our simple online room visualizer and design tools.</h2>
                <Button v-slot="slotProps" asChild>
                    <button v-bind="slotProps.a11yAttrs" class="rounded-md px-3 py-3 bg-emerald-600 hover:bg-emerald-400">
                        <RouterLink to="/login" class="text-white font-bold hover:text-gray-600">Start Designing Now!</RouterLink>
                    </button>
                </Button>
            </section>

            <section class="py-16 px-4 bg-gray-50">
                <div class="container mx-auto">
                    <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Why Choose Our Room Visualizer?</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                            <h3 class="text-xl font-semibold mb-2 text-black-600 dark:text-black">Easy to Use Design Interface</h3>
                            <p class="text-gray-600">No design experience needed! Start visualizing and designing your room in seconds with our intuitive tools.</p>
                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                            <h3 class="text-xl font-semibold mb-2 text-black-600 dark:text-black">Realistic 3D Room Previews</h3>
                            <p class="text-gray-600">Visualize your room with stunning detail and realistic 3D renderings before you commit to changes.</p>
                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                            <h3 class="text-xl font-semibold mb-2 text-black-600 dark:text-black">Save & Share Your Designs</h3>
                            <p class="text-gray-600">Easily download, save, and share your unique room designs with friends, family, or clients.</p>
                        </div>
                    </div>

                    <div class="relative align-item-center w-85.5 h-full overflow-hidden rounded-lg shadow-xl translate-x-7.5 md:w-258 md:translate-x-0 xl:w-385" ref="slider">
                        <div class="flex" :style="{ width: `${images.length * 100}%` }">
                            <Image
                                v-for="(img, index) in images"
                                :key="index"
                                :src="img"
                                class="w-85.5 h-full object-cover flex-shrink-0 md:w-258 xl:w-385"
                                :alt="`Room Visualizer Example - Design Style ${index + 1}`"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section class="py-16 px-4 bg-gray-50">
                <div class="container mx-auto text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-12">How Our Room Visualizer Works</h2>

                    <h3 class="text-2xl md:text-3xl font-semibold text-left mb-6 md:mb-8 text-black">Create a New Room Design</h3>
                    <div class="flex flex-col md:flex-row items-center justify-between mb-16 md:space-x-12">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:w-1/2 mb-8 md:mb-0">
                            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <h4 class="text-xl font-semibold mb-1 text-gray-800">Imagine Your Ideal Room</h4>
                                <p class="text-gray-600">Simply describe your desired room layout and elements in the input box.</p>
                            </div>
                            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <h4 class="text-xl font-semibold mb-1 text-gray-800">Customize Your Design Style</h4>
                                <p class="text-gray-600">Experiment with various interior design styles such as Luxury, Minimalist, Modern, and more.</p>
                            </div>
                            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <h4 class="text-xl font-semibold mb-1 text-gray-800">Visualize & Save Your Creation</h4>
                                <p class="text-gray-600">Instantly preview your newly designed room in 3D, then save or share your unique creation.</p>
                            </div>
                        </div>
                        <Image :src="createPng" alt="How to create a new room design with Room Visualizer" class="md:w-1/2 rounded-lg shadow-lg" />
                    </div>

                    <h3 class="text-2xl md:text-3xl font-semibold text-left mb-6 md:mb-8 text-black">Renovate Your Existing Room</h3>
                    <div class="flex flex-col md:flex-row-reverse items-center justify-between md:space-x-reverse md:space-x-12">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:w-1/2 mb-8 md:mb-0">
                            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <h4 class="text-xl font-semibold mb-1 text-gray-800">Upload Your Room Photo</h4>
                                <p class="text-gray-600">Easily upload a photo of your current room or a floor plan to begin the renovation process.</p>
                            </div>
                            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <h4 class="text-xl font-semibold mb-1 text-gray-800">Specify Your Desired Renovation</h4>
                                <p class="text-gray-600">Tell our system exactly what changes you desire for your existing space.</p>
                            </div>
                            <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <h4 class="text-xl font-semibold mb-1 text-gray-800">Visualize & Apply Renovations</h4>
                                <p class="text-gray-600">See your renovated room come to life in 3D, then save or share your updated design.</p>
                            </div>
                        </div>
                        <Image :src="renovatePng" alt="How to renovate an existing room with Room Visualizer" class="md:w-1/2 rounded-lg shadow-lg" />
                    </div>
                </div>
            </section>

            <section class="py-16 px-4 bg-gray-50">
                <div class="container mx-auto text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-12">Who Can Benefit from Room Visualizer?</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                            <img src="/src/assets/picture/homeowner.jpg" alt="Homeowners planning renovations" class="w-24 h-24 rounded-full mb-4 object-cover" />
                            <h3 class="text-xl font-semibold mb-2 text-black-600">Homeowners</h3>
                            <p class="text-gray-600">Visualize your home renovation ideas and decor changes with confidence before making any investments.</p>
                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                            <img src="/src/assets/picture/interior-designer.jpg" alt="Interior Designers using a room design tool" class="w-24 h-24 rounded-full mb-4 object-cover" />
                            <h3 class="text-xl font-semibold mb-2 text-black-600">Interior Designers</h3>
                            <p class="text-gray-600">Rapidly create realistic mockups and professional presentations to impress your clients.</p>
                        </div>
                        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                            <img src="/src/assets/picture/real-estate.jpg" alt="Real Estate Agents showing property potential" class="w-24 h-24 rounded-full mb-4 object-cover" />
                            <h3 class="text-xl font-semibold mb-2 text-black-600">Real Estate Agents</h3>
                            <p class="text-gray-600">Help prospective buyers envision the full potential of a property with interactive and stunning visuals.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="bg-gradient-to-r from-green-800 to-gray-900 text-white text-center py-16 px-4">
                <h2 class="text-3xl md:text-4xl font-bold mb-8">Ready to Design Your Dream Room Today?</h2>
                <div>
                    <Button v-slot="slotProps" asChild>
                        <button v-bind="slotProps.a11yAttrs" class="rounded-md px-3 py-3 bg-red-500 hover:bg-red-300">
                            <RouterLink to="/login" class="text-white font-bold hover:text-gray-600">Try Our Room Visualizer Now!</RouterLink>
                        </button>
                    </Button>
                </div>
            </section>
        </main>

        <footer class="bg-gray-800 text-gray-300 py-8 px-4 mt-auto">
            <div class="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <h3 class="text-xl font-bold mb-4 md:mb-0 text-white">Room Visualizer</h3>
                <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0 md:pl-30">
                    <RouterLink to="/" class="hover:text-white transition-colors duration-200">Home</RouterLink>
                    <RouterLink to="/service/create" class="hover:text-white transition-colors duration-200">Create Room Design</RouterLink>
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