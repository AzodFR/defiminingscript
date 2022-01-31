import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import SplitCarousel from "vue-split-carousel";

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const pinia = createPinia()
createApp(App).use(pinia).use(PrimeVue).use(SplitCarousel).component('Button', Button).mount('#app')
