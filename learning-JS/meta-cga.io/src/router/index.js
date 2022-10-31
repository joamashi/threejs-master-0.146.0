import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// *************************************************************

// import Home from '../views/Home.vue'
// import PageNotFound from '../views/PageNotFound'
// import MovieIndexPage from '../components/MovieIndexPage'
// import MovieShowPage from '../components/MovieShowPage'

// const routes = [
//   { path: '/', name: 'Home', component: Home },
//   { path: '/about', name: 'About', component: () => import('../views/About.vue')},
//   { path: '/movie', name: 'MovieIndexPage', component: MovieIndexPage },
//   { path: '/movie/:id', name: 'MovieShowPage', component: MovieShowPage }
// ]
// const router = new VueRouter({
//   routes
// })
// export default router

// *************************************************************

/*
  process.env.NODE_ENV == development  |  production
*/

console.log('production :: ', process.env.NODE_ENV === 'production')

import url from './url'

export default new VueRouter({
  // mode: 'history',
  routes : url
})