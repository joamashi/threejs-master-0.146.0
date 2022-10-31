import Vue from 'vue'
import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'
// import 'vuetify/src/styles/main.sass'
// import '../scss/vuetify.css'

// import Vuetify from 'vuetify/lib'
// import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

import ko from 'vuetify/es5/locale/ko'

const opts = {
  lang: {
    locales: { ko},
    current: 'ko',
  },

  // theme: {
  //   themes: {
  //     light: {
  //       primary: colors.red.darken1, // #E53935
  //       secondary: colors.red.lighten4, // #ffcdd2
  //       accent: colors.indigo.base, // #3F51B5
  //     },
  //   },
  // },


}

export default new Vuetify(opts)