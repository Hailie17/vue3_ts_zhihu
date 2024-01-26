<template>
  <div class="post-detail-page">
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
    </article>
  </div>
</template>

<script lang="ts">
import UserProfile from '@/components/UserProfile.vue'
import { GlobalDataProps, ImageProps } from '@/store'
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'post-detail',
  components: { UserProfile },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
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
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    return {
      currentPost,
      currentImageUrl,
      currentHTML
    }
  }
})
</script>
