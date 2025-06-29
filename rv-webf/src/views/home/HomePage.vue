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
                    <Button asChild v-slot="slotProps" style="color: white;">
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
                    <h3>Easy to Use</h3>
                    <p>No experience needed & start designing in seconds.</p>
                    </div>
                    <div class="feature-card">
                    <h3>Realistic Previews</h3>
                    <p>Visualize your room in stunning detail and 3D.</p>
                    </div>
                    <div class="feature-card">
                    <h3>Save & Share</h3>
                    <p>Download and share your room designs easily.</p>
                    </div>
                </div>
                <div class="slider-container" ref="slider">
                    <img v-for="(img, index) in images" :key="index" :src="img" class="slider-image" />
                </div>
            </section>
            <section class="homepage-section3">
                <h1>How Does It Works?</h1>
                <div class="how-steps">
                    <div class="how-step">
                    <!-- <span class="step-number">1</span> -->
                    <h3>Upload Your Room</h3>
                    <p>Take a photo or upload a floor plan to get started.</p>
                    </div>
                    <div class="how-step">
                    <!-- <span class="step-number">2</span> -->
                    <h3>Customize Style</h3>
                    <p>Try different furniture, wall colors, and layouts.</p>
                    </div>
                    <div class="how-step">
                    <!-- <span class="step-number">3</span> -->
                    <h3>Visualize & Save</h3>
                    <p>Preview your new room and save or share your design.</p>
                    </div>
                </div>
            </section>
            <section class="homepage-section4">
                <h1>Who It's For</h1>
                <div class="use-cases-grid">
                    <div class="use-case-card">
                    <img src="/src/assets/picture/homeowner.jpg" alt="Homeowners Icon" />
                    <h3>Homeowners</h3>
                    <p>Visualize your renovation ideas before spending a dime.</p>
                    </div>
                    <div class="use-case-card">
                    <img src="/src/assets/picture/interior-designer.jpg" alt="Interior Designers Icon" />
                    <h3>Interior Designers</h3>
                    <p>Create mockups quickly to present your vision to clients.</p>
                    </div>
                    <div class="use-case-card">
                    <img src="/src/assets/picture/real-estate.jpg" alt="Real Estate Agents Icon" />
                    <h3>Real Estate Agents</h3>
                    <p>Help clients see the potential of a space with interactive visuals.</p>
                    </div>
                </div>
            </section>
            <section class="homepage-section5">
                <h1>Ready to Design Your Dream Room?</h1>
                <div class="homepage-section5-button">
                    <Button asChild v-slot="slotProps" severity="danger">
                        <RouterLink to="/login" :class="slotProps.class">Try Now!</RouterLink>
                    </Button>
                </div>
            </section>
        </main>
        <footer class="footerpage">
            <div class="footerpage-container">
                <h3>Room Visualizer</h3>
                <div class="footerpage-column">
                    <RouterLink to="/home">Home</RouterLink>
                    <RouterLink to="/service/create">Create Room</RouterLink>
                    <RouterLink to="/price">Pricing</RouterLink>
                </div>
                <div class="footerpage-legal">
                    <p>© 2025 Room Visualizer. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
</template>