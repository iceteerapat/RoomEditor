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

<style>
@import './assets/css/style.css';
</style>