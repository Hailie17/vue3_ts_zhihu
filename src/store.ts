import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from './helper'

export interface ResponseType<P =Record<string, never>> {
  code: number;
  msg: string;
  data: P;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
}
interface ListProps<P> {
  [id: string]: P;
}
export interface GlobalErrorProps {
  message?: string;
  status: boolean;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ListProps<ColumnProps>;
  posts: ListProps<PostProps>;
  user: UserProps;
}
// 封装请求函数
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: {},
    posts: {},
    user: { isLogin: false }
  },
  mutations: { // 同步
    createPost (state, newPost) {
      state.posts[newPost._id] = newPost
    },
    fetchColumns (state, rawData) {
      state.columns = arrToObj(rawData.data.list)
    },
    fetchColumn (state, rawData) {
      state.columns[rawData.data._id] = rawData.data
    },
    fetchPosts (state, rawData) {
      state.posts = arrToObj(rawData.data.list)
    },
    fetchPost (state, rawData) {
      state.posts[rawData.data._id] = rawData.data
    },
    deletePost (state, { data }) {
      delete state.posts[data._id]
    },
    updatePost (state, { data }) {
      state.posts[data._id] = data
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
      console.log(state.user)
    },
    login (state, rawData) {
      const { token } = rawData.data
      localStorage.setItem('token', token)
      state.token = token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout (state) {
      state.token = '' // 清空token
      localStorage.removeItem('token') // 删除本地缓存token
      delete axios.defaults.headers.common.Authorization // 删除请求头
    }
  },
  actions: { // 异步
    fetchColumns ({ commit }) { // context 具有和 store 相同的方法和属性
      return asyncAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/user/login', 'login', commit, payload)
    },
    createPost ({ commit }, payload) {
      return asyncAndCommit('/post', 'createPost', commit, payload)
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/post/${id}`, 'deletePost', commit, { method: 'delete' })
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: { // 对存储在 state 中的数据进行处理或计算
    getColumns: (state) => {
      return objToArr(state.columns)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts[id]
    }
  }
})

export default store
