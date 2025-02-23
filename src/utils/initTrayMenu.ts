import { TrayMenu } from './defineTrayMenu.ts'

const trayIconId = 'rbr-translator'
const initTrayMenu = () => {
  const importedTrayMenus = import.meta.glob('../tray-menus/*.ts', {
    eager: true,
    import: 'default'
  })
  const trayMenus = Object.entries(importedTrayMenus).map(([_path, _trayMenu]) => {
    const path = _path as string
    const id = path.replace(/^\.\.\/tray-menus\/(.*)\.ts$/, '$1')
    const trayMenu = _trayMenu as TrayMenu
    // @ts-ignore
    trayMenu.id = id
    return trayMenu
  })
  return executeOnce('initTrayMenu', async () => {
    const menu = await Menu.new({
      id: trayIconId,
      items: trayMenus
    })
    let trayIcon = await TrayIcon.getById(trayIconId)
    if (trayIcon) {
      await trayIcon.setMenu(menu)
      return
    }
    trayIcon = await TrayIcon.new({
      id: trayIconId,
      icon: 'icons/Square284x284Logo.png',
      menu: menu,
      tooltip: 'RBR Translator',
      action(event) {
        if (event.type === 'DoubleClick') {
          getWindowByLabel('main').then((w) => w?.show())
        }
      }
    })
    await trayIcon.setShowMenuOnLeftClick(false)
  })
}
export default initTrayMenu
