import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

const label = 'update'
const openUpdateWindow = async () => {
  let updateWindow = await getWindowByLabel(label)
  if (updateWindow) {
    await updateWindow.show()
    await updateWindow.setFocus()
    return
  }
  updateWindow = new WebviewWindow(label, {
    url: '/update',
    title: '更新',
    width: 650,
    height: 614,
    center: true
  })
}

export default openUpdateWindow
