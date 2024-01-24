import { h, render } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'

const createMessage = (message: string, type: MessageType, timeout?:number) => {
  const messageVnode = h(Message, {
    message,
    type
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  render(messageVnode, mountNode) // 挂载节点
  const destory = () => {
    render(null, mountNode) // 卸载节点
    document.body.removeChild(mountNode)
  }
  if (timeout) {
    setTimeout(() => {
      destory()
    }, timeout)
  }
  return {
    destory
  }
}

export default createMessage
