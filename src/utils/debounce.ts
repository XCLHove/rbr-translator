/**
 * 函数防抖
 * @param fun 函数
 * @param delaySecond 延迟执行的秒数
 */
export function debounce<Args extends any[], R>(fun: (...args: Args) => R, delaySecond = 1): (...args: Args) => void {
  let timer: any
  return function (...args: Args) {
    clearTimeout(timer)
    timer = setTimeout(() => fun(...args), delaySecond * 1000)
  }
}
