<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter  } from 'vue-router';
import { useAuthStore } from '@/store/AuthStore';

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IftaLabel from 'primevue/iftalabel';
import GlobalDialog from '../../components/GlobalDialog.vue';

const messageDialog = ref(null);
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
      messageDialog.value.show(response.data.message, 'Error');
      return;
    }

    if (response.status !== 200) {
      messageDialog.value.show(response.data.message, 'Error');
    } else {
      router.push('/service');
    }
  } catch (error) {
    console.error(error);
    messageDialog.value.show(error.message, 'Error');
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
          <GlobalDialog ref="messageDialog" />
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