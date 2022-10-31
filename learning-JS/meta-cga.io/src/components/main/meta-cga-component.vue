<template>
  <article 
    :id="item_data.id" 
    :class="item_data.id !== undefined ? 'item-id-' + item_data.id : ''">
    <metaCgaIo v-if="item_data.id === 'meta-cga-io'" :item="item_data"></metaCgaIo>
    <!-- <metaNull v-else></metaNull> -->
  </article>
</template>

<script>
import metaCgaIo from '@/components/main/meta-cga-io.vue'
// import metaNull from '@/components/main/meta-null.vue'

export default {
  name: '',
  props: {
    item: Object
  },

  components: {
    metaCgaIo,
    // metaNull
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
  .item-id-meta-cga-io {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style> 