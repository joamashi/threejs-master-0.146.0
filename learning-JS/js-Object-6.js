/* 
    <div id="switcher" class="switcher">
        <button id="switcher-default">Default</button>
        <button id="switcher-narrow">Narrow Column</button>
        <button id="switcher-large">Large Print</button>
    </div>

    <button id="button-1">button-1</button>
    <button id="button-2">button-2</button>

    <br>

    <button id="foo">foo</button>
    <button id="foo2">foo2</button>


    <div id="results"></div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> 
*/
​
function sayFoo () {
    'sayFoo'
}

function sayBar () {
    'sayBar'
}

function sayBaz () {
    'sayBaz'
}

var btn = document.getElementById('foo');
btn.addEventListener('click', sayFoo, false); // sayFoo
btn.addEventListener('click', sayBar, false); // sayBar
btn.addEventListener('click', sayBaz, false); // sayBaz

// -------------------------------------------------------------------------

var btn2 = document.getElementById('foo2');
var eventListener = {
    message: 'This is an event listener object',
    handleEvent: function (e) { // handleEvent
        this.message
    },
    ev: function (e) {
        'ev'
    }
}
btn2.addEventListener('click', eventListener, false); // This is an event listener object

// -------------------------------------------------------------------------

function setBodyClass (className) {
    $('body').removeClass().addClass(className);
    $('#switcher button').removeClass('selected');
    $('#switcher-' + className).addClass('selected');
}

var triggers = {
    D: 'default',
    N: 'narrow',
    L: 'large'
}

$('#switcher').click(function (e) {
    if ($(e.target).is('button')) {
        var bodyClass = e.target.id.split('-')[1];
        setBodyClass(bodyClass);
    }
});

$(document).keyup(function (e) {
    var key = String.fromCharCode(e.keyCode);
    if (key in triggers) setBodyClass(triggers[key]);
});

// -------------------------------------------------------------------------

function cunt () {
    var counter = 0;

    $('#button-1').click(function () {
        counter++;
        $.print('counter = ' + counter);
    })

    $('#button-2').click(function () {
        counter--;
        $.print('counter = ' + counter);
    })
}
cunt();