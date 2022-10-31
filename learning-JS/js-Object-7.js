/** 
* 나의 자바스크립트 애플리케이션 
* 
* @module : MODULE 
*/
var MODULE = {};

this;

var myglobel = 'globel';
window.myglobel;
window['myglobel'];
this.myglobel;

function foo () {
    var a = b = 0;
    console.log(a)
    console.log(b)
}
foo();
window.a; // undefined
window.b; // 0

// -------------------------------------------------------------------------

function add () {
    var sum = 0 // 초
    for (var i = 0, j = arguments.length; i < j; i++) {
        sum += arguments[i];
    }
    return sum;
}
add(2, 3, 4, 5); // 14

function add(arr) {
    var sum = 0;
    for (var i = 0, j = arr.length; i < j; i++) {
        sum += arr[i];
    }
    return sum / arr.length; // 14 / 4
}
add([2, 3, 4, 5]); // 3.5

// -------------------------------------------------------------------------

function M (first, last) {
    return {
        first: first,
        last: last
    }
}

function E (P) {
    P // {first: "park", last: "young"}
    return P.first + ', ' + P.last;
}

var sx = M('park', 'young');
sx; // {first: "park", last: "young"}

E(sx); // park, young
E({ first: "park", last: "young" }); // park, young

// -------------------------------------------------------------------------

var global_1 = 1;
​
globel_2 = 2;

(function () {
    globel_3 = 3;
}());

delete globel_1;
delete globel_2;
delete globel_3;

typeof global_1; // number
typeof global_2; // undefined
typeof global_3; // undefined

// -------------------------------------------------------------------------

// for-in 배열이 아닌 객체를 순회할 때 사용
var man = { hands:2, legs:2, heads:1};
for (var i in man) {
    // if ( man.hasOwnPorperty(i)) {
    i, " : ", man[i];
    // }

    // hands: 2
    // legs: 2
    // heads: 1
}

// -------------------------------------------------------------------------

var setup3 = function () {
    return 9-10;
}
var na = setup3(); // -1. 함수 실행해서 전달
na(); // Uncaught TypeError: na is not a function at
​
​
var setup3 = function () {
    return 9-10;
}
var na = setup3;
na(); // -1

// -------------------------------------------------------------------------

({
    max : 100,
    init: function () {
        this.max
    }
}).init(); // 100

// -------------------------------------------------------------------------

'메모이제이션 패턴 - 함수에 프로퍼티를 추가하여 반환값을 캐시하여 다음 호출 시점에 복잡한 연산을 반복하지 않을 수 있다'
// 코드의 실행속도를 높이는 데 도움.

// -------------------------------------------------------------------------

var conf = { name: 'batman', first: 'Bruce', last: 'Wayne'};
function addFun (conf) {
    conf.name; // batman
}
addFun(conf);
addFun({ name: 'batman', first: 'Bruce', last: 'Wayne'});

// -------------------------------------------------------------------------

// 커리.Curry
var sayHi = function (who) {
    return who;
}
sayHi(); // undefined
sayHi('world'); // world
sayHi.apply(null, ['world']); // world

// 첫 번째 인자가 null이면 this는 전역 객체를 가리킨다
// 함수가 객체의 메서드일 때는 null을 전달하지 않는다

// -------------------------------------------------------------------------

// 커링.Curring == 원본 함수와 매개변수 일부를 물려받은 새로운 한수를 생성.
// 어떤 함수를 호출할 때 대부분의 매개변수가 항상 비슷하다면, 커링의 적합한 후보라고 할 수 있다.
// 매개변수 일부를 적용하여 새로운 함수를 동적으로 생성하면 이 함수는 반복되는 매개변수를 내부적으로 저장하여 
// 매번 인자를 전달하지 않아도 운본 함수가 기대하는 전체 목록을 미리 채워놓을 것이다.

// -------------------------------------------------------------------------

1 == true; // true
1 === true; // false
​
// false, 0, '', NaN, null, undefined

10 > 1 ? 'yes' : 'no'; // yes

var os = {
    'a': {
        'b' : 10
    }
}
os['a']['b']; // 10
os.a.b;

// -------------------------------------------------------------------------

var a = [1, 2, 3];

for (var i = 0; i < a.length; i++) {
    i; // 0, 1, 2
}

for (var i = 0, len = a.length; i < len; i++) {
    i; // 0, 1, 2
}

for (var i = 0, len; len = a[i]; i++) {
    i; // 0, 1, 2
}

for (var i in a) {
    i; // 0, 1, 2
}

// -------------------------------------------------------------------------

[].concat();  // 해당 배열에 지정한 항목들을 추가한 새로운 배열을 돌려줌
[].pop();     // 마지막 항목을 제거한 다음 돌려줌
[].push();    // 마지막에 하나 이상의 항목을 추가
[].slice();   // 배열의 일부분을 돌려줌
[].sort();    // 기교에 사용할 함수를 따로 지정할 수 있다
[].splice();  // 구역을 삭제하거나 항목을 추가해서 배열을 수정할 수 있다
[].unshift(); // 배열의 시작부분에서 항목을 붙일 수 있다