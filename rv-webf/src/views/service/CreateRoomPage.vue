<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref } from "vue";
import { useAuthStore } from '@/store/AuthStore';
import { computed } from 'vue';

import RepositoriesFactory from '../../apis/repositories/RepositoriesFactory'
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Drawer from 'primevue/drawer';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import Image from 'primevue/image';
import ProgressSpinner from 'primevue/progressspinner';

const respository = RepositoriesFactory.get('RoomServiceRepository');
const visibleLeft = ref(false);
const authStore = useAuthStore();

const loading = ref(false);
const roomSize = ref('');
const roomStyle = ref('');
const roomType = ref('');
const pictureSize = ref('');
const size = ref([
    {name: '800 X 600', code: 0.69},
    {name: '1024 X 768', code: 0.88},
    {name: '1280 X 720', code: 0.95},
    {name: '1366 X 768', code: 1},
    {name: '1600 X 900', code: 1.18},
    {name: '1760 X 990', code: 1.3},
    {name: '1920 X 1080', code: 1.41}
])
const etc = ref('');
const imageUrl = ref('');

async function onSubmit() {
    loading.value = true;
    try {
        let prompt = `Create ${roomType.value.toLowerCase()} with ${roomSize.value} square metre and have the style of ${roomStyle.value.toLowerCase()}`;
        if (etc.value !== '') {
            prompt += ` and include ${etc.value.toLowerCase()}`;
        }
        const ratio = pictureSize.value.code;

        const response = await respository.create({prompt, ratio});
        if (response.status === 200) {
            imageUrl.value = response.data.image;
        } else {
            console.error("Image generation failed", response);
        }
    } catch(error) {
        console.error("Error during generation:", error);
    } finally {
        loading.value = false;
    }
}

function downloadImage() {
  const link = document.createElement('a');
  link.href = imageUrl.value;
  link.download = 'generated-room.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const isLoggedIn = computed(() => 
    !!authStore.token || !!localStorage.getItem('token')
);

const router = useRouter();
const showMenu = (event) => {
    menu.value.toggle(event);
};
const menu = ref();
const items = computed(() => [
  {
    label: 'Profile Setting',
    items: [
      {
        label: 'Account',
        command: () => {
          router.push('/service/account');
        }
      },
      {
        label: 'Logout',
        command: () => {
          authStore.logout();
          router.push('/home');
        }
      }
    ]
  }

]);
const username = localStorage.getItem('username');
</script>

<template>
    <div class="wrapper">
        <div v-if="!isLoggedIn" class="login-overlay">
            <div class="login-content">
                <h2>Please log in to access this feature</h2>
                <RouterLink to="/login">
                    <Button class="login-button">Go to Login</Button>
                </RouterLink>
            </div>
        </div> 
        <header class="servicepage-menu">
            <div class="icon" @click="showMenu">
                <i class="fas fa-user"/>
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" style="align-items: flex-end;" />
            </div>
            <div class="logo-servicepage">
                <h1>Room Visualizer</h1>
            </div>
            <div class="profile-info">
                <p>Username: {{ username }}</p>
                <p>Subscription: </p>
            </div>

        </header>
        <main>
            <div class="drawer-toggle-btn">
                <Button icon="fa-solid fa-arrow-right" @click="visibleLeft = true" />
            </div>
            <Drawer v-model:visible="visibleLeft" header="Menu">
                <RouterLink to="/service/create">Create Room</RouterLink>
                <RouterLink to="/service/renovate">Renovate Room</RouterLink>
            </Drawer>
            <section class="createimage-page">
                <div class="input-properties">
                    <h2>Input Properties</h2>
                    <div class="input-roomsize">
                        <label for="roomsize">Room Size</label>
                        <InputNumber inputId="roomsize" v-model="roomSize" aria-describedby="roomsize-help" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="500"fluid />
                        <Message size="small" severity="secondary" variant="simple">Enter your room size required (m²).</Message>
                    </div>
                    <div class="input-roomstyle">
                        <label for="roomstyle">Room Styles</label>
                        <InputText id="roomstyle" v-model="roomStyle" aria-describedby="roomstyle-help" fluid/>
                        <Message size="small" severity="secondary" variant="simple">Enter your room style such as Italian-American style.</Message>
                    </div>
                    <div class="input-roomtype">
                        <label for="roomtype">Room Type</label>
                        <InputText id="roomtype" v-model="roomType" aria-describedby="roomtype-help" fluid/>
                        <Message size="small" severity="secondary" variant="simple">Enter your room type such as Living room, Kitchen, etc.</Message>
                    </div>
                    <div class="select-size">
                        <label for="picturesize">Picture Size</label>
                        <Select v-model="pictureSize" :options="size" optionLabel="name" placeholder="Select picture size"/>
                    </div>
                    <div class="input-etc">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="etc" rows="5" cols="30" style="resize: none" />
                        <Message size="small" severity="secondary" variant="simple">Describe your room more such as TV on the left or Couch attach with the wall.</Message>
                    </div>
                    <Button label="Generate Room" @click="onSubmit"/>
                    <ProgressSpinner v-if="loading" style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner"/>
                </div>
                <div class="image-result">
                    <h2>Image Result</h2>
                    <Image :src="imageUrl" alt="Generated room" width="80%" preview v-if="imageUrl"/>
                    <Button label="Download Image" @click="downloadImage" v-if="imageUrl"/>
                </div>
            </section>
        </main>
        <footer class="footerpage" style="height: 160px;" >
            <div class="footerpage-container">
                <h3>Room Visualizer</h3>
                <div class="footerpage-column">
                    <RouterLink to="/home">Home</RouterLink>
                    <RouterLink to="/service">Create Room</RouterLink>
                    <RouterLink to="/price">Pricing</RouterLink>
                </div>
                <div class="footerpage-legal">
                    <p>© 2025 Room Visualizer. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
</template>