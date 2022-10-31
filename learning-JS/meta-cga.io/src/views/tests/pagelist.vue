<template>
  <fragment>

    <ul>
      <li 
        v-for="url in urls" 
        :key="url.id">
        <!-- <router-link :to="url.path"> -->
        <router-link 
          :to="{ 
            name: url.name, 
            params: { id: url.id }
          }" target="_blank">{{ url.meta.title }}</router-link>
        </li>
    </ul>

    <!-- 
      <router-link v-bind:to="{ name: 'show', params: { id: movie.id }}">더보기</router-link>
     -->
  </fragment>
</template>

<script>
  import url from '@/router/url'

  export default {
    name: 'pagelist',
    data () {
      return {
        urls: url
      }
    },

    created () {
      // document.title = this.$route.meta.title;
    },

    computed: {
      // pageTitle () {
      //   return this.$route.meta.title;
      // }
    },

    watch: {
      // $route(to, from) {
      //   document.title = to.meta.title || 'Some Default Title';
      // },
    }
  }
</script>

<style lang="scss" scoped>
  
</style> 