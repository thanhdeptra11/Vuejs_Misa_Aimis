import './assets/main.css'
import './assets/icon.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'

import router from './router'

import BaseButton from '@/components/base/baseButton/BaseButton.vue'
import BaseSelectBox from '@/components/base/baseInput/BaseSelectBox.vue'

const app = createApp(App)

app.component('BaseButton', BaseButton)
app.component('BaseSelectBox', BaseSelectBox)

app.use(createPinia())
app.use(router)

app.mount('#app')
