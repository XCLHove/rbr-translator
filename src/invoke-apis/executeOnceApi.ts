type Options = {
  eventName: string
}

export const executeOnceApi = (options: Options) => {
  return invokeApi('execute_once', options)
}
