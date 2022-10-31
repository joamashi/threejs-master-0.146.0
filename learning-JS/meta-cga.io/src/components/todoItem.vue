<template>
  <fragment>
    <li>{{ todo.text }}</li>
  </fragment>
</template>

<script>
  export default {
    name: 'todoItem',
    props: ['todo'],

    data () {
      return {
        groceryList: [
          { id: 0, text: 'Vegetables' },
          { id: 1, text: 'Cheese' },
          { id: 2, text: 'Whatever else humans are supposed to eat' }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  
</style> 