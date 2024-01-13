import { createApp } from 'vue'

import "@/style/reset.scss";
import "@/style/colors.scss";
import "@/style/style.scss";

import 'v-calendar/dist/style.css';

import App from './App.vue'
const app = createApp(App)

//libs
import { createPinia } from 'pinia';
import router from './router';
import VueApexCharts from "vue3-apexcharts";
import VCalendar from 'v-calendar';

app.use(createPinia())
app.use(router)
app.use(VueApexCharts)
app.use(VCalendar)

//components
import VButton from '@/components/ui/VButton.vue'
import VLoading from '@/components/ui/VLoading.vue'
import TextSelect from '@/components/ui/inputs/TextSelect.vue'
import VTextInput from '@/components/ui/inputs/VTextInput.vue'
import PageControls from '@/components/layout/PageControls.vue'
// import BrdModal from '@/components/ui/BrdModal.vue'
import VErr from '@/components/ui/VErr.vue'

app.component('VButton', VButton)
app.component('VLoading', VLoading)
app.component('TextSelect', TextSelect)
app.component('VTextInput', VTextInput)
app.component('PageControls', PageControls)
// app.component('BrdModal', BrdModal)
app.component('VErr', VErr)

app.mount('#app')
