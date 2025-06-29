import { ref } from 'vue';

// Reactive state for the dialog
const isDialogVisible = ref(false); // Renamed for clarity, avoid 'isVisible' if your component also has one
const dialogMessage = ref('');
const dialogType = ref('info'); // 'info', 'error', 'warning', 'success'

// A variable to hold the Promise's resolve function
let _dialogResolve;

export function useMessageDialog() {
  const show = (message, type = 'info') => {
    return new Promise((resolve) => {
      dialogMessage.value = message;
      dialogType.value = type;
      isDialogVisible.value = true;
      _dialogResolve = resolve; // Store the resolve function
    });
  };

  // This method will be called by the dialog component when it's closed or 'OK' is pressed
  const hide = () => {
    isDialogVisible.value = false;
    if (_dialogResolve) {
      _dialogResolve(); // Resolve the promise that was returned by 'show'
      _dialogResolve = null; // Clear it to prevent multiple resolves
    }
  };

  return {
    isDialogVisible,
    dialogMessage,
    dialogType,
    show,
    hide, // Expose hide so your dialog component can call it
  };
}