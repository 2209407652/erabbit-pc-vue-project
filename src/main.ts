import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'

// 重置样式
import 'normalize.css'

// 自定义插件
import ui from './components/library'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)    // 持久化储存插件

app.use(pinia)
app.use(router)
app.use(ui)

app.mount('#app')
