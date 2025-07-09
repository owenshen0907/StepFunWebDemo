<template>
  <div class="pt-18 bg-white">
    <!-- 导航栏 -->
    <NavBar @open-env="showEnv = true" />

    <!-- 环境弹框 -->
    <EnvModal
        :show="showEnv"
        :env="selectedEnv"
        @save="onSaveEnv"
        @close="showEnv = false"
    />

    <main class="container mx-auto px-6 py-8 space-y-8 bg-white rounded-xl shadow-lg mt-4">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">语音转文字 (ASR)</h2>

      <form @submit.prevent="onSubmit" class="bg-white p-8 rounded-xl shadow-lg space-y-8 transition-all hover:shadow-xl">
        <!-- Model -->
        <div>
          <label class="block text-gray-700 mb-2">Model</label>
          <select v-model="model" class="w-full mt-1 p-2 border rounded">
            <option value="step-asr">step-asr</option>
            <option value="step-asr-mini">step-asr-mini</option>
            <option value="step-asr-pro">step-asr-pro</option>
            <option value="step-asr-pro-waic">step-asr-pro-waic</option>
          </select>
        </div>

        <!-- Response Format -->
        <div>
          <label class="block text-gray-700 mb-2">Response Format</label>
          <div class="mt-2 space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" value="json" v-model="responseFormat" />
              <span class="ml-2">JSON</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="text" v-model="responseFormat" />
              <span class="ml-2">Text</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="srt" v-model="responseFormat" />
              <span class="ml-2">SRT</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="vtt" v-model="responseFormat" />
              <span class="ml-2">VTT</span>
            </label>
          </div>
        </div>

        <!-- Audio File -->
        <div>
          <label class="block text-gray-700 mb-2">Audio File</label>
          <div class="flex items-center">
            <label class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-500 transition">
              <span>选择音频文件</span>
              <input
                  type="file"
                  class="hidden"
                  @change="onFileChange"
                  accept=".flac,.mp3,.mp4,.mpeg,.mpga,.m4a,.ogg,.wav,.webm,.aac,.opus"
                  :disabled="loading"
              />
            </label>
            <button
                v-if="file"
                type="button"
                @click="removeFile"
                class="ml-4 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-400 transition"
                :disabled="loading"
            >删除</button>
          </div>
          <div v-if="file" class="mt-4">
            <audio :src="audioUrl" controls class="w-full" />
          </div>
          <p class="text-sm text-gray-500 mt-2">
            支持格式：flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm, aac, opus；文件大小&lt;100MB。
          </p>
        </div>

        <!-- 提交 / 取消 -->
        <div class="flex space-x-4">
          <button
              type="submit"
              class="flex-1 py-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition disabled:opacity-50"
              :disabled="loading"
          >
            <span v-if="!loading">提交</span>
            <span v-else>等待中...</span>
          </button>
          <button
              v-if="loading"
              type="button"
              @click="cancelRequest"
              class="flex-1 py-3 bg-gray-400 text-white rounded hover:bg-gray-300 transition"
          >取消</button>
        </div>
      </form>

      <!-- Trace ID -->
      <div v-if="traceId" class="mt-6">
        <label class="block text-gray-700 mb-1">Trace ID</label>
        <input
            type="text"
            readonly
            :value="traceId"
            class="w-full p-2 border rounded bg-gray-100 text-gray-800"
        />
      </div>

      <!-- Result -->
      <div v-if="result" class="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-medium mb-2">结果</h3>
        <pre class="whitespace-pre-wrap text-gray-800">{{ result }}</pre>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import EnvModal from '@/components/EnvModal.vue'
import useEnv from '@/composables/useEnv.js'

// 环境配置
const { envs, activeEnvId, loadEnvs, loadActiveEnvId, saveEnv } = useEnv()
const showEnv = ref(false)
const selectedEnv = ref({})

// 初始化加载并监听激活环境
onMounted(async () => {
  await loadEnvs()
  await loadActiveEnvId()
})
watch(
    [() => envs.value, () => activeEnvId.value],
    ([list, id]) => {
      if (id && list.length) {
        const found = list.find(e => e.id === id)
        if (found) selectedEnv.value = found
      } else if (list.length) {
        // 未激活时退回第一条
        selectedEnv.value = list[0]
      }
    },
    { immediate: true }
)

// ASR 状态
const model = ref('step-asr')
const responseFormat = ref('json')
const file = ref(null)
const audioUrl = ref('')
const result = ref('')
const traceId = ref('')
const loading = ref(false)
const abortController = ref(null)

function onFileChange(e) {
  file.value = e.target.files[0]
  audioUrl.value = URL.createObjectURL(file.value)
  result.value = ''
  traceId.value = ''
}
function removeFile() {
  file.value = null
  audioUrl.value = ''
}

async function onSubmit() {
  if (!file.value) {
    return alert('请先选择音频文件')
  }
  loading.value = true
  abortController.value = new AbortController()

  try {
    const formData = new FormData()
    formData.append('model', model.value)
    formData.append('response_format', responseFormat.value)
    formData.append('file', file.value)

    const response = await fetch('/proxy/audio/transcriptions', {
      method: 'POST',
      headers: {
        'X-Env-Base-Url': selectedEnv.value.url,
        'X-Env-Key': selectedEnv.value.key,
      },
      body: formData,
      signal: abortController.value.signal,
    })

    if (!response.ok) {
      const text = await response.text()
      result.value = `Error ${response.status}: ${text}`
      return
    }

    traceId.value = response.headers.get('X-Trace-Id') || ''
    const data = await response.json()
    result.value = JSON.stringify(data, null, 2)
  } catch (e) {
    if (e.name === 'AbortError') {
      result.value = '请求已取消'
    } else {
      result.value = e.message
    }
  } finally {
    loading.value = false
    abortController.value = null
  }
}

function cancelRequest() {
  abortController.value && abortController.value.abort()
}

function onSaveEnv(env) {
  saveEnv(env)
  showEnv.value = false
}
</script>

<style scoped>
/* Tailwind CSS 实用类管理样式 */
</style>
