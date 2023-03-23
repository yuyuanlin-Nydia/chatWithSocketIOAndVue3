import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import './assets/scss/main.scss'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '@fortawesome/fontawesome-free/css/all.css'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import axiosInstance from './plugin/axios'

const app = createApp(App)
app.provide('$axios', axiosInstance)
app.use(Quasar, quasarUserOptions)
  .use(store)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
