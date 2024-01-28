<template>
  <div class="vue-easymde-editor">
    <textarea ref="textArea"></textarea>
  </div>
</template>

<script setup lang="ts">
import EasyMDE, { Options } from 'easymde'
import { defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue'
// 类型、属性、事件
interface EditorProps {
  modalValue?: string;
  optios?: Options;
}
interface EditorEvents {
  (type: 'update:modelValue', value: string): void;
  (type: 'change', value: string): void;
  (type: 'blur'): void;
}
const props = defineProps<EditorProps>()
const emit = defineEmits<EditorEvents>()
// 初始化数据
const textArea = ref<null | HTMLTextAreaElement>(null)
let easyMDEInstance: EasyMDE | null = null
const innerValue = ref(props.modalValue || '')
onMounted(() => {
  if (textArea.value) {
    // 组装options
    const config: Options = {
      ...(props.optios || {}), // 如果 props.optios 不存在， 赋值为空对象
      element: textArea.value, // element dom节点
      initialValue: innerValue.value // initialValue初始值
    }
    easyMDEInstance = new EasyMDE(config)
    // 监控对应的事件
    easyMDEInstance.codemirror.on('change', () => {
      if (easyMDEInstance) {
        // 拿到当前的值
        const updatedValue = easyMDEInstance.value()
        innerValue.value = updatedValue
        emit('update:modelValue', updatedValue)
        emit('change', updatedValue)
      }
    })
    easyMDEInstance.codemirror.on('blur', () => {
      if (easyMDEInstance) {
        emit('blur')
      }
    })
  }
})
onUnmounted(() => {
  // 销毁实例
  if (easyMDEInstance) {
    easyMDEInstance.cleanup()
  }
  easyMDEInstance = null
})
</script>
