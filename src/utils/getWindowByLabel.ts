import { getAllWindows } from '@tauri-apps/api/window'

const windowMap = new Map<string, TauriWindow>()
const getWindowByLabel = async (label: string) => {
  if (windowMap.size === 0) {
    await getAllWindows().then((windows) => {
      windows.forEach((window) => {
        windowMap.set(window.label, window)
      })
    })
  }

  return windowMap.get(label)
}

export default getWindowByLabel
