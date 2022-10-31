let devux = ' - meta-cga.io'

// const requireAuth = () => (to, from, next) => {
//   // if (store.state.accessToken !== '') {
//   //   return next();
//   // }
//   // next('/login');

//   console.log('requireAuth')
// };

export default [
  { 
    path: '/', 
    name: 'Home', 
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue'),
    meta: {
      requiresAuth: true, // 인증이 반드시 필요한 경우
      title: 'meta-cga.io',
      bodyClass: 'home',
      metaTags: [
        { name: 'description', content: '' },
        { property: 'og:description', content: '' }
      ]
    },

    beforeEnter : (to, from, next) => {
      // 이 컴포넌트를 렌더링하는 라우트 앞에 호출됩니다.
      // 이 가드가 호출 될 때 아직 생성되지 않았기 때문에
      // `this` 컴포넌트 인스턴스에 접근 할 수 없습니다!

      console.log('to : ', to)
      // {name: "Home", meta: {…}, path: "/", hash: "", query: {…},…}

      console.log('from : ', from)
      // {name: "IndexTest", meta: {…}, path: "/index_test_2020", hash: "", query: {…},…}
      
      console.log('next : ', next(false)) // undefined

      // alert('beforeEnter')
      next()
    }
  },

  // { 
  //   path: '/icons', 
  //   name: 'Icons', 
  //   component: () => import(/* webpackChunkName: "Icons" */ '../views/Icons.vue'),
  //   meta: {
  //     title: 'Icons' + devux,
  //     metaTags: [
  //       { name: 'description', content: '' },
  //       { property: 'og:description', content: '' }
  //     ]
  //   }
  // },

  // { 
  //   path: '/ipa', 
  //   name: 'IPA', 
  //   component: () => import(/* webpackChunkName: "IPA" */ '../views/IPA.vue'),
  //   meta: {
  //     title: 'IPA' + devux,
  //     metaTags: [
  //       { name: 'description', content: 'description' },
  //       { property: 'og:description', content: 'description' }
  //     ]
  //   }
  // },

  // { 
  //   path: '/order/:id', 
  //   name: 'OrderComplete', 
  //   component: () => import(/* webpackChunkName: "OrderComplete" */ '../views/ORDER.vue'),
  //   meta: {
  //     title: '주문완료' + devux,
  //     metaTags: [
  //       { name: 'description', content: '' },
  //       { property: 'og:description', content: '' }
  //     ]
  //   }
  // },

  // { 
  //   path: '/shindomart', 
  //   name: 'Shindomart', 
  //   component: () => import(/* webpackChunkName: "Shindomart" */ '../views/Shindomart.vue'),
  //   meta: {
  //     title: 'Shindomart' + devux,
  //     metaTags: [
  //       { name: 'description', content: '' },
  //       { property: 'og:description', content: '' }
  //     ]
  //   }
  // },

  // { 
  //   path: '/components', 
  //   name: 'Component', 
  //   component: () => import(/* webpackChunkName: "Component" */ '../views/Component.vue'),
  //   meta: {
  //     title: 'Component' + devux,
  //     metaTags: [
  //       { name: 'description', content: '' },
  //       { property: 'og:description', content: '' }
  //     ]
  //   }
  // },
  // // ------------------------------------------------------------------
  {
    path: "*", 
    name: '404 Pagge', 
    component: () => import(/* webpackChunkName: "404 Pagge" */ '../views/PageNotFound.vue'),
    meta: {
      title: '404 page' + devux,
      metaTags: [
        { name: 'description', content: '' },
        { property: 'og:description', content: '' }
      ]
    }
  },
  // // ------------------------------------------------------------------
  // {
  //   path: '/pagelist', 
  //   name: 'pagelist', 
  //   component: () => import(/* webpackChunkName: "pagelist" */ '../views/tests/pagelist.vue'),
  //   meta: {
  //     title: '페이지 리스트' + devux,
  //     metaTags: [
  //       { name: 'description', content: '' },
  //       { property: 'og:description', content: '' }
  //     ]
  //   }
  // },
  // // ------------------------------------------------------------------
  // {
  //   path: '/testvue2020', 
  //   name: 'TestVue2020', 
  //   component: () => import(/* webpackChunkName: "TestVue2020" */ '../views/tests/TestVue2020.vue'),
  //   meta: {
  //     title: 'Vue 테스트' + devux,
  //     metaTags: [
  //       { name: 'description', content: '' },
  //       { property: 'og:description', content: '' }
  //     ]
  //   }
  // },
  // // ------------------------------------------------------------------
  // {
  //   path: '/vuetify', 
  //   name: 'vuetify', 
  //   component: () => import(/* webpackChunkName: "vuetify" */ '../views/vuetify.vue'),
  //   meta: {
  //     title: 'vuetify' + devux,
  //     metaTags: [
  //       { name: 'description', content: '' },
  //       { property: 'og:description', content: '' }
  //     ]
  //   }
  // },
  // // ------------------------------------------------------------------
  // {
  //   path: '/slot', 
  //   name: 'slot', 
  //   component: () => import(/* webpackChunkName: "slot" */ '../views/slot.vue'),
  //   meta: {
  //     title: 'slot' + devux,
  //     metaTags: [
  //       { name: 'description', content: '' },
  //       { property: 'og:description', content: '' }
  //     ]
  //   }
  // },
  // // ------------------------------------------------------------------
  // {
  //   path: '/keep', 
  //   name: 'keep', 
  //   component: () => import(/* webpackChunkName: "keep" */ '../views/keep.vue'),
  //   meta: {
  //     title: 'keep' + devux,
  //     metaTags: [
  //       { name: 'description', content: '' },
  //       { property: 'og:description', content: '' }
  //     ]
  //   }
  // },
  // // ------------------------------------------------------------------
  // {
  //   path: '/movie', 
  //   name: 'MovieIndexPage', 
  //   component: () => import(/* webpackChunkName: "MovieIndexPage" */ '../views/tests/MovieIndexPage.vue'),
  //   meta: {
  //     title: '무비무비 리스트' + devux,
  //     metaTags: [
  //       { name: 'description', content: '' },
  //       { property: 'og:description', content: '' }
  //     ]
  //   }
  // },
  // // ------------------------------------------------------------------
  // {
  //   id: 4,
  //   path: '/movie/:id', 
  //   name: 'MovieShowPage', 
  //   component: () => import(/* webpackChunkName: "MovieShowPage" */ '../views/tests/MovieShowPage.vue'),
  //   meta: {
  //     title: '무비무비 상세' + devux,
  //     metaTags: [
  //       { name: 'description', content: '' },
  //       { property: 'og:description', content: '' }
  //     ]
  //   }
  // },
  // // ------------------------------------------------------------------
  // { 
  //   path: '/lifecycle', 
  //   name: 'Lifecycle', 
  //   component: () => import(/* webpackChunkName: "Lifecycle" */ '../views/Lifecycle.vue'),
  //   meta: {
  //     title: 'Lifecycle' + devux,
  //     metaTags: [
  //       { name: 'description', content: '' },
  //       { property: 'og:description', content: '' }
  //     ]
  //   }
  // },
]