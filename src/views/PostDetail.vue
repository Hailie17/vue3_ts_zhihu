<template>
  <div class="post-detail-page">
    <modal title="删除文章" :visible="modalIsVisible" @modal-on-close="modalIsVisible = false" @modal-on-confirm="hideAndDelete">
      <p>确定要删除这篇文章吗？</p>
    </modal>
    <article class="w-75 mx-auto mb-5" v-if="currentPost">
      <img src="" alt="">
      <h2 class="b-4">{{ currentPost.title }}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-5 row">
        <div class="col">
          <user-profile :user="currentPost.author" v-if="typeof currentPost.author === 'object'"></user-profile>
        </div>
        <span class="text-muted col text-right font-italic">发表于： {{ currentPost.createdAt }}</span>
      </div>
      <div v-html="currentHTML"></div>
      <div v-if="showEditErea" class="btn-group mt-5">
        <router-link :to="{ name: 'create', query: { id: currentPost._id }}" type="button" class="btn btn-success">编辑</router-link>
        <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import UserProfile from '@/components/UserProfile.vue'
import { GlobalDataProps, ImageProps, UserProps, ResponseType, PostProps } from '@/store'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import MarkdownIt from 'markdown-it'
import Modal from '@/components/Modal.vue'
import createMessage from '@/components/createMessage'

export default defineComponent({
  name: 'post-detail',
  components: { UserProfile, Modal },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const router = useRouter()
    const modalIsVisible = ref(false)
    const currentId = route.params.id
    const md = new MarkdownIt()
    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    const currentPost = computed(() => store.getters.getCurrentPost(currentId))
    const currentHTML = computed(() => {
      if (currentPost.value && currentPost.value.content) { // 如果 currentPost.value 存在
        return md.render(currentPost.value.content)
      } else {
        return ''
      }
    })
    const showEditErea = computed(() => { // 是否显示编辑区
      const { isLogin, _id } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) { // 判断是否有文章且为登录状态
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id // 文章作者为登录者
      } else {
        return false // 不符合这些条件返回false
      }
    })
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      store.dispatch('deletePost', currentId).then((rawData: ResponseType<PostProps>) => {
        createMessage('删除成功， 2s 后跳转到首页', 'success', 2000)
        setTimeout(() => {
          router.push({ name: 'column', params: { id: rawData.data.column } })
        }, 2000)
      })
    }
    return {
      currentPost,
      currentImageUrl,
      currentHTML,
      showEditErea,
      modalIsVisible,
      hideAndDelete
    }
  }
})
</script>
