<!-- App.vue --> 
<template>
    <section>
        <div>{{msg}}</div>
        <button @click="doCount">{{ nowCount }}</button>
        <button @click="doCountDouble">乘2</button>
    </section>
</template>

<script>
export default {
  data() {
    return {
      msg: 'hello vue',
      count: 1
    }
  },
  computed: {
      nowCount() {
          return this.$store.state.count
      }
  },
  created() {
  },
  methods: {
      doCount() {
          this.count = this.nowCount
          this.$store.commit('doCount', ++this.count)
          console.log(this.count);
          
      },
      doCountDouble() {
          this.$store.dispatch('doCountDouble')
      }
  }
}
</script>