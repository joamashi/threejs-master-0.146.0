"getter"
​
// getter는 객체의 프로퍼티를 가져오는 함수
​
{get prop() { ... } }
{get [expression]() { ... } }
​
// prop : 프로퍼티를 가져올 함수 이름
// expression : ES6에서 추가. 계산 되어지는 프로퍼티 이름을 위해 expression이 추가
​
// 동적으로 계산이 필요한 프로퍼티 값을 가져와야 할 때, getter를 사용한다면 별도의 함수를 만들 필요가 없습니다.
​
// getter를 사용할 때 3가지에 유의
// 1. 식별자로 숫자와 문자를 모두 사용할 수 있습니다.
// 2. 파라미터가 없어야 합니다.
// 3. 리터럴 객체의 같은 이름의 get이나 동일한 이름의 프로퍼티를 가질 수 없습니다. ({ get x() {}, get x() {} }, { x : ..., get x() {} } 불가능)
​
var log = ['test'];
var obj = {
    get latest () {
        // if (log.length == 0) return undefined;
        // log.length == 1
        return log[log.length - 1]
    }
}
console.log(obj.latest);    // "test"
delete obj.latest;          // getter는 삭제가 가능
console.log(obj.latest);    // undefined


// 객체가 이미 존재 할 때, defineProperty 메소드로 getter를 정의
var o = { 
    a: 0 
}
Object.defineProperty(o, "b", { 
    get: function () {
        return this.a + 1; 
    } 
});
console.log(o.b) // 1

// 동적으로 getter 이름을 정의. 이 방법은 ES6에서 포함된 기능
// 아직 여러 브라우저에서 지원되지 않고, 지원하지 않는 환경에서는 syntax error가 발생
var expr = "foo";
var obj = {
    get [expr]() { return "bar"; }
};
console.log(obj.foo); // "bar"
​
// getter의 장점
// 1. 계산 미루기 (Lazy getter)
// getter는 프로퍼티에 접근하기 전까지 그 값을 계산하지 않습니다. getter의 값 계산은 실제 값이 필요할 때 이루어지고, 값이 필요하지 않다면, 계산을 하지 않습니다. 즉 값이 필요하지 않다면 쓸데없는 계산을 하지 않아 cpu를 낭비하지 않게 됩니다.
​
// 2. 캐싱 (Smart/Memorized getter)
// 최적화 방법으로 계산 미루기와 함께 캐싱하는 것이 있습니다. 값은 getter가 호출될 때 처음 계산되며 캐싱됩니다. 이후의 호출은 다시 계산하지 않고 이 캐시값을 반환합니다.
​
// 1. 값의 계산 비용이 큰 경우. (RAM이나 CPU 시간을 많이 소모하거나, worker thread를 생성하거나, 원격 파일을 불러오는 등)
// 2. 값이 당장 필요하지 않지만 나중에 사용되어야 할 경우(혹은 이용되지 않을 수도 있는 경우)
// 3. 값이 여러번 이용되지만 변경되지 않아 매번 계산할 필요가 없는 경우
​
var o = {
    set foo (val) {
        delete this.foo;
        this.foo = val;
    },
    get foo () {
        delete this.foo;
        return this.foo = 'something';
    }
};

o.foo = "test";
console.log(o.foo); // test
// getter은 값을 캐싱하고 있기 때문에 아래와 같은 경우, 사용에 유의