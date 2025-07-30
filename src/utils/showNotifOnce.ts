import { ElNotification } from 'element-plus'

let lastMessage = ''

export const showNotifOnce = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
  if (message === lastMessage) return

  lastMessage = message

  ElNotification({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    message,
    type,
    duration: 5000
  })

  // Optional: reset after timeout to allow the same message later
  setTimeout(() => {
    if (lastMessage === message) {
      lastMessage = ''
    }
  }, 5100)
}
