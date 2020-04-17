<!-- App.vue --> 
<template>
    <section class="container">
        <div style="margin-bottom: 30px;">{{msg}}</div>
        <button @click="doCount">{{ nowCount }}</button>
        <button @click="doCountDouble">乘2</button>
    </section>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Vuex 测试',
      count: 1
    }
  },
  computed: {
      nowCount() {
          return this.$store.state.count
      }
  },
  methods: {
      doCount() {
          this.count = this.nowCount
          console.log('## 我是 commit 之前的值： ##', this.nowCount);
          this.$store.commit('doCount', ++this.count)
          console.log('## 结果值： ##', this.nowCount);         
      },
      doCountDouble() {
          console.log('## 我是 dispatch 之前的值： ##', this.nowCount);
          this.$store.dispatch('doCountDouble')
          console.log('## 结果值： ##', this.nowCount);
      }
  }
}
</script>
<style scoped>
.container {
    box-sizing: border-box;
    padding: 80px;
    text-align: center;
}
button { 
    width: 100px;
    height: 40px;
}
</style>