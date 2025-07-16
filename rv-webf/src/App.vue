<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/store/AuthStore'

import ConfirmDialog from 'primevue/confirmdialog';
import DynamicDialog from 'primevue/dynamicdialog';
import GlobalDialog from './components/GlobalDialog.vue';

const authStore = useAuthStore();

onMounted(async () => {
  authStore.initializeAuth();
  if (authStore.isAuthenticated) { 
    try {
      await authStore.refresh();
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
  <GlobalDialog />
</template>

<style src="@fortawesome/fontawesome-free/css/all.min.css"></style>

<style>
@import './assets/css/room-visuallizer-theme.css';
</style>