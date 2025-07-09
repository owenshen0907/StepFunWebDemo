<template>
<nav 
      class="fixed inset-x-0 top-0 h-16 bg-gradient-to-r from-sky-600 to-indigo-700 text-white z-50 flex items-center px-4 sm:px-6 gap-3 sm:gap-5 backdrop-blur-lg transition-[background,shadow] duration-500 border-b border-white/20 shadow-xl group/navbar motion-safe:animate-fade-in-down"
      :class="{
        '!from-sky-700 !to-indigo-700 shadow-lg': hasScrolled, 
        'px-2 gap-2': isMobile
      }"
      @mouseenter="hasScrolled = true"
      @mouseleave="hasScrolled = false"
      v-resize="handleResize"
>
    <a href="/" class="flex items-center text-2xl font-black tracking-tighter text-white/90 hover:text-white transition-[transform,colors] duration-300 group/logo hover:-translate-y-0.5">
      <svg class="w-6 h-6 mr-2 text-blue-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
      <span class="bg-gradient-to-r from-sky-200 to-sky-300 bg-clip-text text-transparent">StepFun</span>
      <span class="bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">WebDemo</span>
    </a>
    <!-- 导航菜单 -->
    <NavMenu />
    <button
        class="ml-auto flex items-center bg-white/10 text-white px-4 py-2.5 rounded-xl hover:bg-white/20 transition-colors duration-300 font-medium border border-white/20 hover:border-white/30 backdrop-blur-md space-x-2 shadow-sm hover:shadow-md motion-safe:animate-pulse-once relative overflow-hidden group/button"
        style="animation-delay: 1s"
        @click="$emit('open-env')"
    >
      环境设置：
      <span class="font-medium ml-1">{{ currentEnvName }}</span>
    </button>
  </nav>
</template>

<script setup>
import NavMenu from '@/components/NavMenu.vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useWindowSize } from '@vueuse/core'

import useEnv from '@/composables/useEnv.js'

// 响应式布局
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 640)

// 滚动状态跟踪
const hasScrolled = ref(false)
const handleScroll = () => hasScrolled.value = window.scrollY > 10

// 窗口尺寸变化处理
const handleResize = () => {
  if (width.value < 640) {
    hasScrolled.value = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 从 useEnv 拿到列表 & 激活 ID 管理方法
const { envs, activeEnvId, loadEnvs, loadActiveEnvId } = useEnv()

// 挂载时先加载环境列表和激活 ID
onMounted(async () => {
  await loadEnvs()
  await loadActiveEnvId()
})

// 根据 activeEnvId 动态计算当前环境名称
const currentEnvName = computed(() => {
  const id = activeEnvId.value
  if (!id) return '未选择'
  const found = envs.value.find(e => e.id === id)
  return found ? found.name : '未选择'
})

// 通知父组件打开环境设置弹框
defineEmits(['open-env'])
</script>

<style scoped>
/* Tailwind CSS 已提供所需样式 */
</style>
