- 초기 로딩 타임을 줄인다
- 정적 자원들까지 모듈화 가능. css, images
- Babel, Typescript 등과 같은 트랜스파일러와 손쉽게 통합
- HMR(Hot Module Replacement)를 지원하기 때문에 코드가 수정될 때마다 자동으로 번들링을 수행하고 페이지가 갱신.
- 다양한 로더(loader)가 제공
- 다양한 플러그인(Plugin)을 제공
​
​
webpack.config.js
var webpack = require('webpack');
module.exports = {
    entry: { // 처음 로드하는 파일을 지정
      main: __dirname + '/src/index.js'  
    },
    
    output: { // 번들링된 결과물의 출력 방법을 지정. 
        path: __dirname + '/public/dist/', // 번들링된 파일의 저장 경로.
        filename: '[name].js', // 생성하는 파일의 파일명 지정. entry 이름이 파일명에 반영되도록 '[name]'
        publicPath : '/dist' // 웹서버에서 이용될 때의 사용 경로를 지정
    },

    module: { // 프로젝트 내부에서 사용하는 다양한 유형의 모듈을 수행하는 방법을 지정.
        rules: [
            {
                test:/\.js$/, // 내부의 test 옵션에는 정규식을 지정. js로 끝나는 경우로 한정.
                loader: 'babel-loader', // 트랜스파일
                exclude: /node_modules/ // 트랜스파일 대상에 포함시키지 않을 파일명의 정규식 패턴을 지정.
            }
        ]
    },

    plugins: [ // 다양한 방법으로 webpack 빌드 프로세스에 사용자가 지정한 작업을 추가할 수 있는 기능 제공.
        new webpack.optimize.UglifyJsPlugin() // 코드 난독화와 압축 기능 제공.
    ],

    devServer: { // 
        contentBase: './public/', // 웹서버 루트로 지정할 디렉터리 경로 설정. 생략하면 프로젝트 디렉터리가 지정
        port: 3000, // 포트 번호를 지정. 지정하지 않으면 기본값 8080
        historyApiFallback:true
       // 브라우저에서 이전 상태로 이동하려할 때 URI가 존재하지 않으면 404 에러가 발생. 이 경우 기본 페이지(index.html)로 이동을 자동화시킬 것인지 여부
    }
}
​
package.json
{
  "name": "webpacktest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack",
    "start": "node_modules/.bin/webpack-dev-server --open --hot", // npm run start
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "babel": "^6.23.0",
    "babel-core": "^6.24.1",
    "babel-loader": "^7.0.0",
    "babel-preset-es2015": "^6.24.1",
    "webpack": "^2.7.0",
    "webpack-dev-server": "^2.4.5"
  }
}

​
​
{
  "name": "webpacktest2",
  "description": "A Vue.js project",
  "version": "1.0.0",
  "author": "",
  "private": true,
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --open --hot",
    "build": "cross-env NODE_ENV=production webpack --progress --hide-modules"
  },
  "dependencies": {
    "vue": "^2.2.1"
  },
  "devDependencies": {
    "babel-core": "^6.0.0",
    "babel-loader": "^6.0.0",
    "babel-preset-latest": "^6.0.0",
​
    "cross-env": "^3.0.0", 
     // 여러 플랫폼에 걸쳐서 환경 변수를 설정하고 사용하는 스크립트를 실행.
​
    "css-loader": "^0.25.0", 
     // 컴포넌트에서 css 파일을 파일명을 이용해 직접 import 구문으로 로드하여 사용하는 방법 제공. 임포트된 css 파일에 정의된
                                클래스는 객체처럼 이용할 수 있다.
​
    "file-loader": "^0.9.0", 
     // 정적 자원(이미지등의 파일)을 import 구문을 이용해 코드로 로드. 로드된 파일은 webpack에 의해 번들링. 번들링될 때
                                파일명에 MD5 해시값을 적용할 수 있다. png, jpg, gif, svg인 경우에만 file-loader가 적용.
​
    "vue-loader": "^11.1.4", 
    ​// 확장자가 .vue인 단일 컴포넌트(Single File Component)파일을 트랜스파일하고 로드하는 기능 수행
 
    "vue-template-compiler": "^2.2.1", 
    // Vue 컴포넌트 내부의 템플릿 문자열을 트랜스파일하는 기능 수행
​
    "webpack": "^2.2.0",
    "webpack-dev-server": "^2.2.0"
  }
}

​
​
​
.babelrc
{
    "presets" : [ "es2015"]
}
​
​
src/index.js
import calc from './utils/utility';

let x = 6;
let y = 5;
let str = `<h2>${x} + ${y} = ${calc.add(x,y)}</h2>`;

document.getElementById("app").innerHTML = str; 
​
​
src/utils/utility.js
let calc = {
    add(x, y) {
        return x + y;
    },
    multiply(x,y) {
        return x * y;
    }
}

export default calc;
​
public/index.html
// <!DOCTYPE html>
// <html lang="en">
//     <head>
//         <title>테스트 페이지</title>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1">
//     </head>
//     <body>
//         <div id="app"></div>
//     </body>
//     <script src="dist/main.js"></script>
// </html>
​
​
public/dist/main.js
!function(t){function e(r){if(n[r])return n[r].exports;var u=n[r]={i:r,l:!1,exports:{}};return t[r].call(u.exports,u,u.exports,e),u.l=!0,u.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/dist",e(e.s=1)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={add:function(t,e){return t+e},multiply:function(t,e){return t*e}};e.default=r},function(t,e,n){"use strict";var r=n(0),u=function(t){return t&&t.__esModule?t:{default:t}}(r),o="<h2>6 + 5 = "+u.default.add(6,5)+"</h2>";document.getElementById("app").innerHTML=o}]);
​
​
webpack, webpack-simple, pwa
vue init webpack-simple webpackProject
​
​
​
/* 
pwa(Progressive Web Application)는 웹 환경에서 최상의 사용자 경험을 제공.
​
신뢰성 : 불안정한 네트워크 상태에서도 즉시 로드하여 브라우저에 앱의 화면이 정상적으로 나타나도록 할 수 있다. 내부적으로 서비스 워커를 이용
​
빠른 속도 :  모든 리소스를 최적으로 신속하게 브라우저에 제공하여 즉각적인 웹 환경을 구현
​
매력적 : 앱스토어 없이 사용자의 홈 화면에 설치됙 제공될 수 있어야 한다. 이를 위해 웹 앱매니페스트파일을 이용해 전체 화면의 사용자 경험 제공.
          웹 푸시 알림을 이용해 사용자의 적극정인 앱 사용을 유도. 앱의 아이콘, 화면에서의 런처, 배경색 등을 시작할 수 있는 JSON 파일을 일컫는 것
​
앱과의 유사성 : 모바일 앱, 데스크톱 앱과 동일한 실행 방식과 사용자 경험을 제공.
​
HTTPS 통신 : HTTPS를 사용하여 통신이 안전하게 이루어질 수 있어야 한다.
​
​
서비스 워커는 PWA의 핵심 기술 중 하나.
서비스 워커는 브라우저 기반에서 백그라운드로 스크립트를 실행하는 기능을 제공하여 웹 페이지와는 독립적으로 작동.
UI와 직접적으로 관련이 없는 기능을 구현할 때 유용.
웹 페이지에서 네트워크 요청이 발생하면 서비스 워커는 요청을 가로채고 캐시가 존재하는지 여부를 조사한다.
캐시가 존재하는 경우 즉시 로딩하여 신속하게 초기 화면이 나타날 수 있도록 한다. 
*/
​
​
 webpack-simple
​
.babelrc
{
  "presets": [
    ["env", { "modules": false }],
    "stage-3"
  ]
}
​
package.json
{
  "name": "webpack-simple",
  "description": "A Vue.js project",
  "version": "1.0.0",
  "author": "BINPAGE\\noten <notenore@gmail.com>",
  "license": "MIT",
  "private": true,
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --open --hot",
    "build": "cross-env NODE_ENV=production webpack --progress --hide-modules"
  },
​
  "dependencies": {
    "vue": "^2.4.4"
  },
​
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ],
​
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.0",
    "babel-preset-stage-3": "^6.24.1",
    "cross-env": "^5.0.5",
    "css-loader": "^0.28.7",
    "file-loader": "^1.1.4",
    "vue-loader": "^13.0.5",
    "vue-template-compiler": "^2.4.4",
    "webpack": "^3.6.0",
    "webpack-dev-server": "^2.9.1"
  }
}

​
​
webpack.config.js
var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
​
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
​
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
​
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    port:3000
  },
​
  performance: {
    hints: false
  },
​
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}

​
​
 webpack
​
.babelrc
{
  "presets": [
    ["env", {
      "modules": false
    }],
    "stage-2"
  ],
​
  "plugins": ["transform-runtime"],
​
  "env": {
    "test": {
      "presets": ["env", "stage-2"]    }
  }
}

​
​
package.json
{
  "name": "webpack-init",
  "version": "1.0.0",
  "description": "A Vue.js project",
  "author": "BINPAGE\\noten <notenore@gmail.com>",
  "private": true,
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "unit": "jest test/unit/specs --coverage",
    "e2e": "node test/e2e/runner.js",
    "test": "npm run unit && npm run e2e",
    "lint": "eslint --ext .js,.vue src test/unit/specs test/e2e/specs",
    "build": "node build/build.js"
  },
​
  "dependencies": {
    "vue": "^2.5.2",
    "vue-router": "^3.0.1"
  },
​
  "devDependencies": {
    "autoprefixer": "^7.1.2",
    "babel-core": "^6.22.1",
    "babel-eslint": "^7.1.1",
    "babel-loader": "^7.1.1",
    "babel-plugin-transform-runtime": "^6.22.0",
    "babel-preset-env": "^1.3.2",
    "babel-preset-stage-2": "^6.22.0",
    "babel-register": "^6.22.0",
    "chalk": "^2.0.1",
    "copy-webpack-plugin": "^4.0.1",
    "css-loader": "^0.28.0",
    "eslint": "^3.19.0",
    "eslint-friendly-formatter": "^3.0.0",
    "eslint-loader": "^1.7.1",
    "eslint-plugin-html": "^3.0.0",
    "eslint-config-standard": "^10.2.1",
    "eslint-plugin-promise": "^3.4.0",
    "eslint-plugin-standard": "^3.0.1",
    "eslint-plugin-import": "^2.7.0",
    "eslint-plugin-node": "^5.2.0",
    "eventsource-polyfill": "^0.9.6",
    "extract-text-webpack-plugin": "^3.0.0",
    "file-loader": "^1.1.4",
    "friendly-errors-webpack-plugin": "^1.6.1",
    "html-webpack-plugin": "^2.30.1",
    "webpack-bundle-analyzer": "^2.9.0",
    "babel-jest": "^21.0.2",
    "jest": "^21.2.0",
    "vue-jest": "^1.0.2",
    "node-notifier": "^5.1.2",
    "chromedriver": "^2.27.2",
    "cross-spawn": "^5.0.1",
    "nightwatch": "^0.9.12",
    "selenium-server": "^3.0.1",
    "postcss-import": "^11.0.0",
    "postcss-loader": "^2.0.8",
    "semver": "^5.3.0",
    "shelljs": "^0.7.6",
    "optimize-css-assets-webpack-plugin": "^3.2.0",
    "ora": "^1.2.0",
    "rimraf": "^2.6.0",
    "url-loader": "^0.5.8",
    "vue-loader": "^13.3.0",
    "vue-style-loader": "^3.0.1",
    "vue-template-compiler": "^2.5.2",
    "portfinder": "^1.0.13",
    "webpack": "^3.6.0",
    "webpack-dev-server": "^2.9.1",
    "webpack-merge": "^4.1.0"
  },
​
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "vue"
    ],
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    "transform": {
      "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
      ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
    },
    "setupFiles": ["<rootDir>/test/unit/setup"],
    "mapCoverage": true,
    "coverageDirectory": "<rootDir>/test/unit/coverage",
    "collectCoverageFrom" : [
      "src/**/*.{js,vue}",
      "!src/main.js",
      "!src/router/index.js",
      "!**/node_modules/**"
    ]
  },
  "engines": {
    "node": ">= 4.0.0",
    "npm": ">= 3.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}

​
​
build/build.js
build/check-versions.js
build/utils.js
build/vue-loader.conf.js
build/webpack.base.conf.js
build/webpack.config.js
build/webpack.prod.conf.js
build/webpack.test.conf.js
​
 pwa
​
.babelrc
{
  "presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
    "stage-2"
  ],
​
  "plugins": ["transform-runtime"],
​
  "env": {
    "test": {
      "presets": ["env", "stage-2"],
      "plugins": [ "istanbul" ]
    }
  }
}
​
package.json
{
  "name": "webpack-pwa",
  "version": "1.0.0",
  "description": "A Vue.js project",
  "author": "BINPAGE\\noten <notenore@gmail.com>",
  "private": true,
  "scripts": {
    "dev": "node build/dev-server.js",
    "start": "node build/dev-server.js",
    "build": "node build/build.js",
    "unit": "cross-env BABEL_ENV=test karma start test/unit/karma.conf.js --single-run",
    "e2e": "node test/e2e/runner.js",
    "test": "npm run unit && npm run e2e",
    "lint": "eslint --ext .js,.vue src test/unit/specs test/e2e/specs"
  },
​
  "dependencies": {
    "vue": "^2.5.2",
    "vue-router": "^3.0.1"
  },
​
  "devDependencies": {
    "autoprefixer": "^7.1.5",
    "babel-core": "^6.26.0",
    "sw-precache-webpack-plugin": "^0.11.4",
    "babel-eslint": "^8.0.1",
    "babel-loader": "^7.1.2",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.6.0",
    "babel-preset-stage-2": "^6.24.1",
    "babel-register": "^6.26.0",
    "chalk": "^2.1.0",
    "connect-history-api-fallback": "^1.4.0",
    "copy-webpack-plugin": "^4.1.1",
    "css-loader": "^0.28.7",
    "cssnano": "^3.10.0",
    "eslint": "^4.9.0",
    "eslint-friendly-formatter": "^3.0.0",
    "eslint-loader": "^1.9.0",
    "eslint-plugin-html": "^3.2.2",
    "eslint-plugin-import": "^2.7.0",
    "eslint-plugin-node": "^5.2.0",
    "eslint-config-standard": "^10.2.1",
    "eslint-plugin-promise": "^3.6.0",
    "eslint-plugin-standard": "^3.0.1",
    "eventsource-polyfill": "^0.9.6",
    "express": "^4.16.2",
    "extract-text-webpack-plugin": "^3.0.0",
    "file-loader": "^1.1.5",
    "friendly-errors-webpack-plugin": "^1.6.1",
    "html-webpack-plugin": "^2.30.1",
    "http-proxy-middleware": "^0.17.4",
    "webpack-bundle-analyzer": "^2.9.0",
    "cross-env": "^5.0.5",
    "karma": "^1.7.1",
    "karma-coverage": "^1.1.1",
    "karma-mocha": "^1.3.0",
    "karma-phantomjs-launcher": "^1.0.4",
    "karma-phantomjs-shim": "^1.5.0",
    "karma-sinon-chai": "^1.3.2",
    "karma-sourcemap-loader": "^0.3.7",
    "karma-spec-reporter": "0.0.31",
    "karma-webpack": "^2.0.5",
    "mocha": "^4.0.1",
    "chai": "^4.1.2",
    "sinon": "^4.0.1",
    "sinon-chai": "^2.14.0",
    "inject-loader": "^3.0.1",
    "babel-plugin-istanbul": "^4.1.5",
    "phantomjs-prebuilt": "^2.1.15",
    "chromedriver": "^2.33.1",
    "cross-spawn": "^5.1.0",
    "nightwatch": "^0.9.16",
    "selenium-server": "^3.6.0",
    "semver": "^5.4.1",
    "shelljs": "^0.7.8",
    "opn": "^5.1.0",
    "optimize-css-assets-webpack-plugin": "^3.2.0",
    "ora": "^1.3.0",
    "rimraf": "^2.6.2",
    "url-loader": "^0.6.2",
    "vue-loader": "^13.3.0",
    "vue-style-loader": "^3.0.3",
    "vue-template-compiler": "^2.5.2",
    "webpack": "^3.7.1",
    "webpack-dev-middleware": "^1.12.0",
    "webpack-hot-middleware": "^2.19.1",
    "webpack-merge": "^4.1.0",
    "uglify-es": "^3.1.3"
  },
  "engines": {
    "node": ">= 4.0.0",
    "npm": ">= 3.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}
​
build/build.js
build/check-versions.js
build/dev-client.js
build/dev-server.js
build/load-minfied.js
build/service-worker-dev.js
build/service-worker-prod.js
build/utils.js
build/vue-loader.conf.js
build/webpack.base.conf.js
build/webpack.config.js
build/webpack.prod.conf.js
build/webpack.test.conf.js