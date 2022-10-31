모듈 패턴을 알아보기 전에 네임스페이스란 용어부터 짚고 넘어가 보겠습니다.

네임스페이스란 수많은 함수, 객체, 변수들로 이루어진 코드가 전역 유효범위를 어지럽히지 않고, 애플리케이션이나 라이브러리를 위한 하나의 전역 객체를 만들고 모든 기능을 이 객체에 추가하는 것을 말합니다.

예를 들어 jQuery와 같은 라이브러리에서 jQuery가 네임스페이스를 가지며 jQuery 이름 내에 모든 기능을 추가하는 것을 말합니다.

다시 말해서, 코드에 네임스페이스를 지정해주며, 코드 내의 이름 충돌뿐만 아니라 이 코드와 같은 페이지에 존재하는 또 다른 자바스크립트 라이브러리나 위젯등 서드파티 코드와의 이름 충돌도 미연에 방지해 주는 것입니다.

우리는 이러한 네이스페이스 패턴을 작은 기능들 만을 모아 놓은 패턴으로 사용할 수가 있는데 모듈 패턴으로 이를 흉내낼 수가 있습니다.

모듈(module) 이라는 것은 전체 애플리케이션의 일부를 독립된 코드로 분리해서 만들어 놓은 것을 말합니다. 관련된 유용한 기능을 모아둔 모듈이라 할 수 있으며 크게는 jQuery 와 같은 라이브러리도 모듈이라 할 수 있습니다. 그리고 jQuery API 카테고리 분류를 보면 css, core, ajax 등등으로 API 를 제공하고 있는데 이 또한 카테고리 섹션을 모듈별로 관리를 하고 최종 빌드버전을 배포하고 있습니다. 물론 jQuery를 모듈별로 사용자가 다운받아 사용할 수도 있습니다. 

자바스크립트에서는 모듈을 구현하는 가장 쉬운 방법은 객체 리터럴을 사용하는 방법입니다.

var module = { 
  key : 'value', 
  pulicMethod () { 
    
  } 
}

// -------------------------------------------------------------------------------

var module = (function () { 
  /** 
    * -------------------------------- 
    * 모듈 패턴을 구현한 클로저 코드 
    * -------------------------------- 
  */ 
  // 은닉될 멤버 정의 
  var privateKey = 0; 
  
  function privateMethod () { 
    return ++privateKey; 
  } 
  
  // 공개될 멤버 (특권 메소드) 정의 
  return { 
    publickey : privateKey, 
    publicMethod () { 
      return privateMethod(); 
    } 
  } 
})();
module.publicMethod(); // 1 
module.publicMethod(); // 2 (클로저로 인한 결과)


// -------------------------------------------------------------------------------

모듈 패턴은 반환값이 함수가 아니라 객체이며, 자동 호출된다는 점만 제외하고 클로저와 유사합니다. 그리고 인스턴스를 여러 개 만들어 낼 수 있는 구조라는 점에서 싱글톤 패턴과 차이가 있습니다. 

위의 코드를 실행하면 익명함수가 자동으로 호출되어 익명함수가 반환하는 객체가 Module 변수에 할당되게 됩니다.

따라서 위와 같이 module.publicMethod() 호출할 수 있습니다. 위의 코드는 하나의 인스턴스 객체만을 생성하고 있어서 싱글톤과 유사합니다.

하지만 아래와 같이 자동으로 호출(self-invoking)되는 구조를 없애면 여러 개의 인스턴스를 생성하여 사용할 수 있습니다.

자동 호출 구조를 없앤 코드입니다.

// 두 개의 인스턴스 생성
var obj1 = Module(); 
obj1.publicMethod(); // 1
obj1.publicMethod(); // 2

var obj2 = Module(); 
obj2.publicMethod(); // 1
obj2.publicMethod(); // 2

위와 같이 Module 함수를 정의(즉시실행 X) 하여 함수를 호출하면 여러 개의 인스턴스인 객체를 생성하여 사용할 수 있습니다.

클로저 인스턴스와 유사하지만 한가지 차이점은 내부의 익명함수에서 반환값이 함수가 아니라 객체를 반환한다는 점입니다.

// -------------------------------------------------------------------------------

"모듈 패턴의 장,단점"

단점
- 전체적으로 코드량이 약간 더 많아지고 따라서 다운로드해야 하는 파일크기도 늘어난다.
- 전역 인스턴스가 단 하나뿐이기 때문에 코드의 어느 한 부분이 수정되어도 전역 인스턴스를 수정하게 된다. 
즉, 나머지 기능들도 갱신된 상태를 물려받게 된다. (장점이자 단점)

장점
- 점점 더 늘어만 가는 코드를 정리할때 널리 사용되며 자바스크립트 코딩패턴에서 널리 권장되는 방법이기도 하다.

// -------------------------------------------------------------------------------

// 1. 네임스페이스를 설정 / 모듈을 정의 
var MyApp = {} // 전역객체 
MyApp.modules = {} 

/* 
  2. 공개범위(특권메소드 등..)와 비공개 유효범위를 만든다
  즉시 실행함수로 모듈이 될 객체를 반환하고 모듈 사용자에게 제공할 공개 인터페이스가 담기게 된다. 
*/ 
MyApp.modules.libs = (function () { 
  // 비공개 프로퍼티 
  // var 선언 및 비공개 메소드등의 유효범위 (private 멤버) 
  
  // 공개 API (public, previlege 멤버) 
  return {
    
  }; 
}());

// -------------------------------------------------------------------------------

"모듈화"와 "모듈 패턴"에 대해 알아봅니다.

먼저 이 개념에 대해 알아보기 전에 고유변수(private member)와 특권메소드(privileged member)에 대해 간략히 짚고 넘어가자.

자바등 다른 언어와는 달리 자바스크립트에는 private, protected, public 프로퍼티와 메서드를 나타내는 별도의 문법이 없다. 

객체의 모든 멤버는 public, 즉 공개되어 있다.

다시 말해서, 자바스크립트에는 고유 구성원(private member)이란 개념이 없으며 객체의 프로퍼티는 모두 공용(public)이다. 

하지만 '고유변수'란 개념은 존재한다. 

예를 들어 함수 안에서 정의한 변수는 함수 밖에서 접근할 수가 없으므로 모두 고유변수(private member)라고 간주한다.

이 고유변수에는 함수의 매개변수, 지역 변수, 내부 함수 등이 포함된다

// -------------------------------------------------------------------------------

// 위험하다. 
var MYAPP = {}; 

// 개선안 
if (typeof MYAPP === 'undefined') { MYAPP = {}; } 

// 또는 더 짧게 작성할 수 있다. 
var MYAPP = MYAPP || {};

// -------------------------------------------------------------------------------

이렇게 추가되는 확인 작업 때문에 상당량의 중복 코드가 생겨날 수 있습니다.

예를 들어 MYAPP.modules.module2 를 정의하려면, 각 단계의 객체와 프로퍼티를 정의할 때마다 확인 작업을 거쳐야 하므로 코드가 세 번 중복됩니다.

따라서 네임스페이스 생성의 실제 작업을 맡아 줄 재사용 가능한 함수를 만들어두면 편리합니다.

다음은 네임스페이스 함수를 구현한 예제입니다.

다음과 같은 방식은 해당 네임스페이스가 존재하면 덮어쓰지 않기 때문에 기존 코드를 망가뜨리지 않습니다.

// -------------------------------------------------------------------------------

var MYAPP = MYAPP || {}; 
MYAPP.namespace = function (ns_string) { 
  var parts = ns_string.split('.'), 
    parent = MYAPP, 
    i; 
    
    // 처음에 중복되는 전역 객체명은 제거
    if (parts[0] === 'MYAPP') { 
      parts = parts.slice(1); 
    } 
    
    for (i = 0; i < parts.length; i += 1) { 
      if (typeof parent[parts[i]] === 'undefined') { 
        parent[parts[i]] = {}; 
      } 
      parent = parent[parts[i]];
    } 
  return parent; 
};

이 코드는 다음 모든 예에서 사용할 수 있습니다.

// -------------------------------------------------------------------------------

var module2 = MYAPP.namespace('MYAPP.modules.module2'); 
module2 === MYAPP.modules.module2 // true

// 첫 부분의 'MYAPP' 을 생략하고도 사용할 수 있다.
MYAPP.namespace('modules.module10'); // 매우 긴 네임스페이스를 만들어 본다.
MYAPP.namespace('once.upon.a.time.there.was.this.long.nested.property');

MYAPP // 확인해보세요!!

// -------------------------------------------------------------------------------

"의존 관계 선언"

자바스크립트 라이브러리들은 대개 네임스페이스를 지정하여 모듈화되어 있기 때문에, 필요한 모듈만 골라서 사용할 수 있습니다.

예를 들어, YUI2 에는 네임스페이스 역할을 하는 YAHOO 라는 전역 변수가 있고, 이 전역 변수의 프로퍼티로 YAHOO.util.DOM(DOM 모듈)이나 YAHOO.util.Event(이벤트 모듈)와 같은 모듈이 추가되어 있습니다.

이때 함수나 모듈 최상단에, 의존 관계에 있는 모듈을 선언하는 것이 좋습니다.

즉, 지역변수를 만들어 모듈을 가리키도록 선언하는 것입니다.

// -------------------------------------------------------------------------------

var myFunction = function () { 
  // 의존 관계에 있는 모듈들 
  var event = YAHOO.util.Event, 
    dom = YAHOO.util.Dom; 
    
  // 이제 event 와 dom 이라는 변수를 사용한다... 
};

대단히 간단한 패턴이지만 상당히 많은 장점을 가지고 있습니다.

1. 의존 관계가 명시적으로 선언되어 있기 때문에 코드를 사용하는 사람이 페이지 내에서 반드시 포함시켜야 하는 스크립트 파일이 무엇인지 알 수 있습니다.

2. 함수의 첫머리에 의존 관계가 선언되기 때문에 의존 관계를 찾아내고 이해하기 쉽습니다.

3. dom 과 같은 지역 변수는 YAHOO 와 같은 전역 변수보다 언제나 더 빠르며 YAHOO.util.Dom 처럼 전역 변수의 중첩 프로퍼티와 비교하면 더 말할 것도 없습니다. 의존 관계 선언 패턴을 잘 지키면 함수 안에서 전역 객체 판별을 단 한번만 수행하고 이 다음부터는 지역 변수를 사용하기 때문에 훨씬 빠릅니다.

// -------------------------------------------------------------------------------

"비공개 멤버"

function add (num1, num2) { 
  var sum = num1 + num2; 
  return sum; 
}

위 코드의 함수에는 num1, num2, sum이라는 세 가지의 고유변수가 있다. 이들 변수는 함수 내부에서는 접근이 가능하지만 함수 외부에서는 접근이 불가능하다. 

비공개 멤버에 대한 별도의 문법은 없지만 클로저를 사용해서 구현할 수 있다.

생성자 함수 안에서 클로저를 만들면, 클로저 유효범위 안의 변수는 생성자 함수 외부에 노출되지 않지만 객체의 공개 메서드 안에서는 쓸 수 있다. 클로저를 함수 안에 만들어 사용하면 스코프 체인을 통해 이들 변수에 접근이 가능하게 된다. 

즉, 생성자에서 객체를 반환할 때 객체의 메서드를 정의하면, 이 메서드안에서는 비공개 변수에 접근할 수 있는 것이다.

// -------------------------------------------------------------------------------

function Gadget () { 
  // 비공개 멤버 private member
  var name = 'iPod'; 
  
  // 공개된 함수 privileged member
  this.getName = function () { 
    return name; 
  }; 
} 

var toy = new Gadget(); 
toy.name // 'name'은 비공개이므로 undefined가 출력
toy.getName() // 공개 메서드에서는 'name'에 접근

// -------------------------------------------------------------------------------

"특권(privileged) 메서드"

위와 같은 코드 기법을 활용하여 함수 외부에서 고유변수에 접근이 가능하도록 공용 메소드를 만들 수가 있는데 이를 특권(privileged) 메소드라고 한다.

다시 말해, 특권 메소드는 고유변수/함수에 접근이 가능한 공용메소드인 것이다.

특권 메서드는 단지 비공개 멤버에 접근권한을 가진 공개 메서드를 가리키는 이름일 뿐이다. 

앞선 예제에서는 getName()은 비공개 프로퍼티인 name에 '특별한' 접근 권한을 가지고 있기 때문에 특권 메서드라고 할 수 있다.

// -------------------------------------------------------------------------------

"비공개 멤버의 허점"

특권 메서드에서 비공개 변수의 값을 바로 반환할 경우 이 변수가 객체나 배열이라면 값이 아닌 참조가 반환되기 때문에, 외부 코드에서 비공개 변수 값을 수정할 수 있다.

// -------------------------------------------------------------------------------

function Gadget(){ 
  // 비공개 멤버 
  var specs = { 
    width : 320, 
    height : 480, 
    color : "white" 
  }; 
  
  // 공개 함수 
  this.getSpecs = function () { 
    return specs; 
  }; 
} 
var toy = new Gadget();
var specs = toy.getSpecs();
  
specs.color = "black";
specs.price = "free"; 
toy.getSpecs(); // {width: 320, height: 480, color: "black", price: "free"}

// -------------------------------------------------------------------------------

얼핏 보기엔 별 문제 없어 보이나 여기서 getSpec() 메서드가 specs 객체에 대한 참조를 반환한다는게 문제다. 

specs는 감춰진 비공개 멤버처럼 보이지만 Gadget 사용자에 의해 변경될 소지가 있다.

이와 같은 예기치 않은 문제를 해결하기 위해서는 비공개로 유지해야 하는 객체나 배열에 대한 참조를 전달할 때 주의를 기울여야 하며 주어진 객체의 최상위 프로퍼티만을 복사하는 extend() 함수와 모든 중첩 프로퍼티를 재귀적으로 복사하는 extendDeep() 함수로 해결할 수 있다.

객체에 특권 메소드를 만드는 방법은 여러가지가 있지만 이 포스팅에서는 모듈화,모듈 패턴화를 알아보면서 어떤 방식으로 특권 메소드를 사용하는지 알아보도록 하자.

// -------------------------------------------------------------------------------

"모듈화(캡슐화)"

// -------------------------------------------------------------------------------

// 전역 스코프(gloval scope) 
// 변수(멤버 변수) 
// var sayHi = "안녕"; 
// 함수 영역 

/* 
  var moduleFunc = function() { 
    // 함수 스코프(새로운 영역이 생성됨) 
  }; 
*/ 

// 위의 멤버변수와 함수 영역을 하나의 코드블럭을 생성한다 
// 즉, 위의 코드는 전역에 정의되어 있지만 멤버변수와 함수 영역을 전역 스코프와 상관없이 
// 하나의 새로운 범위를 생성,관리하기위해 모듈화시킨다 

// 새로운 모듈화(캡슐화) 
// 자가 실행 함수 
(function(){ 
  var sayHi = "안녕"; 
  var moduleFunc = function () { 
    return sayHi; 
  }; 
  moduleFunc() // 같은 스코프안에서 함수 호출함 
}()); // 즉시 실행 함수 

// 외부에서 호출 
sayHi; // Uncaught ReferenceError: sayHi is not defined 
moduleFunc() // Uncaught ReferenceError: moduleFunc is not defined

// -------------------------------------------------------------------------------

"모듈 패턴"

더글라스 크록포드가 고안한 모듈 패턴은 싱글톤에서 같은 일을 한다.

싱글톤이란 인스턴스를 단 하나만 갖게 의도한 객체이다. 
전통적으로 자바스크립트에서 싱글톤을 만들 때는 다음 코드와 같이 객체 리터럴 표기법을 사용한다.

// -------------------------------------------------------------------------------

var singleton = { 
  name: value, 
  method : function() { 
    // 메소드 코드 
  } 
}

// -------------------------------------------------------------------------------

"객체 리터럴과 비공개 멤버"

생성자가 아닌 객체 리터럴로 비공개 멤버를 구현할 수 있다. 

객체 리터럴에서는 익명 즉시 실행함수를 추가하여 클로저를 만든다. 

모듈 패턴은 위 코드 형식에 따라 기본 싱글톤을 확장하여 고유멤버(private member)와 특권 메소드(privileged member)를 사용할 수가 있다.

// -------------------------------------------------------------------------------

var myobj; 
// 이 변수에 객체를 할당
(function () { 
  // 비공개 멤버 
  var name = "my, oh my";
  
  // 공개될 부분을 구현
  // var를 사용하지 않는다. 
  myobj = { 
    //특권 메서드 
    getName () { 
      return name; 
    } 
  }; 
}()); 
myobj.getName();

또는

var myobj = (function () { 
  //비공개 멤버 
  var name = "my, oh my"; 
  
  //공개될 부분을 구현
  return { 
    //특권 메서드 
    getName () { 
      return name; 
    } 
  }; 
}()); 
myobj.getName();

// -------------------------------------------------------------------------------

var myObj = function () { 
  
  // 고유 멤버(private member)가 될 스코프 
  var sayHi = "안녕하세요!!"; 
  var intCnt = 0; 
  var hi = function() { 
    intCnt += 1; // hi 함수를 호출할 때마다 1씩 증가하도록 함 
    return sayHi; 
  };
  var cnt = function() { 
    return intCnt; // closure를 통해서 증가된 intCnt값을 반환하도록 해준다. 
  } 
  
  // 특권/공용메소드와 프로퍼티 (공용 인터페이스)=>외부에 공개하기 위한 역할 
  // 객체 리터럴을 함수 값으로 반환(반환되는 객체리터럴에는 공용이 될 프로퍼티와 메소드만 소유) 
  return { 
    getHi () { 
      return sayHi; // 고유멤버에 접근이 가능(특권 메소드) 
    }, 
    getHi2 () { 
      return '반갑습니다~~!!'; 
    }, 
    getHi3 : hi, 
    getCnt : intCnt, // intCnt를 직접 외부에 반환시켜주면 증가된 값이 출력되지 않는다. 
    getCnt2 : cnt 
  } 
}(); 

// 모듈 패턴 외부에서 함수 호출이 가능한 것은 객체 리터럴을 반환값으로 넘겨줬기 때문이다 
// 이렇게 외부에서 사용이 가능하다고 하여 공용 메소드라고 일컫는다. 
myObj.getHi() 
myObj.getHi2() 
myObj.getHi3() 
myObj.getCnt 
myObj.getCnt2() 
myObj.getHi3() 
myObj.getCnt2()

// -------------------------------------------------------------------------------

"이렇게 모듈 패턴은 객체를 반환하는 익명 함수를 사용"

익명 함수 내부에서는 첫번째로 고유멤버인 함수의 매개변수,지역변수,함수 등을 정의하고 그 다음에는 객체 리터럴을 함수값으로 반환하는 것이다.

반환 된 객체 리터럴에는 공용적으로 사용될 프로퍼티나 메소드만 포함하게 되고 이 객체는 익명함수 내에서 정의되었기 때문에 공용메소드는 고유멤버에 접근하여 사용이 가능하다.

즉, 객체 리터럴이 싱글톤에 대한 공용 인터페이스를 정의하는 것이다.

// -------------------------------------------------------------------------------

"프로토타입과 비공개 멤버"

생성자를 사용하여 비공개 멤버를 만들 경우, 생성자를 호출하여 새로은 객체를 만들 때마다 비공개 멤버가 매번 재생성된다는 단점이 있다.

사실 생성자 내부에서 this 에 멤버를 추가하면 항상 이런 문제가 발생한다.

이러한 중복을 없애고 메모리를 절약하려면 공통 프로퍼티와 메서드를 생성자의 prototype 프로퍼티에 추가해야 합니다.

이렇게 하면 동일한 생성자로 생성한 모든 인스턴스가 공통된 부분을 공유하게 된다.

감춰진 비공개 멤버들도 모든 인스턴스가 함께 쓸 수 있다.

이를 위해서는 두 가지 패턴, 즉 생성자 함수 내부에 비공개 멤버를 만드는 패턴과 객체 리터럴로 비공개 멤버를 만드는 패턴을 함께 써야 한다.

왜냐하면 prototype 프로퍼티도 결국 객체라서 객체 리터럴로 생성할 수 있기 때문이다.

// -------------------------------------------------------------------------------

function Gadget() { 
  // 비공개 멤버 
  var name = 'iPod'; 
  
  // 공개 함수 
  this.getName = function () { 
    return name; 
  } 
} 
Gadget.prototype = (function () { 
  // 비공개 멤버 
  var browser = 'Mobile Webkit'; 
  
  // 공개된 프로토타입 멤버 
  return { 
    getBrowser : function () { 
      return browser; 
    } 
  } 
})(); 
var toy = new Gadget(); 
toy.getName(); // 객체 인스턴스의 특권 메서드 
toy.getBrowser(); // 프로토타입의 특권 메서드

// -------------------------------------------------------------------------------

"비공개 함수를 공개 메서드로 노출시키는 방법"

노출 패턴(revelation pattern) 은 비공개 메서드를 구현하면서 동시에 공개 메서드로도 노출하는 것을 말합니다.

객체의 모든 기능이 객체가 수행하는 작업에 필수불가결한 것들이라서 최대한 보호가 필요한데, 동시에 이 기능들의 유용성 때문에 공개적인 접근도 허용하고 싶은 경우가 있을 수 있습니다.

노출 패턴은 이런한 경우에 유용하게 쓸 수 있습니다.

메서드가 공개되어 있다는 것은 결국 이 메서드가 위험에 노출되어 있다는 말과도 같습니다.

공개 API 사용자가 어저면 본의 아니게 메서드를 수정할 수 있기 때문입니다.

ECMAScript 5에서는 객체를 고정(freeze)시킬 수 있는 선택자가 있지만, 이전 버전에서는 그렇지 않습니다.

이제 노출 패턴에 대해 알아보도록 하자.

이 용어는 크리스천 헤일먼(Christian Heilmann)이 만들어냈으며 처음에는 '모듈 노출 패턴(revealing module pattern)'이라고 했습니다.

먼저 예제를 살펴보도록 합니다.

이 예제는 객체 리터럴 안에서 비공개 멤버를 만드는 패턴에 기반하고 있습니다.

// -------------------------------------------------------------------------------

var arr;

(function () {

    var astr = '[object Array]';
    var toString = Object.prototype.toString;

    function isArray(a) {
        return toString.call(a) === astr;
    }

    function indexOf(haystack, needle) {
        var i   = 0,
            max = haystack.length;
        for (; i < max; i += 1) {
            if (haystack[i]  === needle ) {
                return i;
            }
        }
        return -1;
    }

    arr = {
        isArray : isArray,
        indexOf : indexOf,
        inArray : indexOf
    }

})();

여기에는 비공개 변수 두 개와 비공개 함수 두 개인 isArray() 와 indexOf() 가 존재하고 있습니다.

즉시 실행 함수의 마지막 부분을 보면, 공개적인 접근을 허용해도 괜찮겠다고 결정한 기능들이 arr 객체에 채울 수 있습니다.

비공개 함수 indexOf() 는 ECMAScript 5 식의 이름인 indexOf 와 PHP 에서 영향을 받은 이름이 inArray 라는 두 개의 이름으로 노출되어 있습니다.

위에서 정의한 코드를 바탕으로 새로운 arr 객체를 태스트해보도록 합니다.

// -------------------------------------------------------------------------------

arr.isArray([1, 2]); // true 가 기록
arr.isArray({0: 1}); // false 가 기록
arr.indexOf(['a', 'b', 's'], 's'); // 2 가 기록
arr.inArray(['a', 'b', 's'], 's'); // 2 가 기록

이제 공개된 메서드인 indexOf() 에 예기치 못한 일이 일어나더라도, 비공개 함수인 indexOf() 는 안전하게 보호되기 때문에 inArray() 는 계속해서 잘 동작할 것입니다.

"JAVASCRIPT"
arr.indexOf = null;
arr.inArray(['a', 'b', 'z', 'z']); // 2 가 기록


모듈 패턴 정리(Module Pattern)

모듈 패턴은 늘어나는 코드를 구조화하고 정리하는데 도움이 되기 때문에 널리 쓰입니다.

다른 언어와는 달리 자바스크립트에는 패키지를 위한 별도의 문법이 없습니다.

하지만 모듈 패턴을 사용하면 개별적인 코드를 느슨하게 결합시킬 수 있습니다.

따라서 각 기능들을 블랙박스처럼 다루면서도 소프트웨어 개발 중에(끊임없이 변하는) 요구사항에 따라 기능을 추가하거나 교체하거나 삭제하는 것도 자유롭게 할수 있습니다.

// -------------------------------------------------------------------------------

"모듈 노출 패턴, 생성자를 생성하는 모듈 그리고 샌드박스 패턴"

// -------------------------------------------------------------------------------

"모듈 노출 패턴"

전 포스팅에서 비공개 멤버와 관련된 패턴을 살펴보면서 이미 노출 패턴을 다룬 바 있습니다.

모듈 패턴도 비슷한 방식으로 작성할 수 있습니다.

즉, 모든 메서드를 비공개 상태로 유지하고, 최종적으로 공개 API 를 갖출 때 공개할 메서드만 골라서 노출하는 것입니다.

// -------------------------------------------------------------------------------

var MYAPP = MYAPP || {};

MYAPP.namespace = function (ns_string) {
    var parts  = ns_string.split('.'),
        parent = MYAPP,
        i;

  // 처음에 중복되는 전역 객체명은 제거한다.
	if (parts[0] === 'MYAPP') parts = parts.slice(1);

	for (i = 0; i < parts.length; i++) {
		if (typeof parent[parts[i]] === 'undefined') {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	
	return parent;
};

MYAPP.namespace('MYAPP.utilities.array');

MYAPP.utilities.array = (function () {
	
    // 비공개 프로퍼티
    var arr_string = '[object Array]',
        ops = Object.prototype.toString;
    
    // 비공개 메서드
    var inArray = function (haystack, needle) {
	    for (var i = 0; i < haystack.length; i++) {
		    if (haystack[i] === needle) return i;
	    }
	    return -1;
    };
    var isArray = function (a) {
        return ops.call(a) === arr_string;
    };
    
    // 공개 API 노출
    return {
      isArray : isArray,
	    inArray : inArray
    }    
}());
MYAPP.utilities.array.inArray(['1', 3], 3) // 1
MYAPP.utilities.array.isArray({'a': 1}) // false

// -------------------------------------------------------------------------------

"생성자를 생성하는 모듈"

앞선 예제에서 MYAPP.utilities.array 라는 객체를 만들었습니다.

하지만 생성자 함수를 사용해 객체를 만드는 것이 더 편할 때도 있습니다.

모듈 패턴을 사용하면서도 이렇게 할 수 있습니다.

모듈을 감싼 즉시 실행 함수가 마지막에 객체가 아니라 함수를 반환하게 하면 됩니다.

다음 모듈 패턴 예제는 생성자 함수인 MYAPP.utilities.Array 를 반환합니다.

// -------------------------------------------------------------------------------

MYAPP.namespace('MYAPP.utilities.Array');

MYAPP.utilities.Array = (function(){
	
	// 의존 관계 선언
	var uobj  = MYAPP.utilities.object,
	    ulang = MYAPP.utilities.lang,
	    // 비공개 프로퍼티와 메서드를 선언한 후 ...
	    Constr;
	
	// 필요하다면 일회성 초기화 절차를 실행한다.
	// ...
	
	// 공개 API - 생성자 함수
	Constr = function (o) {
		this.elements = this.toArray(o);
	};
	
	// 공개 API - 프로토타입
	Constr.prototype = {
		consturctor : MYAPP.utilities.Array,
		version : '2.0',
		toArray : function (obj) {
			for (var i = 0, a = [], len = obj.length; i < len; i += 1) {
				a[i] = obj[i];
			}
			return a;
		}
	};
	
	// 생성자 함수를 반환한다.
	// 이 함수가 새로운 네임스페이스에 할당될 것이다.
	return Constr;
	
}());

// 위 생성자 함수는 다음과 같이 사용할 수 있다.
var arr = new MYAPP.utilities.Array({});
arr.version //

// -------------------------------------------------------------------------------

"모듈에 전역변수 가져오기"

이 패턴의 흔한 변형 패턴으로는 모듈을 감싼 즉시 실행 함수에 인자를 전달하는 형태가 있습니다.

어떠한 값이라도 가능하지만 보통 전역 변수에 대한 참조 또는 전역 객체 자체를 전달합니다.

이렇게 전역 변수를 전달하면 즉시 실행 함수 내에서 지역 변수로 사용할 수 있게 되기 때문에 탐색 작업이 좀더 빨리집니다.

MYAPP.utilities.module = (function (app, global) {
	
	// 전역 객체에 대한 참조와
	// 전역 애플리케이션 네임스페이스 객체에 대한 참조가 지역 변수화 된다.
	
}(MYAPP, this));

// -------------------------------------------------------------------------------

"샌드박스 패턴"
// 샌드박스 패턴은 네임스페이스 패턴의 다음과 같은 단점을 해결합니다.

- 애플리케이션 전역 객체가 단 하나의 전역 변수에 의존한다. 따라서 네임스페이스 패턴으로는 동일한 애플리케이션이나 라이브러리의 두 가지 버전을 한 페이지에서 실행시키는 것이 불가능하다. 여러 버전들이 모두 이를테면 MYAPP 이 라는 동일한 전역 변수명을 쓰기 때문이다.
- MYAPP.utilities.array 와 같이 점으로 연결된 긴 이름을 써야 하고 런타임에는 탐색 작업을 거쳐야한다.

이름을 보고 짐작할 수 있듯이 샌드박스 패턴은 어떤 모듈이 다른 모듈과 그 모듈의 샌드박스에 영향을 미치지 않고 동작할 수 있는 환경을 제공하는 것입니다.

// -------------------------------------------------------------------------------

"전역 생성자"
// 네임스페이스 패턴에서는 전역 객체가 하나입니다.

샌드박스 패턴의 유일한 전역은 생성자입니다.

이것을 Sandbox() 라고 해보자. 이 생성자를 통해 객체들을 생성할 것입니다.

그리고 이 생성자에 콜백 함수를 전달해 해당 코드를 샌드박스 내부 환경으로 격리시킬 것입니다.

샌드박스 사용법은 다음과 같습니다.

// -------------------------------------------------------------------------------

new Sandbox(function (box) {
	// 여기에 코드가 들어간다...
})

// -------------------------------------------------------------------------------

box 객체는 네임스페이스 패턴에서의 MYAPP 과 같은 것입니다.

코드가 동작하는데 필요한 모든 라이브러리 기능들이 여기에 들어갑니다.


이 패턴에 두 가지를 추가해 보도록 하자.

new 를 강제하는 패턴을 활용하여 객체를 생성할 때 new 를 쓰지 않아도 되게 만든다.
Sandbox() 생성자가 선택적인 인자를 하나 이상 받을 수 있게 한다. 이 인자들은 객체를 생성하는 데 필요한 모듈의 이름을 지정한다. 우리는 코드의 모듈화를 지향하고 있으므로 Sandbox() 가 제공하는 기능 대부분이 실제로는 모듈 안에 담겨지게 될 것이다.


이제 객체를 초기화하는 코드가 어떤 모습인지 예제를 보도록 합니다.

다음과 같이 new 를 쓰지 않고도, 가상의 모듈 'ajax' 와 'event' 를 사용하는 객체를 만들 수 있습니다.

// -------------------------------------------------------------------------------

Sandbox(['ajax','event'], function (box) {
	// console.log(box);
})

// 다음 예제는 앞선 예제와 비슷하지만 모듈 이름을 개별적인 인자로 전달합니다.

"JAVASCRIPT"
Sandbox('ajax','dom', function (box) {
	// console.log(box);
})


"쓸 수 있는 모듈을 모두 사용한다" 는 의미로 와일드카드 * 인자를 사용하면 어떨까?

편의를 위해 모듈명을 누락시키면 샌드박스가 자동으로 * 를 가정하도록 해보자.

그렇다면 모든 모듈을 사용하는 방법으로 다음 두 가지가 가능하게 될 것입니다.

Sandbox('*', function (box) {
	// console.log(box);
});

Sandbox(function (box) {
	// console.log(box);
});

마지막으로 샌드박스 객체의 인스턴스를 여러 개 만드는 예제를 살펴보도록 하자.

심지어 한 인스턴스 내부에 다른 인스턴스를 중첩시킬 수도 있습니다.

이 때도 두 인스턴스 간의 간섭 현상은 일어나지 않습니다.

Sandbox('dom', 'event', function (box) {
	
	// dom 과 event 를 가지고 작업하는 코드
	Sandbox('ajax', function () {
		// 샌드박스된 box 객체를 또 하나 만든다.
		// 이 "box" 객체는 바깥쪽 함수의 "box" 객체와는 다르다.
		
		// ajax 를 사용하는 작업 완료
		
	});
	
	// 더 이상 ajax 모듈의 흔적은 찾아볼 수 없다.
});

이 예제들에서 볼 수 있듯이, 샌드박스 패턴을 사용하면 콜백 함수로 코드를 감싸기 때문에 전역 네임스페이스를 보호할 수 있습니다.

필요하다면 함수가 곧 객체라는 사실을 활용하여 Sandbox() 생성자의 "스태틱" 프로퍼티에 데이터를 저장할 수도 있습니다.

또 원하는 유형별로 모듈의 인스턴스를 여러 개 만들 수도 있습니다.

이 인스턴스들은 각각 독립적으로 동작하게 됩니다.

그럼 이제 이 모든 기능을 지원하는 Sandbox() 생성자와 그 모듈을 구현하는 방법을 살펴보도록 하자.



"모듈 추가하기"
실제 생성자를 구현하기 전에 모듈을 어떻게 추가할 수 있는지부터 살펴보도록 합니다.

Sandbox() 생성자 함수 역시 객체이므로 modules 이라는 프로퍼티를 추가할 수 있습니다.

이 프로퍼티는 키-값의 쌍을 담은 객체로, 모듈의 이름이 되고 각 모듈을 구현한 함수가 값이 되도록 할 것입니다.

Sandbox.modules = {};

Sandbox.modules.dom = function (box) {
	box.getElement = function () {
	};
	box.getStyle = function () {
	};
	box.foo = 'bar';
};

Sandbox.modules.event = function (box) {
	// 필요에 따라 다음과 같이 Sandbox 프로토타입에 접근할 수 있다.
	// box.constructor.prototype.m = 'mmm';
	
	box.attachEvent = function () {
	};
	box.detachEvent = function () {
	};
	
};

Sandbox.modules.ajax = function (box) {
	box.makeRequest = function () {
	};
	box.getResponse = function () {
	};
};
위 예제에서는 dom, event, ajax 라는 모듈을 추가했습니다.

모든 라이브러리와 복잡한 웹 애플리케이션에서 흔히 사용되는 기능들입니다.

각 모듈을 구현하는 함수들이 현재의 인스턴스 box 를 인자로 받아들인 다음 이 인스턴스에 프로퍼티와 메서드를 추가하게 됩니다.



"생성자 구현"
이제 Sandbox() 생성자를 구현해 보도록 합니다.(이 생성자의 이름은 여러분의 라이브러리나 애플리케이션에 맞게 바꾸어도 좋다.)

function Sandbox() {
	// arguments 를 배열로 바꾼다.
	var args = Array.prototype.slice.call(arguments);
	
	// 마지막 인자는 콜백 함수다.
	var callback = args.pop();
	
	// 모듈은 배열로 전달될 수도 있고, 개별 인자로 전달될 수도 있다.
	var modules = (args[0] && typeof args[0] === 'string') ? args : args[0];
	var i;
	
	// 함수가 생성자로 호출되도록 보장한다.(new 를 강제하는 패턴)
	if ((!this instanceof Sandbox)) {
		return new Sandbox(modules, callback);
	}
	
	// this 에 필요한 프로퍼티를 추가한다.
	this.a = 1;
	this.b = 2;
	
	// 코어 'this' 객체에 모듈을 추가한다.
	// 모듈이 없거나 '*' 이면 사용 가능한 모든 모듈을 사용한다는 의미이다.
	if (!modules || modules === '*' || modules[0] === '*') {
		modules = [];
		for (i in Sandbox.modules) {
			if (Sandbox.modules.hasOwnProperty(i)) {
				modules.push(i);
			}
		}
	}
	
	// 필요한 모듈들을 초기화한다.
	for (i = 0; i < modules.length; i += 1) {
		Sandbox.modules[modules[i]](this);
	}
	
	// 콜백 함수를 호출한다.
	callback(this);
	
}

// 필요한 프로토타입 프로퍼티들을 추가한다.
Sandbox.prototype = {
	name: 'My Application',
	version : '1.0',
	getName : function () {
		return this.name;
	}
};

위 구현에서 핵심적인 사항들은 다음과 같습니다.

this 가 Sandbox 의 인스턴스인지 확인하고, 그렇지 않으면 (즉, Sandbox() 가 new 없이 호출되었다면) 함수를 생성자로 호출한다.

생성자 내부에서 this 에 프로퍼티를 추가한다. 생성자의 프로토타입에도 프로퍼티를 추가할 수 있다.

필요한 모듈은 배열로도, 개별적인 인자로도 전달할 수 있고, * 와일드카드를 사용하거나, 쓸 수 있는 모듈을 모드 쓰겠다는 의미로 생략할 수도 있다. 이 예제에서는 필요한 기능을 다른 파일로부터 로딩하는 것까지는 구현하지 않았지만, 이러한 선택지도 확실히 고려해보아야 한다.

필요한 모듈을 모두 파악한 다음에는 각 모듈을 초기화한다. 다시 말해 각 모듈을 구현한 함수를 호출한다.

생성자의 마지막 인자는 콜백 함수이다. 이 콜백 함수는 맨 마지막에 호출되며, 새로 생성된 인스턴스가 인자로 전달된다. 이 콜백 함수가 실제 사용자의 샌드박스이며 필요한 기능을 모두 갖춘 상태에서 box 객체를 전달받게 된다.