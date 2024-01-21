<template>
  <div class="validata-input-container pb-3">
    <input type="text" :class="{'is-invalid' : inputRef.error}" class="form-control" v-model="inputRef.val" @blur="validateInput">
    <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, mergeProps, reactive } from 'vue'

const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
interface RuleProp {
  type: 'required' | 'email';
  message: string;
}
export type RulesProp = RuleProp[]
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>
  },
  setup (props) {
    const inputRef = reactive({
      val: '',
      error: false,
      message: ''
    })
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
      }
    }
    return {
      inputRef,
      validateInput
    }
  }
})
</script>
<style>
.invalid-feedback {
  text-align: left;
}
</style>
