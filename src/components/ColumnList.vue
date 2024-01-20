<template>
  <div class="column">
    <ul>
      <li v-for="column in list" :key="column.id">
        <img :src="column.avatar" :alt="column.title" />
        <h5>{{ column.title }}</h5>
        <p>{{ column.description }}</p>
        <a href="#">进入专栏</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export interface ColumnProps {
  id: number
  title: string
  avatar: string
  description: string
}
export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>, // PropType 接收一个泛型，将Array的构造函数返回传入的泛型类型; 将一个构造函数断言成一个类型需要添加PropType
      required: true
    }
  }
})
</script>
