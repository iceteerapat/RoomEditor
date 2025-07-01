<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

import Button from 'primevue/button';
import RepositoriesFactory from '@/apis/repositories/RepositoriesFactory';
import { useMessageDialog } from '@/components/MessageDialog.js';

const respository = RepositoriesFactory.get('CreateAccountRepository');
const route = useRoute();
const router = useRouter();
const messageDialog = useMessageDialog();

onMounted(async () => {
  const token = route.params.token;

  if (!token) {
    console.error("No verification token found in URL.");
    messageDialog.show("Verification failed: No token provided.", 'error');
    router.push('/home');
    return;
  }

  try {
    const response = await respository.verify(token);
    if (response.status === 200) {
      messageDialog.show("Email verified successfully! You can now log in.", 'success');
    } else {
      messageDialog.show(response?.data?.message || "Verification failed. Please try again.", 'error');
    }
  } catch (error) {
    console.error("Verification error:", error);
    messageDialog.show(error.response?.data?.message || "Verification failed. The link might be invalid or expired.", 'error');
  }
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
    <header class="bg-white shadow-md py-4 px-6 md:px-8 lg:px-12">
      <nav class="flex items-center justify-between flex-wrap">
        <RouterLink to="/home" class="text-2xl font-bold text-gray-800 tracking-tight">
          Room Visualizer
        </RouterLink>
        <ul class="flex items-center space-x-4 md:space-x-6 lg:space-x-8 text-gray-600 font-medium text-lg">
          <RouterLink to="/home" class="hover:text-blue-600 transition-colors duration-200">Home</RouterLink>
          <RouterLink to="/service" class="hover:text-blue-600 transition-colors duration-200">Create Room</RouterLink>
          <RouterLink to="/price" class="hover:text-blue-600 transition-colors duration-200">Pricing</RouterLink>
          <Button asChild v-slot="{ class: btnClass }" severity="primary" class="!p-0 !bg-transparent !border-none !shadow-none">
            <RouterLink to="/login" :class="[btnClass, 'inline-flex items-center justify-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200']">Login</RouterLink>
          </Button>
        </ul>
      </nav>
    </header>

    <main class="flex-grow flex items-center justify-center p-4">
      <section class="verify-page text-center bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 class="text-3xl font-semibold text-green-700 mb-4">Verification Email Success!</h2>
        <p class="text-gray-700 text-lg">Your email has been successfully verified. Please proceed to login to start visualizing your dream rooms.</p>
        <RouterLink to="/login">
            <Button label="Go to Login" severity="primary" class="mt-8 px-6 py-3 text-lg" />
        </RouterLink>
      </section>
    </main>

    <footer class="bg-gray-800 text-white py-8 px-6 md:px-8 lg:px-12">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <h3 class="text-2xl font-bold text-white">Room Visualizer</h3>
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-lg">
          <RouterLink to="/home" class="hover:text-blue-400 transition-colors duration-200">Home</RouterLink>
          <RouterLink to="/service/create" class="hover:text-blue-400 transition-colors duration-200">Create Room</RouterLink>
          <RouterLink to="/price" class="hover:text-blue-400 transition-colors duration-200">Pricing</RouterLink>
        </div>
        <div class="text-sm text-gray-400">
          <p>© {{ new Date().getFullYear() }} Room Visualizer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>