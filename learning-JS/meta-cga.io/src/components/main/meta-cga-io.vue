<template>
  <article 
    :id="item_data.id" 
    :class="item_data.id !== undefined ? 'item-id-' + item_data.id : ''">
    <span>{{item_data.name}}</span>
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
    span {
      font-family: "Roboto";
      font-weight: 500;
    }
  }
</style> 