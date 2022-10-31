function countSeconds (num) { // 외부 함수
  for (var i = 1; i < num; i++) {
    setTimeout(function () { 
      console.log(i)
    }, i * 1000) // 내부 함수
  }
}
countSeconds(3)
// 4
// 4
// 4



function countSeconds (num) {
  setTimeout(function () { console.log(1)}, 1000)
  setTimeout(function () { console.log(2)}, 2000)
  setTimeout(function () { console.log(3)}, 3000)
}
countSeconds(3)
// 1
// 2
// 3



function countSeconds (num) {
  for (var i = 1; i < num; i++) {
    (function () {
      setTimeout(function () { 
        console.log(i)
      }, i * 1000)
    }())
  }
}
countSeconds(3)
// 1
// 2
// 3



function countSeconds (num) {
  for (var i = 1; i <= num; i++) {
    (function (n) {
      setTimeout(function () { 
        console.log(n)
      }, n * 1000)
    }(i))
  }
}
countSeconds(3)
// 1
// 2
// 3
