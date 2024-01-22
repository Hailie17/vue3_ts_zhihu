<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import mitt from 'mitt'

type ValidateFunc = () => boolean
type Events = { 'form-item-created': ValidateFunc }// 定义一个Event类型  这个对应是让事件和对应的callback 一一对应
export const emitter = mitt<Events>()// 实例化 mitt 的时候，作为泛型传递进去
export default defineComponent({
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr: ValidateFunc[] = [] // 存放一组函数，执行以后可以显示错误的信息，并且返回input是否通过
    const submitForm = () => {
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit', result)
    }
    const callback = (func?: ValidateFunc) => {
      if (func) {
        funcArr.push(func) // 将监听得到的验证函数都存到一个数组中
      }
    }
    emitter.on('form-item-created', callback)
    onMounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>
