import { ElNotification } from 'element-plus'

const shownKeys = new Set<string>()

export function showNotifOnce({
  title = 'Notice',
  message,
  type = 'info',
  duration = 3000
}: {
  title?: string
  message: string
  type?: 'success' | 'warning' | 'info' | 'error'
  duration?: number
}) {
  const key = `${title}-${message}-${type}`

  if (shownKeys.has(key)) return

  shownKeys.add(key)

  ElNotification({
    title,
    message,
    type,
    duration
  })

  setTimeout(() => {
    shownKeys.delete(key)
  }, duration + 100)
}
