<template>
  <fragment>
    <h1>404</h1>
  </fragment>
</template>

<script>
  export default {
    name: 'Home',

    components: {
      
    },

    created () {
      document.title = this.$route.meta.title;
    },
  }
</script>

<style lang="scss" scoped>

</style> 