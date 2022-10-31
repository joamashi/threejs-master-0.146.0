"모듈 로더 - RequireJS"


"JavaScript 파일과 모듈 로더"
"브라우저에 최적화되어 있지만 Rhino나 NodeJS등의 환경에서도 사용"
"모듈 로더를 사용하면 당신의 코드의 성능과 품질이 좋아질 것"

// 자바스크립트 파일을 동적으로 로딩
// AMD 모듈화를 적용한 코드라면 모듈로서도 사용. 코드간의 의존성

// 코드가 실행되려면 다른 스크립트가 먼저 로딩되어야 한다거나 하는 경우가 있는데, 자칫 스크립트 로딩의 순서가 꼬일 경우 에러를 뱉어내며 동작하지 않을 수 있다. RequireJS를 사용하면 코드간 의존성을 줌으로서 아예 그러한 경우를 막을 수 있고, 좀 더 체계적인 소스코드를 만들어낼 수 있다. 장점만을 죽 늘어놓았는데 자세한건 좀 더 살펴보자.  

// ------------------------------------------------------------------------------

(function(exports) {
  "use strict";

  // private 변수
  var name = "I'am a module";

  // 외부에 공개할 public 객체
  var pub = {};

  pub.getName() {
    return name;
  }

  // 외부 공개
  exports.aModule = pub;

})(exports || global);

(exports || global).aModule.getName(); // I'm a module


// 이러한 구현은 변수를 private 화 할 수 있으며 그로 인한 캡슐화로 모듈 사용이 쉬운 장점이 있지만, 여러개의 모듈을 선언하면서 exports 객체에 프로퍼티가 겹칠 경우 앞서 선언된 공개 속성은 덮어써지는 문제가 있고, 모듈간 의존성이 있을때 의존성을 정의하기가 매우 어렵다. 

// 그리고 익명 함수와 exports 객체를 사용하는 애매한 코드로 인해 눈에 잘 들어오지 않는다. 이러한 경우를 해결하기 위해 여러 Module Loader가 공개되어 있는데, 그 중 하나가 RequireJS. RequireJS에서는 모듈의 고유성과 의존성을 잘 지원하고 있다. 

// RequireJS는 AMD 모듈 로딩 표준을 따르기에 기본적으로 모든 모듈이 비동기적이다.

// 모든 모듈은 비동기적으로 명시적으로 요청하거나 의존성이 있을 때 로딩(Lazy Loading) 된다. 필요한 자바스크립트 파일을 어플리케이션 시작 전 전부 로딩하지 않고, 실제 필요한 때 (사용자의 입력이나 메소드 호출 등의 특별한 경우) 에 로딩하게 할 수 있어서 전체적인 페이지의 속도 향상에도 도움이 된다.  

// ------------------------------------------------------------------------------

<script data-main="main" src="requirejs.js"></script> 

// 위 태그를 주의깊게 보면 data-main 이라는 속성에 main 이라는 값이 할당되어 있는데, 이 속성은 옵션으로 이 속성을 주게 되면 requirejs가 전부 로딩되면 저 경로의 속성 이름에 해당하는 파일을 자동으로 로딩한 뒤 실행한다. 

// 경로는 절대 경로가 아니면 requirejs 기준의 상대 경로를 따른다. 모든 모듈의 경로 또한 requirejs가 로딩되는 경로에 상대적이나, 나중에 설정을 통해 바꿀 수 있다.

// ------------------------------------------------------------------------------

"/js/controller/main.js"
"/js/controller/main"


// 일반적인 RequireJS 모듈 정의
define(function() {

  "use strict";

  var exports = {
    version: "1.0"
  };

  var private1 = "private1";
  var private2 = "private2";

  exports.doSomething = function() {};
  exports.stopSomething = function() {};

  return exports;
});

// 모듈의 정의에는 define 이라는 글로벌 함수를 사용하며 인자로 함수 하나를 받는데 그 함수에서 반환하는 객체가 모듈이 된다. 

// 인자 함수는 일종의 객체 팩토리인 셈이다. 

// JavaScript는 함수 자체가 스코프를 생성하므로 이 안에서 필요한 만큼의 private 를 선언하고, 외부 공개가 필요한 객체나 함수는 return 으로 반환하면 된다. 다수를 공개하고 싶다면 객체 형식으로 묶어 반환하면 된다. 정리해보면 다음과 같은 코드이다.

// 의존성이 없는 모듈의 정의
define(['팩토리 함수']);

// 분명 앞에서 RequireJS는 모듈간의 의존성을 정의하는 방법을 제공한다고 했다. 이대로는 아까 순수하게 JavaScript로 만든 모듈 코드와 별반 다를게 없어 보인다. 

// 물론 의존성을 줄 수 있다. 

// 팩토리 함수 앞 인자로 생성될 모듈이 "의존하고 있는 모듈 이름을 문자열로 담은 배열" 을 주면 된다.

// 의존성이 있는 모듈 정의
define(['의존 모듈 이름 배열'], ['팩토리 함수']);
/*
    /main.js
    /App.js
    /sub/Logger.js
    /sub/MainController.js
*/

// Logger.js
define(function() {

  "use strict";

  var console = global.console || window.console;
  
  var exports = {
    version: "0.1.0",
    author: "javarouka"
  };

  exports.log = function() {};

  return exports;
});

// 팩토리 함수 안에 var로 선언된 것들은 private 으로 내부에서만 사용하며, exports 객체의 속성으로 지정된 log 함수만 공개되어 외부에서는 log를 통해 이 모듈을 사용할 수 있다. 

// MainController.js / @dependency Logger.js
define(["sub/Logger"], function(logger) {

  "use strict";

  var exports = {
    type: "controller",
    name: "Main"
  };

  var bindEvent = function() {
    logger.log("bind event...")
  };

  var view = function() {
    logger.log("render ui");
  };

  exports.execute = function(routeParameters) {
    logger.log(exports.name + " controller execute...");
  }

  return exports;
}); 
// 팩토리 함수 앞에 인자로 의존성 모듈의 이름 배열을 주는데 상대 경로일 경우 
// .js 확장자를 생략해야 한다. "sub/Logger" 라고 주면 된다. 

// 주게 되면 팩토리 함수의 인자로 전달되는데 배열에 지정한 순서대로 전달

// ApplicationContext.js / @dependency sub/MainController.js
define(["sub/MainController"], function(main) {
  "use strict";
});

/*
    Logger.js
    MainController.js
    App.js
*/
// 순서대로 로딩되게 될 것이다. 

// main.js / @dependency App.js, sub/Logger.js
require(["App", "sub/Logger"], function(app, logger) {

  "use strict";

  app.start();
  logger.log("Application start");

}, 
function(err) {
  // ERROR handling
}); 
// 모듈 정의가 아닌 단순히 코드를 실행할 때는 require 함수를 사용한다. 

// require는 define과 비슷하게 첫번째 인자로 의존성, 두번째 인자로 실행 코드 함수, 세번째 인자는 옵션으로 에러 핸들러

// 실행 코드 함수에서 코드상에서 잡을 수 있는 오류가 나거나, 로딩에 실패할 경우 실행된다.  

// 여기서 짚고 넘어갈 것이 있다. Logger.js 는 두 부분에서 의존성이 있다. 

// 이 경우에는 먼저 로딩되는 모듈이나 코드에서 한번 로딩되면, 그 다음에는 모듈을 다시 로딩하지 않고 로딩된 모듈을 다시 사용한다. 

// Java Spring의 싱글톤 레지스트리와 살짝 비슷하다.

// define: 모듈을 정의할 때
// require: 정의된 모듈에 의존성을 주는 코드를 작성할 때



"환경설정"
// 이 코드를 RequireJS가 로딩된 뒤 기타 모듈을 로딩하기 전에 둔다

require.config({
  // 모듈을 로딩할 기본 패스를 지정
  baseUrl: "/js/some/path",

  // 모듈의 기본 패스. 모듈의 이름과 실제 경로를 매핑할 수 있어 별칭(alias) 기능
  paths: {
    // 이 모듈은 /js/some/path/module/javarouka.js 경로
    "javarouka": "modules/javarouka",

    // 모듈 패스를 배열로 주게 되면 먼저 앞의 URL로 로딩해보고 안되면 다음 경로에서 로딩
    // CDN 등을 사용할 때 좋다.
    "YIHanghee": [
      "https://cdn.example.com/YIHanghee",
      "modules/YIHanghee"
     ]
  },
  
  // 모듈의 로딩 시간을 지정. 
  // 이 시간을 초과하면 Timeout Error 가 throw
  waitSeconds: 15
});


// 구 소스코드(global-traditional)와 같이 사용하는 법 - Shim


requirejs.config({
  paths: {
    // jquery 로딩 시 필요한 경로를 지정
    'jquery': [ 
      '/js/jquery', 
      '//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min' 
    ],
    // underscore
    'underscore': [ 
      '/js/underscore.min', 
      '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min' 
    ],
    // backbone
    'backbone': [
      'js/backbone.min',
      '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min'
    ]
  },
  shim: {
    // underscore에 대한 shim 속성을 정의
    'underscore': {
      // 반환될 객체는 exports속성으로 정의
      // underscore는 아래와 같은 _ 이름으로 공개되는 것이 사용이 직관적
      exports: function() { return _; }
    },
    
    // shim 속성의 키로 모듈 이름을 지정하고 내부 속성을 나열
    // backbone은 underscore와 jquery 에 의존성
    'backbone': {
      // 백본이 의존하는 underscore와 jquery를 deps 속성에 정의
      // 이름은 위에 이미 지정한 별칭(키 이름)으로 해도 된다.
      deps: ['underscore', 'jquery'],
      // 반환될 객체를 정의한다.
      // 문자열로 줄 경우,
      // 글로벌 객체에서 저 속성을 키로 하는 객체가 모듈이 된다.
      // 함수를 줄 경우,
      // 함수의 실행 결과로 리턴되는 객체가 모듈이 된다.
      exports: 'Backbone'
    }
  }
}); 
// 모듈이 로딩될 경로를 paths 속성의 키로 정의한 뒤 shim 속성에서 정의한 코드에 대한 의존성을 정의 

// Backbone.js은 jQuery 와 Underscore.js 에 의존성이 있어서 반드시 순서대로 로딩

// "backbone" 키로 지정된 deps 속성에는 앞에서 했던 define 처럼 배열 형태로 의존성을 정의하고, exports 속성으로 팩토리 함수를 정의

//  "backbone" 이라는 모듈 이름으로 RequireJS 모듈처럼 사용
// exports 속성에 문자열을 주면 그 문자열에 해당하는 전역의 속성이 define에서 팩토리 함수에서 리턴하는 객체가 되며, 함수를 줄 경우 반환되는 객체를 지정

// exports에 함수를 지정하는 경우는 팩토리 함수와 동일하게 이 shim 모듈이 반환하는 모듈을 조정할 때 유용 

// prototype.js와 jQuery를 같이 사용할 경우에는 $ 변수 충돌이 일어나므로 반드시 jQuery에서 prototype.js를 로딩하기 전에 jQuery.noConflict 를 호출


// 이럴 경우 RequireJS에서는
"jquery": {
  exports: function() {
    var jQuery = jQuery.noConflict();
    return jQuery;
  }
},
"prototype": {
  deps: [ "jquery" ],
  exports: "$"
} 
// 과 같은 방식을 적용할 수 있겠다. 두 모듈이 안전하게 로딩


// JavaScript 는 사용하기 편한만큼 편함에 너무 의존하다보면 돌이킬 수 없는 스파게티코드나 중복 코드 발생이 많아질 수 있다. 

// RequireJS는 이러한 경우의 한 대안이 될 수 있으며, 모듈 프로그래밍을 통해 좀 더 체계적인 프로그래밍을 가능하게 해 주며, 브라우저 지원도 IE6 이상부터 지원하는 괜찮은 호환율을 보여준다. 

// 혹시 스파게티, 반복 코드가 보인다면, 바로 RequireJS를 한번 고려


// ------------------------------------------------------------------------------


requirejs.config({
  // 파일이 있는 기본 경로를 설정
  // 만약 data-main 속성이 사용되었다면, 그 경로가 baseUrl
  // data-main 속성은 require.js를 위한 특별한 속성으로 require.js는 스크립트 로딩을 시작하기 위해 이 부분을 체크한다.
  baseUrl:'js', // 'js' 라는 폴더를 기본 폴더로 설정
 
  // path는 baseUrl 아래에서 직접적으로 찾을 수 없는 모듈명들을 위해 경로를 매핑해주는 속성
  // "/"로 시작하거나 "http" 등으로 시작하지 않으면, 기본적으로는 baseUrl에 상대적으로 설정
  // paths: { "exam": "aaaa/bbbb"}

  // 의 형태로 설정한 뒤에, define에서 "exam/module" 로 불러오게 되면, 스크립트 태그에서는 실제로는 src="aaaa/bbbb/module.js"
  // path는 또한 아래와 같이 특정 라이브러리 경로 선언을 위해 사용될 수 있는데, path 매핑 코드는 자동적으로 .js 확장자를 붙여서 모듈명을 매핑
  paths: { // .js 생략
    'text': '../lib/require/text',
    'jquery': '../lib/jquery/jquery-1.7.min',
    'angular': '../lib/angular/angular-1.0.4'
  },

  // AMD 형식을 지원하지 않는 라이브러리의 경우 아래와 같이 shim을 사용해서 모듈
  shim: {
    'angular': {
      deps: ['jquery'], // angular가 로드되기 전에 jquery가 로드
      exports: 'angular' // 로드된 angular 라이브러리는 angular 라는 이름의 객체로 사용
    }
  }
});


// ------------------------------------------------------------------------------

 
// requireJS를 활용하여 모듈 로드
requirejs([
  // 디펜던시가 걸려있으므로, 이 디펜던시들이 먼저 로드된 뒤에 아래 콜백이 수행
  'text', // 미리 선언해둔 path, css나 html을 로드하기 위한 requireJS 플러그인
  'jquery',// 미리 선언해둔 path, jQuery는 AMD를 지원하기 때문에 이렇게 로드해도 jQuery 또는 $로 호출할 수 있다.
  'angular'// 미리 선언해둔 path
  ],
  function (text, $, angular) { // 디펜던시 로드뒤 콜백함수. 로드된 디펜던시들은 콜백함수의 인자
    // 이 콜백 함수는 위에 명시된 모든 디펜던시들이 다 로드된 뒤에 호출
    // 주의해야할 것은, 디펜던시 로드 완료 시점이 페이지가 완전히 로드되기 전 일 수도 있다는 사실
    // 이 콜백함수는 생략 가능
    
    // 페이지가 완전히 로드된 뒤에 실행
    $(document).ready(function(){
      var jQuery=$;
      alert($().jquery);
    });
  }
);


// ------------------------------------------------------------------------------