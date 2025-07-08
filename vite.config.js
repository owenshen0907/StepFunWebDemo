import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import httpProxy from 'http-proxy'
import fs from 'node:fs'
import { resolve } from 'node:path'

// 创建代理实例
const { createProxyServer } = httpProxy
const apiProxy = createProxyServer({ changeOrigin: true })

// 日志目录
const logsDir = resolve(__dirname, 'proxy-logs')
// 确保目录存在
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'dynamic-env-proxy-with-daily-logs',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url.startsWith('/proxy/')) {
            return next()
          }

          const originalPath = req.url
          const base = req.headers['x-env-base-url']
          const key  = req.headers['x-env-key']

          if (!base) {
            res.statusCode = 400
            return res.end('Missing X-Env-Base-Url header')
          }

          // 去掉末尾斜杠
          const target = base.endsWith('/') ? base.slice(0, -1) : base

          if (key) {
            req.headers['authorization'] = `Bearer ${key}`
          }
          req.url = req.url.replace(/^\/proxy/, '')

          // 记录响应数据到当日日志
          apiProxy.once('proxyRes', (proxyRes) => {
            const chunks = []
            proxyRes.on('data', chunk => chunks.push(chunk))
            proxyRes.once('end', () => {
              const body = Buffer.concat(chunks).toString('utf8')
              const logEntry = {
                timestamp:       new Date().toISOString(),
                requestPath:     originalPath,
                responseStatus:  proxyRes.statusCode,
                responseHeaders: proxyRes.headers,
                responseBody:    body,
              }
              // 日志文件按天切分
              const date = new Date().toISOString().slice(0,10)  // YYYY-MM-DD
              const file = path.resolve(logsDir, `${date}.log`)
              fs.appendFileSync(file, JSON.stringify(logEntry) + '\n')
            })
          })

          // 发起代理转发
          apiProxy.web(req, res, { target }, (err) => {
            console.error('Proxy error:', err)
            next(err)
          })
        })
      },
    },
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})