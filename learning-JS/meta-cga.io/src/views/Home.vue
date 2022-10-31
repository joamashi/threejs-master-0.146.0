<template>
  <fragment>
    <!-- <router-link :to="{ name: 'IPA'}" target="_blank">ipa</router-link> -->
    <section class="grid-container" ref="gridWight">
      <section 
        class="grid-item" 
        v-for="(item, index) in grid" 
        :key="index" 
        :data-index="'item-num-' + index"
        ref="itemWight">
        <meta-cga-io v-if="item.id === 'meta-cga-io'" :item="item"></meta-cga-io>
        <lottie-cga v-else-if="item.id === 'lottie-cga'" :item="item"></lottie-cga>
        <meta-null v-else :item="item"></meta-null>
      </section>
    </section>
  </fragment>
</template>

<script>
  import metaNull from '@/components/main/meta-null.vue'
  import metaCgaIo from '@/components/main/meta-cga-io.vue'
  import lottieCga from '@/components/main/lottie-cga.vue'

  export default {
    name: 'Home',
    props: {
      msg: String
    },

    components: {
      metaCgaIo,
      lottieCga,
      metaNull
    },

    data () {
      return {
        grid: [
          {
            id: '',
            name: '',
          },
          {
            id: 'meta-cga-io',
            name: 'meta-cga.io',
          },
          {
            id: 'lottie-cga',
            name: 'lottie-cga',
          }
        ]
      }
    },

    created () {
      document.title = this.$route.meta.title;
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
      // console.log(this.$refs.gridWight.clientWidth)
      this.grid.map((data, index) => {
        let _wight = this.$refs.gridWight.clientWidth;
        let _columns = _wight > 511 ? 3 : 2;
        let _padding = _wight > 511 ? 26.6699999999999 : 30;
        this.$refs.itemWight[index].style.height = (_wight / _columns) - _padding + 'px';
        // 3.3300000000000125
        // 26.669999999999987

        // 512 / 717
      })
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
  .grid-container {
    display: grid;
    // grid-template-columns: 1fr 1fr 1fr;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, minmax(100px, auto));
    
    row-gap: 10px; // row의 간격을 10px로
    column-gap: 20px; // column의 간격을 20px로
    gap: 10px 20px; // row-gap: 10px; column-gap: 20px;
    gap: 20px; // row-gap: 20px; column-gap: 20px;
    padding: 20px;

    @include max_wight_511() {
      grid-template-columns: repeat(3, 1fr);
    }

    .grid-item {
      > article {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;

        background-color: #f9f9f9;
        border-radius: 1rem;
        overflow: hidden;
      }
    }
    
  }
</style> 