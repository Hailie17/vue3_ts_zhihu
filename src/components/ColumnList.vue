<template>
  <div class="column">
    <div class="row">
      <div v-for="column in columnList" :key="column._id" class="col-4 card h-100 shadow-sm mb-4">
        <div class="card-body">
          <img :src="column.avatar && column.avatar.url" :alt="column.title" class="rounded-circle border border-light my-3" />
          <h5 class="card-title">{{ column.title }}</h5>
          <p class="card-text text-start">{{ column.description }}</p>
          <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary">进入专栏</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ColumnProps } from '../store'
export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>, // PropType 接收一个泛型，将Array的构造函数返回传入的泛型类型; 将一个构造函数断言成一个类型需要添加PropType
      required: true
    }
  },
  setup (props) {
    const columnList = computed(() => {
      return props.list.map(column => {
        if (!column.avatar) {
          column.avatar = {
            url: require('@/assets/column.jpg')
          }
        }
        return column
      })
    })
    return {
      columnList
    }
  }
})
</script>
<style scoped>
.card-body img {
  width: 50px;
  height: 50px;
}
</style>
