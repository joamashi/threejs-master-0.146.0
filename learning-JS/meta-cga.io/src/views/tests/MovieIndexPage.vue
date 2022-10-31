<template>
  <fragment>
    <h1>영화 목록</h1>

    <div v-for="movie in movies" v-bind:key="movie.id">
      <img :src="movie.poster">
      
      <div>
        <strong>{{ movie.name }}</strong>, <i> {{ movie.year }} </i>
        <router-link v-bind:to="{ name: 'show', params: { id: movie.id }}">더보기</router-link>
      </div>
    </div>
  </fragment>
</template>

<script>
export default {
  data () {
    return {
      movies: []
    }
  },
  created () {
    document.title = this.$route.meta.title;

    this.$http.get('/api/movies').then(( response ) => {
      this.movies = response.data

      console.log(this.movies) // [{...}, {...}, {...}]
    })
  }
}
</script>

<style lang="scss">

</style> 