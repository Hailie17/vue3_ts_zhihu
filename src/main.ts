import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import axios from 'axios'

axios.get('http://api.vikingship.xyz/api/columns').then((res) => {
  console.log(res)
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
