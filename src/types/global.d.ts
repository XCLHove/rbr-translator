import { Window as _TauriWindow } from '@tauri-apps/api/window'

export {}

declare global {
  interface Window {
    __TAURI_INTERNALS__: Record<string, unknown>
  }

  type TauriWindow = _TauriWindow

  type UpdateWindowOptions = {
    autoClose?: boolean
  }
}
