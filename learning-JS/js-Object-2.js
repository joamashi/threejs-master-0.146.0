function Person() {
    this.name = "anonymous";
    this.job = "none";
    this.sayHello = function () {
        console.log(this.name, this.job); // Unikys Programmer
    }
}

function Unikys() {
    var obj = new Person;
    obj.name = "Unikys";
    obj.job = "Programmer";

    obj; // Person {name: "Unikys", job: "Programmer", sayHello: ƒ}

    return obj;
}

var me = new Unikys;
me.sayHello();
me // Person {name: "Unikys", job: "Programmer", sayHello: ƒ}

me instanceof Unikys; // false; 
me instanceof Person; // true;

// 이렇게 ECMAScript 표준에서 거치고 있는 단계를 중간에서 캐치하여 나만의 return 값을 설정함으로써 상속을 했었다. 
// 하지만 이 방법은 치명적인 단점이 있는데, 바로 위의 변수 me는 Unikys의 인스턴스가 아닌 Person으로 밖에 인식을 못한다는 것이다.

// -------------------------------------------------------------------------

var person = {
    name: "anonymous",
    sayHello: function () {
        this.name;
    }
}

function Unikys() {
    this.name = "Unikys";
}

Unikys.prototype = person;
var me = new Unikys();

me.sayHello(); // Unikys
person.sayHello(); // anonymous
me instanceof Unikys; // true

me; // Unikys2 {name: "Unikys"}

// -------------------------------------------------------------------------

'Object.create([Object] {, [Object]})'

// '자바스크립트' 개발자들은 내부에서 이렇게 constructor가 망가지는 것을 원하지 않았기 때문에 고안한 것이 
// Object.create 함수이다.물론 이러한 여론에다가 new를 사용한 객체의 생성이 '자바스크립트스럽지 않다'라는 의견 
// 또한 많이 반영되어 new라는 키워드의 사용을 자제하고 싶어하는 사람들이 의견 또한 이러한 별도로 객체를 생성하는 
// 함수를 제안하게 되고 이것이 표준 규격에도 들어가게 된 것이다.
// 하지만 표준에는 약간 늦게 추가되어 현재는 이 Object.create함수는 IE는 9이상 버전, 
// 나머지 크롬 / 파폭 / 사파리5 이상의 브라우져에서 지원해주는 함수이다.
// IE9 이상 버전만 지원해주다 보니 아직은 마음대로 사용할 수는 없는 함수이지만, 
// 앞으로 '자바스크립트' 개발자로서 상속을 활용하게 된다면 이러한 개념을 이해하고 Object.create 함수를 이용하는 것도 좋을 것이다.

'Object.create()를 써야하는가 ?'

// 솔직히 말하면 아직은 이른 시기인 것 같다.이제 막 ECMAScript5의 표준에 들어갔고, 
// 하위 브라우져들은 지원하지 않는 것을 굳이 위험성을 안고 100 % 호환되는 new 를 안 쓸 이유가 없기 때문이다.
// 그렇다면 왜 이러한 글을 썼는가 ? 자바스크립트라는 언어를 공부해보면 정말로 너무나 완벽하고 매우 매력적이지만 
// 처음에 만들어졌을 때 약간 대충(?) 만든 탓에 위에서 언급한 것과 같은 결함들이 곳곳 숨겨져 있기 때문에 
// 작은 위험성도 미리 알고 대처를 하는 것이 어떻겠느냐 하는 생각에서 쓴 것이고, 해외의 유명한 자바스크립트 개발자들은 
// 이미 'new'라는 키워드를 안 쓰는 방향으로 개발을 하기 시작했기 때문에 이러한 경향에 탑승한다고 해서 해가 될 것은 없기 때문이다. 
// (그들이 말하는 new는 'It's not like javascript' 자바스크립트스럽지 않다는 이유이다.) 
// 물론 계속 new를 사용하면서 개발해도 되겠지만 현재에 안주하고 살면서 문제점을 인식하지 못 하고 새로운 변화가 왔을 때를 
// 대비하지 못 한다면 그저그런 웹개발자가 되어버릴테니까.

// 참고로 아직 Object.create가 시기상조라고 느끼는 이유 중 하나는 바로 성능 때문이기도한데, 
// 아래의 성능 테스트를 실제로 돌려보면 10배 가량의 성능 차이를 보이기 때문에, 
// 퍼포먼스가 필요한 경우라면 new를 사용하는 것이 더 좋을 것이다.

// 사실 성능만 놓고보면 왜 써야할지 모를 정도로 압도적이다.파란색바가 동일 시간 내에 수행 가능한 명령 횟수인데, 
// Object.create는 보이지도 않고 new를 이용한 경우만 보이는 정도이니 이것은 성능상 차이가 10배도 넘어선다고 봐도 된다. 
// 이렇게 성능상 안 좋은 Object.create를 언제부터 사용하는 것이 일반적이 될지는 모르겠지만 IE8의 점유가 다소 적어지고나서야 
// 가능해지지 않을까 생각해보면, 위에서 말했던 상속을 하게 될 때에 new에서 가지는 문제점을 인지하고 그 지뢰를 밟지 않게 조심해야 할 것이다.

// -------------------------------------------------------------------------

function Person(name) {
    this.name = name;
}

Person.prototype = {
    sayHello: function () {
        this.name
    }
}

var unikys = Object.create(Person.prototype, {
    name: {
        value: "Unikys",

        // 이렇게 설정할 변수/속성의 값을 미리 설정할 수 있다. 하지만 여기서 #1의 2번째 yell을 하게 되면 무엇이라고 나오는지 살펴보면, 
        // 이상하게도, 바로 윗줄에서 설정한 "My name is Suniky"가 아니고, 원래의 값인 "My name is Unikys"라고 나오게 된다. 
        // 이렇게 기본 값만을 설정하게 되면 이 속성은 읽기 전용이 되어서 값을 수정할 수 없게 된다. 
        // 따라서, (조금 귀찮지만) 추가적인 설정을 해주면 된다.

        // 위에서 한 세팅은 Object.defineProperty의 스펙에도 나와있기는 하지만, 간단하게 설명을 한다면, 
        // configurable은 해당 속성을 삭제할 수 있느냐 여부를 설정, enumerable은 for-in 등과 같이 루프를 돌 때 보이게 설정하는 여부, 
        // writable은 해당 속성에 값을 써 넣을 수 있는지 여부를 설정하는 것이고, 모두 default로 false 값을 가지게 된다. 
        // 위의 기능들 중에서 enumerable을 잘 활용한다면 for-in에서 if (obj.hasOwnProperty(key)) 를 매번 했던 것도 안해도 되므로 
        // 설계를 잘하면 프로그래밍 상의 에러를 줄이고 예기치 못하게 발생할 문제들을 해결할 수 있게 되므로 매우 편리하게 사용할 수 있을 것이다. 또한, configurable이나 writable등을 설정함으로써 나의 라이브러리를 배포하고자 한다면, readonly로 나의 라이브러리와 모듈들을 보호할 수 있을테니 라이브러리를 개발하고자한다면 이러한 정보는 알아두면 좋을 것이다.

        configurable: true,
        enumerable: true,
        writable: true
    }
});
unikys.sayHello(); // Unikys
unikys.name = "Suniky";
unikys.sayHello(); // Suniky