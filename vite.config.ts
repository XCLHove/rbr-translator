import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          '@tauri-apps/api/window': ['getCurrentWindow', 'getAllWindows'],
          '@tauri-apps/api/webview': ['getCurrentWebview'],
          '@tauri-apps/api/webviewWindow': ['getCurrentWebviewWindow'],
          '@tauri-apps/api/core': ['invoke'],
          '@tauri-apps/api/dpi': ['PhysicalPosition', 'PhysicalSize'],
          '@tauri-apps/api/app': ['getVersion'],
          '@tauri-apps/plugin-updater': ['check'],
          '@tauri-apps/plugin-http': [['fetch', 'tauriFetch']],
          '@tauri-apps/api/event': ['listen', 'emit'],
          '@tauri-apps/api/tray': ['TrayIcon'],
          '@tauri-apps/api/menu/menu': ['Menu'],
          '@tauri-apps/plugin-process': ['exit', 'relaunch'],
          axios: [['default', 'axios']],
          '@tauri-apps/plugin-global-shortcut': ['register', 'unregisterAll']
        }
      ],
      resolvers: [ElementPlusResolver()],
      dirs: [
        {
          glob: 'src/utils',
          types: true
        },
        {
          glob: 'src/libs',
          types: true
        },
        {
          glob: 'src/invoke-apis',
          types: true
        }
      ],
      dts: 'src/types/auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dirs: ['src/components'],
      dts: 'src/types/components.d.ts'
    })
  ],

  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        update: 'update.html'
      }
    }
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 11420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 11421
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**']
    }
  }
}))
