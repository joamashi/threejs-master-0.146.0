"하이브리드 앱을 구현하는 기술"
​
    "더 좋은 앱 개발을 위한 노하우"
    
    
    // a 태그의 이동이나 click 이벤트 터치 이벤트 처리 후 0.3초의 지연 시간을 거쳐야 비로소 실행.
    // a 태그와 click 이벤트를 사용하지 않도록 한다.
    // <span ontouchstart="alert('hoge')">...</span>
    
    // Tappable : 모바일 브라우저에서 이용할 수 있는 탭 처리를 다루는 라이브러리
        
        tappable('#my-button', function () {
            alert('버튼이 눌렸습니다');
        });
   
    
    // FastClick : Tappable 보다 더욱 자연스럽게 이용할 수 있는 라이브러리
    // 한 번 초기화만으로 click 이벤트의 발생을 빠르게 해준다.
        
        window.addEventListener('load', function () {
            FastClick.attach(document.body);
        }, false);
    
    
    "제이쿼리 대신 Zepto.js"
    $(function () {
        $('.col').css('background-color', '#f00')
    });
    
    // 탭할 때 표시되는 하이라이트 없애기
    // a { -webkit-tap-higthlight-color: rgba(0,0,0,0)}
    
    // 팝업 메뉴 없애기
    // iOS의 WebView에서 링크를 오래 누르면 팝업 메뉴가 표시. 이를 막기 위해.
    // a { -webkit-touch-callout: none;}
    
    // 사용자가 문자를 선택할 수 없게 하기
    // a { -webkit-user-select: none;}
    
    
    // 콘텐츠 일부에 관성 스크롤 사용
    #foobar {
        -webkit-overflow-scrolling: touch;
        overflow: scroll;
        width: 200px;
        height: 200px;
    }

    #foober > * {
        -webkit-transform: translateZ(0px);
    }
    
    
    "인디케이터 이용"
    fgnass.github.io/spin.js
    
    var opts = {
        lines: 13,              // 표시할 줄 수
        length: 20,             // 길이
        width: 10,
        radius: 30,             // 내부 원의 반지름
        corners: 1,             // 코너의 둥글기
        rotate: 0,              // 회전 오프셋
        direction: 1,           // 1: 시계 반향, -1:반시계 반향
        color: '#000',
        speed: 1,               // 1초에 몇 번 회전하는가
        trail: 60,              // Afterglow percentage
        shadow: false,
        hwaccel: false,         // 하드웨어 가속을 사용
        className: 'spinner',
        zIndex: 2e9             // 기본 200000000
    };
    var target = document.getElementById('foo');
    var spinner = new Spinner(opts).spin(target);
    
    
    // body { -webkit-text-size-adjust: none;}

 
    // -----------------------------------------------------------------------------   
    

    // DOM 다시 그리기 비용 줄이기
    // HTML을 바로 해석하는 것이 아니라 DOM 트리 형태로 일단 변환하고 나서 렌더링하는 것.

    // 반복된 DOM 조작이 그리기를 느리게 한다.
        
        for (var i=l; i<10000; i++) {
            var div = document.createElement('div');
            div.innerHTML = "<h1>HelloWorld</h1>";
            document.body.appendChild(div); // 반복해서 DOM 요소를 DOM 트리에 삽입
        }
        
    // DOM에 삽입하는 처리를 한 번에 모이기
    
        // 랩퍼용 DOM 요소를 작성
        var base = document.createElement('div');
        for (var i=l; i<10000; i++) {
            var div = document.createElement('div');
            div.innerHTML = "<h1>HelloWorld</h1>";
            base.appendChild(div);
        }
        document.body.appendChild(base); // DOM 트리에 한 번에 삽입

    // DOM 요소를 모아서 삽입
        
        var fragment = document.createDocumentFragment();
        for (var i=l; i<10000; i++) {
            var div = document.createElement('div');
            div.innerHTML = "<h1>HelloWorld</h1>";
            fragment.appendChild(div);
        }
        document.body.appendChild(fragment); // fragment를 직접 appendChild로 삽입
    
    // DOM 트리에서 잘라내 조작한 후에 다시 삽입
        
        var target = document.getElementById('foo');
        
        // DOM 트리에서 잘라내기
        document.getElementById('foo-wrapper').removeChild(target);
        
        // 잘나낸 DOM 요소 이하를 반복해서 조작
        for (var i=0; i<target.childNodes.length; i++) {
            var element = target.childNodes[i];
            element.innerHTML = "<h1>HelloWorld</h1>";
        }
        
        // DOM 트리로 되돌린다
        document.getElementById('foo-wrapper').appendChild(target);
        

    // -----------------------------------------------------------------------------        
    
    "레이아웃 재계산 비용 줄이기"        
    
    "DOM을 갱신하거나 마진이나 패딩등의 스타일을 변경하면 뒤따르는 DOM 요소와 부모의 DOM 요소의 배치도 다시 계산해야 할 필요가 있다."
    
    // 1. 요소 크기 고정하기
        
        height와 width를 설정해두는 것이 좋다.
        #foot-menu { height:500px; width:100px;}
    
    // 2. 절대위치 지정하기
        
        DOM 요소 이하가 변경되더라도 부모 DOM 요소로 레이아웃 재계산이 전파되지 않게 된다.
        
    // 3. CSS Transforms 이용하기
        
        margin이나 padding처럼 레이아웃에 관련된 스타일 속성을 변경하면 DOM 요소의 레이아웃도 다시 계산. 레이아웃 재계산이 일어나지 않는 CSS Transforms를 이용.
        
        이동하기        translate
        확대,축소하기    scale
        회전하기        rotate
        비스듬히 변형하기 skew
        
        .foober {
            -webkit-ftarnsform: translateX(30px), translateY(15px);
        }
    
    // ---------------------------------------------------------------------------
    // 2차원 변형 함수
    // ---------------------------------------------------------------------------

        translateX(-30px)               // X좌표 이동
        translateY(50%)                 // Y좌표 이동
        translate(20px, 50px)
        rotate(90deg)
        scaleX(3)                       // X방향 확대,축소
        scaleY(1.2)                     // Y방향 확대,축소
        scale(1.2)
        skewX(10deg)                    // X방향 비스듬히 변형
        skewY(10deg)                    // Y방향 비스듬히 변형
        skew(10deg, 20deg)
        matrix(1,0,0,1,0,0)             // 요소의 변형을 어파인 변환 행렬로 지정

    // ---------------------------------------------------------------------------        


    // ---------------------------------------------------------------------------
    // 3차원 변형 함수
    // ---------------------------------------------------------------------------            
        
        translateZ(-30px)               // Z좌표 이동
        translate3D(10px, 44px, 200px)  
        rotateZ(40deg)                  // Z방향 회전
        rotate3D(0.5, 1, 1)
        skewZ(10deg)                    // Z방향 비스듬히 변형
        scaleZ(3)                       // Z방향 확대,축소
        scale3D(1.2)
        matrix3D(1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)

    // ---------------------------------------------------------------------------        
    
    // 공간의 깊이를 지정. 지정한 픽셀이 작으면 작을수록 3차원 변형의 원근감이 강해진다.
    // .footer { -webkit-perspective: 200px;}
    
    
    // DOM 트리 단순하게 만들기
    // DOM 트리의 구조가 거대하고 복잡해질수록 레이아웃 계산에 시간이 걸린다.

    // ----------------------------------------------------------------------------- 

    "JSON"
    // 데이터 직렬화 형식의 일종. 배열이나 오브젝트처럼 구조화된 데이터를 문자열로 표현.
    
    var object = JSON.parse(jsonString);
    
    var jsonString = JSON.stringify({
        id: '4050',
        item: {
            name: 'notepage',
            email: 'notenore@gmail.com',
            createAt: 13324234235
        }
    });
    
    - 문자열은 큰따옴표만 이용
    - 오브젝트의 키에는 반드시 큰따옴표 문자열을 지정
    - 정수는 10진수 표기만 사용. 16진수나 8진수 표기는 지원하지 않는다.
    - 주석도 지원하지 않는다.
    
    
    // eval 함수 보안상 취약점
    var object = eval(jsonString);

    // ----------------------------------------------------------------------------    

    "CSS 애니메이션"
    
    transition / animation
    
    -webkit-transition: 스트일 속성 이름, 애니메인션 시간, 타이밍 함수
    
    .foober { 
        width: 300px;
        background-color: red;
        -webkit-transition: background-color 400ms linear;
        -webkit-transition: background-color 400ms linear, width 400ms linear;
    }
    .foober:hover { width:100px; background-color:green;}

    
    ease                            // 처음과 끝이 부드럽게 변화
    linear                          // 직선적으로 일정한 속도로 변화
    ease-in                         // 부드럽게 시작되고 끝날 때는 갑자기 멈춘다
    ease-out                        // 갑자기 시작되고 끝날 때 부드럽게 변화
    ease-in-out                     // 처음과 끝이 부드럽게 변화
    cubic-bezier(x1, y1, x2, y2)    // 3차 베지어 곡선에 의해 변화
    
    
    레이아웃 재계산이 일어나지 않도록 하기
    // width, height, margin, padding 등의 스타일 속성을 변경하면 레이아웃을 다시 계산!
    
    
    그리기에 GPU 사용하기
    // -webkit-transform: translateZ(0px);
    
    
    iOS기기에서 깜박임 줄이기
    // translateX, translateY, translate 함수 사용하지 않기
    // backface-visibility를 설정하기
    // GPU로 그리는 영역을 작게 하기
    
    // 깜박이는 예
    -webkit-transform: translateX(10px) translateY(20px);
    
    // 깜박임 없애기
    -webkit-transform: translate3D(10px, 20px, 0px);
    
    // GPU를 사용할 때 애니메이션할 요소가 지나치게 큰 경우가 있다. 
    // 요소를 그릴 때는 우선 GPU의 메모리에 전송하고 나서 텍스처로 그리는데 이때 GPU의 텍스처는 크기가 제한되어 있다.
    
    // ----------------------------------------------------------------------------    
    
    "기기 정보 얻기"
    var isIOS = !!navigator.userAgent.match(/ipod|ipad|iphone/i);
    var isAndroid = !!navigator.userAgent.match(/android/i);
    
    if ($.os.phone) {
        console.log('스마트폰');
    } else if ($.os.tablet) {
        console.log('태블릿');
    }
    
    // 플랫폼 판별
    if ($.os.ios) {
    
    } else if ($.os.android) {
    
    }
    
    $.os.version
    
    
    $('li').on('touchstart', function () { ... });
        
    
"스토리지"  
    
    로컬 스토리지
    세션 스토리지
    파일 스토리지
    WebSQL 데이터베이스
    모바일 BaaS


"모바일 환경의 특징"

    touchstart
    touchmove
    touchend
    touchcancel // 시스템에서 터치를 취소했을 때 발생
    touchenter
    touchleave
    
    event.touches         // 모든 터치 목록
    event.targetTouches   // 이 터치 이벤트의 target에 대한 터치 목록
    event.changedTouches  // touchcancel과 touchend로 떨어져버린 터치 목록
    
    identifier  // 터치 인식하기 위한 고유 ID
    target      // touchstart 시의 DOM 요소
    // ----------------------------------------
    clientX     // X 좌표. 스크롤 포함하지 않는다
    clientY     // Y 좌표. 스크롤 포함하지 않는다
    // ----------------------------------------
    pageX       // X 좌표. 스크롤 포함
    pageY       // Y 좌표. 스크롤 포함
    // ----------------------------------------
    screenX     // 스크린 기준 X 좌표
    screenY     // 스크린 기준 Y 좌표
    

    
    "터치 좌표 구하기"
    
    // click 이벤트일 때
    document.addEventListener('click', function (e) {
        var x = e.clientX;
        var y = e.clientY;
    }, false);
    
    // 터치 이벤트일 때
    document.addEventListener('touchstart', function (e) {
        var x = e.touches[0].clientX;
        var y = e.touches[0].clientY;
    }, false);    
    
    
    
    "스크롤 금지"
    
    var foober = document.getElementById('foober');
    foober.addEventListener('touchmove', function (e) {
        e.preventDefault;
    }, false);
    
    
    
    "크롬에서 터치 이벤트 발생시키기"
    
    Emulation > Sensors > "Emulate touch screen" 체크
    
    
    "터치 이벤트는 마우스 이벤트보다 반드시 먼저 발생한다. click 이벤트는 300밀리초 후에 발생." 
    
    
    "제스처 감지"
        
        gesturestart    // 두 손가락을 터치했을 때 발생
        gesturechange   // 터치한 손가락을 움직였을 때 발생
        gestureend      // 터치한 손가락을 뗐을 때 발생
        
        // swipeLeft, swipeRight, swipeUp, swipeDown
        $(document).on('swipeLeft', function () { ... });
        
        // 750밀리초를 누르면 롱탭으로 판정
        $(document).on('longTap', function () { ... });
        
        // 더블탭
        $(document).on('doubleTap', function () { ... });
        
        
        "Hammer.js"
        // 멀티터치 제스처를 판별하기 위한 라이브러리.
        
        Hammer(domElement).on('tap', function () { ... });
        Hammer(domElement, {
            drag: false,
            transform: false
        }).on('tap', function () {
            ...
        });
    
    
    "디바이스 오리엔테이션"
        
        // 안드로이드 제외
        window.orientation
        
        if (90 === Math.abs(window.orientation)) {
            alert('landscape입니다');
        } else {
            alert('portrait입니다')
        }
        
        
        window.addEventListener('orientaionchange', function () {
            var orientaion = window.orientaion;    
        }, false);
        
        
    // <link rel="stylesheet" media="(orientaion:portrait)" href="portrait.css">
    // <link rel="stylesheet" media="(orientaion:landscape)" href="landscape.css">
     
     @media (orientaion:portrait) { ... }           
     @media (orientaion:landscape) { ... }    
     
     
     
    "뷰포트"
    // <meta name="viewport" content="width=device-width, inital-scale=1.0">     
        
        width           // 가로폭
        height          // 세로폭
        inital-scale    // 스케일 초기값 1.0
        user-scalable   // 스케일 조정 여부 yes, no
        min-scale       // 스케일 최소값
        max-scale       // 스케일 최대값
     
   
     

"디버그"
    
    "와이너리에 의한 웹 인스펙터"
        
        $ sudo npm install -g weinre
        
    "iOS 원격 웹 인스펙터"
        
    "크롬 원격 웹 인스펙터"    



"메모리 측정 / 절약"




"HTML5 하이브리드 앱 보안"




"자바스크립트와 네이브티브의 브릿지"




"WebView로 HTML5 하이브리드 앱 개발하기"