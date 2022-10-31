<template>
  <fragment>
    <h1>상세 내용</h1>
      {{ movie }}
  </fragment>
</template>

<script>
export default {
  data () {
    return {
      movie: {}
    }
  },
  created () {
    document.title = this.$route.meta.title;

    // var id = this.$route.params.id
    this.$http.get(`/api/movies/${ this.$route.params.id }`)
    .then(( response ) => {
      this.movie = response.data
    })

    console.log(123, this.$route.params.id) // undefined
    console.log(123, this.$route)
    /**
      fullPath: "/movie/1"
      hash: ""
      matched: [{…}]
      meta: {}
      name: "MovieShowPage"
      params: {}
      path: "/movie/1"
      query: {}
     */

  }
}
</script>

<style lang="scss">

</style> 