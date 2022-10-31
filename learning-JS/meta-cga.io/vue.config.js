const path = require('path')

module.exports = {
  devServer: {
    // proxy 설정
    // proxy: 'http://localhost:3000',
    proxy: { 
      // proxyTable 설정 
      '/api': {
         target: 'http://localhost:3000/api', 
         changeOrigin: true, 
         pathRewrite:{ 
           "^/api" : '' 
          } 
        } 
      }
  },
  
  // production 경로 설정
  // publicPath: process.env.NODE_ENV === 'production' ? 'http://devux.ai/' : '/',
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

  // 빌드 경로 변경
  // outputDir : path.resolve(__dirname, "../../../nodejs-cafe24-git/public/"),

  // pages: {
  //   index: {
  //     entry: 'src/index/main.js',
  //     template: 'public/index.html',
  //     filename: 'index.html',
  //     title: 'Index Page',
  //     chunks: ['chunk-vendors', 'chunk-common', 'index']
  //   },
  //   subpage: 'src/subpage/main.js'
  // }


  css: {
    loaderOptions: {
      scss: {
        prependData: `
        @import "~@/scss/variables.scss";
        @import "~@/scss/mixins.scss";
        `
      }
    }
  },


  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Custom Title'
    }
  }
}