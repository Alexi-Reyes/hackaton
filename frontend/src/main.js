import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routeur/index.js'
import axios from 'axios';

axios.defaults.withCredentials = true;

const app = createApp(App)

app.use(router)
app.mount('#app')
