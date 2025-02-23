const onTauriWebview: (executor: () => void) => void = (() => {
  let onTauri = (_executor: () => void) => {}
  if (window.__TAURI_INTERNALS__) onTauri = (executor: () => void) => executor()
  return onTauri
})()

export default onTauriWebview
