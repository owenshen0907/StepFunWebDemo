<template>
  <nav
      class="fixed inset-x-0 top-0 h-16 bg-blue-600 text-white shadow-lg z-50 flex items-center px-4"
  >
    <a href="/" class="text-2xl font-bold hover:text-blue-200">StepFunWebDemo</a>
    <!-- 导航菜单 -->
    <NavMenu />
    <button
        class="ml-auto bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition"
        @click="$emit('open-env')"
    >
      环境设置：
      <span class="font-medium ml-1">{{ currentEnvName }}</span>
    </button>
  </nav>
</template>

<script setup>
import NavMenu from '@/components/NavMenu.vue'
import { ref, computed, onMounted } from 'vue'
import useEnv from '@/composables/useEnv.js'

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