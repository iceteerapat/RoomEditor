<script setup>
import { RouterLink } from 'vue-router';
import { onMounted, ref } from 'vue';

import Button from 'primevue/button';


const slider = ref(null);
const images = [
  '/src/assets/picture/one.jpeg',
  '/src/assets/picture/two.jpeg',
  '/src/assets/picture/three.jpeg',
  '/src/assets/picture/four.jpeg',
  '/src/assets/picture/five.jpeg',
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
            <section class="homepage-section1">
                <h1>Room Visualizer</h1>
                <h2>Turn your imagination into reality with our simple room visualizer.</h2>
                <Button asChild v-slot="slotProps">
                    <RouterLink to="/login" :class="slotProps.class">Get Started</RouterLink>
                </Button>
            </section>
            <section class="homepage-section2">
                <div class="features-container">
                    <h1>Why Choose Room Visualizer?</h1>
                    <div class="feature-card">
                    <!-- <img src="/src/assets/icons/idea.png" alt="Idea icon" /> -->
                    <h3>Easy to Use</h3>
                    <p>No experience needed — start designing in seconds.</p>
                    </div>
                    <div class="feature-card">
                    <!-- <img src="/src/assets/icons/3d.png" alt="3D icon" /> -->
                    <h3>Realistic Previews</h3>
                    <p>Visualize your room in stunning detail and 3D.</p>
                    </div>
                    <div class="feature-card">
                    <!-- <img src="/src/assets/icons/save.png" alt="Save icon" /> -->
                    <h3>Save & Share</h3>
                    <p>Download and share your room designs easily.</p>
                    </div>
                </div>
                <div class="slider-container" ref="slider">
                    <img v-for="(img, index) in images" :key="index" :src="img" class="slider-image" />
                </div>
            </section>
        </main>
        <footer>

        </footer>
    </div>
</template>