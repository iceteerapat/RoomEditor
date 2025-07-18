<script setup>
import { ref, inject, computed, watch } from 'vue';

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const dialogRef = inject('dialogRef');

const roomTypes = ref([
  { name: 'Attic', image: '/typeAndStyle/style/attic.jpg' },
  { name: 'Basement', image: '/typeAndStyle/style/basement.jpg' },
  { name: 'Bathroom', image: '/typeAndStyle/style/bathroom.jpg' },
  { name: 'Bedroom', image: '/typeAndStyle/style/bedroom.jpg' },
  { name: 'Closet/Walk-in Closet', image: '/typeAndStyle/style/closet.jpg' },
  { name: 'Dining Room', image: '/typeAndStyle/style/dining.jpg' },
  { name: 'Entryway (Foyer/Mudroom)', image: '/typeAndStyle/style/entryway.jpg' },
  { name: 'Family Room', image: '/typeAndStyle/style/family.jpg' },
  { name: 'Fitness Room', image: '/typeAndStyle/style/fitness.jpg' },
  { name: 'Garage', image: '/typeAndStyle/style/garage.jpg' },
  { name: 'Hallway/Corridor', image: '/typeAndStyle/style/hallway.jpg' },
  { name: 'Home Office', image: '/typeAndStyle/style/homeOffice.jpg' },
  { name: 'Home Theater', image: '/typeAndStyle/style/hometheater.jpg' },
  { name: 'Kitchen', image: '/typeAndStyle/style/kitchen.jpg' },
  { name: 'Laundry Room', image: '/typeAndStyle/style/laundry.jpg' },
  { name: 'Living Room', image: '/typeAndStyle/style/living.jpg' },
  { name: 'Pantry', image: '/typeAndStyle/style/pantry.jpg' },
  { name: 'Playroom', image: '/typeAndStyle/style/playroom.jpg' },
  { name: 'Stairwell', image: '/typeAndStyle/style/stairewell.jpg' },
  { name: 'Sunroom', image: '/typeAndStyle/style/sunroom.jpg' },
  { name: 'Utility Room', image: '/typeAndStyle/style/utility.jpg' },
]);

const searchTerm = ref('');
const selectedType = ref(null);
const selectedCustomType = ref('');

if (dialogRef.value && dialogRef.value.data && dialogRef.value.data.initialSelection) {
  const initial = dialogRef.value.data.initialSelection;
  const foundType = roomTypes.value.find(s => s.name.toLowerCase() === initial.toLowerCase());
  if (foundType) {
    selectedType.value = foundType;
    searchTerm.value = foundType.name;
  } else {
    selectedCustomType.value = initial;
    searchTerm.value = initial;
  }
}

const filteredRoomTypes = computed(() => {
  if (!searchTerm.value) {
    return roomTypes.value;
  }
  const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
  return roomTypes.value.filter(type =>
    type.name.toLowerCase().includes(lowerCaseSearchTerm)
  );
});

watch(searchTerm, (newValue) => {
  const lowerCaseNewValue = newValue.toLowerCase().trim();
  const foundMatch = roomTypes.value.find(type => type.name.toLowerCase() === lowerCaseNewValue);

  if (foundMatch) {
    selectedType.value = foundMatch;
    selectedCustomType.value = '';
  } else if (newValue.trim() !== '') {
    selectedType.value = null;
    selectedCustomType.value = newValue.trim();
  } else {
    selectedType.value = null;
    selectedCustomType.value = '';
  }
});

const selectType = (type) => {
  selectedType.value = type;
  selectedCustomType.value = '';
  searchTerm.value = type.name;
};

const isCustomTypeSelected = computed(() => {
  return selectedCustomType.value !== '' && !selectedType.value;
});

const selectedTypeName = computed(() => {
  if (selectedType.value) {
    return selectedType.value.name;
  } else if (selectedCustomType.value) {
    return selectedCustomType.value;
  }
  return '';
});

const canConfirmSelection = computed(() => {
  return selectedType.value !== null || selectedCustomType.value !== '';
});

const confirmSelection = () => {
  if (selectedType.value) {
    dialogRef.value.close(selectedType.value.name);
  } else if (selectedCustomType.value) {
    dialogRef.value.close(selectedCustomType.value);
  }
};

const closeDialog = (data) => {
  dialogRef.value.close(data);
};
</script>

<template>
  <div class="p-fluid p-4">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 dark:text-white">Select Your Room Type</h3>
    <div class="mb-4">
      <InputText v-model="searchTerm" placeholder="Search or enter your custom type..." class="w-full"/>
    </div>

    <div v-if="isCustomTypeSelected" class="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md">
      <i class="pi pi-info-circle mr-2"></i>
      Using custom type: <span class="font-semibold">{{ selectedTypeName }}</span>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto pr-2">
      <div v-for="type in filteredRoomTypes" :key="type.name" class="flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200"
       :class="{
          'border-blue-500 ring-2 ring-blue-200 shadow-md': selectedType && selectedType.name === type.name,
          'hover:bg-gray-50': !(selectedType && selectedType.name === type.name)
        }"
        @click="selectType(type)"
      >
      <img :src="type.image" :alt="type.name" class="w-full h-24 object-cover rounded-md mb-2" onerror="this.onerror=null;this.src='/images/placeholder-no-image.jpg';"/>
        <span class="text-sm font-medium text-gray-700 text-center dark:text-white">{{ type.name }}</span>
      </div>
      <div v-if="filteredRoomTypes.length === 0 && searchTerm && !isCustomTypeSelected" class="col-span-full text-center text-gray-500 py-4">
        No matching types found. Type above to use a custom type.
      </div>
    </div>

    <div class="flex justify-content-end gap-2 mt-6">
      <Button label="Cancel" icon="pi pi-times" class="p-button-text p-button-secondary" @click="closeDialog(null)" />
      <Button label="Select Type" icon="pi pi-check" :disabled="!canConfirmSelection" @click="confirmSelection" />
    </div>
  </div>
</template>