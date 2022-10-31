<template>
  <fragment>
    <main :class="'wrap ' + deviceDetector">
      <router-view />
      <footer>
        <p>© 2022 meta-cga.io</p>
      </footer>
    </main>
  </fragment>
</template>

<script>
  export default {
    name: 'App',
    data () {
      return {
        deviceDetector : ''
      }
    },

    created () {
      // console.log(this.$device.ios)     // true
      // console.log(this.$device.android) // false
      // console.log(this.$device.windows) // false

      if (this.$device.ios ==  true) {
        this.deviceDetector = 'ios';
      } else if (this.$device.android == true) {
        this.deviceDetector = 'android';
      } else {
        this.deviceDetector = 'desktop';
      }
    },
  }
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&family=Roboto&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Mono:wght@500&display=swap');

  // @import url('https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css');
  // @import url('https://fonts.googleapis.com/css?family=Material+Icons');
  // @import url('https://cdn.jsdelivr.net/npm/vuetify@2.4.2/dist/vuetify.min.css');

  // @import '~bootstrap';
  // @import '~bootstrap-vue';
  
  // @import './scss/vuetify.css';
  // @import './scss/vuetify.scss';

  // @import '~vuetify/src/styles/main.sass';
  // @import '~vuetify/src/styles/styles.sass';


  @import "./scss/mixins.scss";
  @import "./scss/reset.scss";
  // @import "./scss/variables.scss";
  // @import "./scss/grid.scss";

  footer {
    p {
      text-align: center;
      padding: 50px 0;
      font-family: initial;
      font-size: 11px;
      line-height: 11px;
      color: rgb(0 0 0 / 55%);
    }
  }
</style> 