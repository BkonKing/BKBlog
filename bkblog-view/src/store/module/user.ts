import { login } from '@/api/module/login'
const types = {
  NEWS_LIST: 'NEWS_LIST'
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
