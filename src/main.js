// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

app.mount('#app')

// 👇 Inicia la autenticación tras montar la app
const authStore = useAuthStore()
;(async () => {
    await authStore.initAuth()
})()
