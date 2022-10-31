XMLHttpRequest
// 데이터 요청 및 응답 처리

// GET  : 데이터를 URL에 포함시켜서 보냄
// POST : 요청 메시지 몸체에 담아 보냄

// 400 : 요청 실패 
// 401 : 권한 없음
// 403 : 접근 금지
// 404 : 문서를 찾을 수 없음
// 500 : 서버 내부 오류

// ------------------------------------------------------------------------------

var xmlHttp;

window.onload = function () {
    // 1. 브라우저에 따른 XMLHttpRequest 생성
    xmlHttp = createXMLHTTPObject();
    
    // 2. 요청에 대한 응답 처리 이벤트 리스너 등록
    xmlHttp.onreadystatechange = on_ReayStateChang;
    
    // 3. 서버로 보낼 데이터 생성
    var data = "key=value1&key2=value2";
    
    // 4. 클라이언트와 서버 간의 연결 요청 준비
    var strPram = "id=ddandongn&pw=sample";
    
    // 4-1. 서버로 보낼 데이터 전송 방식 설정. 대부분 GET, POST 중 하나 지정
    xmlHttp.open("GET", "data.php?" + strPram, true);
    
    // 4-2. 서버 측 응답 방식 설정. 동기, 비동기 중 선택
    xmlHttp.send("id=ddandongn&pw=sample"); 
     
    alert("전송시작");
};

// 1. 브라우저에 따른 XMLHttpRequst 생성
function createXMLHTTPObject () {
    
    var xhr = null;
    if (window.XMLHttpRequest) {
        // IE7 이상, 사파리, 파이어폭스, 오페라
        xhr = new XMLHttpRequst():
    } else {
        // IE5, IE6
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    return xhr; 
}

// 6. 응답 처리
function on_ReadyStateChange () {
    
    // 0 : 초기화 전
    // 1 : 로딩 중
    // 2 : 로딩 됨
    // 3 : 대화 상태
    // 4 : 데이터 전송 완료
    
    XMLHttpRequst().open(method, url, async)
    XMLHttpRequst().send(data)
    
    XMLHttpRequst().readyState
    // 요청 상태 0, 1, 2, 3, 4
    
    XMLHttpRequst().onreadystatechange
    
    XMLHttpRequst().responseText
    XMLHttpRequst().responseXML
    
    XMLHttpRequst().status
    // 응답 상태 200, 400
    
    XMLHttpRequst().statusText
    // 응답 반환된 상태 메시지
    
    if (xmlHttp.readyState == 4) {
        
        // 200 : 에러 없음
        // 400 : 페이지가 존재하지 않음
        
        if (xmlHttp.status == 200) {
            // 7. 이제 이 부분에서 서버에서 보낸 데이터를 처리
            alert("데이터 처리");
        }
        
    } else {
        alert("처리 중 에러가 발생");
    }
}

// ------------------------------------------------------------------------------
    
// $.get(url, data, success(data, textStatus, jqXHR), dataType)

$result = "<result><succes>true</succes></result>";
echo($result);

var param = {user:"notepage", pw:"123456"};
$.get("login.php", param, function (data) {
    if ($(data).find("succes") == "true") {
        // 정상처리   
    }
}).error(function () {
    // 에러    
});

// ------------------------------------------------------------------------------

// $.getJSON(url, data, success(data, textStatus, jqXHR))

$result = '{"result":{"success":"true"}}';
echo($result);

var param = {user:"notepage", pw:"123456"};
$.getJSON("login.php", param, function (data) {
    if (data.result.success == "true") {
        // 정상처리   
    }
}).error(function () {
    // 에러    
});

// ------------------------------------------------------------------------------

// $.post(url, data, success(data, textStatus, jqXHR))

$result = '{"result":{"success":"true"}}';
echo($result);

var param = {user:"notepage", pw:"123456"};
$.post("login.php", param, function (data) {
    if (data.result.success == "true") {
        // 정상처리   
    }
}).error(function () {
    // 에러    
});

// ------------------------------------------------------------------------------

// $.ajax(settings)

$result = '{"result":{"success":"true"}}';
echo($result);

var param = {user:"notepage", pw:"123456"};
$.ajax({
    url: "login.php",
    data: parem,
    type: "GET",
    dataType: "JSON",
    success: function (data) {
        if (data.result.success == "true") {
            // 정상처리
        }
    },
    error: function (jqXHR, textStatus, errorThrwn) {
        // 에러
    }
});

// ------------------------------------------------------------------------------

var ANIMATION_DURATION = 500;
var IMAGE_HEIGHT = 128;

var $bannerContainer;
var $bannerItems;

var nCurrentIndex;
var imageHeight;
var nBannerCount;
var nTimerID;

$(document).ready(function () {
    startLoadFile();
});

function startLoadFile () {
    $.getJSON("banner.json", true, function (objBannerInfo) {
        creatImages(objBannerInfo);
        init();
        setBannerPosition();
        startMove();
    });
}

function creatImages (objBannerInfo) {
    var banners = objBannerInfo.rows;
    var strDOM = "";
    
    for (var i = 0; i < banners.length; i++) {
        var banner = banners[i];
        
        strDOM += '<div>';
        strDOM += '<img src="' + banner.url + '" alt="' + title + '">';
        strDOM += '</div>';
    }
    
    var $bannerContainer = $("#banner_container");
    $bannerContainer.append(strDOM);
}

function init () {
   this.$bannerContainer = $("#banner_container");
   this.$bannerItems = $("#banner_container div");
   this.nCurrentIndex = 0;
   this.nTimerID = 0;
   this.nBannerCount = this.$bannerItems.length;
}

function setBannerPosition () {
    this.$bannerItems.css({opacity:0, top:IMAGE_HEIGHT});
    this.$bannerItems.eq(0).css({opacity:1, top:0});
}

function startMove () {
    this.nTimerID = setInterval(on_StartMove, 1000);
}

function on_StartMove () {
    if (nCurrentIndex + 1 >= nBannerCount) {
        showBannerAt(0);
    } else {
        showBannerAt(nCurrentIndex + 1);
    }
}

function showBannerAt (nIndex) {
    if (nCurrentIndex == nIndex || nIndex < 0 || nIndex >= nBannerCount) return;
    
    var $objOld = $bannerItems.eq(nCurrentIndex);
    var $objNew = $bannerItems.eq(nIndex);
    
    $objNew.css({top:IMAGE_HEIGHT, opacity:0});
    $objOld.animate({top:-IMAGE_HEIGHT, opacity:0}, ANIMATION_DURATION, "quintEaseOut");
    $objNew.animate({top:0, opacity:1}, ANIMATION_DURATION, "quintEaseOut");
    
    nCurrentIndex = nIndex;
}

// ------------------------------------------------------------------------------

"URL을 사용한 정보 보존"

function getQueryParam (name) {
   var name = name.replace(/[\[]/,"\\\[", "\\\[").replace(/[\]]/, "\\\]");
   var regexS = "[\\?&]" + name + "([^&#]*)";
   var regex = new RegExp(regexS);
   var results = regex.exec(window.location.href);
   
   if (results == null) {
        return null;
   } else {
        return results[1];
   }
}

window.loload = function () {
    document.getElementById("move").onClick = moveSquare;
    document.getElementById("size").onClick = resizeSquare;
    document.getElementById("color").onClick = changeColor;
    
    var move = getQueryParam("move");
    if (!move) return;
    
    var size = getQueryParam("size");
    var color = getQueryParam("color");
    
    var square = document.getElementById("square");
        square.style.left = move + "px";
        square.style.height = size + "px";
        square.style.width = size + "px";
        square.style.backgroundColor = "#" + color;
        
    document.getElementById("move").setAttribute("data-state", move);
    document.getElementById("size").setAttribute("data-state", size);
    document.getElementById("color").setAttribute("data-state", color);
}

function updateURL () {
    var move = document.getElementById("move").setAttribute("data-state");
    var color = document.getElementById("color").setAttribute("data-state");
    var size = document.getElementById("size").setAttribute("data-state");
    
    var link = document.getElementById("link");
    var path = location.protocol + "//" + location.hostname + location.pathname + "?move=" + move + "&size=" + size + "&color=" + color;
    
    link.innerHTML = "<p><a href='" + path + "'>정적 상태 링크</a></p>";
}

function moveSquare () {
    var move = parseInt(document.getElementById("move").getAttribute("data-state"));
    
    move += 100;
    
    document.getElementById("square").style.left = move + "px";
    document.getElementById("move").setAttribute("data-state", move);
    
    updateURL();
}

function resizeSquare () {
    var size = parseInt(document.getElementById("size").getAttribute("data-state"));
    
    size += 50;
    
    var square = document.getElementById("squsare");
        square.style.width = size + "px";
        square.style.height = size + "px";
    
    document.getElementById("size").getAttribute("data-state", size);
    
    updateURL();
}

function changeColor () {
    var color = document.getElementById("color").getAttribute("data-state");
    var hexcolor;
    
    if (color == "000ff") {
        hexcolor = "ffff00";
    } else {
        hexcolor = "0000ff";
    }
            
    document.getElementById("color").style.backgroundColor = "#" + hexcolor;
    document.getElementById("color").getAttribute("data-state", hexcolor);
    
    updateURL();
}

<button id="move" data-state="0">사각형 이동</button>
<button id="size" data-state="100">사각형 크기 증가</button>
<button id="color" data-state="ffff00">색상 변경</button>

<div id="link"></div>
<div id="square"></div>

// ------------------------------------------------------------------------------

"쿠키로 정보 보존"

// 데이터 크기 4k 미만

document.cookie = "cookiename=cookievaule; expires=date; path=path";

window.onload = function () {
    if (navigator.cookieEnabled) {
        document.getElementById("set").onclick = setCookie;
        document.getElementById("get").onclick = readCookie;
        document.getElementById("erase").onclick = eraseCookie;
    }     
};

// 쿠키 2011년에 만료되도록 설정
function setCookie () {
    var cookie = document.getElementById("cookie").value;
    var value = document.getElementById("value").value;
    
    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 11);
    
    var tmp = cookie + "=" + encodeURI(value) + "; expires=" + futureDate.toGMTString() + "; path=/";
    
    document.cookie = tmp;
}

// 각 쿠키는 세미콜론으로 분리되어 있음
function readCookie () {
    var key = document.getElementById("cookie").value;
    
    var cookie = document.cookie;
    var first = cookie.indexOf(key+ "=");
    
    // 쿠키 있으면
    if (first >= 0) {
        var str = cookie.substring(first, cookie.length);
        var last = str.indexOf(";");
        
        if (last < 0) last = str.length;
        
        str = str.substring(0, last).split("="); 
    } else {
        // "none found"
    }
}

// 쿠키 날짜를 과거로 설정하여 쿠키값 삭제
function eraseCookie () {
    var key = document.getElementById("cookie").value;
    
    var cookieDate = new Date();
    cookieDate.setDate(cookieDate.getDate() - 10);
    
    document.cookie = key + "=; expires=" + cookieDate.toGMTString() + "; path=/";
}

// <form>
//     <label for="cookie">쿠키 입력 : </label> <input type="text" id="cookie">
//     <label for="value">쿠키값 : </label> <input type="text" id="value">
// </form>

// <button id="set">쿠키 설정</button>
// <button id="get">쿠키 확인</button>
// <button id="erase">쿠키 삭제</button>

// ------------------------------------------------------------------------------

"history.pushState, window.onpopevent 사용 정보 보존"

// 새로 고침을 눌렀을 때 페이지 상태 보존

// window.onpopevent 페이지 상태 원래대로 복원

window.onload = function () {
    document.getElementById("next").onclick = nextPanel;
}

window.onpopstate = function (e) {
    if (e.state) return;
    
    var page = e.state.page;
    
    switch (page) {
        case "one" :
            functionOne();
            break;
        case "two" :
            functionOne();
            functionTwo();
            break;
        case "three" :
            functionOne();
            functionTwo();
            functionThree();
            break;
    }
}

function nextPanel () {
    var page = document.getElementById("next").getAttribute("data-page");
    
    switch (page) {
        case "zero" :
            functionOne();
            break;
        case "one" :
            functionTwo();
            break;
        case "two" :
            functionThree();
            break;
    }
}

// 버튼 클래스를 설정하고 상태 링크 작성 후 페이지에 추가
function setPage (page) {
    document.getElementById("next").setAttribute("data-page", page);
    window.history.pushState({page:page}, "Page" + page, "?page=" + page);
}

// ------------------------------------------------------------------------------

"sessionStorage"

// ------------------------------------------------------------------------------

"localStorage"

// ------------------------------------------------------------------------------

$.getJSON('b.json', function (data) {
    var html = '';
    
    $.each(data, function (entryIndex, entry) {
        html += '<div class="entry">';
        html += '<h3 class="term">' + entry.trem + '</h3>';
        html += '<div class="part">' + entry.part + '</div>';
        html += '<div class="definition">';
        html += entry.definition;
        
        if (entry.quote) {
            html += '<div class="quote">';
            $.each(entry.quote, function (linIndex, line) {
                html += '<div class="quote-line">' + line + '</div>';
            });
            
            if (entry.author) {
                html += '<div class="quote-author">' + entry.author + '</div>';
            }
            
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';
    });
    
    $("#dictionary").html(html);
});

// ------------------------------------------------------------------------------

url         // HTTP 요청을 할 대상이 되는 url
async       // true / false
cache       // true / false
contentType // 'application/x-www-form-urlencoded' 서버로 데이터를 전송할 때 콘텐츠 타입
type        // GET / POST
dataType    // html, json, jsonp, script, text
data        // 서버로 전송될 데이터 
processData // true / false 건네받은 객체가 문자열이 아닌 경우 ...