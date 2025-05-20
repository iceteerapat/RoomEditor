<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter  } from 'vue-router';
import { useAuthStore } from '../../store/AuthStore';

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IftaLabel from 'primevue/iftalabel';

const store = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const handleSubmit = () => {
  console.log('Email:', email.value);
  console.log('Password:', password.value);
}

const login = async() => {
    store.login(email.value, password.value);
    router.push('/service');
};

</script>

<template>
  <div class="wrapper">
    <section class="loginpage">
      <div class="loginform">
        <h1>Login</h1>
        <form @submit.prevent="handleSubmit">
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
          <Button type="submit" label="Log in" severity="primary" @click="login" />
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