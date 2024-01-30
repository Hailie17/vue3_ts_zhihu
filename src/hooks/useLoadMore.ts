import { useStore } from "vuex"
import { ref, computed, ComputedRef } from 'vue'

interface LoadParams {
  currentPage: number;
  pageSize: number;
}
export const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = { currentPage: 2, pageSize: 5 }) => {

}