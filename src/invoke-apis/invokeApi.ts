import { InvokeArgs, InvokeOptions } from '@tauri-apps/api/core'
const invokeApi = (cmd: string, args?: InvokeArgs, options?: InvokeOptions) => {
  const prefix = `invoke:${cmd}`
  logGroupCollapsed(`${prefix}:request`, () => {
    args && console.log('args', simpleClone(args))
    options && console.log('options', simpleClone(options))
  })
  return invoke(cmd, args, options)
    .then((response) => {
      logGroupCollapsed(`${prefix}:response`, () => {
        console.log('response', simpleClone(response))
      })
      return response
    })
    .catch((error) => {
      logGroupCollapsed(`${prefix}:error`, () => {
        console.error('error', simpleClone(error))
      })
      throw error
    })
}

export default invokeApi
