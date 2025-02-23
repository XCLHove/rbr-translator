import lock from './lock.ts'

type Size = { width: number; height: number }
type SizeHandler = (newSize: Size, oldSize: Size) => MaybePromise<Size>

/**
 * 窗口大小根据元素自适应
 * @param element 默认 document.getElementById('app')
 */
const currentWindowAutoSizeFromElement = (element: HTMLElement | None, sizeHandler?: SizeHandler) => {
  const currentWindow = getCurrentWindow()

  if (!element) {
    element = document.getElementById('app') as HTMLElement
  }

  const resizeCurrentWindow = lock(() => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newWidth = element.offsetWidth
        const newHeight = element.offsetHeight
        if (!sizeHandler) {
          const newSize = new PhysicalSize(newWidth, newHeight)
          currentWindow.setSize(newSize).finally(() => resolve())
          return
        }

        currentWindow.outerSize().then(async (oldPhysicalSize) => {
          const oldSize: Size = { width: oldPhysicalSize.width, height: oldPhysicalSize.height }
          let newSize: Size = { width: newWidth, height: newHeight }
          newSize = await sizeHandler(newSize, oldSize)
          const newPhysicalSize = new PhysicalSize(newSize.width, newSize.height)
          currentWindow.setSize(newPhysicalSize).finally(() => resolve())
        })
      }, 0)
    })
  })
  resizeCurrentWindow()
  const resizeObserver = new ResizeObserver(resizeCurrentWindow)
  resizeObserver.observe(element)
  return () => resizeObserver.disconnect()
}

export default currentWindowAutoSizeFromElement
