# 大模型基础能力验证与调试前端框架

这是一个基于 **Vue 3**、**Vite**、**Tailwind CSS** 和 **IndexedDB** 的前端框架示例，核心用于大模型基础能力验证与调试。内置对接了 **阶跃星辰** 的大模型接口，并兼容大多数 **OpenAI** 接口协议。通过本框架，你可以实现以下功能：

---

## 主要功能

### 1. **快速集成各类大模型**

- **配置简单**：只需配置模型地址与密钥，即可立即调用并测试不同模型能力。
- **灵活切换**：支持多种大模型环境的快速集成与切换，便于对比不同模型的效果。

### 2. **多环境管理**

- **环境配置**：支持新增、编辑、删除多套模型环境，灵活管理不同模型的配置。
- **持久化存储**：使用 **IndexedDB** 存储环境配置，确保配置数据的持久化和安全性。

### 3. **调试日志记录**

- **日志存储**：在本地记录每次请求和响应日志，包含请求体、响应头、响应内容。
- **便于回溯**：提供详细的日志记录，便于开发者回溯和排查问题，提升调试效率。

### 4. **可视化导航**

- **组件化设计**：采用 **Vue** 组件化的导航菜单与页面布局，结构清晰，易于维护。
- **快速扩展**：支持快速扩展更多前端能力模块，如 **ASR**（语音转文字）、**TTS**（文字转语音）、**图生图** 等。

### 5. **本地代理转发**

- **开发模式支持**：在开发模式下，自动将 `/proxy/*` 路径请求转发到目标大模型服务。
- **保留原始数据**：代理转发过程中保留原始请求头与响应头（如 `X-Trace-Id`），确保调试信息的完整性。

---

## 技术栈

- **Vue 3** (Composition API)
- **Vite**
- **Tailwind CSS**
- **IndexedDB**（通过 `idb` 库）
- **HTTP Proxy**（开发时用作本地代理）

---

## 使用场景

- **大模型能力验证**：快速集成和测试不同大模型的能力，验证其在实际应用中的表现。
- **开发调试**：提供详细的日志记录和本地代理功能，便于开发者进行问题排查和调试。
- **多模型对比**：支持多环境管理，方便对比不同模型的效果，选择最适合的模型。

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

## 贡献 & 问题

如有任何疑问、需求或 Bug 报告，欢迎提交 **Issue** 或 **PR**！

---

© 2025 Owenshen0907