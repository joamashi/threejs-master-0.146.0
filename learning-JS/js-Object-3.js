// <div id="div0">Click me! DIV 0</div>
// <div id="div1">Click me! DIV 1</div>
// <div id="div2">Click me! DIV 2</div>


for (var i = 0, len = 3; i < len; i++) {
    document.getElementById('div' + i).addEventListener('click', function () {
        i; // 3, 3, 3
    }, false);
}
​
​
​
// 함수를 활용한 문제해결
function setDivClick(index) {
    document.getElementById('div' + index).addEventListener('click', function () {
        index; // 0, 1, 2
    }, false);
}

for (var i = 0, len = 3; i < len; i++) {
    setDivClick(i);
}
​
​
​
// 클로저를 활용한 문제해결
for (var i = 0, len = 3; i < len; i++) {
    document.getElementById('div' + i).addEventListener('click', (function (index) {
        return function () {
            index // 0, 1, 2
        }
    }(i)), false);
}
​
​
​
// 0부터 9까지 더하여 총합이 16이 넘는 숫자를 구하기
for (var i = 0; i < 10; i++) {
    var total = (total || 0) + i;
    var last = i;

    total; // 0 1 3 6 10 15 21
    last; // 0 1 2 3 4 5 6

    if (total > 16) break;
}
total; // 21
​
​
try {
    throw new exception('fake exception');
} catch (err) {
    var test = 'can you see me';
    err instanceof ReferenceError === true; // true
}
test === 'can you see me';  // true
typeof err === 'undefined'; // true
​
​
​
'특정 함수가 참조하는 변수들이 선언된 렉시컬 스코프는 계속 유지된는데, 그 함수와 스코프를 묶어서 클로저라고 한다'

'클로저가 나타나는 가장 기본적인 환경은 스코프 안에 스코프가 있을 때, 즉 function 안에 function이 선언되었을 때이다.'

'반복적으로 같은 작업을 할 때, 같은 초기화 작업이 지속적으로 필요할 때, 콜백 함수에 동적인 데이터를 넘겨주고 싶을 때 클로저를 사용하자!'

function outer () {
    var count = 0;
    // console.log(1)
    var inner = function () {
        // console.log(2)
        return ++count;
    }
    return inner;
}
// outer()
// 1
// ƒ () {
//   console.log(2)
//   return ++count
// }

var increase = outer();
increase(); // 1
increase(); // 2
increase(); // 3
​
​
​
function outer2 () {
    var count = 0;
    return {
        increase : function () { // increase 증가
            return ++count;
        },
        decrease : function () { // decrease 감소
            return --count;
        }
    }
}

var counter = outer2();
counter.increase(); // 1
counter.increase(); // 2
counter.increase(); // 3
counter.decrease(); // 2

var counter2 = outer2(); // 별도의 스코프가 생성되어 변수가 따로따로 저장.
counter2.increase(); // 1
counter2.increase(); // 2
counter2.increase(); // 3
​
​
// 같은 값을 공유할 수 있도록 변수를 static 변수처럼 만들기
var count2 = 0;
function outer3 () {    
    return {
        increase : function () {
            return ++count2;
        },
        decrease : function () {
            return --count2;
        }
    }
}

var counter3 = outer3();
counter3.increase(); // 1
counter3.increase(); // 2

var counter4 = outer3();
counter4.increase(); // 3
counter4.increase(); // 4
​

// <button id="in1">Click me! in1 increase</button>
// <button id="in2">Click me! in1 decrease</button>
// <button id="in3">Click me! in2 increase</button>
// <button id="in4">Click me! in2 decrease</button>

​
var countFactory = (function () { // IIFE
    var count = 0;
    return function () {
        return {
            increase : function () {
                return ++count;
            },
            decrease : function () {
                return --count;
            }
        }
    }
}());

var counter5 = countFactory();
var counter6 = countFactory();

document.getElementById('in1').addEventListener('click', function () {
    counter5.increase();
}, false);

document.getElementById('in2').addEventListener('click', function () {
    counter5.decrease();
}, false);

document.getElementById('in3').addEventListener('click', function () {
    counter6.increase();
}, false);

document.getElementById('in4').addEventListener('click', function () {
    counter6.decrease();
}, false);
​
​
function sum (base) {
    var inClosure = base;
    return function (adder) {
        return inClosure + adder;
    }
}
var fiveAdder = sum(5);
fiveAdder(3); // 8
var threeAdder = sum(3);
threeAdder(1); // 4
