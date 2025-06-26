<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/store/AuthStore'

import ConfirmDialog from 'primevue/confirmdialog';
import DynamicDialog from 'primevue/dynamicdialog';

const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.isAuthenticated) { 
    await authStore.refresh();
  }
});
</script>

<template>
  <ConfirmDialog />
  <DynamicDialog />
  <RouterView />
</template>

<style src="@fortawesome/fontawesome-free/css/all.min.css"></style>

<style>
@import './assets/css/room-visuallizer-theme.css';
</style>