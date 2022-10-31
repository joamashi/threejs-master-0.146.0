$('div').data('foo', 52)
$('div').data('bar', {myType: 'test', count: 40})
$('div').data({baz: [1, 2, 3]})
$('div').data('foo') // 52
$('div').data() // {foo: 52, bar: {myType:'test', count:40}, baz: [1, 2, 3]}


$('div').data('park') // undefined
$('div').data('bar', 'footer') // key : value
$('div').data('bar') // footer


// <div data-role="page" data-option="{'name':'Jone'}">
$('div').data('role') // page
$('div').data('otion').name // Jone
// [data-role="page"] { color:red}


var div = $('div')[0]
$.data(div, 'foo', 52)
$.data(div, 'test', {first: 16, last: 'pizza'})
$.data(div, 'test').first // 16
$.data(div, 'test').last // pizza


$('div').removeData(div, 'foo')
$.removeData(div, 'foo')


$.hasData(div) // true