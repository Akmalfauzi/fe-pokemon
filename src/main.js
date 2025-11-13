import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLazyload from 'vue-lazyload'
import { Toaster } from 'vue-sonner'
import App from './App.vue'
import router from './router'

import './index.css'
import 'vue-sonner/style.css'

const app = createApp(App)
const pinia = createPinia()

const lazyLoadOptions = {
    preLoad: 1.3,
    attempt: 3,
    lifecycle: {
        loaded: (el) => {
            console.log('Image loaded:', el)
        },
        error: (el) => {
            console.log('Image error:', el)
        }
    }
}

app.use(pinia)
app.use(router)
app.use(VueLazyload, lazyLoadOptions)
app.component('Toaster', Toaster)
app.mount('#app')