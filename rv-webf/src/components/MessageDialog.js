import { ref } from 'vue';

const isDialogVisible = ref(false);
const dialogMessage = ref('');
const dialogType = ref('info');

let _dialogResolve;

export function useMessageDialog() {
  const show = (message, type = 'info') => {
    return new Promise((resolve) => {
      dialogMessage.value = message;
      dialogType.value = type;
      isDialogVisible.value = true;
      _dialogResolve = resolve;
    });
  };

  const hide = () => {
    isDialogVisible.value = false;
    if (_dialogResolve) {
      _dialogResolve();
      _dialogResolve = null;
    }
  };

  return {
    isDialogVisible,
    dialogMessage,
    dialogType,
    show,
    hide,
  };
}