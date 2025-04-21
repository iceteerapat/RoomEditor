<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IftaLabel from 'primevue/iftalabel';

const username = ref('')
const password = ref('')

const handleSubmit = () => {
  console.log('Username:', username.value)
  console.log('Password:', password.value)
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
            <label for="username">Username</label>
          </IftaLabel>

          <IftaLabel class="formpassword">
            <InputText id="password" type="password" v-model="password" :invalid="!value"/>
            <label for="password">Password</label>
          </IftaLabel>

          <Button type="submit" label="Log in" severity="primary" />
        </form>
      </div>
    </section>
  </div>
</template>