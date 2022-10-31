$ babel test.js -o test.out.js
$ babel test.js -o test.out.js -w // -w 감시. 실행된 상태..
$ babel src -o dest -w // 디렉토리 감시
$ babel src -d dest -w --compact=true // 압축.축약


// const x3 = (n) => n * 3
"use strict"
var x3 = function x3 (n) {
  return x * 3
}


$ npm run watch // "watch" : babel src -d dest -w --compact=true --source-maps
$ npm run compile // "compile" : $ babel src -d dest --compact=true --source-maps

$ which npm
// /usr/local/bin/npm

$ which node
// /usr/local/bin/node

$ which babel
// /usr/local/bin/babel

$ babel --version
// 6.26.0

$ npm install -g babel-cli
$ npm install bable -preset-es2015
babel test.js --presets=es2015 // ES2015로 변환
balel tess.js --presets=es2015 -o test.out.js // ES2015로 변환 후 별도 파일 분리

$ npm install --seve-dev babel-cli
$ npm install --seve-dev babel-preset-es2015 


// .babelrc
{"presets":["es2015"]}