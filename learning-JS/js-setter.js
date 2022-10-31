// setter는 객체의 프로퍼티를 설정하는 함수
​
{set prop(val) { . . . }}
{set [expression](val) { . . . }}
​
// prop : 프로퍼티를 가져올 함수 이름
// expression : ES6에서 추가. 계산 되어지는 프로퍼티 이름을 위해 expression이 추가. (getter와 방식이 동일)
​
// setter는 프로터티 값이 변경되어 질 때마다 함수를 실행하는데 사용
​
'setter를 사용할 때 3가지에 유의'
// 1. 식별자로 숫자와 문자를 모두 사용할 수 있습니다.
// 2. 한개의 파라미터만 가질 수 있습니다.
// 3. 리터럴 객체의 같은 이름의 set이나 동일한 이름의 프로퍼티를 가질 수 없습니다. ({ set x() {}, set x() {} }, { x : ..., set x() {} } 불가능)



// setter는 객체를 초기화 할 때 선언
var o = {
    set current(str) {
        this.log[this.log.length] = str;
    },
    log: []
}
o.current = "test";
console.log(o); // { current: [Setter], log: [ 'test' ] }
delete o.current;
console.log(o); // { log: [ 'test' ] }
o.current = "test2";
console.log(o); // { log: [ 'test' ], current: 'test2' }
​
// 객체가 이미 존재 할 때, defineProperty 메소드로 setter를 정의
var o = { a: 0 };
Object.defineProperty(o, "b", { set: function (x) { this.a = x / 2; } });
o.b = 10;
console.log(o.a) // 5

// 동적으로 setter 이름을 정의. 
// getter와 동일하게, 이 방법은 ES6에서 포함된 기능. 
// 아직 여러 브라우저에서 지원되지 않고, 지원하지 않는 환경에서는 syntax error가 발생.

var expr = "foo";
var obj = {
    baz: "bar",
    set [expr](v) { this.baz = v; }
};
console.log(obj.baz); // "bar"
obj.foo = "baz";
console.log(obj.baz); // "baz"