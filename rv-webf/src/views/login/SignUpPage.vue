<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IftaLabel from 'primevue/iftalabel';

const username = ref('')
const email = ref('')
const password = ref('')
const visible = ref(false);

const handleSubmit = () => {
  console.log('Username: ', username.value)
  console.log('Email: ', email.value)
  console.log('Password: ', password.value)
}
</script>

<template>
    <div class="wrapper">
        <section class="createaccountpage">
            <div class="createaccountform">
                <h1>Create an account to visualize dream rooms</h1>
                <form @submit.prevent="handleSubmit">
                  <IftaLabel class="formusername">
                    <InputText id="email" v-model="email" :invalid="!value"/>
                    <label for="email">Email:</label>
                  </IftaLabel>
                  <IftaLabel class="formusername">
                    <InputText id="username" v-model="username" :invalid="!value"/>
                    <label for="username">Username:</label>
                  </IftaLabel>
                  <IftaLabel class="formpassword">
                    <InputText id="password" v-model="password" :invalid="!value"/>
                    <label for="password">Password:</label>
                  </IftaLabel>

                  <Button type="submit" label="Create Account" @click="visible = true" severity="primary" />
                  <Dialog v-model:visible="visible" modal header="Success" :style="{ width: '770px' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <p class="m-0">
                        Congratulations🎉🎉🎉 You have create account successfully. Please try login!
                    </p>
                  </Dialog>
                  <div class="checkaccount">
                    Aleady have an account? <RouterLink to="/login">Log in</RouterLink>
                  </div>
                </form>
            </div>
        </section>
    </div>
</template>