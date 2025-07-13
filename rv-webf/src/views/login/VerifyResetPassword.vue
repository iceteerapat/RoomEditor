<script setup>
import { reactive, ref, onMounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { Form } from '@primevue/forms';

import Button from 'primevue/button';
import IftaLabel from 'primevue/iftalabel';
import Password from 'primevue/password';
import Message from 'primevue/message';
import Sidebar from 'primevue/sidebar';

import RepositoriesFactory from '@/apis/repositories/RepositoriesFactory';
import { useMessageDialog } from '@/components/MessageDialog.js';

const respository = RepositoriesFactory.get('AuthRepository');
const route = useRoute();
const router = useRouter();
const messageDialog = useMessageDialog();

const isLoading = ref(false);
const tokenVerified = ref(false);
const mobileVisible = ref(false);

function toggleMobileMenu() {
  mobileVisible.value = !mobileVisible.value;
}

const passwordForm = reactive({
  newPassword: '',
  confirmPassword: ''
});

const resolver = ({ values }) => {
  const errors = {};
  const newPassword = values?.newPassword || '';
  const confirmPassword = values?.confirmPassword || '';

  if (!newPassword) {
    errors.newPassword = [{ message: 'New password is required.' }];
  } else if (newPassword.length < 8) {
    errors.newPassword = [{ message: 'Password must be at least 8 characters.' }];
  }

  if (!confirmPassword) {
    errors.confirmPassword = [{ message: 'Confirm password is required.' }];
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = [{ message: 'Passwords do not match.' }];
  }

  return { values, errors };
};

onMounted(async () => {
  const token = route.params.token;

  if (!token) {
    console.error("No verification token found in URL.");
    messageDialog.show("Verification failed: No token provided.", 'error');
    router.push('/login');
    return;
  }

  try {
    const response = await respository.verifyResetToken(token);
    if (response.status === 200) {
      messageDialog.show("Token verified. Please set your new password.", 'success');
      tokenVerified.value = true;
    } else {
      messageDialog.show(response?.data?.message || "Token verification failed. Please try again.", 'error');
      router.push('/login');
    }
  } catch (error) {
    console.error("Token verification error:", error);
    messageDialog.show(error.response?.data?.message || "Token verification failed. The link might be invalid or expired.", 'error');
    router.push('/login');
  }
});

const onSubmit = async ({ valid }) => {
  if (!valid) {
    console.log("Please correct the password errors.");
    return;
  }

  isLoading.value = true;
  const token = route.params.token;

  try {
    const response = await respository.verifyReset({
      token: token,
      newPassword: passwordForm.newPassword
    });

    if (response.status === 200) {
      messageDialog.show("Your password has been successfully reset! You can now log in.", 'success');
      router.push('/login');
    } else {
      messageDialog.show(response?.data?.message || "Failed to set new password. Please try again.", 'error');
    }
  } catch (error) {
    console.error("Set new password error:", error);
    messageDialog.show(error.response?.data?.message || "Failed to set new password. The link might be invalid or expired.", 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50 font-sans antialiased dark:bg-gray-50">
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

    <main class="flex-grow flex items-center justify-center p-4 sm:p-6">
      <section class="w-full max-w-sm mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8 md:p-10 dark:bg-white">
        <div class="text-center mb-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 dark:text-gray-800">Set New Password</h1>
        </div>

        <div v-if="!tokenVerified" class="text-center text-gray-700 dark:text-gray-300">
          <p class="mb-4">Verifying your token...</p>
          <i class="pi pi-spin pi-spinner text-4xl text-blue-500 dark:text-blue-400"></i>
        </div>

        <Form v-else v-slot="$form" :value="passwordForm" :resolver="resolver" @submit="onSubmit" class="space-y-5">
          <IftaLabel class="block">
            <Password
              v-model="passwordForm.newPassword"
              name="newPassword"
              inputId="newPassword"
              variant="filled"
              toggleMask
              :class="['w-full', { 'p-invalid': $form.newPassword?.invalid }]"
              aria-describedby="newPassword-error"
            />
            <label for="newPassword" class="text-emerald-500 dark:text-emerald-400">New Password:</label>
            <Message v-if="$form.newPassword?.invalid" severity="error" :pt="{ root: { class: 'mt-2' }, text: { class: 'text-sm' } }">{{ $form.newPassword.error.message }}</Message>
          </IftaLabel>

          <IftaLabel class="block">
            <Password
              v-model="passwordForm.confirmPassword"
              name="confirmPassword"
              inputId="confirmPassword"
              variant="filled"
              toggleMask
              :class="['w-full', { 'p-invalid': $form.confirmPassword?.invalid }]"
              aria-describedby="confirmPassword-error"
            />
            <label for="confirmPassword" class="text-emerald-500 dark:text-emerald-400">Confirm Password:</label>
            <Message v-if="$form.confirmPassword?.invalid" severity="error" :pt="{ root: { class: 'mt-2' }, text: { class: 'text-sm' } }">{{ $form.confirmPassword.error.message }}</Message>
          </IftaLabel>

          <Button type="submit" label="Set New Password" severity="primary" class="w-full mt-6" :loading="isLoading" />
        </Form>
      </section>
    </main>

    <footer class="bg-gray-800 text-white py-8 px-6 md:px-8 lg:px-12 dark:bg-gray-950">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <h3 class="text-2xl font-bold text-white">Room Visualizer</h3>
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-lg text-gray-300">
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
