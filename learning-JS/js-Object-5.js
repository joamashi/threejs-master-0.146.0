var data = {
    '_id': 'mspark11',
    'name': '박명수',
    'phones': ['010-2323-0200', '02-2214-2342'],
    'title': '수석 컨설턴트',
    'hiredate': new Date('2010-09-01')
}

// 데이터를 문자열로 변환
var str = JSON.stringify(data, function (key, value) {
    if (key == 'hiredate') {
        return new Date(value).getTime();
    } else {
        return value;
    }
});

/**
 *  key :
     value :  {_id: "mspark11", name: "박명수", phones: Array(2), title: "수석 컨설턴트", hiredate: Wed Sep 01 2010 09:00:00 GMT+0900 (대한민국 표준시)}
    key :  _id
    value :  mspark11
    key :  name
    value :  박명수
    key :  phones
    value :  (2) ["010-2323-0200", "02-2214-2342"]0: "010-2323-0200"1: "02-2214-2342"length: 2__proto__: Array(0)
    key :  0
    value :  010-2323-0200
    key :  1
    value :  02-2214-2342
    key :  title
    value :  수석 컨설턴트
    key :  hiredate
    value :  2010-09-01T00:00:00.000Z 
* 
*/

console.log(str); // '{"_id":"mspark11","name":"박명수","phones":["010-2323-0200","02-2214-2342"],"title":"수석 컨설턴트","hiredate":1283299200000}'

// -------------------------------------------------------------------------

var json = '{"_id":"mspark22","name":"박명수","phones":["010-2323-0200","02-2214-2342"],"title":"수석 컨설턴트","hiredate":1283299200000}'

// 문자열을 자바스크립트의 데이터로 변환
var p2 = JSON.parse(json, function (key, value) {
    if ( key == 'hiredate') {
        return new Date(value);
    } else {
        return value;
    }
});

console.log(p2); // {_id: "mspark22", name: "박명수", phones: Array(2), title: "수석 컨설턴트", hiredate: Wed Sep 01 2010 09:00:00 GMT+0900 (대한민국 표준시)}

// -------------------------------------------------------------------------

// 함수 단위의 변수 관리 . 함수 단위로 유효범위(scope)가 설정
var x = "global";
function f () {
    x; // global
}
// f()

// -------------------------------------------------------------------------

// 실행시의 변수 관리는 렉시컬(lexical) 영역을 기준으로
function f2 () {
    x; // undefined
    var x = "local";
    x; // local
}
// f2()

// -------------------------------------------------------------------------

// 변수의 유효범위는 실행 중에 설정되는 것이 아닌, 정의될때의 함수 단위로 설정
// 하위함수에서 상위함수로의 부모 / 자식 관계가 정의된 것 - 스코프 체인
var a = 1;
function f3 () {
    if(true) var c = 2;
    return c; // 2
}
// f3() 

// -------------------------------------------------------------------------

var o1 = { val1:1, val2:2, val3:3};
var o2 = { v1:10, v2:50, v3:100, v4:25};

function sum (a1, a2) {
    var  _sum = 0;

    this; // { val1:1, val2:2, val3:3}), { v1:10, v2:50, v3:100, v4:25}

    a1; // 7, 17, 27, 37
    a2; // 8, 18, 28, 38

    for (name in this) {
        _sum += this[name];
    }

    return _sum;
}

sum.apply(o1, [7, 8]); // 6
sum.apply(o2, [17, 18, 32]); // 185

sum.call({ val1:1, val2:2, val3:3}, 27, 28); // 6
sum.call({ v1:10, v2:50, v3:100, v4:25}, 37, 38); // 185

// -------------------------------------------------------------------------

function Person () {}
var p = new Person();
p.name = 'egoing';
p.introduce = function () {
    return this.name;
}
p.introduce(); // egoing

// -------------------------------------------------------------------------

function Ultra () {
    this.text = 'text'
}
Ultra.prototype.ultraProp = true;
Ultra.prototype; // {ultraProp: true, constructor: ƒ}

function Super () {}
Super.prototype = new Ultra();
Super; // prototype: Ultra { text: "text" }
Super.prototype; // Ultra {text: "text"}
Super.prototype.__proto__.ultraProp; // true
Super.prototype.text; // text
Super.prototype.ultraProp; // true

function Sub () {}
Sub.prototype = new Super();
Sub.prototype.ultraProp = 2;
Sub.prototype; // Ultra {ultraProp: 2}

var s = new Super();
s.ultraProp = 3;
Sub.prototype = s;
Sub.prototype; // Ultra {ultraProp: 3}

var o = new Sub();
o.ultraProp; // 3
o.prototype; // undefined

// -------------------------------------------------------------------------

var module = {
    init : function () {
        module.ini.init();
        module.winScroll();
    },
    winScroll : function () {
        '4 == winScroll'
    },
    ini : {
        init : function () {
            '1 == ini.init'
            this.event(); // event() 호출
        },
        event : function () {
            '2 == ini.event'
            this.action(); // action() 호출
        },
        action : function () {
            '3 == ini.action'
        }
    }
}
module.init()
// 1 == ini.init
// 2 == ini.event
// 3 == ini.action
// 4 == winScroll