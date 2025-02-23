const getPrefix = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hour = now.getHours().toString().padStart(2, '0')
  const minute = now.getMinutes().toString().padStart(2, '0')
  const second = now.getSeconds().toString().padStart(2, '0')
  const millisecond = now.getMilliseconds().toString().padStart(3, '0')
  const prefix = `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`
  return prefix
}

export const logGroup = (label: string, callback: () => void) => {
  console.group(`${getPrefix()} ${label}`)
  callback()
  console.groupEnd()
}

export const logGroupCollapsed = (label: string, callback: () => void) => {
  console.groupCollapsed(`${getPrefix()} ${label}`)
  callback()
  console.groupEnd()
}
