import { createRouter, createWebHistory } from 'vue-router'
import HomePage   from '@/pages/HomePage.vue'
import AsrPage    from '@/pages/audio/asr/AsrPage.vue'
import ImageToImagePage from '@/pages/media/image-to-image/ImageToImagePage.vue'

const Placeholder = { template: '<div class="p-4">占位页</div>' }

const routes = [
    // 根路径渲染 HomePage
    { path: '/', component: HomePage },

    // Audio 子路由
    { path: '/audio/asr',           component: AsrPage      },
    { path: '/audio/streaming',     component: Placeholder  },
    { path: '/audio/tts',           component: Placeholder  },
    { path: '/audio/streaming-tts', component: Placeholder  },
    { path: '/audio/real-time',     component: Placeholder  },

    // Media 子路由
    { path: '/media/text2img',    component: Placeholder },
    { path: '/media/img2img',     component: ImageToImagePage },
    { path: '/media/text2video',  component: Placeholder },
    { path: '/chat',   component: Placeholder },
    { path: '/doc',    component: Placeholder },
    { path: '/agent',  component: Placeholder },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})
