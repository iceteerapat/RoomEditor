<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/store/AuthStore'

import ConfirmDialog from 'primevue/confirmdialog';
import DynamicDialog from 'primevue/dynamicdialog';

const authStore = useAuthStore();

onMounted(async () => {
  authStore.initializeAuth();
  if (authStore.isAuthenticated) { 
    try {
      await authStore.refresh();
      console.log('Token refreshed successfully on app startup.');
    } catch (error) {
      console.error('Failed to refresh token on app startup:', error);
    }
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