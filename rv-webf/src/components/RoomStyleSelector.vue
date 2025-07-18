<script setup>
import { ref, inject, computed, watch } from 'vue';

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const dialogRef = inject('dialogRef');

const roomStyles = ref([
  { name: 'Art Deco', image: '/src/assets/picture/typeAndStyle/style/artDeco.png' },
  { name: 'Asian Zen', image: '/src/assets/picture/typeAndStyle/style/asianZen.png' },
  { name: 'Bohemian (Boho Chic)', image: '/src/assets/picture/typeAndStyle/style/bohemian.jpg' },
  { name: 'Classic', image: '/src/assets/picture/typeAndStyle/style/classic.jpg' },
  { name: 'Coastal/Hamptons', image: '/src/assets/picture/typeAndStyle/style/coastal.png' },
  { name: 'Contemporary', image: '/src/assets/picture/typeAndStyle/style/contemporary.jpg' },
  { name: 'Eclectic', image: '/src/assets/picture/typeAndStyle/style/eclectic.png' },
  { name: 'Farmhouse', image: '/src/assets/picture/typeAndStyle/style/farmhouse.png' },
  { name: 'Hollywood Regency', image: '/src/assets/picture/typeAndStyle/style/hollywoodRegency.png' },
  { name: 'Industrial', image: '/src/assets/picture/typeAndStyle/style/industrial.jpg' },
  { name: 'Luxury', image: '/src/assets/picture/typeAndStyle/style/luxury.jpg' },
  { name: 'Mediterranean', image: '/src/assets/picture/typeAndStyle/style/mediterranean.png' },
  { name: 'Mid-Century Modern', image: '/src/assets/picture/typeAndStyle/style/midCentury.png' },
  { name: 'Minimalist', image: '/src/assets/picture/typeAndStyle/style/minimalist.jpg' },
  { name: 'Modern', image: '/src/assets/picture/typeAndStyle/style/modern.jpg' },
  { name: 'Rustic', image: '/src/assets/picture/typeAndStyle/style/rustic.jpg' },
  { name: 'Scandinavian', image: '/src/assets/picture/typeAndStyle/style/scandinavian.jpg' },
  { name: 'Shabby Chic', image: '/src/assets/picture/typeAndStyle/style/shabbychic.png' },
  { name: 'Transitional', image: '/src/assets/picture/typeAndStyle/style/transitional.png' },
  { name: 'Urban Modern', image: '/src/assets/picture/typeAndStyle/style/urbanModern.png' },
]);

const searchTerm = ref('');
const selectedStyle = ref(null);
const selectedCustomStyle = ref('');

if (dialogRef.value && dialogRef.value.data && dialogRef.value.data.initialSelection) {
  const initial = dialogRef.value.data.initialSelection;
  const foundStyle = roomStyles.value.find(s => s.name.toLowerCase() === initial.toLowerCase());
  if (foundStyle) {
    selectedStyle.value = foundStyle;
    searchTerm.value = foundStyle.name;
  } else {
    selectedCustomStyle.value = initial;
    searchTerm.value = initial;
  }
}

const filteredRoomStyles = computed(() => {
  if (!searchTerm.value) {
    return roomStyles.value;
  }
  const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
  return roomStyles.value.filter(style =>
    style.name.toLowerCase().includes(lowerCaseSearchTerm)
  );
});

watch(searchTerm, (newValue) => {
  const lowerCaseNewValue = newValue.toLowerCase().trim();
  const foundMatch = roomStyles.value.find(style => style.name.toLowerCase() === lowerCaseNewValue);

  if (foundMatch) {
    selectedStyle.value = foundMatch;
    selectedCustomStyle.value = '';
  } else if (newValue.trim() !== '') {
    selectedStyle.value = null;
    selectedCustomStyle.value = newValue.trim();
  } else {
    selectedStyle.value = null;
    selectedCustomStyle.value = '';
  }
});

const selectStyle = (style) => {
  selectedStyle.value = style;
  selectedCustomStyle.value = '';
  searchTerm.value = style.name;
};

const isCustomStyleSelected = computed(() => {
  return selectedCustomStyle.value !== '' && !selectedStyle.value;
});

const selectedStyleName = computed(() => {
  if (selectedStyle.value) {
    return selectedStyle.value.name;
  } else if (selectedCustomStyle.value) {
    return selectedCustomStyle.value;
  }
  return '';
});

const canConfirmSelection = computed(() => {
  return selectedStyle.value !== null || selectedCustomStyle.value !== '';
});

const confirmSelection = () => {
  if (selectedStyle.value) {
    dialogRef.value.close(selectedStyle.value.name);
  } else if (selectedCustomStyle.value) {
    dialogRef.value.close(selectedCustomStyle.value);
  }
};

const closeDialog = (data) => {
  dialogRef.value.close(data);
};
</script>

<template>
  <div class="p-fluid p-4">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 dark:text-white">Select Your Room Style</h3>
    <div class="mb-4">
      <InputText v-model="searchTerm" placeholder="Search or enter your custom style..." class="w-full"/>
    </div>

    <div v-if="isCustomStyleSelected" class="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md">
      <i class="pi pi-info-circle mr-2"></i>
      Using custom style: <span class="font-semibold">{{ selectedStyleName }}</span>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto pr-2">
      <div v-for="style in filteredRoomStyles" :key="style.name" class="flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200"
       :class="{
          'border-blue-500 ring-2 ring-blue-200 shadow-md': selectedStyle && selectedStyle.name === style.name,
          'hover:bg-gray-50': !(selectedStyle && selectedStyle.name === style.name)
        }"
        @click="selectStyle(style)"
      >
      <img :src="style.image" :alt="style.name" class="w-full h-24 object-cover rounded-md mb-2" onerror="this.onerror=null;this.src='/images/placeholder-no-image.jpg';"/>
        <span class="text-sm font-medium text-gray-700 text-center dark:text-white">{{ style.name }}</span>
      </div>
      <div v-if="filteredRoomStyles.length === 0 && searchTerm && !isCustomStyleSelected" class="col-span-full text-center text-gray-500 py-4">
        No matching styles found. Type above to use a custom style.
      </div>
    </div>

    <div class="flex justify-content-end gap-2 mt-6">
      <Button label="Cancel" icon="pi pi-times" class="p-button-text p-button-secondary" @click="closeDialog(null)" />
      <Button label="Select Style" icon="pi pi-check" :disabled="!canConfirmSelection" @click="confirmSelection" />
    </div>
  </div>
</template>