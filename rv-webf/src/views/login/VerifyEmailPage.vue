<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

import Client from '../../apis/AxiosClient/Axios';
import Button from 'primevue/button';

const route = useRoute(); 
const router = useRouter();

onMounted(async () => {
    
  const token = route.params.token;
  try {
    const response = await Client.get(`/verify-email/${token}`);
    alert(response.data.message); 
    router.push('/login'); 
  } catch (error) {
    alert('Verification failed or expired. Please try again.');
    console.error(error);
  }
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
            <section>
                <h2>Verification Email Success!! Please try login</h2>
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