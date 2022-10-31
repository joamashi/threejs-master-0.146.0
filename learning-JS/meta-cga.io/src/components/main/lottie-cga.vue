<template>
  <article 
    :id="item_data.id" 
    :class="'item-id-' + item_data.id">
    <em>{{item_data.name}}</em>
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

<style lang="scss">
  
</style> 