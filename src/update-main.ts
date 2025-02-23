import { createApp } from 'vue'
import UpdateApp from './UpdateApp.vue'
import { createPlugin as createTauriPiniaPlugin } from 'tauri-plugin-pinia'
import updateRouter from './libs/updateRouter'

// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// tailwindcss
import './assets/css/tailwind.css'

const pinia = createPinia()
const tauriPiniaPlugin = createTauriPiniaPlugin()
pinia.use(tauriPiniaPlugin)

const app = createApp(UpdateApp)
app.use(ElementPlus)
app.use(updateRouter)
app.use(pinia)
app.mount('#app')
