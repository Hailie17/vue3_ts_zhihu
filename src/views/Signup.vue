<template>
  <div class="signup-page mx-auto p-2 w-330">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input :rules="emailRules" v-model="formData.email" placeholder="请输入邮箱地址" type="text"></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <validate-input :rules="nameRules" v-model="formData.nickName" placeholder="请输入昵称" type="text" />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input :rules="passwordRules" v-model="formData.password" placeholder="请输入密码" type="password" />
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input :rules="repeatPasswordRules" v-model="formData.repeatPassword" placeholder="请再次输入密码" type="text" />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">提交</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import createMessage from '@/components/createMessage'

export default defineComponent({
  name: 'Signup',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: ''
    })
    const router = useRouter()
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nameRules: RulesProp = [
      { type: 'required', message: '昵称不能为空' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const repeatPasswordRules: RulesProp = [
      { type: 'required', message: '重复密码不能为空' },
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatPassword
        },
        message: '密码不相同'
      }
    ]
    const onFormSubmit = async (result: boolean) => {
      if (result) {
        const payload = {
          email: formData.email,
          nickName: formData.nickName,
          password: formData.password
        }
        axios.post('/users/', payload).then(() => {
          createMessage('注册成功 正在跳转登录页面', 'success')
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        }).catch(e => {
          console.log(e)
        })
      }
    }
    return {
      formData,
      emailRules,
      onFormSubmit,
      nameRules,
      passwordRules,
      repeatPasswordRules
    }
  }
})
</script>
