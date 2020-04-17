import { isObject, forEachValue } from './util' 

let Vue

export class Store {
    constructor(options = {}, Vue) {
        if (!Vue && typeof window !== 'undefined' && window.Vue) {
            install(window.Vue)
        }
        
        const { state = {}, getters = {}, mutations = {}, actions = {} } = options
        
        // 初始化
        this._committing = false
        this._state = state
        this._actions = Object.create(null)
        this._mutations = Object.create(null)
        this.getters = Object.create(null)

        const { dispatch, commit } = this
        const store = this

        // 装载 getters
        forEachValue(getters, (fn, type) => {
            registerGetter(this, type, fn)
        })

        // 装载 mutations 和 actions
        forEachValue(mutations, (fn, type) => {
            registerMutation(this, type, fn)
        })

        forEachValue(actions, (fn, type) => {
            registerAction(this, type, fn)
        })

        this.dispatch = function boundDispatch (type, payload) {
            return dispatch.call(store, type, payload)
        }

        this.commit = function boundCommit (type, payload) {
            return commit.call(store, type, payload)
        }
        
        // 新建 Vue 实例响应式存储
        resetStoreVM(this, state)
    }
    get state() {
        return  this._vm._data.$$state
    }
    // 禁止再赋值
    set state (v) {
        throw new Error('不允许赋值！！！')
    }

    // commit
    commit(type, payload) {
        const entry = this._mutations[type]

        if (!entry) {
            console.error(`[vuex] unknown mutation type: ${type}`)
        }
        // 执行对应处理函数
        this._withCommit(() => {
            entry(payload)
        })
    }

    // dispatch
    dispatch(type, payload) {
        const entry = this._actions[type]
        
        entry (payload)
    }

    // 执行函数并加锁
    _withCommit (fn) {
        const committing = this._committing
        this._committing = true
        fn()
        this._committing = committing
    }

}

// 安装方法
export function install (_Vue) {
    if (Vue && _Vue === Vue) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          '[vuex] already installed. Vue.use(Vuex) should be called only once.'
        )
      }
      return
    }
    Vue = _Vue
    // 取得 Vue 实例后混入
    Vue.mixin({ beforeCreate: vuexInit })   
}

/**
 * Vuex init hook, injected into each instances init hooks list.
 * 初始化 Vuex
 */
function vuexInit () {
    const options = this.$options
    
    if (options.store) {
      // 组件内部有 store,则优先使用原有的store  
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      // 组件没有 store 则继承根节点的 $store
      this.$store = options.parent.$store
    }
}   

// 新建 Vue 实例
function resetStoreVM (store, state) {
    // 先看有没有旧实例
    const oldVm = store._vm
    
    if (oldVm) {
        Vue.destroy(oldVm)
    }
    // store.getters = {}

    store._vm = new Vue({
        data: {
          $$state: state
        },
    })
}


// 注册包装模块变量后的 getter 函数
function registerGetter (store, type, fn) {
    Object.defineProperty(store.getters, type, {
        get() {
            return fn(store._state)
        }
    })
}

// 注册 mutations
function registerMutation (store, type, fn) {
    store._mutations[type] = (payload) => {
        fn.call(store, store._state, payload);
    }
}

// 注册 actions
function registerAction (store, type, fn) {
    store._actions[type] = (payload) => {
        fn.call(store, { state: store._state, commit: store.commit }, payload);
    }
}
