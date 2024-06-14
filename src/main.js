import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// import '@/assets/styles/global.css'; // 如果有全局样式的话
import router from './router'; // 引入 router


const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.mount('#app');