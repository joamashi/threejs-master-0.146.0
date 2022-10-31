var book = {
    title: "객체지향 자바스크립트의 원리",
    toString: function () {
        return "[Book" + this.title + "]"
    }
}
var message = "Book = " + book;
message; // Book = [Book객체지향 자바스크립트의 원리]

// console.log(Object.prototype) // {}

Object.prototype.add = function (value) {
    this // String {"title"}
    return this + value;
}
book.add(5); // [Book객체지향 자바스크립트의 원리]5
'title'.add("end"); // titleend

document.add(true); // titleend
window.add(5); // titleend

// -------------------------------------------------------------------------

var empty = {};
for (var property in empty) {
    empty // {}
    property // add

    if (empty.hasOwnProperty(property)) {
        property
    }
}

// -------------------------------------------------------------------------

var obj = new Object(); // var obj = {}
obj.title = '타이틀';

obj // {title: "타이틀"}

obj.hasOwnProperty('title'); // true
obj.isPrototypeOf(); // false
obj.propertyIsEnumerable(); // false

obj.toLocaleString(); // [object Object]
obj.toString(); // [object Object]

obj.valueOf(); // {title: "타이틀"}

'title' in obj; // true
obj instanceof Object; // true
obj.constructor === Object; // true


obj.sub = '서브';
obj; // {title: "타이틀", sub: "서브"}

// console.log(Object.prototype)
// console.log(Object.getPrototypeOf(obj))

// constructor
// hasOwnProperty
// isPrototypeOf
// propertyIsEnumerable
// toLocaleString
// toString
// valueOf
// __defineGetter__
// __defineSetter__
// __lookupGetter__
// __lookupSetter__
// get __proto__
// set __proto__

var obj3 = function () {
    this.title3 = '타이틀3';
}
var o = new obj3; // () 인자값 없으면 생략가능
o instanceof obj3; // true
o.constructor === obj3; // true
o.title3; // 타이틀3

// -------------------------------------------------------------------------

var greet = {
    runGreet: function () {
        this.name, arguments[0], arguments[1]
    }
}
var cody = { name: 'cody'};
greet.runGreet.call(cody, 'foo', 'bar1', 'bar2'); // cody foo bar1
greet.runGreet.call({ name: 'cody' }, 'foo', 'bar1', 'bar2'); // cody foo bar1

var lisa = { name: 'lisa'}
greet.runGreet.apply(lisa, ['foo', 'bar1', 'bar2']); // lisa foo bar1
greet.runGreet.apply({ name: 'lisa' }, ['foo', 'bar1', 'bar2']); // lisa foo bar1

// -------------------------------------------------------------------------

function R (length, width, height) {
    this.length = length;
    this.width = width;
    this.height = height;
}

R.prototype.getArea = function () {
    return this.length * this.width;
}

R.prototype; // {getArea: ƒ, constructor: ƒ}

function S (size) {
    this; // S {length: 6, width: 6, height: undefined}

    // R의 this값을 담아서 S의 값을 전달.
    // R.call(this, size, size);
    R.apply(this, [size, size]);
}

S.prototype = Object.create(R.prototype); // Object.create

S.prototype.toString = function () {
    return this.length + ', ' + this.width;
}

S.prototype; // R {toString: ƒ}

var A = new S(6);

A               // S {length: 6, width: 6}
A.prototype     // undefined
A.length        // 6
A.width         // 6
A.getArea()     // 36
A.toString()    // 6, 6

A.__proto__ // R {toString: ƒ}
A.__proto__.__proto__ // {getArea: ƒ, constructor: ƒ}

// -------------------------------------------------------------------------

$.print = function (message) {
    $(document).ready(function () {
        $('<div class="result"></div>').text(String(message)).appendTo('#results');
    })
}

// -------------------------------------------------------------------------

// 메서드 호출, 생성자 호출, 함수 호출

function doit () {
    fn(5, 4); // 함수 fn을 선언한 지점보다 앞에서 호출

    function fn () {
        $.print('called')
        $.print(arguments.length) // 2
        $.print(arguments[0]) // 5
    }
}
doit();
// called

// -------------------------------------------------------------------------

// 재귀 함수가 함상 자기 자신을 계속 호출하면 실행이 끝나지 않는다.(무한 루프)
function factorial (n) {
    if (n <= 1) return 1;
    else return n * factorial(n - 1);
}
factorial(5); // 5! = (5*4*3*2*1) = 120

// -------------------------------------------------------------------------

function make () {
    return function (x) { // 5, 4, 3, 2, 1
        if (x <= 1) return 1;
        return x * arguments.callee(x - 1);
    }
}
var result = make()(5);
result; // 120

// -------------------------------------------------------------------------

function sumTo (num) {
    if (num <= 1) return 1;
    else return num + sumTo(num - 1);
}
sumTo(5); // 15

// -------------------------------------------------------------------------

function sumTo (num) {
    if (num <= 1) return 1;
    else return num + arguments.callee(num - 1);
}
sumTo(5); // 15

// -------------------------------------------------------------------------

function outerFn () {
    'Outer-1'
    function innerFn () {
        'Inner-1'
    }
    innerFn();
}
outerFn();
// Outer-1
// Inner-1

// -------------------------------------------------------------------------

var globalVar
function outerFn () {
    'Outer-2'
    function innerFn () {
        'Inner-2'
    }
    globalVar = innerFn
}
outerFn();
globalVar();
// Outer-2 
// Inner-2

// -------------------------------------------------------------------------

function outerFn () {
    'Outer-3'
    function innerFn () {
        'Inner-3'
    }
    return innerFn;
}
var fnRef = outerFn();
fnRef();
// Outer-3
// Inner-3

// -------------------------------------------------------------------------

function outerFn () {
    function innerFn () {
        var innerVar = 0;
        innerVar++;
        innerVar;
    }
    return innerFn;
}
var fnRef2 = outerFn();
fnRef2();
fnRef2();
var fnRef3 = outerFn();
fnRef3();
fnRef3();
// 1
// 1
// 1
// 1

// -------------------------------------------------------------------------

var globalVar = 0;
function outerFn () {
    function innerFn () {
        globalVar++;
        globalVar;
    }
    return innerFn;
}
var fnRef4 = outerFn();
fnRef4();
fnRef4();
fnRef4();
var fnRef5 = outerFn​();
fnRef5();
fnRef5();
// 1
// 2
// 3

// 4
// 5

// -------------------------------------------------------------------------

function outerFn () {
    var globalVar = 0; // 부모 함수의 지역 변수

    // 내부 함수는 그 부모의 범위를 상속하고 있으므로 부모 함수의 변수를 참조
    function innerFn () {
        globalVar++;
        globalVar;
    }
    return innerFn;
}
var fnRef6 = outerFn();
fnRef6();
fnRef6();
fnRef6();
var fnRef7 = outerFn();
fnRef7();
fnRef7();
// 1
// 2
// 3

// 1
// 2


// 클로저 사이의 상호작용

// -------------------------------------------------------------------------

function T () {
    var a = 0;
    return function () {
        return ++a;
    }
}
var seq = T();
seq(); // 1
seq(); // 2
seq(); // 3
seq(); // 4
seq(); // 5
seq(); // 6
seq(); // 7

// -------------------------------------------------------------------------

function outerFn () {
    var outerVar = 0;

    // 두 개의 내부 함수는 같은 지역변수를 참조하며, 같은 변수범위를 공유한다.

    function innerFn_1 () {
        outerVar++;
        outerVar
    }

    function innerFn_2 () {
        outerVar += 2;
        outerVar
    }

    return {
        'fn1' : innerFn_1,
        'fn2' : innerFn_2
    }
}
var fnRef8 = outerFn();
fnRef8.fn1();
fnRef8.fn2();
fnRef8.fn1();
fnRef8.fn1();
var fnRef9 = outerFn();
fnRef9.fn1();
fnRef9.fn2();
fnRef9.fn1();
// 1
// 3
// 4
// 5

// 1
// 3
// 4

// -------------------------------------------------------------------------

function counter () {
    if (!arguments.callee.count) {
        arguments.callee.count = 0;
    }
    return console.log(arguments.callee.count++);
}
counter(); // 1
counter(); // 2 
counter(); // 3

// -------------------------------------------------------------------------

var setup = function () {
    console.log(1)

    return function () {
        console.log(2)
    }
}
var ms = setup(); // 1
var ms = setup(); // 1
ms(); // 2

// -------------------------------------------------------------------------

var setup2 = function () {
    var count = 0;
    count;

    return function () {
        // return console.log(count += 1)
        return ++count; // count += 1
    }
}
var next = setup2(); // 0
next(); // 1
next(); // 2
next(); // 3

setup2()(); // 0 1
setup2()(); // 0 1
setup2()(); // 0 1



// jQuery에서의 클로저

'$(document).ready()로 인자 전달하기'

'이벤트 핸들러'

'반복문에서 핸들러 연결하기'

'기명함수와 익명함수'

// 메모리 누수 위험

'우연한 순환 참조들'

'인터넷 익스플로러 메모리 누수 문제'