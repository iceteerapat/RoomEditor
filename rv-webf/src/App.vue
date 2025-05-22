<script setup>
import { RouterView } from 'vue-router';

import ConfirmDialog from 'primevue/confirmdialog';
import DynamicDialog from 'primevue/dynamicdialog';
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