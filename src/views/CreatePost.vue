<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <uploader action="/upload" :before-upload="uploadCheck" @file-uploaded="handleFileUploaded" @uploaded="uploadedData" class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4">
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading ...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploded="dataProps">
        <img :src="dataProps.uploadedData.data.url" alt="">
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input :rules="titleRules" v-model="titleVal" placeholder="请输入文章标题" type="text"></validate-input>
      </div>
      <div class="m-3">
        <label class="form-label">文章详情：</label>
        <editor v-model="titleVal" :optios="editorOptions" ref="editorRef" @blur="checkEditor" :class="{ 'is-invalid': !editorStatus.isValid}"></editor>  // 用ref获取对应的dom节点
        <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{ editorStatus.message }}</span>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">发表文章</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from 'vue'
import EasyMDE, { Options } from 'easymde'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import Editor from '@/components/Editor.vue'
import Uploader from '@/components/Uploader.vue'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '@/store'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { beforeUploadCheck } from '../helper'
import createMessage from '../components/createMessage'

interface EditorInstance {
  clear: () => void;
  getMDEInstance: () => EasyMDE | null;
}
export default defineComponent({
  name: 'Login',
  components: { ValidateInput, ValidateForm, Uploader, Editor },
  setup () {
    const editorOptions: Options = {
      spellChecker: false
    }
    const uploadedData = ref()
    const titleVal = ref('')
    const editorStatus = reactive({
      isValid: true,
      message: ''
    })
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const route = useRoute() // useRoute()拿到和url相关的参数
    const isEditMode = !!route.query.id // !!转换为boolean
    const editorRef = ref<null | EditorInstance>()
    let imageId = ''
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const checkEditor = () => {
      if (contentVal.value.trim() === '') {
        editorStatus.isValid = false
        editorStatus.message = '文章详情不能为空'
      } else {
        editorStatus.isValid = true
        editorStatus.message = ''
      }
    }
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          if (currentPost.image) {
            uploadedData.value = { data: currentPost.image }
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) { // 如果 rawData.data._id 存在
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      checkEditor()
      if (result && editorStatus.isValid) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          store.dispatch('createPost', newPost).then(() => {
            createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData()
        formData.append(uploadedFile.name, uploadedFile)
        axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          console.log(res)
        })
      }
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 }) // 上传前类型判断
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式！', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过 1MB', 'error')
      }
      return passed
    }
    return {
      titleRules,
      titleVal,
      contentVal,
      onFormSubmit,
      handleFileChange,
      uploadCheck,
      handleFileUploaded,
      uploadedData,
      editorOptions,
      editorRef,
      checkEditor,
      editorStatus
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-upload-container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
