“모듈러 프로그래밍은 프로그램과 라이브러리를 모듈 단위로 잘개 나누는 행위”

“모듈은 하위 모듈로 더 잘게 나뉘어지므로 모듈 간 계층 관계가 형성”

// 코드를 여러 모듈로 분리하여 깔끔하게 구획하고 조직화
// 전역 스코프를 통해 인터페이스하지 않고 모듈 각자 자신의 스코프를 가지므로 전역 변수 사용을 줄일 수 있고 그로 인한 문제점을 예방
// 타 프로젝트에서도 똑같은 모듈을 임포트하여 사용할 수 있으므로 코드 재사용
// 특정 모듈에 버그가 한정되므로 디버깅이 쉽다.


“즉시 실행 함수 표현식”

    (function (window) {

        var sum = function (x,y) {
            return x + y;
        }

        var sub = function (x,y) {
            return x - y;
        }

        var math = {
            findSum: function (a,b) {
                return sum(a,b);
            },
            findSub: function (a,b) {
                return sub(a,b);
            }
        }

        window.math = math;
    })(window);

    math.findSum(1,2); // 3
    math.findSub(1,2); // -1


“비동기 모듈 정의 AMD”
// RequireJS 가장 잘 알려진 AMD 라이브러리. 리콰이어JS.

// 리콰이어JS 라이브러리의 모듈을 생성/임포트. math.js

    define(function () {
        var sum = function (x,y) {
            return x + y;
        }

        var sub = function (x,y) {
            return x - y;
        }

        var math = {
            findSum: function (a,b) {
                return sum(a,b);
            },
            findSub: function (a,b) {
                return sub(a,b);
            }
        }

        return math;
    });

// 첫 번째 파라미터 취급할 파일명. 확장자 js는 리콰이어js가 파일명에 알아서 붙는다.
// 두 번째 파라미터 math는 익스포트한 변수
// 모듈은 비동기적으로 임포트되고 콜백 또한 비동기적으로 실행

    require([‘math’], function (math) {
        math.findSum(1,2); // 3
        math.findSub(1,2); // -1
    })




“커먼JS”
// 노드JS에서 모듈을 구현하는 명세서
// 각 모듈은 개별 파일로 구현하며 비동기적으로 임포트

    // math.js
    var sum = function (x,y) {
        return x + y;
    }

    var sub = function (x,y) {
        return x - y;
    }

    var math = {
        findSum: function (a,b) {
            return sum(a,b);
        },
        findSub: function (a,b) {
            return sub(a,b);
        }
    }

    exports.math = math;

    var math = require(‘./math’).math;
    math.findSum(1,2); // 3
    math.findSub(1,2); // -1



“만등 모듈 정의 UMD”

    (function (root, factory) {
        // 환경 파악
        if (typeof define === ‘function’ && define,amd) {
            define([], factory);
        } else if (typeof exports === ‘object’) {
            module.exports = factory();
        } else {
            root.returnExports = factory();
        }
    }(this, function () {
        // 모듈 정의

        var sum = function (x,y) {
            return x + y;
        }

        var sub = function (x,y) {
            return x - y;
        }

        var math = {
            findSum: function (a,b) {
                return sum(a,b);
            },
            findSub: function (a,b) {
                return sub(a,b);
            }
        }

        return math;
    }));



// ES6 모듈은 모듈마다 개별 js 파일에서 자바스크립트 코드로 구현하며 원하는 개수만큼 변수를 익스포트할 수 있다.


“ES6 모듈 생성”

    // 변수를 익스포트
    export {var}

    // 변수를 여럿 익스포트
    export {var1, var2, var3}

    // 변수를 다른 이름으로 익스포트
    export {var as myvariableName}

    // 여러 변수를 상이한 별명으로 익스포트
    export {var1 as var1, var2 as var2}

    // 기본 별명을 쓴다
    export {var as default}

    // 기본 별명을 쓴다
    export {var as default, var1 as myvariableName1, var2}

    // 변수 이름 대신 표현식을 넣는다
    export default function () {}

    // 하위 모듈에서 익스포트한 변수를 익스포트
    export {var1, var2} from “myAnotherModule”

    // 하위 모듈에서 익스포트한 모든 변수를 익스포트
    export * from “myAnotherModule”;


    // 모듈 내에서 export 문은 무제한 사용할 수 있다.

    // 그때그때 변수를 익스포트하는 건 불가능

    // if...else 조건문에 export 문을 쓰면 에러가 난다.

    // 모듈 구조는 정적이라고, 즉 익스포트는 컴파일 시점에 결정된다

    // 똑같은 변수명/별명을 계속 익스포트할 수는 없지만 동일한 변수를 서로 다른 별명으로 여러 번 익스포트하는 건 가능

    // 모듈 코드는 엄격 모드로 실행

    // 익스포트한 변수값은 자신을 익스포트한 모류 내에서 변경할 수 있다.



“ES6 모듈 임포트”

    // 기본 별명을 임포트. x는 기본 별명의 별명
    import x from “module-relative-path”;

    // x를 임포트
    import {x} from “module-relative-path”;

    // x2는 x1의 별명
    import {x1 as x2} from “module-relative-path”;

    // x1, x2를 임포트
    import {x1, x2} from “module-relative-path”;

    // x1, x2를 임포트, x3, x2의 별명
    import {x1,x2 as x3} from “module-relative-path”;

    // x1, x2와 별명을 임포트, x는 기본 별명의 별명
    import x, {x1, x2} from “module-relative-path”;

    // 그냥 모듈을 임포트. 모듈에서 익스포트된 변수는 전혀 임포트하지 않는다.
    import “module-relative-path”;

    // 변수 전체를 임포트한 뒤 x라는 객체로 감싼다. 기본 별명도 임포트
    import * as x from “module-relative-path”;

    // 기본 별명에 별명을 줬다
    import x1, * as x2 from “module-relative-path”;


    // 변수를 별명으로 임포트하면 해당 변수는 실제 변수명이 아닌, 별명으로 참조해야 한다. 즉, 실제 변수명은 가려지고 별명만 보이는 셈이다.

    // import 문은 익스포트된 변수의 사본을 임포트하는 게 아니다. 오히려 변수를 임포트하는 프로그램의 스코프에서 쓸 수 있는 변수가 된다. 
    // 따라서 모듈 내에서 익스포트된 변수를 고치면 이 변수를 임포트한 프로그램에도 반영된다

    // 임포트한 변수는 읽기 전용이므로 이를 익스포트한 모듈의 스코프를 벗어나 위치에서 할당은 불가능

    // 모듈은 자바스크립트 엔진의 단일 인스턴스에서 딱 한번 임포트할 수 있다. 다시 임포트하려고 하면 앞에서 임포트한 모듈 인스턴스를 재사용

    // 모듈은 그때그때 임포트할 수 없다.

    // if...else 조건문에 import문을 쓰면 에러

    // 모듈 구조는 정적이라고, 즉 임포트는 컴파일 시점에 결정

    // ES6 임포트는 자바스크립트 자체 기능이고 모듈 임포트와 변수 익스포트는 곹 바로 결정되지 않기 때문에 AMD, 커먼JS의 임포트보다 빠르다. 
    // 따라서 자바스크립트 엔진이 성능 최적화를 수행하기가 유리.



“모듈 로더”

    // 모듈 임포트를 하는 자바스크립트 엔진 콤포넌트

    // import 문은 내장 모듈 로더로 모듈을 임포트한다.

    // 내장 모듈 로더는 자바스크립트 환경마다 로딩 체계가 제각각.

    // 브라우저에서 모듈을 임포트하면 서버에서 모듈이 로딩되지만 노드JS 환경에서는 파일시스템에서 로딩

    // 모듈 로더는 다양한 환경에서 서로 다른 방식으로 성능을 최적화하는 방향으로 모듀을 로딩

    // 브라우저는 모듈 로더가 로딩 도중 웹 페이지 로딩을 차단하지 않게 모듈을 비동기적으로 로딩/실행

    // 모듈 로더 API를 이용하면 모듈 로딩을 가로채고 그때그때 모듈을 가져오는 등 커스터마이징해서 내장 모듈 로더와 프그로그램 연동
​
​