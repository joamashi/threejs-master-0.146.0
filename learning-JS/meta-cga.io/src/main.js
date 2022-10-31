import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// ----------------------------------------------------------

import $ from 'jquery';
Vue.prototype.$$ = $;

// ----------------------------------------------------------

// Vue.js를 사용하여 반응 형 모바일 우선 사이트를 구축하기 위해 세계에서 가장 널리 사용되는 프레임 워크 인 Bootstrap v4를 기반으로 BootstrapVue를 시작하십시오.
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.prototype.$spin = BootstrapVue

// ----------------------------------------------------------

// 디바이스 체크
import device from "vue-device-detector"
Vue.use(device)

// ----------------------------------------------------------

// import { Plugin } from 'vue-fragment'
// Vue.use(Plugin)
import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)

// ----------------------------------------------------------

// Vue.js에서 lodash remove 오작동
// https://lovemewithoutall.github.io/it/lodash-remove-not-works-in-vue/

import VueLodash from 'vue-lodash'
import _ from 'lodash'
Vue.use(VueLodash, { name: 'custom' , lodash: _ })
// console.log(lodash)
// Vue.prototype.lodash = lodash

// ----------------------------------------------------------

// 웹팩으로 Vue.JS 번들 크기를 줄이는 방법
// https://ui.toast.com/weekly-pick/ko_20190603/

import moment from "moment"
import VueMomentJS from "vue-momentjs"
Vue.use(VueMomentJS, moment)

// console.log('moment', moment(new Date()).format('YYYYMMDD')) // moment 20200610
// console.log('moment', moment(new Date()).add(1, 'days').format('YYYYMMDD')) // moment 20200611

// ----------------------------------------------------------

import axios from 'axios'
Vue.prototype.$http = axios

// ----------------------------------------------------------

import emailjs from 'emailjs-com'
Vue.prototype.$emailjs = emailjs

// ----------------------------------------------------------

Vue.config.productionTip = false

// ----------------------------------------------------------

// import vuetify from '@/plugins/vuetify'

// ----------------------------------------------------------

new Vue({
  router,
  // vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
