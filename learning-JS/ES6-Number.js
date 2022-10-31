/*
    내장 객체에 새 프로퍼티/메서드를 다수 추가.
    개발자가 쉽게 처리할 수 있게 지원
    에러나기 쉬운 꼼수를 쓰지 않아도 숫자, 문자열, 배열에 여러 가지 기능 구현/
*/

'숫자'
// 2진수 추가
let a = 0b00001111; // 10진수 15의 2진수
let b = 15;

a === b // true

// 8진수 변경
var a = 017; // 10진수 15의 8진수
var a = 0o17; // 10진수 15의 8진수


// 자바스크립트는 모든 숫자를 64비트 부동 소수점 형태로 저장.
// 정수는 소수점이 없는, 즉 소수점이 0인 부동 소수점 숫자


// 정수 여부 판별
let a = 17.0;
Number.isInteger(a); // true

let b = 1.2;
Number.isInteger(b); // false

// isNaN() 함수는 숫자 여부를 판별. 숫자 아닌 값은 true, 그 외엔 false를 반환.
Number.isNaN('NaN');         // false
Number.isNaN(NaN);           // true
Number.isNaN('안녕하세요');     // false
Number.isNaN(12);            // false

isNaN('NaN');               // true
isNaN(NaN);                 // true
isNaN('안녕하세요');           // true
isNaN(12);                  // false
​
​
// 유한 숫자 여부 판별
Number.isFinite(10);    // true
Number.isFinite(NaN);   // false
Number.isFinite(null);  // false
Number.isFinite([]);    // false

isFinite(10);           // true
isFinite(NaN);          // false
isFinite(null);         // true
isFinite([]);           // true


// Number.isSafeInterger(number)

// Number.EPSILON
// 미세한 반올림 오차는 무시하고 부동 소수점 숫자를 비교하는 함수

0.1 + 0.2 == 0.3        // false
0.9 - 0.8 == 0.1        // false
0.1 + 0.2               // 0.30000000000000004
0.9 - 0.8               // 0.09999999999999998

function epsilonEqual (a, b) { // 두 값의 동등 여부를 비교
    return Math.abs(a - b) < Number.EPSILON;
}
epsilonEqual(0.1 + 0.2, 0.3); // true
epsilonEqual(0.9 - 0.8, 0.1); // true


'수학 연산'

// Math 객체에도 삼각, 산술 등의 연산 메서드가 대거 추가.
// 더분에 외부 라이브러리를 쓰지 않아도 정확도가 높고 성능 면에서도 최적화된 내장 메서드 사용

// 삼각 연산
Math.sinh(0);      // 0
Math.cosh(0);      // 1
Math.tanh(0);      // 0
Math.asinh(0);     // 0
Math.acosh(1);     // 0
Math.atanh(0);     // 0
Math.hypot(2,2,1); // 3. 피타고라스 정리


// 산술 연산
Math.log2(16);      // 4
Math.log10(1000);   // 3
Math.log1p(0);      // 0
Math.expm1(0);      // 0
Math.cbrt(8);       // 2


// 숫자 변환 및 숫자에서 정보를 추출하는 메서드.
// Math.imul() 함수는 32비트 정수 2개를 받아 곱한 결과값의 하위 32비트를 반환
// 자바스크립트에서 32비트 정수 곱셈을 할 수 잇는 유일한 방법

Math.imul(590, 5000000); // -1344967296. 32비트 정수 곱셈
590 * 5000000;          // 2950000000


// 32비트 숫자의 전치 제로 비트를 반환
Math.clz32(7);          // 29
Math.clz32(1000);       // 22
Math.clz32(295000000);  // 3


// 숫자가 음수, 양수, 0인지 반환
Math.sign(11);  // 1
Math.sign(-11); // -1
Math.sign(0);   // 0


// 가수부를 덜어낸 정수부 숫자만 반환
Math.trunc(11.17);  // 11
Math.trunc(-1.112); // -1


// 32비트 부동 솟수점 값으로 반올림
Math.fround(0);     // 0
Math.fround(1);     // 1
Math.fround(1.137); // 1.1369999647140503
Math.fround(1.5);   // 1.5