<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="close"></div>
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden flex z-10">
      <!-- 左：列表 + add/delete/activate -->
      <div class="w-1/3 border-r flex flex-col">
        <div class="px-4 py-3 border-b flex justify-between items-center">
          <h3 class="text-lg">环境列表</h3>
          <div class="space-x-2">
            <button
                v-if="editingEnv.id && editingEnv.id !== activeId"
                @click="activate(editingEnv)"
                class="px-2 py-1 bg-green-600 text-white rounded"
            >激活</button>
            <button
                v-if="editingEnv.id"
                @click="remove(editingEnv)"
                class="px-2 py-1 bg-red-600 text-white rounded"
            >删除</button>
          </div>
        </div>
        <ul class="flex-1 overflow-auto">
          <li
              v-for="env in envs"
              :key="env.id"
              @click="select(env)"
              :class="[
              'px-4 py-2 cursor-pointer hover:bg-gray-100',
              env.id === activeId ? 'bg-blue-100' : '',
              env.id === editingEnv.id && env.id !== activeId ? 'bg-blue-50' : ''
            ]"
          >
            {{ env.name }}
          </li>
        </ul>
        <div class="px-4 py-3 border-t">
          <button
              @click="addNew()"
              class="w-full px-2 py-1 border-2 border-dashed rounded hover:bg-gray-50"
          >+ 添加环境</button>
        </div>
      </div>

      <!-- 右：编辑表单 -->
      <div class="w-2/3">
        <div class="px-4 py-3 border-b"><h3 class="text-lg">环境详情</h3></div>
        <div class="p-4 space-y-4">
          <label class="block"><span>名称</span>
            <input v-model="editingEnv.name" class="w-full border p-2 rounded" />
          </label>
          <label class="block"><span>地址</span>
            <input v-model="editingEnv.url" class="w-full border p-2 rounded" />
          </label>
          <label class="block"><span>Key</span>
            <input v-model="editingEnv.key" class="w-full border p-2 rounded" />
          </label>
        </div>
        <div class="px-4 py-3 border-t flex justify-end space-x-3">
          <button @click="save()" class="px-4 py-2 bg-blue-600 text-white rounded">保存</button>
          <button @click="close()" class="px-4 py-2 bg-gray-200 rounded">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useEnv from '@/composables/useEnv.js'
const props = defineProps({ show: Boolean })
const emit  = defineEmits(['close'])

const { envs, activeEnvId: activeId, loadEnvs, saveEnv, deleteEnv, setActiveEnvId } = useEnv()
const editingEnv = ref({ id:'', name:'', url:'', key:'' })

onMounted(async () => {
  await loadEnvs()
  // pre‐select the active one if any
  if (activeId.value) {
    const e = envs.value.find(x => x.id===activeId.value)
    if (e) editingEnv.value = { ...e }
  }
})

function select(env) {
  editingEnv.value = { ...env }
}
function addNew() {
  editingEnv.value = { id:'', name:'', url:'', key:'' }
}
async function save() {
  if (!editingEnv.value.name || !editingEnv.value.url) {
    return alert('名称和地址不能为空')
  }
  await saveEnv(editingEnv.value)
  await loadEnvs()
  // if we're on a brand‐new one, auto‐select form to DB instance
  if (editingEnv.value.id && activeId.value!==editingEnv.value.id) {
    // stay in modal so user can activate when ready
  }
}
async function activate(env) {
  setActiveEnvId(env.id)
  emit('close')
}
async function remove(env) {
  if (!env.id) return
  if (confirm(`真的删除环境 "${env.name}"？`)) {
    await deleteEnv(env.id)
    await loadEnvs()
    // if that was the active one, we auto‐clear it
    if (activeId.value===env.id) setActiveEnvId('')
    // clear form if it was deleted
    editingEnv.value = {id:'',name:'',url:'',key:''}
  }
}
function close() {
  emit('close')
}
</script>