<template>
  <div>
    <a href="#" @click="changeComponent('Keep1')">Keep1</a>
    <a href="#" @click="changeComponent('Keep2')">Keep2</a>

    <!-- <component v-bind:is="comp"></component>  -->
    
    <keep-alive>
      <component v-bind:is="comp"></component> 
    </keep-alive>
  </div>
</template>

<script>
import Keep1 from '@/components/keepAlive/keep1'
import Keep2 from '@/components/keepAlive/keep2'

export default {
  data() {
    return { comp: 'Keep1' }
  },
  components: {
    Keep1,
    Keep2,
  },
  methods: {
    changeComponent: function(componentName) {
      this.comp = componentName
    }
  }
}
</script>