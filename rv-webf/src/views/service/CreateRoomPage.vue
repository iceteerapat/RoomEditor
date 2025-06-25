<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref } from "vue";
import { computed } from 'vue';
import { formatDateToYMD } from '../../components/DateFormat';
import { useServiceStore } from '../../store/ServiceStore';
import { useAuthStore } from '../../store/AuthStore';
import { decodeJwt } from '../../components/DecodeJwt.js';

import Repositories from '../../apis/repositories/RepositoriesFactory.js';
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

const visibleLeft = ref(false);
const serviceStore = useServiceStore();
const authStore = useAuthStore();

const repository = Repositories.get('PurchaseRepository');
const now = new Date();
const loading = ref(false);
const roomSizeWidth = ref('');
const roomSizeHeight = ref('');
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
    {name: '1920 X 1080', code: 1.43}
])
const etc = ref('');
const imageUrl = ref('');

const token = localStorage.getItem('token');
const email = ref('');
const username = ref('');
const customerId = ref('');
const serviceName = ref('');
const imageGenerate = ref('');

if(token){
    const data = decodeJwt(token);
    if(data){
        email.value = data.email || '';
        username.value = data.username || '';
        customerId.value = data.customerId || '';
        serviceName.value = data.serviceName || '';
        imageGenerate.value = data.imageGenerate || '';
    }
}

async function onSubmit() {
    loading.value = true;
    try {
        let prompt = `Create ${roomType.value.toLowerCase()} with ${roomSizeWidth.value} square metre of width and ${roomSizeHeight.value} square metre of height and having the style of ${roomStyle.value.toLowerCase()}`;
        if (etc.value !== '') {
            prompt += ` and include ${etc.value.toLowerCase()}`;
        }
        const ratio = pictureSize.value.code;

        const response = await serviceStore.genImage({prompt, ratio});
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

async function downloadImage() {
  try {
    const response = await fetch(imageUrl.value, {
      mode: 'cors',
    });
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-room-${formatDateToYMD(now)}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  }
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
          onManage();
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

async function onManage(){
    try{
        const response = await repository.manage({withCredentials: true});
        const portalUrl = response.data.url;
        window.location.href = portalUrl;
    }catch(error){
        console.error('Error creating portal session:', error);
        alert('Could not open billing portal. Please try again later.');
    }

}

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
                <p>Subscription: {{ serviceName }} </p>
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
                        <label for="roomSizeWidth">Room Width</label>
                        <InputNumber inputId="roomSizeWidth" v-model="roomSizeWidth" aria-describedby="roomSizeWidth-help" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="500"fluid />
                        <Message size="small" severity="secondary" variant="simple">Enter your room size required (m²).</Message>
                    </div>
                    <div class="input-roomsize">
                        <label for="roomSizeHeight">Room Height</label>
                        <InputNumber inputId="roomSizeHeight" v-model="roomSizeHeight" aria-describedby="roomSizeHeight-help" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="500"fluid />
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
                </div>
                <div class="image-result">
                    <h2>Image Result</h2>
                    <Image :src="imageUrl" alt="Generated room" width="80%" preview v-if="imageUrl"/>
                    <Button label="Download Image" @click="downloadImage" v-if="imageUrl"/>
                </div>
                <div v-if="loading" class="loading-overlay">
                    <div class="loading-content">
                        <ProgressSpinner v-if="loading" style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner"/>
                        <p>Right now image is generating, please wait for 2-3 minutes</p>
                    </div>
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