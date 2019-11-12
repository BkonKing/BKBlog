import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

let modules:object = {}

const moduleContext = require.context('./module', true, /\.ts/)

moduleContext.keys().forEach((module) => {
  const moduleText = moduleContext(module)
  Object.assign(modules, moduleText)
})

export default new Vuex.Store({
  modules: {
    ...modules
  },
  getters
})
