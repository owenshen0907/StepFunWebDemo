<template>
  <ul class="ml-8 flex items-center space-x-6">
    <!-- Chat -->
    <li>
      <router-link to="/chat" class="hover:bg-blue-500 px-2 py-1 rounded">Chat</router-link>
    </li>

    <!-- Audio Dropdown -->
    <li class="relative group">
      <button class="hover:text-blue-200 px-2 py-1 rounded focus:outline-none">
        Audio
        <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <ul
          class="absolute left-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg
               opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0
               transition-all duration-200"
      >
        <li><router-link to="/audio/asr" class="block px-4 py-2 hover:bg-gray-100">ASR</router-link></li>
        <li><router-link to="/audio/streaming" class="block px-4 py-2 hover:bg-gray-100">流式</router-link></li>
        <li><router-link to="/audio/tts" class="block px-4 py-2 hover:bg-gray-100">TTS</router-link></li>
        <li><router-link to="/audio/streaming-tts" class="block px-4 py-2 hover:bg-gray-100">流式TTS</router-link></li>
        <li><router-link to="/audio/real-time" class="block px-4 py-2 hover:bg-gray-100">Real-Time</router-link></li>
      </ul>
    </li>

    <!-- Media Dropdown -->
    <li class="relative group">
      <button class="hover:text-blue-200 px-2 py-1 rounded focus:outline-none">
        Media
        <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <ul
          class="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg
               opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0
               transition-all duration-200"
      >
        <li><router-link to="/media/text2img" class="block px-4 py-2 hover:bg-gray-100">文生图</router-link></li>
        <li><router-link to="/media/img2img" class="block px-4 py-2 hover:bg-gray-100">图生图</router-link></li>
        <li><router-link to="/media/text2video" class="block px-4 py-2 hover:bg-gray-100">文生视频</router-link></li>
      </ul>
    </li>

    <!-- Doc -->
    <li>
      <router-link to="/doc" class="hover:bg-blue-500 px-2 py-1 rounded">Doc</router-link>
    </li>

    <!-- Agent -->
    <li>
      <router-link to="/agent" class="hover:bg-blue-500 px-2 py-1 rounded">Agent</router-link>
    </li>
  </ul>
</template>

<script setup>
// 静态导航，无需脚本逻辑
</script>

<style scoped>
/* Tailwind CSS 负责样式 */
</style>