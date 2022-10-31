
// ---------------------------------------------------------------------

'템플릿 리터럴'

var d1 = new Date();
var name3 = "홍길동";
var r1 = `${name3} 님에게 ${d1.toDateString()}에 연락했다`;
r1 // 홍길동 님에게 Sun Nov 19 2017에 연락했다

// 유니코드 이스케이프 형식으로 변환

var product = "갤럭시S7";
var price = 199000;
var str = `${product}의 가격은 ${price}원 입니다`;
str; // 갤럭시S7의 가격은 199000원 입니다

// ---------------------------------------------------------------------

'컬렉션'

var s1 = new Set();
s1.add("사과");
s1.add("배");
s1.add("사과");
s1.add("포도");
s1 // Set { '사과', '배', '포도' }

var john = new Set(["사과", "포도", "배"]);
var susan = new Set(["파인애플", "키위", "배"]);

// 합집합 
var union = new Set([...john.values(), ...susan.values()])
union // Set { '사과', '포도', '배', '파인애플', '키위' }

// 교집합
var intersection = new Set([...john.values()].filter(e => susan.has(e)))
intersection// Set { '배' }

// 차집합 
var diff = new Set([...john.values()].filter(e => !susan.has(e)))
diff // Set { '사과', '포도' }


let teams = new Map()
teams.set('LG', '트윈스')
teams.set('삼성', '라이온스')
teams.set('NC', '다이노스')
teams.set('기아', '타이거스')
teams.set('한화', '이글즈')
teams.set('롯데', '자이언츠')

teams.has("SK") // false
teams.get("LG") // 트윈스

// ---------------------------------------------------------------------

'Module : export / import'

let var1 = 1000
function add(a, b) {
  return a + b;
}
export { var1, add }
import { add, var1 } from './utility2'
add(4, 5) // 9
var1 // 1000


export let var11 = 1000
export function add22 (a, b) {
  return a + b
}
import { add22, var11 as v } from './utility1'
add22(4, 5) // 9
v // 1000


let calc = {
  add(x, y) {
    return x + y
  },
  multiply(x, y) {
    return x * y
  }
}
export default calc
import calc from './utility3'
calc.add(4, 5) // 9
calc.multiply(4, 5) // 20

// ---------------------------------------------------------------------



  // ---------------------------------------------------------------------

  "Destructuring 기능"
  // 객체 표현식을 통해 변수들을 매핑하여 할당
  
  // ---------------------------------------------------------------------
  
  "함수 인자 기능 확대"
  // 인자 기본값 설정, 가변 인자 기능 확대
  
  // ---------------------------------------------------------------------
  
  "lterator와 for-of 기능"
  // lterator 속성 정의 기능과 for-fo 추가 키워드 정의, lterator 속성을 간단하게 정의하기 위한 function과 yield 키워드
  
  // ---------------------------------------------------------------------
  
  "Map과 Set 기능 추가"
  // Map과 Set 키워드와 WeakMap, WeakSet 키워드
  
  // ---------------------------------------------------------------------
  
  "Binary / Octal 표현식"
  // 2진수, 8진수 표현식
  
  0b1001101010 === 618 // binary
  0o1152 === 618 // octal
  0x264 === 618 // hex
  
  // ---------------------------------------------------------------------
  
  "TypedArray 기능"
  // 형식 기반 배열 기능
  
  // ---------------------------------------------------------------------
  
  "모듈 기능 표준화"
  // 모듈 관리를 위한 export, import 표준
  
  // ---------------------------------------------------------------------
  
  "Proxy 프락시 모듈"
  // 객체 가상화 또는 Proxy 패턴의 다양한 기능을 기본 표준
  
  var target = { u: 'Hello, U'}
  var proxy = new Proxy(target, {
    get (target, name) {
      return name in target ? target[name] : `${name}`
    },
    set (target, name, value) {
      if (name === 'age') {
        if (typeof value === 'number') {
          target[name] = value
        } else {
          console.log('Wrong type, must be number')
        }
      }
    }
  })
  
  proxy.u // Hello, U
  // target: { u: 'Hello, U' }
  // name: u
  
  proxy.park // park
  // target: { u: 'Hello, U' }
  // name: park
  
  // ---------------------------------------------------------------------
  
  "Symbol 모듈"
  // 새로운 기본형에 대한 정의 기능
  
  // ---------------------------------------------------------------------
  
  "Promise 모듈"
  // 특정 함수 호출이나 연산이 비동기로 이루어져서 앞으로 완료되었을 때, 이후에 처리할 함수나 에러를 처리하기 위한 함수를 설정하는 모듈
  
  function sendMsg (msg, timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(msg)
      }, timeout)
    })
  }
  
  var sn = sendMsg('Hello, ', 1000)
  sn.then(
    (msg) => sendMsg(`${msg} World`, 2000)
  ).then(
    (msg) => {
      `${msg}! All done` // Hello,  World! All done
    }
  )
  
  // ---------------------------------------------------------------------
  
  "기존 추가 API"
  // Math, Number, String, Array, Object
  
  var array = ['a', 'b', 1, 2, NaN]
  array.indexOf('a') >= 0     // true
  array.indexOf(2) !== -1     // true
  array.indexOf(NaN) !== -1   // false
  
  array.includes('a')         // true
  array.includes(2)           // true
  array.includes(NaN)         // true
  
  var squareRootOfTwo = Math.pow(2, 0.5)  // 1.4142135623730951
  var cubeTwo = Math.pow(2, 3)            // 8
  
  // 지수 연산자
  var squareRootOfTwo = 2 ** 0.5          // 1.4142135623730951
  var cubeTwo = 2 ** 3                    // 8