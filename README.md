# StepFun Web Demo

这是一个基于 **Vue 3**、**Vite**、**Tailwind CSS** 和 **IndexedDB** 的前端示例工程，演示了多环境管理、导航组件、**ASR**（语音转文字）功能以及本地代理转发到 API 的完整流程。

---

## 特性

- **多环境管理**：通过 `useEnv` 组合函数，将 API 地址和密钥存储在 **IndexedDB** 中，并持久化“激活”环境。支持新增、编辑、删除和切换环境。
- **导航组件**：`NavBar.vue` + `NavMenu.vue` 实现顶部固定导航，菜单与下拉子菜单分离为独立组件。
- **ASR 页面**：用来上传音频文件，调用 **StepFun API** 进行转录，并显示响应文本与 `X-Trace-Id`。
- **动态代理**：在 `vite.config.js` 中配置 `/proxy/*` 路径代理，将前端请求转发到用户选定的环境地址，保留原始请求体和响应头。

---

## 技术栈

- **Vue 3** (Composition API)
- **Vite**
- **Tailwind CSS**
- **IndexedDB**（通过 `idb` 库）
- **HTTP Proxy**（开发时用作本地代理）

---

## 安装与运行

1. **克隆仓库**

   ```bash
   git clone <仓库地址>
   cd stepfun_web_demo
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **启动开发服务器**

   ```bash
   npm run dev
   ```

   访问：[http://localhost:5173/](http://localhost:5173/)

4. **生产构建**

   ```bash
   npm run build
   ```

5. **预览构建结果**

   ```bash
   npm run preview
   ```

---

## 项目结构

```
stepfun_web_demo/
├─ public/                 # 静态资源
│  └─ index.html           # 应用入口 HTML
├─ src/
│  ├─ assets/              # 全局样式（Tailwind）
│  ├─ components/          # 通用组件
│  │  ├─ NavBar.vue        # 顶部导航（引用 NavMenu）
│  │  ├─ NavMenu.vue       # 分离的菜单列表
│  │  └─ EnvModal.vue      # 环境设置弹框
│  ├─ composables/         # Composition API 组合函数
│  │  └─ useEnv.js         # 环境管理逻辑（IndexedDB）
│  ├─ pages/               # 业务页面
│  │  └─ audio/asr/        # ASR 页面
│  │     └─ AsrPage.vue     # 语音转文字功能
│  ├─ router/              # 路由配置
│  │  └─ index.js
│  ├─ services/            # 前端接口封装
│  │  └─ api.js            # transcribe 方法
│  ├─ main.js              # 入口 JS
│  └─ App.vue              # 根组件
├─ vite.config.js          # Vite 配置（包含代理）
├─ postcss.config.cjs      # PostCSS & TailwindCSS 配置
├─ tailwind.config.js      # Tailwind 配置
├─ package.json
└─ README.md               # 本文档
```

---

## 环境管理 (useEnv)

- `loadEnvs()`：加载所有环境配置。
- `saveEnv(env)`：新增/更新环境，自动生成 id。
- `deleteEnv(id)`：删除指定环境；若当前激活则清空。
- `loadActiveEnvId()`：读取持久化的激活环境 ID。
- `setActiveEnvId(id)`：设置并保存当前激活环境 ID。

所有数据均存储在 **IndexedDB** 的两个 `object store`：

- `envs`：保存环境对象，主键为 `id`。
- `settings`：保存应用级设置，如 `activeEnvId`。

---

## 本地代理 (vite.config.js)

开发模式下，**Vite** 会拦截所有 `/proxy/*` 请求，将其转发到用户在环境管理中配置的 `url`：

```javascript
server: {
  setupMiddlewares(middlewares, { app }) {
    app.use('/proxy', (req, res, next) => {
      const base = req.headers['x-env-base-url']
      const key  = req.headers['x-env-key']

      // 校验、拼接、设置 Authorization...
      req.url = req.url.replace(/^\/proxy/, '')
      proxy.web(req, res, { target: base });
    });
    return middlewares
  }
}
```

前端调用示例：

```javascript
const resp = await fetch('/proxy/audio/transcriptions', {
  method: 'POST',
  headers: {
    'x-env-base-url': selectedEnv.url,
    'x-env-key':      selectedEnv.key,
  },
  body: formData
});
```

代理会原封不动透传响应头，保证 `X-Trace-Id` 等自定义头能够在浏览器端获取。

---

## ASR 页面示例

`/src/pages/audio/asr/AsrPage.vue`：

- 支持选择模型 (`step-asr`, `step-asr-mini`, …)
- 支持 `json`、`text`、`srt`、`vtt`
- 选择本地音频后可回放或删除
- 调用 `/proxy/audio/transcriptions`，显示返回文本与 `Trace ID`

---

## 贡献 & 问题

如有任何疑问、需求或 Bug 报告，欢迎提交 **Issue** 或 **PR**！

---

© 2025 Owenshen0907