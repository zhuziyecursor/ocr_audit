import { useMessage } from 'naive-ui'

export function useToast() {
  const message = useMessage()
  return {
    toast: (content: string) => message.success(content),
    success: (content: string) => message.success(content),
    error: (content: string) => message.error(content),
    warning: (content: string) => message.warning(content),
  }
}
