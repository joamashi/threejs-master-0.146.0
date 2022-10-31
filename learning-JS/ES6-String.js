"\u를 붙여 이스케이프"


// 주어진 인덱스의 캐릭터에 해당하는 코드 포인트를 음이 아닌 정수로 반환
"\uD83D\uDE91".codePointAt(1);  // 56977
"\u{1F691}".codePointAt(1);    // 56977
"hello".codePointAt(2);        // 108


// 코드 포인트 뭉치를 입력받아 해당 문자열을 반환
String.fromCodePoint(0x61, 0x62, 0x63); // abc
String.fromCodePoint("\u0061\u0062" == String.fromCodePoint(0x61, 0x62)) // true


// 문자열을 원하는 개수만큼 복사하여 연결된 문자열로 반환
"ㅋ".repeat(6); // ㅋㅋㅋㅋㅋㅋ


// 주어진 문자열이 있는지 찾아보고 그 결과를 true/false로 반환
"안녕, 나는 자바스크립트".includes("자바스크립트");     // true
"안녕, 나는 자바스크립트".includes("자바스크립트", 13); // false


// 주어진 문자열로 시작하는지 여부를 판별
"안녕, 나는 자바스크립트".startsWith("안녕, ");         // true
"안녕, 나는 자바스크립트".startsWith("자바스크립트", 7);  // true


// 주어진 문자열로 끝나는지 여부를 판별
"안녕, 나는 자바스크립트".endsWith("자바스크립트");     // true
"안녕, 나는 자바스크립트".endsWith("자바스크립트", 7);  // true


"정규화. normalization. 문자열 의미를 고정한 채 코드 포인트를 검색하고 표준화하는 과정"
// 정규화 유형. NFC, NFD, NFKC, NFKD

"\u00E9"                // e
"e\u0301"               // e
"\u00E9" == "e\u0301"   // false
"\u00E9".length         // 1
"e\u0301".length        // 2


var a = "\u00E9".normalize();
var b = "e\u0301".normalize();
a == b      // true
a.length    // 1
b.length    // 1



"템플릿 문자열"
// 문자열을 생성하는 새로운 리터럴. 표현식/문자열 삽입. 여러 줄 문자열, 문자열 형식화, 문자열 태깅 등 다양한 기능을 제공. 
// 런타임 시점에 일반 자바스크립트 문자열로 처리/변환되므로 안심하고 그냥 문자열처럼 사용.

    `안녕하세요!!!` // 템플릿 문자열

    // 표현식
    let a = 20;
    let b = 10;
    let c = "자바스크립트";
    let str = `나는 ${a+b}살이고 ${c}를 좋아함`;


    // 여러 줄 문자열
    "1\n2\n3"

    `1
    2
    3`

    // \n 대신 그냥 개행.