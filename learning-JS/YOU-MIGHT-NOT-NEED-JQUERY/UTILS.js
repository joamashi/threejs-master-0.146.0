/**
 * Array Each
 * =================================================================================
 */

$.each(array, function (i, item) {/* */});

array.forEach(function (item, i) {/* */});

/**
 * Map
 * =================================================================================
 */

$.map(array, function (value, index) {/* */});

array.map(function (value, index) {/* */});

/**
 * Bind
 * =================================================================================
 */

$.proxy(fn, context);

  // jQuery.proxy(대상함수, context)
  // 대상함수 : context를 변경할 대상함수를 지정
  // context : 대상함수에 입힐 context 지정

  var value = "전역 value";
  var callValue = function () {
    var value = "지역 value";
    console.log(this.value);
  }
  var obj = {
    value : "obj의 멤버변수"
  }
  var proxyFunc = $.proxy(callValue, obj); // obj의 context를 갖는 callValue 함수 리턴
  callValue(); // 전역 value;
  proxyFunc(); // obj의 멤버변수


fn.bind(context);
 
/**
 * Deep Extend
 * =================================================================================
 */

$.extend(true, {}, objA, objB);

var deepExtend = function(out) {
  out = out || {};
  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];

    if (!obj) continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object'){
          if(obj[key] instanceof Array == true) out[key] = obj[key].slice(0);
          else out[key] = deepExtend(out[key], obj[key]);
        }
        else out[key] = obj[key];
      }
    }
  }
  return out;
};
deepExtend({}, objA, objB);
 
/**
 * Extend : 객체를 좀 더 쉽게 병합
 * =================================================================================
 */

$.extend({}, objA, objB);

var extend = function(out) {
  out = out || {};
  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i]) continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
    }
  }
  return out;
};
extend({}, objA, objB);

function Foo() { this.a = 1;}
function Bar() { this.c = 3;}
Foo.prototype.b = 2;
Bar.prototype.d = 4;
_.assign({ 'a': 0 }, new Foo, new Bar) // => { 'a': 1, 'c': 3 }

// Object.assign == IE X
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };
const returnedTarget = Object.assign(target, source);
console.log(target); // { a: 1, b: 4, c: 5 }
console.log(returnedTarget); // { a: 1, b: 4, c: 5 }

let obj1 = { a: 0 , b: { c: 0}};
let obj2 = Object.assign({}, obj1);
console.log(JSON.stringify(obj2)); // { a: 0, b: { c: 0}}

/**
 * Index Of
 * =================================================================================
 */

$.inArray(item, array)

array.indexOf(item);

 
/**
 * Is Array
 * =================================================================================
 */

$.isArray(arr);

Array.isArray(arr);

/**
 * Now
 * =================================================================================
 */

$.now();

Date.now();
 
/**
 * Parse HTML
 * =================================================================================
 */

$.parseHTML(htmlString);

var parseHTML = function (str) {
  var tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = str;
  return tmp.body.children;
};
parseHTML(htmlString);

 /**
 * Parse JSON
 * =================================================================================
 */

$.parseJSON(string);

JSON.parse(string);

/**
 * Slice
 * =================================================================================
 */

$(els).slice(begin, end);

els.slice(begin, end);

 
/**
 * Trim
 * =================================================================================
 */

$.trim(string);

string.trim();

 /**
 * Type
 * =================================================================================
 */

$.type(obj);

Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
