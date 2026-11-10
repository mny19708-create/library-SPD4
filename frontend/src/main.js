import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // ត្រូវមានបន្ទាត់នេះ

const app = createApp(App)

app.use(router) // ត្រូវមានបន្ទាត់នេះ

app.mount('#app')
