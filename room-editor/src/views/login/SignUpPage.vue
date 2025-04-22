<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IftaLabel from 'primevue/iftalabel';

const username = ref('')
const email = ref('')
const password = ref('')

const handleSubmit = () => {
  console.log('Username: ', username.value)
  console.log('Email: ', email.value)
  console.log('Password: ', password.value)
}
</script>

<template>
    <div class="wrapper">
        <section class="createaccountpage">
            <div class="createaccoutnform">
                <h1>Create an account to visualize dream rooms</h1>
                <form @submit.prevent="handleSubmit">
                  <IftaLabel class="formusername">
                    <InputText id="email" v-model="email" :invalid="!value"/>
                    <label for="email">Email:</label>
                  </IftaLabel>
                </form>
            </div>
        </section>
    </div>
</template>