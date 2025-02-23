const _event = 'execute-once'
const currentWindow = getCurrentWindow()
const executeOnce = async (eventName: string, callback: () => MaybePromise<void>) => {
  return new Promise<void>(async (resolve, reject) => {
    const unListen = await currentWindow.listen<string>(_event, async (event) => {
      logGroupCollapsed('executeOnce', () => {
        console.log(event)
      })
      if (event.payload !== eventName) return
      unListen()
      await callback()
      resolve()
    })
    executeOnceApi({ eventName }).catch(reject)
  })
}
export default executeOnce
