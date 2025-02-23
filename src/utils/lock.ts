/**
 * 给函数加锁
 * @param fun
 */
const lock = <Args extends any[], R>(fun: (...args: Args) => MaybePromise<R>) => {
  let isLocked = false
  return (...args: Args) => {
    if (isLocked) {
      return
    }
    isLocked = true

    const result = fun(...args)
    if (result instanceof Promise) {
      result.finally(() => {
        isLocked = false
      })
      return
    }
    isLocked = false
  }
}

export default lock
