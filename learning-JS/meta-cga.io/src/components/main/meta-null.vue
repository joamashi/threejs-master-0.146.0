<template>
  <article>
    <span><em>404</em></span>
  </article>
</template>

<script>
export default {
  name: '',
  props: {
    item: Object
  },

  data () {
    return {
      item_data: this.item 
    }
  },

  created () {
    console.log(this.item_data)
  },

  computed: {

  },

  methods: {

  },

  watch: {
  
  },

  beforeMount () {
    
  },

  mounted () {
    
  },

  beforeUpdate () {

  },
    
  updated () {

  },

  beforeDestroy() {
    
  },

  destroyed () {

  }
}
</script>

<style lang="scss" scoped>
  article {
    span,
    em {
    }
  }
</style> 