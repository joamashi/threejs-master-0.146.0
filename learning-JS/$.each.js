$('#extend img').each(function (i) {
  $(this) // ?  
})
$('#extend img').each((i) => {
  $(this) // ?
})


var obj = { 'a': 1, 'b': 2}
$.each(obj, function (key, value) {
  key + ' : ' + value // a: 1
})


$.each([52, 97], function (index, value) {
  index + ' : ' + value // 0 : 52
})