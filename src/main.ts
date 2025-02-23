import { createApp } from 'vue'
import App from './App.vue'
import { createPlugin as createTauriPiniaPlugin } from 'tauri-plugin-pinia'

// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// tailwindcss
import './assets/css/tailwind.css'

const pinia = createPinia()
const tauriPiniaPlugin = createTauriPiniaPlugin()
pinia.use(tauriPiniaPlugin)

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app')

initTrayMenu()
initGlobalShortcut()
