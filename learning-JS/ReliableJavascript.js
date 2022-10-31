"자바스크립트 패턴과 테스트"
견고한 프로그램을 개발하는 원리
자바스크립트 문법 특성을 이해하고 디자인 패턴과 테스트 주도 개발 (TDD)로 견고한 프로그램을 만든다

1. 기초 다지기

2. 패턴을 응용한 코드 테스트

3. 자바스크립트 고급 특성을 응용한 테스팅과 코딩

4. 고급 테스팅

5. 총정리

github.com/gilbutITbook/006844

// -------------------------------------------------------------------------------

== '타입을 강제 변환.coercion 한 뒤 비교'

=== '강제 변환 없이 그냥 비교'



"1부 기초 다지기"

// 1장. 좋은 소프트웨어 만들기
// 1.1 바르게 시작하는 코드 작성하기
  
  클래스가 5개인 시스템보다 50개인 시스템에서 개발 및 유지 보수 난이도가 10배 이상 더 높다.
  최대 20개의 통신 채널이 유발.
  
  클라이언트 / 서버 양쪽에서 규모가 큰 시스템의 부하를 감당할 수 있게 해주는 단일 페이지 애플리케이션, 노드JS 같은 자바스크립트 기술이 등작하면서 개발자는 통신 채널을 최소화하는 문제를 진지하게 고민.
  
  스크립트는 모듈이 아니다.
  
  스코프는 중첩 함수로 다스린다.
  
  "SOLID 원칙"
    // 단일 책임 원칙
    // 개방/폐쇄 원칙
    // 리스코프 치환 원칙
    // 인터페이스 분리 원칙
    // 의존성 역전 원칙  

// 1.2 바르게 유지되는 코드 작성하기
  
  단위(unit) 테스트는 미래에 대비한 투자. 특정 조건에서 어떻게 작동해야 할지 정의.
  
  "테스트 주도 개발을 실천"
  
  "테스트하기 쉬운 코드로 다듬기"
  
  var Users = Users || {};
  Users.registration = function () {
    return {
      validateAndRegisterUser : function (user) {
      
        // user 객체가 올바르게 채워졌는지 검증
        if (!user || user.name === "" || user.password === "" || user.password.length < 6) throw new Error('사용자 인증이 실패했습니다.');
        
        // 검증을 마친 user 객체를 서버로 전송
        $.post("http://...", user);
        
        // UI에 메시지를 표시
        $("#user-message").text("가빕해주셔서 감사합니다, " + user.name + "님");
      }
    };
  };
  
  "관심사를 세 가지를 요약"
  1. 사용자 검증
  2. 서버와 직접 통신
  3. UI 직접 다루기
  
// -------------------------------------------------------------------------------

// 2장 도구 다루기
// 2.1 테스팅 프레임워크
    
    function createReservation (passenger, flight) {
      return {
        passengerInfo: passenger,
        flightInfo: flight
      }
    }   

// 2.2 의존성 주입 프레임워크
    
    Attendee = function (attendeeId) {
      // 'new'로 생성하도록 강제한다
      if (!(this instanceof Attendeee)) return new Attendee(attendeeId);
      
      this.attendeeId = attendeeId;
      this.service = new ConferenceWebSvc();
      this.messenger = new Messenger();
    }
    
    // 주어진 세션에 좌석 예약을 시도
    // 성공/실패 여부를 메시지로 알려준다
    Attendee.prototype.reserve = function (sesssionId) {
      if (this.service.reserve(this.attendeeId, sessionId)) {
        this.messenger.success('좌석 예약이 완료되었습니다!' + ' 고객님은' + this.service.getRemainingReservations() + ' 좌석을 추가 예약하실 수 있습니다.')
      } else {
        this.messenger.failure('죄송합니다, 해당 좌석은 예약하실 수 없습니다.');
      }
    }
    
    최신 의존성 주입 프레임워크 - 리콰이어JS
    
    define(['./Service', './Messenger'], function (service, messenger) {
      return function (attendeeId) {
        return new Attendee(service, messenger, attendeeId);
      }
    });
    

// 2.3 애스팩트 툴킷
    
    "AOP. 애스팩트 지향 프로그래밍"
    단일한 책임 범위 내에 있지 않은 하나 이상의 객체에 유용한 코드를 한데 묶어 눈에 띄지 않게 객체에 배포
    
    배포할 코드 조각 - 어드바이스.advice
    어드바이스가 처리할 문제 - 애스팩트.aspect / 황단 관심사.cross-cutting concern
    
    // 캐싱 없는 모듈
    TravelService = (function (rawWebService) {
      var conferenceAirport = 'BOS';
      var maxArrival = new Date(/* 날짜 */);
      var minDeparture = new Date(/* 날짜 */);
      
      return {
        getSuggestedTicket: function (homeAirport) {
          return rawWebService.getCheapestRoundTrip(homeAirport, conferenceAirport, maxArrival, minDeparure);
        }
      };
    })();
    
    // AOP 없는 캐싱
    TravelService = (function (rawWebService) {
      var conferenceAirport = 'BOS';
      var maxArrival = new Date(/* 날짜 */);
      var minDeparture = new Date(/* 날짜 */);
      
      // 간단한 캐싱
      var cache = [];
      
      return {
        getSuggestedTicket: function (homeAirport) {
          var ticket;
          
          if (cache[homeAirport]) return cache[homeAirport];
          
          ticket = rawWebService.getCheapesRoundTrip(homeAirport, conferenceAirport, maxArrival, minDeparure);
          
          cache[homeAirport] = ticket;
           
          return ticket;
        }
      };
    })();

// 2.4 코드 검사 도구

    'use strict'

// -------------------------------------------------------------------------------

// 3장 객체를 바르게 만들기	
// 3.1 원시형
    
    String, Number, Boolean, null, undefined, + Symbol
    // 그들만의 객체 래퍼를 지닌다.
  
// 3.2 객체 리터럴

// 3.3 모듈 패턴
  
  "임의 모듈 생성"
  // 해당 애플리케이션만 사용할 수 있는 모든 객체(모듈)를 담아 넣은 전역 객체를 선언하여 이름공간처럼 활용
  var MyApp = MyApp || {};
  
  // 애플리케이션 이름공간에 속한 모듈. animalMaker라는 다른 함수에 의존하며 animalMaker는 주입 가능
  MyApp.wildlifePreserveSimulator = function (animalMaker) {
    
    // 프라이빗 변수
    var animals = [];
    
    // API를 반환
    return {
      addAnimal: function (species, sex) {
        animals.push(animalMaker.make(species, sex));
      },
      getAniamlCount: function () {
        return animals.length;
      }
    }
  }
  var preserve = MyApp.wildlifePreserveSimulator(realAnimalMaker); // 실행됨
  preserve.addAnimal(gorilla, remale);
  
  "즉시 실행 모듈 생성"
  // API를 반환하는 건 임의 모듈과 같지만, 외부 함수를 선언하자마자 실행하는 방법.
  // 반환된 API는 이름공간를 가진 전역 변수에 할당된 후 해당 모듈의 싱글톤 인스턴스가 된다
  var MyApp = MyApp || {};
  MyApp.wildlifePreserveSimulator = (function () {
    
    var animals = [];
    
    return {
      addAnimal: function (species, sex) {
        animals.push(animalMaker.make(species, sex));
      },
      getAniamlCount: function () {
        return animals.length;
      }
    }
  }());
  
  // 싱글톤
  MyAppp.wildlifePreserveSimulator.addAnimal(realAnimalMaker, gorilla, remale);
  
// 3.4 객체 프로토타입과 프로토타입 상속

  "Object.create" 기존 객체와 프로토타딥이 연견된 객체를 새로 만들 수 있다. // new
  
  var ape = {
    hasThumbs: true,
    hasTail: false,
    swing: function () {
      return '매달리기';
    }
  };
  var chimp = Object.create(ape);
  var bonobo = Object.create(ape);
  bonobo.habitat = '중앙 아프리카';
  bonobo.hasThumbs; // false
  
  ape.hasThumbs = false;
  chimp.hasThumbs; // false
  bonobo.hasThumbs; // false
  
  "프로토타입 체인"
  var p = {a: true}
  var a = Object.create(p);
  var c = Object.create(a);
  c.a; // true

// 3.5 new 객체 생성
  
  "new를 강제로 사용하도록"
  throw new Error('이 객체는 new를 사용하여 생성해야 합니다.')

// 3.6 클래스 상속

  function M () {}
  function N () {}
  N.prototype = new M();
  N.prototype.hop = function () {}
  var s = new N();
  s.hop()
  s instanceof N // true
  s instanceof M // true
  

  "함수형"

  함수형 상속을 하면 데이터를 숨긴 채 접근을 다스릴 수 있다.
  
  var A = A || {};
  
  A.M = function (e, c) {
    
    var e = e,
      c = c;
      
    return {
      getA () {
        return e // 제스터
      },
      getB () {
        return c // false
      }
    };
  };
  
  A.K = function (e) {
    
    var b = A.M(e, false);
    
    b.h = function () {
      return b.getA() + ' 껑충';
    }
    
    return b;
  };
  
  var j = A.K('제스터');
  j.getA() // 제스터
  j.getB() // false 
  j.h() // 제스터 껑충


// -------------------------------------------------------------------------------

"2부 패턴을 응용한 코드 테스팅"
  
  프라미스 패턴은 비동기 액션을 초기화하고 성공과 실패 케이스를 각각 처리할 콜백을 준다. 프라미스를 깨우치고 나면 이벤트 기반의 비동기 프로그래밍보다 훨씬 더 이해하기 쉽고 우아하며 탄탄한 코드를 작성할 수 있다.

// -------------------------------------------------------------------------------

// 5장 콜백 패턴
  
  콜백은 나중에 실행할 부차 함수에 인자로 넣는 함수다. 여기서 코백이 실행될 '나중' 시점이 부차 함수의 실행 완료 이전이면 '동기', 반대로 실행 완료 이후면 '비동기'라고 본다.
  
  
  var C = C || {};
  C.a = function (f, l) {
    var k = false,
      f = f || 'None',
      l = l || 'None';
    
    return {
      g () {
        return f + ' ' + l;
      },
      i () {
        return k;
      },
      e () {
        k = true;
      }
    }
  }
  
  
  var friends = ["Mike", "Stacy", "Andy", "Rick"]; 
  friends.forEach(function (eachName, index) { 
    index + 1 + ". " + eachName 
    // 1. Mike, 2. Stacy, 3. Andy, 4. Rick 
  });
  
  콜백 패턴은 클로저다.
  

// -------------------------------------------------------------------------------

// 6장 프라미스 패턴
  
  Promise는 자바스크립트 비동기 처리에 사용되는 객체
  
  //Promise 선언
  var _promise = function (param) {
  	return new Promise(function (resolve, reject) {
  		// 비동기를 표현하기 위해 setTimeout 함수를 사용 
  		window.setTimeout(function () {
  			if (param) { // 파라메터가 참이면, 
  				resolve("해결 완료");
  			} else { // 파라메터가 거짓이면, 
  				reject(Error("실패!!"));
  			}
  		}, 3000);
  	});
  };
  
  //Promise 실행
  _promise(true)
  .then(function (text) { // 성공시
  	console.log(text);
  }, function (error) { // 실패시
  	console.error(error);
  });
  
  
  "콜백 패턴"
  function getData (callback) {
    $.get('url 주소/products/1', function (response) {
      callback(response);
      // 서버에서 받은 데이터 response를 callbackFunc() 함수에 넘겨줌
    });
  }
  getData(function (tableData) {
    console.log(tableData); 
    // $.get()의 response 값이 tableData에 전달됨
  });
  
  "프라미스 패턴"  
  function getData(callback) {
    return new Promise(function (resolve, reject) {
      $.get('url 주소/products/1', function (response) {
        resolve(response); // 데이터를 받으면 resolve() 호출
      });
    });
  }
  getData().then(function (tableData) { // getData()의 실행이 끝나면 호출되는 then()
    console.log(tableData); // resolve()의 결과 값이 여기로 전달됨
  });
  
  
  function getData() {
    return new Promise(function (resolve, reject) {
      $.get('url 주소/products/1', function (response) {
        if (response) resolve(response);
        reject(new Error("Request is failed"));
      });
    });
  }
  // Fulfilled 또는 Rejected의 결과 값 출력
  getData().then(function (data) {
    console.log(data); // response 값 출력
  }).catch(function (err) {
    console.error(err); // Error 출력
  });
  
  
  new Promise(function(resolve, reject){
    setTimeout(function() {
      resolve(1);
    }, 2000);
  })
  .then(function(result) {
    console.log(result); // 1
    return result + 10;
  })
  .then(function(result) {
    console.log(result); // 11
    return result + 20;
  })
  .then(function(result) {
    console.log(result); // 31
  });
  
  제이쿼리 프로미스는 기본적으로 공식 구현을 따르지 않아서 문제가 있습니다. 에러 처리와 프로미스 실행 순서에 관한 문제입니다. 하지만 복잡한 프로미스를 구현하지 않는 이상은 그 문제가 발생하지 않기 때문에 그냥 사용하셔도 됩니다. (제이쿼리 3.0에서는 그 문제가 해결되었습니다)

  제이쿼리는 프로미스를 사용할 수 있게 Deferred라는 객체를 제공합니다. 이 객체를 사용하면 일반 코드도 프로미스처럼 사용할 수 있습니다.
  
  
  var longAndComplicatedFunction = function () {
    try {
      
      // 완료되려면 50초가 걸리는 매우 복잡한 코드
      
      console.log('성공');
    } catch (err) {
      console.log('실패');
    }
  };
  longAndComplicatedFunction();
  
  console.log('다음 행동');
  
  // 이렇게 복잡한 코드가 있으면 이 코드를 실행하는 50초 동안은 아무 것도 할 수 없습니다. 50초 후에야 다음 행동이 실행될 겁니다. 사용자들은 멍하니 기다리거나 화가 나서 앱을 종료할 겁니다.


  이렇 때 비동기 프로그래밍이 필요합니다. 
  흔히 콜백 형식이나 프로미스 형식을 사용하는 데, 콜백 형식은 점점 더 코드가 복잡해지는 문제를 발생시키기 때문에, 콜백이 여러 번 중첩될 것 같으면 프로미스 형식을 사용해야합니다.
  
  
  var longAndComplicatedFunction = function() {
    var deferred = $.Deferred();
    
    try {
      
      // 완료되려면 50초가 걸리는 매우 복잡한 비동기 코드
      
      deferred.resolve('성공');
    } catch (err) {
      deferred.reject(err);
    }
    
    return deferred.promise();
  };
  
  longAndComplicatedFunction()
  .done(function(message) {
    console.log(message);
  }).fail(function(error) {
    console.log(error);
  }).always(function() {
    console.log('완료!');
  });
  
  console.log('다음 행동');
  
  // 이렇게 $.Deferred()로 deferred 객체를 만들고, 성공했을 때에는 resolve, 실패했을 때에는 reject 메소드를 호출하면 resolve는 done으로, reject는 fail로 연결됩니다.

  // 이제 비동기 방식으로 했기 때문에 다음 행동은 50초를 기다릴 필요 없이 바로 실행되고, 복잡한 행동이 완료되었을 시 등록해둔 done 메소드가 실행됩니다. 실패했다면 fail 메소드가 실행되고요.
  longAndComplicatedFunction 함수에서 deferred.promise()를 return하는 것을 잊지 마세요!

  // 참고로 done이나 fail로 구분하지 않고 한 번에 처리하려면 then 메소드가 있습니다. 
  // 첫 번째 인자는 성공 시 콜백이고, 두 번째 인자는 실패 시 콜백입니다. 
  // then도 연달아 쓸 수 있습니다.

  // $.when은 여러 개의 비동기 프로미스 함수를 동시에 처리할 수 있게 해줍니다.
  $.when(longFunc1(), longFunc2())
  .done(function(result1, result2) {
    console.log(result1, result2);
  });
  
  // $.when 안에 여러 개의 프로미스 함수를 넣어줍니다. 함수들이 모두 종료되었을 때 연결해둔 done 메소드의 콜백이 실행됩니다. longAndComplicatedFunction의 결과는 result1으로, longerAndMoreComplicatedFunction의 결과는 result2로 연결됩니다.

  // 여러 개의 프로미스를 동시에 처리할 수 있기 때문에 편리합니다. 특히 선행 조건으로 비동기 함수 여러개가 필요한 경우 $.when을 쓰면 효과적으로 코딩을 할 수 있습니다. done 메소드에서 비동기 함수의 결과들을 한 번에 받을 수 있으니까요.
  
  <button>Go</button>
  <p>Ready...</p>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
   
  $("button").on("click", function () {
    $("p").append("Started...");
   
    $("div").each(function (i) {
      $(this).fadeIn().fadeOut(1000 * (i + 1));
    });
   
    $("div").promise()
    .done(function () { // promise()
      $("p").append(" Finished! ");
    });
  });
  
  
  var effect = function () {
    return $("div").fadeIn(800).delay(1200).fadeOut();
  };
  
  $("button").on("click", function () {
    $("p").append(" Started... ");
   
    $.when(effect()) // $.when()
    .done(function () {
      $("p").append(" Finished! ");
    });
  });
  
// -------------------------------------------------------------------------------

// 7장 부분 적용 함수
    
  "커링"

// -------------------------------------------------------------------------------

// 8장 메모이제이션 패턴  

// -------------------------------------------------------------------------------

// 9장 싱글톤 패턴

// -------------------------------------------------------------------------------

// 10장 팩토리 패턴

// -------------------------------------------------------------------------------

// 11장 샌드박스 패턴

// -------------------------------------------------------------------------------

// 12장 장식자 패턴

// -------------------------------------------------------------------------------

// 13장 전략 패턴

// -------------------------------------------------------------------------------

// 14장 프록시 패턴

// -------------------------------------------------------------------------------

// 15장 체이너블 메서드

// -------------------------------------------------------------------------------

"3부 자바스크립트 고급 특성을 응용한 테스팅과 코딩"

// 16장 인터페이스 없는 언어에서 인터페이스에 맞추기
// 16.1 인터페이스가 좋은 점
// 16.2 인터페이스 분리 원칙 
// 16.3 TDD 방식으로 규약 레지스트리 생성하기 

// -------------------------------------------------------------------------------

// 17장 인자 타입 확실히 하기
// 17.1 자바스크립트는 인자 타입이 따로 없다! 
// 17.2 ContractRegistry를 확장하여 인자 체크하기
// 17.3 규약 라이브러리 지원 
// 17.4 모두 합치기 
// 17.5 애스팩트 지향 솔루션 vs 정적 솔루션 

// -------------------------------------------------------------------------------

// 18장 call, apply, bind 삼인방
// 18.1 this 바인딩 원리
// 18.2 call, apply, bind를 응용한 코드의 작성과 테스팅

// -------------------------------------------------------------------------------

// 19장 메소드 빌림
// 19.1 빌리는 객체가 알맞은가? 
// 19.2 빌리는 객체에 미치는 부수 효과 
// 19.3 빌려주는 객체에 미치는 부수 효과 

// -------------------------------------------------------------------------------

// 20장 믹스인

// -------------------------------------------------------------------------------

// 21장 고급 프로그램 아키텍처 테스팅
// 21.1 관찰자 패턴
// 21.2 중재자 패턴
