<script setup>
import { ref, defineExpose } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const dialogVisible = ref(false);
const dialogHeader = ref('');
const dialogMessage = ref('');

/**
 * Function to show the dialog from outside this component.
 * @param {string} message - The message content.
 * @param {string} header - The dialog header.
 */

const show = (message, header = 'Message') => {
  dialogMessage.value = message;
  dialogHeader.value = header;
  dialogVisible.value = true;
};

defineExpose({
  show,
});
</script>

<template>
  <Dialog v-model:visible="dialogVisible" :header="dialogHeader" modal :style="{ width: '30vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <p>{{ dialogMessage }}</p>
    <template #footer>
      <Button label="OK" icon="pi pi-check" @click="dialogVisible = false" autofocus />
    </template>
  </Dialog>
</template>