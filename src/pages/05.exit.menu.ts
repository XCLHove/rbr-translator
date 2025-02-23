import { exit } from '@tauri-apps/plugin-process'

export default defineMenu({
  en: 'Exit',
  zh: '退出游戏',
  onClick() {
    onTauriWebview(() => {
      exit(0)
    })
  },
})
