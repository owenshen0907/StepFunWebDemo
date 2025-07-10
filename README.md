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

- **开发模式支持**：在开发模式下，自动将 `/proxy/*` 路径请求转发到目标大模型服务
- **CORS 解决方案**：通过本地代理绕过浏览器同源策略限制
- **请求头保留**：完整传递原始请求头（包括 Authorization 等认证信息）
- **调试支持**：在浏览器开发者工具中可查看完整请求/响应记录

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

### 环境要求（必须严格匹配）

✅ **Node.js**: v20.12.0 (通过 `.nvmrc` 强制指定)  
✅ **PNPM**: 8.15.4+ (推荐使用 exact 8.15.4 版本)  
⚠️ 注意：版本不匹配会导致依赖安装失败！

1. **克隆仓库**

   ```bash
   git clone https://github.com/owenshen0907/StepFunWebDemo.git
   cd StepFunWebDemo
```
2. **环境准备**

   ```bash
   # 安装指定 Node 版本（必须使用 v20.12.0）
   nvm install
   # 切换项目 Node 环境
   nvm use
   
   # 安装 pnpm（若未安装）
   npm install -g pnpm@8.15.4
   ```

3. **安装项目依赖**

   请先确保已切换至正确的 Node 版本：

   ```bash
   nvm use
   pnpm install
   ```

4. **启动开发服务器**

   ```bash
   npm run dev
   ```

   访问：[http://localhost:5173/](http://localhost:5173/)

4. **生产构建**

   ```bash
   nvm use
   npm run build

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
├─ vite.config.js          # Vite 配置（包含代理配置）
├─ postcss.config.cjs      # PostCSS & TailwindCSS 配置
├─ tailwind.config.js      # Tailwind 配置
├─ .nvmrc                 # Node 版本管理配置
├─ jsconfig.json          # JavaScript 项目配置
├─ package.json
└─ README.md               # 本文档
```

---

## 贡献 & 问题

如有任何疑问、需求或 Bug 报告，欢迎提交 **Issue** 或 **PR**！

---

© 2025 Owenshen0907
