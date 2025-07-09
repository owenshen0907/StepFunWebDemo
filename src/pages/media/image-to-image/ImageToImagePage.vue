<template>
  <div class="pt-18 bg-white">
    <NavBar @open-env="showEnv = true" />
    <EnvModal
      :show="showEnv"
      :env="selectedEnv"
      @save="onSaveEnv"
      @close="showEnv = false"
    />

    <main class="container mx-auto px-6 py-8 space-y-8 bg-white rounded-xl shadow-lg mt-4">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">图生图 (Image-to-Image)</h2>

      <form @submit.prevent="onSubmit" class="bg-white p-8 rounded-xl shadow-lg space-y-8 transition-all hover:shadow-xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Model Selection -->
        <div>
          <label class="block text-gray-700 mb-2">模型 <span class="text-red-500">*</span></label>
          <select v-model="model" class="w-full mt-1 p-2 border rounded" required>
            <option value="step-1x-medium">step-1x-medium</option>
          </select>
        </div>

        <!-- Image Size -->
        <div>
          <label class="block text-gray-700 mb-2">图片尺寸</label>
          <select v-model="size" class="w-full mt-1 p-2 border rounded">
            <option value="1024x1024">1024x1024（默认）</option>
            <option value="256x256">256x256</option>
            <option value="512x512">512x512</option>
            <option value="768x768">768x768</option>
            <option value="1280x800">1280x800 (16:9)</option>
            <option value="800x1280">800x1280 (16:9)</option>
          </select>
        </div>

        <!-- Response Format -->
        <div>
          <label class="block text-gray-700 mb-2">返回格式</label>
          <div class="flex gap-4 mt-2">
            <label class="flex items-center">
              <input type="radio" v-model="responseFormat" value="url" class="mr-2" />
              URL
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="responseFormat" value="b64_json" class="mr-2" />
              Base64
            </label>
          </div>
        </div>

        <!-- Prompt Input -->
        <div>
          <label class="block text-gray-700 mb-2">提示词</label>
          <textarea
            v-model="prompt"
            class="w-full p-2 border rounded"
            rows="3"
            placeholder="请输入图片描述..."
          ></textarea>
        </div>

        <!-- Style Reference -->
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-2">风格参考图</label>
            <div class="flex items-center">
              <label class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-500 transition">
                <span>选择参考图</span>
                <input
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="onStyleImageChange"
                  :disabled="loading"
                />
              </label>
              <button
                v-if="styleImage"
                @click="removeStyleImage"
                type="button"
                class="ml-4 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-400 transition"
                :disabled="loading"
              >删除</button>
            </div>
            <div v-if="styleImagePreview" class="mt-4">
              <img :src="styleImagePreview" class="max-w-xs rounded shadow" />
            </div>
          </div>

          <div>
            <label class="block text-gray-700 mb-2">风格权重</label>
            <input
              type="range"
              v-model="styleWeight"
              min="0"
              max="2"
              step="0.1"
              class="w-full mt-1"
            />
            <span class="text-gray-600">{{ styleWeight }}</span>
          </div>
        </div>

        </div>

        <!-- Advanced Options -->
        <div class="border-t pt-6 space-y-6">
          <h3 class="text-lg font-medium text-gray-800">高级选项</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 mb-2">随机种子 (0=随机)</label>
              <input
                type="number"
                v-model.number="seed"
                min="0"
                class="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label class="block text-gray-700 mb-2">生成步数 (1-100)</label>
              <input
                type="number"
                v-model.number="steps"
                min="1"
                max="100"
                class="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label class="block text-gray-700 mb-2">CFG Scale (1-10)</label>
              <input
                type="number"
                v-model.number="cfgScale"
                min="1"
                max="10"
                step="0.1"
                class="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex space-x-4">
          <button
            type="submit"
            class="flex-1 py-3 bg-blue-600 text-white rounded hover:bg-blue-500 transition disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? '生成中...' : '开始生成' }}
          </button>
          <button
            v-if="loading"
            type="button"
            @click="cancelRequest"
            class="flex-1 py-3 bg-gray-400 text-white rounded hover:bg-gray-300 transition"
          >取消</button>
        </div>
      </form>

      <!-- Results -->
      <div v-if="traceId" class="mt-6">
        <label class="block text-gray-700 mb-1">Trace ID</label>
        <input
          type="text"
          readonly
          :value="traceId"
          class="w-full p-2 border rounded bg-gray-100 text-gray-800"
        />
      </div>

      <div v-if="resultImage" class="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-medium mb-4">生成结果</h3>
        <img :src="resultImage" class="max-w-full rounded-lg shadow" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import NavBar from '@/components/NavBar.vue'
import EnvModal from '@/components/EnvModal.vue'
import useEnv from '@/composables/useEnv.js'

const { envs, activeEnvId, loadEnvs, loadActiveEnvId, saveEnv } = useEnv()
const showEnv = ref(false)
const selectedEnv = ref({})

// 初始化环境配置
watch([envs, activeEnvId], ([list, id]) => {
  if (id && list.length) {
    const found = list.find(e => e.id === id)
    if (found) selectedEnv.value = found
  } else if (list.length) {
    selectedEnv.value = list[0]
  }
}, { immediate: true })

// 图生图状态
const model = ref('step-1x-medium')
const size = ref('1024x1024')
const responseFormat = ref('url')
const prompt = ref('')
const seed = ref(0)
const steps = ref(50)
const cfgScale = ref(7.5)
const styleImage = ref(null)
const styleImagePreview = ref('')
const styleWeight = ref(2)
const resultImage = ref('')
const traceId = ref('')
const loading = ref(false)
const abortController = ref(null)

function onStyleImageChange(e) {
  const file = e.target.files[0]
  if (!file) return

  styleImage.value = file
  const reader = new FileReader()
  reader.onload = (e) => styleImagePreview.value = e.target.result
  reader.readAsDataURL(file)
}

function removeStyleImage() {
  styleImage.value = null
  styleImagePreview.value = ''
}

async function onSubmit() {
  if (!styleImage.value || !prompt.value) {
    return alert('请填写提示词并选择参考图')
  }

  loading.value = true
  abortController.value = new AbortController()

  try {
    const reader = new FileReader()
    reader.readAsDataURL(styleImage.value)
    const base64Image = await new Promise(resolve => {
      reader.onload = () => resolve(reader.result.split(',')[1])
    })

    const response = await fetch('/proxy/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Env-Base-Url': selectedEnv.value.url,
        'X-Env-Key': selectedEnv.value.key,
      },
      body: JSON.stringify({
        model: model.value,
        prompt: prompt.value.substring(0, 1024),
        size: size.value,
        n: 1,
        response_format: responseFormat.value,
        seed: seed.value || undefined,
        steps: Math.min(Math.max(steps.value, 1), 100),
        cfg_scale: Math.min(Math.max(cfgScale.value, 1), 10),
        style_reference: {
          source_url: `data:image/png;base64,${base64Image}`,
          weight: parseFloat(styleWeight.value)
        }
      }),
      signal: abortController.value.signal
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    traceId.value = response.headers.get('X-Trace-Id') || ''
    const data = await response.json()
    resultImage.value = data.data[0].url
  } catch (e) {
    alert(e.name === 'AbortError' ? '请求已取消' : `生成失败: ${e.message}`)
  } finally {
    loading.value = false
    abortController.value = null
  }
}

function cancelRequest() {
  abortController.value?.abort()
}

function onSaveEnv(env) {
  saveEnv(env)
  showEnv.value = false
}
</script>
