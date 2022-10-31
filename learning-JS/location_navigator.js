document.lastModified   // "02/10/2012 10:41:31"
document.title          // "네이버 :: 나의 경쟁력, 네이버"
document.referrer       // "http://section.blog.naver.com/SectionMain.nhn"
document.location

"location"

- 절대 어떤 경우에도 location.href를 사용하면 안 된다.
- mouseover이벤트를 focus 이벤트와 함께 사용  

location.reload()                           // 현재 문서 다시 읽어 오기
location.replace("http://www.naver.com")    // 현재 문서를 다른 url 문서로 바꾸기.
location.hash                               // ""
location.host                               // "www.naver.com"
location.hostname                           // "www.naver.com"
location.href                               // "http://www.naver.com/"
location.pathname                           // "/"
location.port                               // ""
location.protocol                           // "http:"

"window.location.origin"
var path = window.location.origin;
if (!window.location.origin) {
    path = window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}
href = path;

location.ancestorOrigins: DOMStringList
location.assign: function () { [native code] }
location.reload: function reload() { [native code] }
location.replace: function () { [native code] }
location.hash: ""
location.host: "notepage.me"
location.hostname: "notepage.me"
location.href: "http://notepage.me/notepage.ui/notepage.BOM.html"
location.origin: "http://notepage.me"
location.pathname: "/notepage.ui/notepage.BOM.html"
location.port: ""
location.protocol: "http:"
location.search: ""   
location.href = httpDomain + '/etc/';

"http://rayuela.kr/ex/r1311022240.html?q=location#ex48"
location.href       // http://rayuela.kr/ex/r1311022240.html?q=location#ex48
location.hash       // #ex48        
location.host       // rayuela.kr
location.pathname   // /ex/r1311022240.html 
location.protocol   // http:
location.search     // ?q=location
location.reload(true)

$(".btn").click(function (e) {
    $('#value').text(eval($(this).text()));
});

location.href = "/kosep/cm/search/main.do?cmSchKywrdText=" + encodeURIComponent($("#cmSchKywrdText").val());

location.href = "/backoffice/storeEmployee/list";


var currentPage = document.location.href; 
//현재 전체 주소를 가져온다. 예) http://www.naver.com

currentPage = currentPage.slice(7); 
//slice를 이용하여 앞에 http:// 빼고 가져올 수 있다. slice는 특정 인덱스부터 잘라낸다.

arr = currentPage.split("/");
//URL의 "/" 뒤에 나오는 값을 화용하여 split 이용하여 자를 수 있다.

currentPage = arr[2];
//  "/"에서 자른 것들을 배열로 저장되는데 2로 하면 2번째 위치 값이 내가 얻고자하는 값이다.




// ------------------------------------------------------------------------------------------




"navigator"

navigator.appCodeName: "Mozilla"
navigator.appName: "Netscape"
navigator.appVersion: "5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.76 Safari/537.36"
navigator.userAgent: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.76 Safari/537.36"
navigator.cookieEnabled: true
navigator.doNotTrack: null
navigator.geolocation: Geolocation
navigator.language: "ko"
navigator.mimeTypes: MimeTypeArray
navigator.onLine: true
navigator.platform: "Win32"
navigator.plugins: PluginArray
navigator.product: "Gecko"
navigator.productSub: "20030107"
navigator.vendor: "Google Inc."
navigator.vendorSub: ""
navigator.webkitPersistentStorage: StorageQuota
navigator.webkitTemporaryStorage: StorageQuota

appName : 웹브라우저 이름
appCodeName : 웹브라우저 코드 이름
appVersion : 웹브라우저 버전
appMinorVersion : 웹브라우저 마이너 버전
cookieEnabled : 쿠키 사용 가능 여부
onLine : 사용자 온라인 상태 여부
platform : 플랫폼
userAgent : 웹브라우저 이름 전체
userLanguage
language
​
​
​
​
​
​
​

navigator.userAgent
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.76 Safari/537.36"

navigator.userAgent.toLowerCase() // 소문자
"mozilla/5.0 (windows nt 6.1; wow64) applewebkit/537.36 (khtml, like gecko) chrome/32.0.1700.76 safari/537.36"

navigator.userAgent.toLowerCase().indexOf('chrome') < -1
!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()) // ie true

!navigator.userAgent.match(/(iP(hone|ad|od)|Android)/i)

var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );

var isMobile = {
    Mozilla: navigator.userAgent.match(/Mozilla/i)[0], 
    // "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.76 Safari/537.36"
    Android: navigator.userAgent.match(/Android/i),
    BlackBerry: navigator.userAgent.match(/BlackBerry/i),
    iOS: navigator.userAgent.match(/iPhone|iPad|iPod/i),
    Opera: navigator.userAgent.match(/Opera Mini/i),
    Windows: navigator.userAgent.match(/IEMobile/i)
};
isMobile.any = function () {
    return (isMobile["Mozilla"] || isMobile["Android"] || isMobile["Android"] || isMobile["BlackBerry"] || isMobile["iOS"] || isMobile["Opera"] || isMobile["Windows"]);
}
isMobile.any(); // ["Mozilla"]

var checkMobile = function(){
    var isMobile = false;
    var user = navigator.userAgent.toLowerCase();
    var mobileDevice = ['iphone','ipod','ipad','android','blackberry','windows ce','nokia','webos','opera mini','sonyericsson','opera mobi','iemobile'];

    for(var i=0; i<mobileDevice.length; i++){
        if(user.indexOf(mobileDevice[i]) != -1) isMobile = true;
    }
    return isMobile;
};

var checkMobile = function () {
    var isMobile = false;
    var user = navigator.userAgent.toLowerCase();
    var mobile = ['iphone','ipod','ipad','android','blackberry','windows ce','nokia','webos','opera mini','sonyericsson','opera mobi','iemobile'];

    $.each(mobile, function(i, val){
        if(user.indexOf(val) != -1) isMobile = true;
    });
    return isMobile;
};

var mobileKeyWords = ['iPhone', 'iPod', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson', 'Windows Phone'];
for (var word in mobileKeyWords){
    if (navigator.userAgent.match(mobileKeyWords[word]) != null){
        location.href = "http://m.xingfuhuxi.cn/mobile/";
        break;
    }
}

// <!--[if !IE]><!--><script>if (/*@cc_on!@*/false) {document.documentElement.className+=' ie10';}</script><!--<![endif]-->
// .ie10 .example {/* IE10-only styles go here */}

var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent); 
// Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)
// <html data-useragent="Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)">
// html[data-useragent*='MSIE 10.0'] h1 {color: blue;} 