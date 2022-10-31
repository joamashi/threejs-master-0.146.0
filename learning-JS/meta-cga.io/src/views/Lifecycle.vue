<template>
  <fragment>
    <b-container>

      <h1>LifeCycle</h1>
    
      <h2>beforeCreate</h2>

      <hr>

      <h2>created</h2>

      <hr>

      <h2>beforeMount</h2>

      <hr>

      <h2>mounted</h2>

      <hr>
      
      <h2>beforeUpdate</h2>

      <hr>

      <h2>updated</h2>

      <hr>

      <h2>beforeDestroy</h2>

      <hr>

      <h2>destroyed</h2>

      <hr>

      <h2>computed</h2>

      <hr>

      <h2>watch</h2>

      <hr>

      <h2>methods</h2>

      

    </b-container>
  </fragment>
</template>

<script>
  export default {
    name: 'Lifecycle',
    
    props: {
      msg: String
    },

    components: {
      
    },

    beforeCreate () {

    },

    created () {
      document.title = this.$route.meta.title;
      
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

    },

    computed: {

    },

    watch: {

    },

    methods: {

    }
  }
</script>

<style lang="scss">
  
</style> 