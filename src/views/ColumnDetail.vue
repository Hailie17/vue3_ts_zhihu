<template>
  <div class="column-deetail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center">
      <div class="col-3 text-center">
        <img :src="column.avatar" :alt="column?.title" class="rounded-circle">
      </div>
    </div>
    <div class="col-9">
      <h4>{{ column?.title }}</h4>
      <p class="text-muted">{{ column?.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { testData, testPosts } from '@/testData'

export default defineComponent({
  setup () {
    const route = useRoute()
    const currentId = +route.params.id // + 将string转化为number
    const column = testData.find(c => c.id === currentId)
    const list = testPosts.filter(post => post.columnId === currentId)
    return {
      column,
      list
    }
  }
})
</script>
