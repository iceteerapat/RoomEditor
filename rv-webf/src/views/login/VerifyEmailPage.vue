<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

import Button from 'primevue/button';
import RepositoriesFactory from '../../apis/repositories/RepositoriesFactory';

const respository = RepositoriesFactory.get('CreateAccountRepository');
const route = useRoute(); 

onMounted(async () => {

  const token = route.params.token;

  try {
    await respository.verify(token);
  } catch (error) {
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
            <section class="verify-page">
                <h2 style="color: black;">Verification Email Success!! Please try login</h2>
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