import { ElMessage } from 'element-plus'

let isMessageShown = false

export function showMessageOnce(message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info'): void {
  if (isMessageShown) return

  isMessageShown = true
  ElMessage({ message, type })

  setTimeout(() => {
    isMessageShown = false
  }, 2000)
}
