<template>
  <div class="container mx-auto py-12">
    <h1 class="text-4xl font-extrabold text-center mb-6">欢迎来到 StepFun Web Demo</h1>
    <p class="text-center text-gray-600">
      这是你的默认首页。可以在这里放置应用简介、快速入口或其他信息。
    </p>

    <!-- 快速入口示例 -->
    <div class="mt-8 flex justify-center space-x-4">
      <router-link
          to="/audio/asr"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
      >
        进入 ASR
      </router-link>
      <router-link
          to="/chat"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
      >
        进入 Chat
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 这里可以加一些脚本逻辑
</script>

<style scoped>
/* 如果需要对首页做特别的样式，可以写在这里 */
</style>