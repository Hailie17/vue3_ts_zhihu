import { createStore } from 'vuex'
import { testData, testPosts } from './testData'

const store = createStore({
  state: {
    column: testData,
    post: testPosts,
    user: { isLogin: false }
  }
})

export default store
