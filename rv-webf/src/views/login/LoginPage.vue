<script setup>
import { onMounted, ref, reactive } from 'vue';
import { RouterLink, useRouter  } from 'vue-router';
import { useAuthStore } from '@/store/AuthStore';
import { Form } from '@primevue/forms';

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IftaLabel from 'primevue/iftalabel';
import { useMessageDialog } from '../../components/MessageDialog.js'; 

const messageDialog = useMessageDialog();
const store = useAuthStore();
const router = useRouter();

const loginForm = reactive({
  email: '',
  password: ''
});

function redirectIfLoggedIn() {
  if (
    localStorage.getItem('token')
  ) {
    router.push('/service/create'); 
  }
}

const resolver = ({ values }) => {
    const errors = {};

    if (!values.email) {
        errors.email = [{ message: 'Email is required.' }];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = [{ message: 'Invalid email format.' }];
    }

    if (!values.password) {
        errors.password = [{ message: 'Password is required.' }];
    } else if (values.password.length < 6) {
        errors.password = [{ message: 'Password must be at least 6 characters.' }];
    }
    return {values, errors};
};

const onSubmit = async ({ valid }) => {
  if (!valid) {
    messageDialog.show("Please fill all required fields and correct errors.", 'error');
    return;
  }

  try {
    const response = await store.login(loginForm.email, loginForm.password);

    if (response && response.status === 200) {
      router.push('/service/create'); 
    } else {
      messageDialog.show(response?.data?.message || 'Login failed. Please check your credentials.', 'error');
    }
  } catch (error) {
    console.error("Login error:", error);
    messageDialog.show(error.message, 'error');
  }
};

onMounted(() => {
  redirectIfLoggedIn();
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
    <section class="w-full max-w-sm mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8 md:p-10">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Login</h1>
      </div>

      <Form v-slot="$form" :value="loginForm" :resolver="resolver" @submit="onSubmit" class="space-y-6">
        <IftaLabel class="block">
          <InputText
            id="email"
            v-model="loginForm.email"
            :class="['w-full', { 'p-invalid': $form.email?.invalid }]"
            aria-describedby="email-error"
            :pt="{
              root: { class: 'bg-white text-black dark:bg-white dark:text-black' },
              input: { class: 'bg-white text-black dark:bg-white dark:text-black' }
            }"
          />
          <label for="email">Email:</label>
          <Message v-if="$form.email?.invalid" severity="error" :pt="{ root: { class: 'mt-2' }, text: { class: 'text-sm' } }">{{ $form.email.error.message }}</Message>
        </IftaLabel>

        <IftaLabel class="block">
          <InputText
            id="password"
            type="password"
            v-model="loginForm.password"
            :class="['w-full', { 'p-invalid': $form.password?.invalid }]"
            aria-describedby="password-error"
            :pt="{
              root: { class: 'bg-white text-black dark:bg-white dark:text-black' },
              input: { class: 'bg-white text-black dark:bg-white dark:text-black' }
            }"
          />
          <label for="password">Password:</label>
          <Message v-if="$form.password?.invalid" severity="error" :pt="{ root: { class: 'mt-2' }, text: { class: 'text-sm' } }">{{ $form.password.error.message }}</Message>
        </IftaLabel>

        <div class="text-right text-sm">
          <RouterLink to="/login/reset" class="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Forget password?</RouterLink>
        </div>

        <Button type="submit" label="Log in" severity="primary" class="w-full mt-6" />
      </Form>

      <div class="text-center text-gray-700 mt-6">
        Don't have an account? <RouterLink to="/createAccount" class="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Create account</RouterLink>
      </div>
    </section>
  </div>
</template>