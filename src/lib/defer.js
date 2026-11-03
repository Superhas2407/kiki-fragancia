// Let the first screen paint before initializing secondary integrations.
export function afterFirstPaint(callback, timeout = 2000) {
  let idle
  const timer = setTimeout(() => {
    if ('requestIdleCallback' in window) idle = window.requestIdleCallback(callback, { timeout: 1000 })
    else callback()
  }, timeout)
  return () => { clearTimeout(timer); if (idle) window.cancelIdleCallback(idle) }
}
