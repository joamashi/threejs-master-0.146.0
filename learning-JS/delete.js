"delete"

  var sum = function (a, b) { return a + b;}
  var add = sum;
  delete sum; // false
  typeof sum; // function

  var o = { x: 1};
  delete o.x; // true
  o.x; // undefined

  var GLOBAL_OBJECT = this;
  GLOBAL_OBJECT.baz = 'blah';
  delete GLOBAL_OBJECT.baz; // true
  typeof GLOBAL_OBJECT.baz; // undefined

  function fun () {}
  fun.prototype.age = 6; // 6
  fun.age; // undefined
  
  var my1 = new fun();
  var my2 = new fun();
  my1.age; // 6
  my2.age; // 6
  delete fun.prototype.age; // true
  fun.prototype.age; // undefined

  var x = 1;
  delete x; // false
  x; // 1
  x = 1; // === window.x
  delete x; // false
  typeof x; // number

  this.foo = 1;
  delete foo; // true
  typeof foo; // undefined

  (function(foo, bar){
    delete foo; // false
    foo; // 1

    delete bar; // false
    bar; // 'blah'
  })(1, 'blah');

  var GLOBAL_OBJECT = this;
  var foo = 1;
  GLOBAL_OBJECT.foo; // 1
  foo === GLOBAL_OBJECT.foo; // true

  function bar(){}
  typeof GLOBAL_OBJECT.bar; // "function"
  GLOBAL_OBJECT.bar === bar; // true

  (function(foo){
    var bar = 2;
    function baz(){}

    ACTIVATION_OBJECT.arguments; // Arguments object
    ACTIVATION_OBJECT.foo; // 1
    ACTIVATION_OBJECT.bar; // 2
    typeof ACTIVATION_OBJECT.baz; // "function"
  })(1);

  (function(){
    delete arguments; // false
    typeof arguments; // "object"

    function f(){}
    delete f.length; // false
    typeof f.length; // "number"
  })();

  function x () {}
  var x;
  typeof x; // function