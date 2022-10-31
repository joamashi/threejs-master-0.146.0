/** 
 * http://youmightnotneedjquery.com/
 * https://developer.mozilla.org/ko/docs/Web/API/Node
 * 
*/

document.getElementById("divId"); 
document.getElementsByClassName("className"); 
document.getElementsByTagName("input");

$("#divId"); 
$(".className"); 
$("input");

/**
  ■ 캐시 https://github.com/fabiospampinato/cash
  캐시는 깃허브에서 3,570개 이상의 별을 받은 프로그램이다. 브라우저용 '매우 단순한 제이쿼리 대체재'로 유명하다. 캐시를 이용하면 제이쿼리 스타일의 문법으로 DOM을 사용할 수 있으며 압축 없이 32KB 공간만 차지한다. 네임스페이스 이벤트, 타입스크립트 형식, 현대화된 빌드 등을 지원한다.

  ■ 젭토 https://github.com/madrobby/zepto
  젭토는 폭넓은 제이쿼리 호환성을 지원하는 API가 포함된 초경량 자바스크립트 라이브러리다. 젭토 개발팀은 제이쿼리를 써온 개발자라면 젭토를 무리 없이 사용할 수 있다고 설명했다. 또한 제이쿼리보다 더 작고 빠르게 로드되며, 모바일 혹은 데스크톱 브라우저용 폰갭(PhoneGap) 툴셋과도 함께 사용할 수 있다.

  ■ 싱크퓨전 에센셜 JS 2
  싱크퓨전 에센셜 JS 2는 타입스크립트로 만든 상용 라이선스의 자바스크립트 UI 컨트롤 라이브러리다. 제이쿼리 UI 라이브러리의 대안으로, 웹 애플리케이션을 개선하면서도 부하가 적고, 가벼운 모듈형 라이브러리다. 싱크퓨전은 앵귤러와 리액트, 뷰 등의 프레임워크를 지원한다.
*/

// --------------------------------------------------------------------------------

$("#app")

document.getElementById("app")
document.querySelector("#app")

// --------------------------------------------------------------------------------

$(".container")

document.getElementsByClassName("container")
document.querySelector(".container")
document.querySelectorAll(".container")

// --------------------------------------------------------------------------------

$("div")

document.getElementsByTagName("div")
document.querySelector("div")
document.querySelectorAll("div")

// --------------------------------------------------------------------------------

// <div data-product-id="G123">Guitar</div>
$("div").data("product-id")

document.querySelector("div").dataset.productId // 'G123'
document.querySelector("div").dataset.productId = "G456"
document.querySelector("div").getAttribute("data-product-id") // 'G123'

// --------------------------------------------------------------------------------

$.ready(() => {
  // start ...
});

document.addEventListener("DOMContentLoaded", () => {
  // start ...
})

// --------------------------------------------------------------------------------

$("a").on("click", evt => {
  // 이벤트 처리 ...
})

document.querySelector("a").addEventListener("click", evt => {
  // 이벤트 처리 ...
})

$("a").click()

document.querySelector("a").click()

// --------------------------------------------------------------------------------

$("a").trigger("@click")

const evt = new CustomEvent("@click")
document.dispatchEvent(evt)

const evt = new CustomEvent("@click", { detail: "some data" })
document.dispatchEvent(evt)

document.querySelector("a").addEventListener("@click", evt => {
  evt.detail // 'some data'
})

const evt = document.createEvent("CustomEvent")
evt.initCustomeEvent("@click", true, false, "some data")
document.dispatchEvent(evt)

// --------------------------------------------------------------------------------

$("#foo").addClass("active")

document.querySelector("#foo").classList.add("active")

document.querySelector("#foo").className += " active"

// --------------------------------------------------------------------------------

// 문자열 변경

$("#foo").text("Hello Chris")

document.querySelector("#foo").innerHTML = "Hello Chris"

// --------------------------------------------------------------------------------

// 비동기 요청

$.ajax("/resource").then(success, fail)

const req = new XMLHttpRequest()
req.open("GET", "/resource", true)
req.onreadystatechange = () => {
  if (req.readyState === 4) {
    if (req.status === 200) success()
    else faile()
  }
}
req.send(null)

// --------------------------------------------------------------------------------

$("li").each(() => {
  $(this) // li element
})

Array.from(document.querySelectorAll("li")).forEach(li => {

})

// --------------------------------------------------------------------------------

const obj3 = $.extend(obj1, obj2)

const obj3 = Object.assign({}, obj1, obj2)

// --------------------------------------------------------------------------------

/**
 * jQuery 는 개발자들이 DOM 조작을 좀 더 편리하게 할 수 있도록 도와주는 기능들을 갖고 있다. 가장 대표적으로 선택자 $ 를 예로 들 수 있다. 그렇지만 라이브러리라는 것이, 기존 네이티브 코드나 무언가를 래핑(wrapping)해서 새롭게 만든 코드 패키지이다 보니, jQuery 역시 그런 것들의 묶음집인데, 문제는 이 래핑(wrapping) 을 너무 많이 해놨다. 심지어 엘리먼트 하나 가지고 오는데도 한 세월이다. (조금 과장해서)
 * 
 * 자바스크립트의 코드가 jQuery 의 코드보다 약 87 배 가량 더 빠르다
 * 
 * 콜 트리(Call tree) 기록 / jQuery => buildFragment 가 무려 약 1 초를 차지
 */

// --------------------------------------------------------------------------------


/**
 * JSON
 * =================================================================================
 */

$.getJSON('/my/url', function (data) {/* */});


var request = new XMLHttpRequest();
request.open('GET', '/my/url', true);
request.onload = function() {
  if (this.status >= 200 && this.status < 400) {
    // Success!
    var data = JSON.parse(this.response);
  } else {
    // We reached our target server, but it returned an error
  }
};
request.onerror = function() {
  // There was a connection error of some sort
};
request.send();

/**
 * Post
 * =================================================================================
 */

$.ajax({ 
  type: 'POST', 
  url: '/my/url', 
  data: data
});

var request = new XMLHttpRequest();
request.open('POST', '/my/url', true);
request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
request.send(data);

/**
 * Request
 * =================================================================================
 */

$.ajax({ 
  type: 'GET',
  url: '/my/url',
  success: function(resp) {/* */},
  error: function() {/* */}
});

var request = new XMLHttpRequest();
request.open('GET', '/my/url', true);
request.onload = function() {
  if (this.status >= 200 && this.status < 400) {
    // Success!
    var resp = this.response;
  } else {
    // We reached our target server, but it returned an error
  }
};
request.onerror = function() {
  // There was a connection error of some sort
};
request.send();