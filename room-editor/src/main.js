import { createApp } from 'vue';
import { createPinia } from 'pinia';

import Toast from "vue-toastification";
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import App from './App.vue';
import Router from './router';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(Router);
app.use(Toast);
app.use(ConfirmationService);
app.use(DialogService);
app.use(PrimeVue);

app.config.globalProperties.$filters = {
    formatDateTime(value) {
      return moment(value).format('DD/MM/yyyy HH:mm:ss.SSS');
    },
    formatDateNormalTime(value) {
      return moment(value).format('DD/MM/yyyy HH:mm:ss');
    },
    formatDateTimeNormal(value) {
      return moment(value).format('DD/MM/yyyy HH:mm');
    },
    formatDateTimeOnlyDate(value) {
      return moment(value).format('DD/MM/yyyy');
    }, 
    formatDateShort(value) {
      return moment(value).format('YYMMDD');
    },
    formatDateTimeMonthName(value) {
      return moment(value).format('DD MMMM YYYY');
    },
    formatDdMmYyyy(value) {
      return moment(value, 'YYYYMMDD').format('DD/MM/YYYY');
    },
    formatDateReport(value) {
      return moment(value,).format('DD-MMM-YYYY');
    },
    formatDecimal(value) {
      return numeral(value).format('0.00');
    },
    formatAmount(value) {
      return numeral(value).format('0,0.00');
    },
    formatAmountFiveDigit(value) {
      return numeral(value).format('0,0.00000');
    }
  }

app.mount('#app');