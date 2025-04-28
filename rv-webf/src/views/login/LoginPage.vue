<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IftaLabel from 'primevue/iftalabel';

const username = ref('');
const email = ref('');
const password = ref('');

const handleSubmit = () => {
  console.log('Email:', email.value);
  console.log('Username: ', username.value);
  console.log('Password:', password.value);
}
</script>

<template>
  <div class="wrapper">
    <section class="loginpage">
      <div class="loginform">
        <h1>Login</h1>
        <form @submit.prevent="handleSubmit">
          <IftaLabel class="formusername">
            <InputText id="username" v-model="username" :invalid="!value"/>
            <label for="username">Username:</label>
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