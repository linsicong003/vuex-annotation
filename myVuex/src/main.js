// main.js
import Vue from 'vue'
import App from './App.vue'
import store from './store/test'


new Vue({
    store,
    devtools: true,
  render: h => h(App)

}).$mount('#app')