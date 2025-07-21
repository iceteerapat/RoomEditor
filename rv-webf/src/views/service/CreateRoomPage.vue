<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref, defineAsyncComponent } from "vue";
import { computed } from 'vue';
import { formatDateToYMD } from '../../components/DateFormat';
import { useServiceStore } from '../../store/ServiceStore';
import { useAuthStore } from '../../store/AuthStore';
import { useMessageDialog } from '../../components/MessageDialog.js'; 
import { marked } from 'marked';
import { useDialog } from 'primevue/usedialog';
import { useToast } from 'primevue/usetoast';

import Toast from 'primevue/toast';
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
const RoomStyleSelector = defineAsyncComponent(() => import('../../components/RoomStyleSelector.vue'));
const RoomTypeSelector = defineAsyncComponent(() => import('../../components/RoomTypeSelector.vue'));

const dialog = useDialog();
const toast = useToast();

const repository = Repositories.get('PurchaseRepository');
const now = new Date();
const loading = ref(false);
const roomSizeWidth = ref('');
const roomSizeHeight = ref('');
const roomSizeLength = ref('');
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
const material = ref('');
const materialAnalysisHtml = ref('');

const showRoomStyleDialog = () => {
  dialog.open(RoomStyleSelector, {
    props: {
      header: 'Select Room Style',
      style: {
        width: '60vw',
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      modal: true,
    },
    data: {
      initialSelection: roomStyle.value
    },
    onClose: (options) => {
      const selectedValue = options.data;
      if (selectedValue) {
        roomStyle.value = selectedValue;
        toast.add({
          severity: 'success',
          summary: 'Style Selected',
          detail: `Room style set to: ${selectedValue}`,
          life: 3000,
        });
      } else {
        toast.add({
          severity: 'info',
          summary: 'Selection Cancelled',
          detail: 'No room style selected.',
          life: 3000,
        });
      }
    },
  });
};

const showRoomTypeDialog = () => {
  dialog.open(RoomTypeSelector, {
    props: {
      header: 'Select Room Type',
      style: {
        width: '60vw',
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      modal: true,
    },
    data: {
      initialSelection: roomType.value
    },
    onClose: (options) => {
      const selectedValue = options.data;
      if (selectedValue) {
        roomType.value = selectedValue;
        toast.add({
          severity: 'success',
          summary: 'Type Selected',
          detail: `Room type set to: ${selectedValue}`,
          life: 3000,
        });
      } else {
        toast.add({
          severity: 'info',
          summary: 'Selection Cancelled',
          detail: 'No room type selected.',
          life: 3000,
        });
      }
    },
  });
};

async function onSubmit() {
    loading.value = true;
    try {
        let prompt = `Create ${roomType.value.toLowerCase()} with ${roomSizeWidth.value} metre of width, ${roomSizeHeight.value} metre of height, ${roomSizeLength.value} metre of length and having the style of ${roomStyle.value.toLowerCase()}`;
        if (etc.value !== '') {
            prompt += ` and include ${etc.value.toLowerCase()}`;
        }
        const ratio = pictureSize.value.code;

        const response = await serviceStore.genImage({prompt, ratio});
        if (response.status === 200) {
            imageUrl.value = response.data.image;
            material.value = response.data.analysis;
            materialAnalysisHtml.value = marked.parse(material.value);
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
          router.push('/');
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
            <div class="md:hidden "> 
                <Button icon="fa-solid fa-bars" @click="visibleLeft = true" class="p-button-rounded p-button-text" />
            </div>
            <div class="translate-x-30 md:hidden dark:text-black">
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

        <main class="flex-grow flex flex-col p-4 gap-6"> 
            <div class="flex flex-col md:flex-row gap-6 flex-grow"> 
                <Drawer v-model:visible="visibleLeft" header="Menu" position="left" class="md:hidden">
                    <div class="flex flex-col gap-4 p-4">
                        <RouterLink to="/service/create" class="text-lg text-green-600 hover:text-green-800 transition-colors" @click="visibleLeft = false">Create Room</RouterLink>
                        <RouterLink to="/service/renovate" class="text-lg text-green-600 hover:text-green-800 transition-colors" @click="visibleLeft = false">Renovate Room</RouterLink>
                        <RouterLink to="/service/creditAndSubscription" class="text-lg text-green-600 hover:text-green-800 transition-colors" @click="visibleLeft = false">Credits & Subscription</RouterLink>
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
                    <div class="flex-1 space-y-6 max-w-md">
                        <h2 class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Input Properties</h2>
                        <div class="flex flex-col gap-2">
                            <label for="roomSizeWidth" class="text-gray-700 font-medium">Room Width (m)</label>
                            <InputNumber inputId="roomSizeWidth" v-model="roomSizeWidth" aria-describedby="roomSizeWidth-help" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="500" class="w-full" />
                            <Message size="small" severity="secondary" variant="simple" class="text-sm text-gray-500">Enter your room width in square meters (m).</Message>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="roomSizeLength" class="text-gray-700 font-medium">Room Height (m)</label>
                            <InputNumber inputId="roomSizeLength" v-model="roomSizeLength" aria-describedby="roomSizeLength-help" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="500" class="w-full" />
                            <Message size="small" severity="secondary" variant="simple" class="text-sm text-gray-500">Enter your room length in square meters (m).</Message>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="roomSizeHeight" class="text-gray-700 font-medium">Room Height (m)</label>
                            <InputNumber inputId="roomSizeHeight" v-model="roomSizeHeight" aria-describedby="roomSizeHeight-help" :minFractionDigits="2" :maxFractionDigits="2" :min="0" :max="500" class="w-full" />
                            <Message size="small" severity="secondary" variant="simple" class="text-sm text-gray-500">Enter your room height in square meters (m).</Message>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="selectedRoomStyle" class="text-gray-700 font-medium">Selected Room Style</label>
                            <InputText v-if="roomStyle" placeholder="Room Style" id="selectedRoomStyle" v-model="roomStyle" readonly class="w-full cursor-pointer" @click="showRoomStyleDialog"/>
                            <Button label="Select Room Style" icon="pi pi-image" @click="showRoomStyleDialog" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="selectedRoomType" class="text-gray-700 font-medium">Selected Room Type</label>
                            <InputText v-if="roomType" placeholder="Room Type" id="selectedRoomType" v-model="roomType" readonly class="w-full cursor-pointer" @click="showRoomTypeDialog" />
                            <Button label="Select Room Type" icon="pi pi-home" @click="showRoomTypeDialog" />
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
            </div> 
            <section class="w-full bg-white p-6 rounded-lg shadow-md">
                <div class="flex items-center justify-center">
                    <h2 class="text-3xl font-bold text-gray-800 ">Material Analysis</h2>
                </div>
                <div v-if="materialAnalysisHtml" class="w-full border-t pt-6 mt-6 border-gray-200">
                    <div class="prose max-w-none text-gray-700 leading-relaxed material-analysis-content">
                        <div v-html="materialAnalysisHtml"></div>
                    </div>
                </div>
                <div v-else-if="!loading && imageUrl" class="w-full border-t pt-6 mt-6 border-gray-200 text-center text-gray-500">
                    <p>No material analysis available for this generation.</p>
                </div>
            </section>
        </main>
        
        <footer class="bg-gray-800 text-gray-300 py-8 px-4 mt-auto">
            <div class="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <h3 class="text-xl font-bold mb-4 md:mb-0 text-white">Room Visualizer</h3>
                <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0 md:pl-30">
                    <RouterLink to="/" class="hover:text-white transition-colors duration-200">Home</RouterLink>
                    <RouterLink to="/service/create" class="hover:text-white transition-colors duration-200">Create Room</RouterLink>
                    <RouterLink to="/price" class="hover:text-white transition-colors duration-200">Pricing</RouterLink>
                    <RouterLink to="/contact" class="hover:text-white transition-colors duration-200">Contact Us</RouterLink>
                </div>
                <div class="text-sm">
                    <p>© 2025 Room Visualizer. All rights reserved.</p>
                </div>
            </div>
        </footer>
        <Toast />
    </div>
</template>