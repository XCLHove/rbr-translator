import { debounce } from './debounce.ts'

type Options = Prettify<{
  saveDebounceTime: number
}>

const localStorageRef = <T>(defaultValue: T, key: string, options?: Options) => {
  let value = defaultValue
  const oldValue = localStorage.getItem(key)
  if (oldValue) {
    value = JSON.parse(oldValue) as T
  }

  const debounceTime = options?.saveDebounceTime || 0
  const setItem = debounce((key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value))
  }, debounceTime)

  return customRef<T>((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue: T) {
        trigger()
        value = newValue
        setItem(key, newValue)
      },
    }
  })
}

export default localStorageRef
