import { h, render } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'

const createMessage = (message: string, type: MessageType, timeout = 2000) => {
  const messageVnode = h(Message, {
    message,
    type
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  render(messageVnode, mountNode) // 挂载节点
  setTimeout(() => {
    render(null, mountNode) // 卸载节点
    document.body.removeChild(mountNode)
  }, timeout)
}

export default createMessage
