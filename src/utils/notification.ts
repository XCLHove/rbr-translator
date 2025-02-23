import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification'

type Options = Parameters<typeof sendNotification>[0]

let notification = async (options: Options) => {
  let permissionGranted = await isPermissionGranted()
  if (!permissionGranted) {
    const permission = await requestPermission()
    permissionGranted = permission === 'granted'
  }
  if (permissionGranted) {
    notification = async (options: Options) => sendNotification(options)
  }
  sendNotification(options)
}

export default notification
