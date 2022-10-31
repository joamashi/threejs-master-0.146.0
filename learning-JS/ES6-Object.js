“__proto__”
// 전역 Object 객체에 새로운 프로퍼티 추가
// 자바스크립트 객체는 프로토타입, 즉 자신이 상속한 객체를 참조하기 위해 내부에 프로퍼티를 둔다.

var x = {x:12};
var y = Object.create(x, {y: {value:13}});

y.x // 12
y.y // 13

let a = {a:12, __proto__: {b:13}};
a.a // 12
a.b // 13


Object.is(value1, value2)
// 동등 여부를 판단. === 연산자와 비슷

Object.is(0, -0)    // false
0 === -0            // true
Object.is(NaN, 0/0) // true
NaN === 0/0        // false
Object.is(NaN, NaN) // true
NaN === NaN        // false


Object.setPrototypeOf(object, prototype)
// 프로퍼티 값을 할당하는 메서드

let x = {x:12};
let y = {y:13};

Object.setPrototypeOf(y, x);

y.x // 12
y.y // 13


Object.assign(targetObj, sourceObjs...)
// 하나, 또는 그 이상의 소스 객체에서 모든 열거 가능한 자기 프로퍼티들을 타깃 객체로 복사하고 이 타깃 객체를 반환

let x = {x:12};
let y = {y:13,__proto__:x};
let z = {z:14, get b() { return 2;}, q: {}};

Object.defineProperty(z, ‘z’, {enumerable: false});

let m = {};

Object.assign(m,y,z);

m.y        // 13
m.z        // undefined
m.b        // 2
m.x        // undefined
m.q == z.q  // true

// 소스의 게터getter, 타깃의 세터setter를 호출.
// 소스 프로퍼티 값을 타깃 객체의 새로운, 또는 이미 존재하는 프로퍼티에 할당하는 기능이 전부
// 소스의 프로퍼티는 복사하지 않는다.
// 자바스크립트에서 프로퍼티명은 문자열 아니면 심볼인데 Object.assign()은 둘 다 복사
// 소스의 프로퍼티 정의부는 복사되지 않으므로 필요 시 Object.getOwnPropertyDescriptor(), Object.defineProperty()를 대신 사용
// null 또는 undefined 값이 키는 복사하지 않고 건너뛴다.