<script setup>
import { computed } from 'vue';
import { useMessageDialog } from './MessageDialog';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const messageDialog = useMessageDialog();

// Optional: Compute header based on message type
const dialogHeader = computed(() => {
  switch (messageDialog.dialogType.value) {
    case 'error': return 'Error';
    case 'warning': return 'Warning';
    case 'success': return 'Success';
    default: return 'Information';
  }
});
</script>

<template>
  <Dialog
    :visible="messageDialog.isDialogVisible.value"
    :modal="true"
    :closable="false"
    :header="dialogHeader"
    @update:visible="messageDialog.hide"
  >
    <p>{{ messageDialog.dialogMessage.value }}</p>
    <template #footer>
      <Button label="OK" @click="messageDialog.hide()" />
    </template>
  </Dialog>
</template>