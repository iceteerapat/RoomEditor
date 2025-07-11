<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref } from "vue";
import { computed } from 'vue';
import { formatDateToYMD } from '../../components/DateFormat';
import { useServiceStore } from '../../store/ServiceStore';
import { useAuthStore } from '../../store/AuthStore';
import { useMessageDialog } from '../../components/MessageDialog.js'; 

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

const messageDialog = useMessageDialog();
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
        await messageDialog.show(response.data.message, 'error');
        }
    } catch(error) {
        loading.value = false;
        await messageDialog.show(error.message, 'error');
        if(error.status === 401){
            router.push('/service/creditAndSubscription');
        }
        if(error.status === 404){
            router.push('/login');
        }
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
    messageDialog.show(error.response.data?.message, 'Error'); // Corrected messageDialog usage
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
        messageDialog.show(error.response.data?.message, 'Error'); // Corrected messageDialog usage
    }

}

</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col"> 
        <div v-if="!isLoggedIn" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="bg-white p-8 rounded-lg shadow-xl text-center">
                <h2 class="text-2xl font-semibold mb-4 dark:text-black">Please log in to access this feature</h2>
                <RouterLink to="/login">
                    <button class="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-colors">Go to Login</Button>
                </RouterLink>
            </div>
        </div> 

        <header class="flex items-center justify-between p-4 bg-white shadow-md">
            <div class="hidden md:block text-left text-sm text-gray-600 space-y-1">
                <p>Username: <span class="font-medium">{{ authStore.getUsername }}</span></p>
                <p>Subscription: <span class="font-medium">{{ authStore.getProductName }}</span></p>
                <p>Credits: <span class="font-medium">{{ serviceStore.getCreditsCount }}</span></p>
            </div>
            <div class="md:hidden">
                <p>Credits: <span class="font-medium">{{ serviceStore.getCreditsCount }}</span></p>
            </div>
            <div class="flex-grow text-center">
                <h1 class="hidden md:block text-3xl font-bold text-gray-800 transform translate-x-5">Room Visualizer</h1>
            </div>
            <div class="cursor-pointer p-2" @click="showMenu">
                <i class="fas fa-user text-2xl text-gray-700"/>
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" class="mt-2" />
            </div>
        </header>

        <main class="flex-grow flex flex-col md:flex-row p-4 gap-6">
            <div class="md:hidden flex justify-start mb-4"> <Button icon="fa-solid fa-arrow-right" @click="visibleLeft = true" class="p-button-rounded p-button-text" />
            </div>
            <Drawer v-model:visible="visibleLeft" header="Menu" position="left" class="md:hidden">
                <div class="flex flex-col gap-4 p-4">
                    <RouterLink to="/service/create" class="text-lg text-green-600 hover:text-green-800 transition-colors">Create Room</RouterLink>
                    <RouterLink to="/service/renovate" class="text-lg text-green-600 hover:text-green-800 transition-colors">Renovate Room</RouterLink>
                    <RouterLink to="/service/creditAndSubscription" class="text-lg text-green-600 hover:text-green-800 transition-colors">Credits & Subscription</RouterLink>
                </div>
            </Drawer>

            <aside class="hidden md:block w-64 bg-white p-4 rounded-lg shadow-md">
                <nav class="flex flex-col gap-4">
                    <RouterLink to="/service/create" class="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors py-2 px-3 rounded-md hover:bg-green-50">Create Room</RouterLink>
                    <RouterLink to="/service/renovate" class="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors py-2 px-3 rounded-md hover:bg-green-50">Renovate Room</RouterLink>
                    <RouterLink to="/service/creditAndSubscription" class="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors py-2 px-3 rounded-md hover:bg-green-50">Credits & Subscription</RouterLink>
                </nav>
            </aside>

            <section class="flex-grow flex flex-col lg:flex-row gap-6 bg-white p-6 rounded-lg shadow-md">
                <div class="flex-1 space-y-6  max-w-md">
                    <h2 class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Input Properties</h2>
                    
                    <div class="flex flex-col gap-2">
                        <label for="roomSizeWidth" class="text-gray-700 font-medium">Room Width (m²)</label>
                        <InputNumber inputId="roomSizeWidth" v-model="roomSizeWidth" aria-describedby="roomSizeWidth-help" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="500" class="w-full" />
                        <Message size="small" severity="secondary" variant="simple" class="text-sm text-gray-500">Enter your room width in square meters (m²).</Message>
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="roomSizeHeight" class="text-gray-700 font-medium">Room Height (m²)</label>
                        <InputNumber inputId="roomSizeHeight" v-model="roomSizeHeight" aria-describedby="roomSizeHeight-help" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="500" class="w-full" />
                        <Message size="small" severity="secondary" variant="simple" class="text-sm text-gray-500">Enter your room height in square meters (m²).</Message>
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="roomstyle" class="text-gray-700 font-medium">Room Styles</label>
                        <InputText id="roomstyle" v-model="roomStyle" aria-describedby="roomstyle-help" class="w-full" />
                        <Message size="small" severity="secondary" variant="simple" class="text-sm text-gray-500">Enter your room style such as Italian-American style.</Message>
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="roomtype" class="text-gray-700 font-medium">Room Type</label>
                        <InputText id="roomtype" v-model="roomType" aria-describedby="roomtype-help" class="w-full" />
                        <Message size="small" severity="secondary" variant="simple" class="text-sm text-gray-500">Enter your room type such as Living room, Kitchen, etc.</Message>
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="picturesize" class="text-gray-700 font-medium">Picture Size</label>
                        <Select v-model="pictureSize" :options="size" optionLabel="name" placeholder="Select picture size" class="w-full" />
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="description" class="text-gray-700 font-medium">Description</label>
                        <Textarea id="description" v-model="etc" rows="5" cols="30" class="w-full resize-none" />
                        <Message size="small" severity="secondary" variant="simple" class="text-sm text-gray-500">Describe your room more such as TV on the left or Couch attached to the wall.</Message>
                    </div>
                    
                    <Button label="Generate Room" @click="onSubmit" class="w-full mt-4 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors" />
                </div>
                
                <div class="flex-1 space-y-6 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6 border-gray-200">
                    <h2 class="text-2xl font-bold text-gray-800">Image Result</h2>
                    <Image :src="imageUrl" alt="Generated room" class="max-w-full h-auto rounded-lg shadow-md" preview v-if="imageUrl"/>
                    <Button label="Download Image" @click="downloadImage" v-if="imageUrl" class="mt-4 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors" />
                </div>
                
                <div v-if="loading" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div class="bg-white p-8 rounded-lg shadow-xl text-center flex flex-col items-center gap-4">
                        <ProgressSpinner style="width: 70px; height: 70px" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner"/>
                        <p class="text-lg font-medium text-gray-700">Right now image is generating, please wait for 2-3 minutes</p>
                    </div>
                </div>
            </section>
        </main>
        
        <footer class="bg-gray-800 text-white p-8">
            <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <h3 class="text-2xl font-semibold">Room Visualizer</h3>
                <div class="flex flex-col md:flex-row gap-4 text-center md:text-left">
                    <RouterLink to="/home" class="hover:text-blue-300 transition-colors">Home</RouterLink>
                    <RouterLink to="/service/create" class="hover:text-blue-300 transition-colors">Create Room</RouterLink>
                    <RouterLink to="/price" class="hover:text-blue-300 transition-colors">Pricing</RouterLink>
                </div>
                <div class="text-sm text-gray-400">
                    <p>© 2025 Room Visualizer. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
</template>