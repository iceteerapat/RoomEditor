<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter  } from 'vue-router';
import { useAuthStore } from '@/store/AuthStore';

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IftaLabel from 'primevue/iftalabel';

const store = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

function redirectIfLoggedIn() {
  if (
    localStorage.getItem('token')
  ) {
    router.push('/service'); 
  }
}

const login = async() => {
  try {
    const response = await store.login(email.value, password.value);

    if (!response || !response.status) {
      alert("Something went wrong. No response from server.");
      return;
    }

    if (response.status !== 200) {
      alert("Email / Password is invalid, please re-login");
    } else {
      router.push('/service');
    }
  } catch (error) {
    console.error(error);
    alert("Unexpected error. Try again later.");
  }
};

onMounted(() => {
  redirectIfLoggedIn();
});
</script>

<template>
  <div class="wrapper">
    <section class="loginpage">
      <div class="loginform">
        <h1>Login</h1>
        <form @submit.prevent="login">
          <IftaLabel class="formusername">
            <InputText id="email" v-model="email" :invalid="!value"/>
            <label for="email">Email:</label>
          </IftaLabel>
          <IftaLabel class="formpassword">
            <InputText id="password" type="password" v-model="password" :invalid="!value"/>
            <label for="password">Password:</label>
          </IftaLabel>
          <div class="forgetpassword"> 
              <RouterLink to="/forgetpassword">Forget password?</RouterLink>
          </div>
          <Button type="submit" label="Log in" severity="primary" />
        </form>
        <ul>
          <div class="signup">
            Don't have an account? <RouterLink to="/createAccount">Create account</RouterLink>
          </div>
        </ul>
      </div>
    </section>
  </div>
</template>