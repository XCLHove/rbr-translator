export default defineGlobalShortcut({
  shortcut: 'Ctrl+Shift+R',
  handler: (event) => {
    if (event.state !== 'Pressed') return
    getWindowByLabel('main').then(async (mainWindow) => {
      console.log('ctrl+shift+r pressed')
      if (await mainWindow?.isVisible()) mainWindow?.hide()
      else mainWindow?.show()
    })
  }
})
