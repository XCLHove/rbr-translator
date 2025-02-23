export default defineTrayMenu({
  text: '检查更新',
  async action() {
    const mainWindow = await getWindowByLabel('main')
    await mainWindow?.hide()
    await openUpdateWindow()
  }
})
