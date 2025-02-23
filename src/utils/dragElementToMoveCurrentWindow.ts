/**
 * 拖动元素以移动当前窗口
 * @param element 要拖动的元素，默认为 document
 */
const dragElementToMoveCurrentWindow = (element: HTMLElement = document as any) => {
  const currentWindow = getCurrentWindow()

  let isMousedown = false
  // 按下时鼠标的 X 坐标
  let mousedownX = 0
  // 按下时鼠标的 Y 坐标
  let mousedownY = 0

  const moveCurrentWindow = lock(async (moveX: number, moveY: number) => {
    const position = await currentWindow.outerPosition()
    const newPosition = new PhysicalPosition(position.x + moveX, position.y + moveY)
    await currentWindow.setPosition(newPosition)
  })
  const mousedownListener = (event: MouseEvent) => {
    isMousedown = true
    mousedownX = event.clientX
    mousedownY = event.clientY
  }
  const mouseupListener = () => {
    isMousedown = false
  }
  const mousemoveListener = (event: MouseEvent) => {
    if (!isMousedown) return
    const moveX = event.clientX - mousedownX
    const moveY = event.clientY - mousedownY
    moveCurrentWindow(moveX, moveY)
  }

  const startListener = () => {
    element.addEventListener('mousedown', mousedownListener)
    element.addEventListener('mousemove', mousemoveListener)
    element.addEventListener('mouseup', mouseupListener)
  }
  const stopListener = () => {
    document.removeEventListener('mousedown', mousedownListener)
    document.removeEventListener('mousemove', mousemoveListener)
    document.removeEventListener('mouseup', mouseupListener)
  }

  startListener()
  return stopListener
}

export default dragElementToMoveCurrentWindow
