import { GlobalShortcut } from './defineGlobalShortcut.ts'

const initGlobalShortcut = async () => {
  const importedGlobalShortcuts = import.meta.glob('../global-shortcuts/*.ts', {
    eager: true,
    import: 'default'
  })
  const globalShortcuts = Object.entries(importedGlobalShortcuts).map(([_path, _globalShortcuts]) => {
    const globalShortcut = _globalShortcuts as GlobalShortcut
    return globalShortcut
  })

  await unregisterAll()
  globalShortcuts.forEach((globalShortcut) => {
    register(globalShortcut.shortcut, globalShortcut.handler).catch((error) => {
      console.error(`快捷键注册失败: ${globalShortcut.shortcut}`, error)
    })
  })
}

export default initGlobalShortcut
