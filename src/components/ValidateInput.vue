<template>
  <div class="validata-input-container pb-3">
    <input v-if="tag !== 'textarea'" :class="{'is-invalid' : inputRef.error}" class="form-control" :value="inputRef.val" @blur="validateInput" @input="updateValue" v-bind="$attrs">
    <textarea v-else :class="{'is-invalid' : inputRef.error}" class="form-control" :value="inputRef.val" @blur="validateInput" @input="updateValue" v-bind="$attrs"></textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, reactive } from 'vue'
import { emitter } from './ValidateForm.vue'

const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
interface RuleProp {
  type: 'required' | 'email';
  message: string;
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false, // 禁止根元素继承
  setup (props, context) {
    const inputRef = reactive({
      val: '',
      error: false,
      message: ''
    })
    const updateValue = (e: Event) => {
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modalValue', targetValue)
    }
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true // 临时变量 passed
          inputRef.message = rule.message
          switch (rule.type) { // 验证输入
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => { // 将事件发射出去，其实就是把验证函数发射出去
      emitter.emit('form-item-created', validateInput)
    })
    return {
      inputRef,
      validateInput,
      updateValue
    }
  }
})
</script>
<style>
.invalid-feedback {
  text-align: left;
}
</style>
