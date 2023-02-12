import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/scss/main.scss'
// font-awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faBars, faGear, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCZ5vQpxh5U2RAKeo2TK50mCe9trs7hN9A',
  authDomain: 'chat-project-55555.firebaseapp.com',
  projectId: 'chat-project-55555',
  storageBucket: 'chat-project-55555.appspot.com',
  messagingSenderId: '66615029820',
  appId: '1:66615029820:web:6d28bda3cae2a893ed1339'
}
const app = initializeApp(firebaseConfig)
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)
console.log(auth)
/* add icons to the library */
library.add(faBars, faGear, faComment, faPaperPlane)
createApp(App)
  .use(store)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
