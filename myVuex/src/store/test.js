import Vue from 'vue'
import MyVuex from './myVuex'

Vue.use(MyVuex)

const store = new MyVuex.Store({
    state: {
        count: 1
    },
    getters: {
        getCount(state) {
            return state.count
        },
        getOne(state) {
            return 1
        }
    },
    mutations: {
        doCount(state, data) {
            state.count = data
        }
    },
    actions: {
        doCount({ commit }, data) {
            commit('doCount', data)
        },
        doCountDouble({ state, commit }) {
            commit('doCount', state.count * 2)
        }
    }
})

export default store