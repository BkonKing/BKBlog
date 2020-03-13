import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import store from '@/store'

const types = {
  NEWS_LIST: ' '
}
const user = {
  state: {
    [types.NEWS_LIST]: []
  },
  mutations: {
    [types.NEWS_LIST]: (state: { [x: string]: any; }, res: any) => {
      state[types.NEWS_LIST] = res
    }
  },
  actions: {
    [types.NEWS_LIST]: async ({ commit }: any, params: object) => {
      const res = await login(params)
      return commit(types.NEWS_LIST, res)
    }
  },
  getters: {
    getNewsResponse (state: { [x: string]: any; }) {
      return state[types.NEWS_LIST]
    }
  }
}
export default user
