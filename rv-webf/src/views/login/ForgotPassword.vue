<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useMessageDialog } from '@/components/MessageDialog';
import RepositoriesFactory from '../../apis/repositories/RepositoriesFactory';
import Sidebar from 'primevue/sidebar';

const repository = RepositoriesFactory.get('AuthRepository');

const email = ref('');
const isLoading = ref(false);
const emailError = ref('');
const mobileVisible = ref(false);
const messageDialog = useMessageDialog();

function toggleMobileMenu() {
    mobileVisible.value = !mobileVisible.value;
}

const handleForgotPassword = async () => {
  emailError.value = '';
  if (!email.value || !email.value.includes('@')) {
    emailError.value = 'Please enter a valid email address.';
    return;
  }
  isLoading.value = true;

  try {
    const response = await repository.reset({ email: email.value });
    if (response.status === 200) {
      messageDialog.show("Email reset link has been sent to your email", 'success');
    } else {
      messageDialog.show(response?.data?.message || "Verification failed. Please try again.", 'error');
    }
    await new Promise(resolve => setTimeout(resolve, 2000));

  } catch (error) {
    console.error("Forgot password error:", error);
    messageDialog.show(error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
    <header class="bg-white text-black shadow-md">
        <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
            <RouterLink to="/" class="text-2xl font-bold text-white-800">
                Room Visualizer
            </RouterLink>

            <ul class="hidden md:flex space-x-6 items-center">
                <RouterLink to="/" class="hover:text-green-600 transition-colors duration-200">Home</RouterLink>
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

    <main class="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-200">
        <h2 class="text-3xl font-bold text-gray-800 text-center mb-6">Forgot Password</h2>
        <p class="text-gray-600 text-center mb-8">
          Enter your email address below and we'll send you a link to reset your password.
        </p>
        <form @submit.prevent="handleForgotPassword" class="space-y-6">
          <div>
            <label for="email" class="block text-lg font-medium text-gray-700 mb-2">Email Address</label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              placeholder="your@example.com"
              required
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200"
              :class="{ 'p-invalid': emailError }"
              aria-describedby="email-error"
            />
            <small v-if="emailError" id="email-error" class="p-error text-red-500 mt-1 block">{{ emailError }}</small>
          </div>
          <Button
            type="submit"
            label="Send Reset Link"
            class="w-full py-3 text-lg font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :loading="isLoading"
          />
        </form>
        <div class="mt-8 text-center">
          <RouterLink to="/login" class="text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors duration-200">
            Back to Login
          </RouterLink>
        </div>
      </div>
    </main>

    <footer class="bg-gray-800 text-white py-8 px-6 md:px-8 lg:px-12">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <h3 class="text-2xl font-bold text-white">Room Visualizer</h3>
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-lg">
          <RouterLink to="/" class="hover:text-blue-400 transition-colors duration-200">Home</RouterLink>
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