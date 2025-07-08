import { createApp } from 'vue';
import App    from './App.vue';
import router from './router';

import './assets/tailwind.css';   // ← 确保路径正确

console.log('main.js running');   // 浏览器 Console 应看到

createApp(App).use(router).mount('#app');