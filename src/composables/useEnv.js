import { ref } from 'vue'
import { openDB } from 'idb'

const DB_NAME = 'stepfun_db'
const STORE_ENVS = 'envs'
const STORE_SETTINGS = 'settings'
const DB_VERSION = 2

// 打开并初始化 IndexedDB
const dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_ENVS)) {
            db.createObjectStore(STORE_ENVS, { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
            const store = db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' })
            store.put({ key: 'activeEnvId', value: '' })
        }
    }
})

export default function useEnv() {
    const envs = ref([])
    const activeEnvId = ref('')

    // 加载所有环境，若为空则添加并去重默认环境
    async function loadEnvs() {
        const db = await dbPromise
        let all = await db.getAll(STORE_ENVS)

        // 默认环境 URL
        const defaultURL = 'https://api.stepfun.com/v1'
        // 如果默认环境多条，删除多余的
        const dup = all.filter(env => env.url === defaultURL)
        if (dup.length > 1) {
            for (let i = 1; i < dup.length; i++) {
                await db.delete(STORE_ENVS, dup[i].id)
            }
            all = await db.getAll(STORE_ENVS)
        }

        if (all.length === 0) {
            // 插入默认环境，Key 留空
            const defaultEnv = {
                id: crypto.randomUUID(),
                name: '阶跃生产',
                url: defaultURL,
                key: ''
            }
            await db.put(STORE_ENVS, defaultEnv)
            envs.value = [defaultEnv]
        } else {
            envs.value = all
        }
    }

    // 保存或更新环境
    async function saveEnv(env) {
        const db = await dbPromise
        if (!env.id) {
            env.id = crypto.randomUUID()
        }
        const cleanEnv = {
            id: env.id,
            name: env.name,
            url: env.url,
            key: env.key
        }
        await db.put(STORE_ENVS, cleanEnv)
        await loadEnvs()
    }

    // 删除环境
    async function deleteEnv(id) {
        const db = await dbPromise
        await db.delete(STORE_ENVS, id)
        await loadEnvs()
        if (activeEnvId.value === id) {
            await setActiveEnvId('')
        }
    }

    // 加载当前激活环境 ID
    async function loadActiveEnvId() {
        const db = await dbPromise
        const rec = await db.get(STORE_SETTINGS, 'activeEnvId')
        activeEnvId.value = rec?.value || ''
    }

    // 设置并持久化激活环境 ID
    async function setActiveEnvId(id) {
        const db = await dbPromise
        activeEnvId.value = id
        await db.put(STORE_SETTINGS, { key: 'activeEnvId', value: id })
    }

    return {
        envs,
        activeEnvId,
        loadEnvs,
        saveEnv,
        deleteEnv,
        loadActiveEnvId,
        setActiveEnvId
    }
}