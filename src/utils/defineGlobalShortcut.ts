import { register } from '@tauri-apps/plugin-global-shortcut'

export type GlobalShortcut = {
  shortcut: Parameters<typeof register>[0]
  handler: Parameters<typeof register>[1]
}

const defineGlobalShortcut = (globalShortcut: GlobalShortcut) => globalShortcut

export default defineGlobalShortcut
