import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Default from './layout/wrapper/index.vue'
import Toaster from "@meforma/vue-toaster";
import vue3GoogleLogin from 'vue3-google-login'


const app = createApp(App)

app.use(router)
app.use(vue3GoogleLogin, {
    clientId: '195640317853-or6f2m0b5s03nddff5gcj0qmcjgsuct3.apps.googleusercontent.com'
  })
app.use(Toaster,
    {
        position: "top-right",
        max:5
    }
)
app.component("default-layout", Default);

app.mount("#app")