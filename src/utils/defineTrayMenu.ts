import { MenuOptions } from '@tauri-apps/api/menu/menu'

export type TrayMenu = Exclude<MenuOptions['items'], None>[number]
const defineTrayMenu = (trayMenu: TrayMenu) => trayMenu
export default defineTrayMenu
