var app = {
config: {
clickMessage: 'Hi'
},
clickHandler: function () {
console.log(this) // <a href="#" id="proxy">proxy</a>
alert(this.config.clickMessage) 
// Uncaught TypeError: Cannot read property 'clickMessage' of undefined
// 잡히지 않은 TypeError : undefined의 'clickMessage'속성을 읽을 수 없습니다.
},
clickHandlerProxy: function () {
console.log(this) // {config: { clickMessage: "Hi" }, clickHandler: ƒ(), clickHandlerProxy: ƒ()}
alert(this.config.clickMessage)
}
}
$('a#proxy1').on('click', app.clickHandler) 
$('a#proxy2').on('click', $.proxy(app, 'clickHandlerProxy')) // 'Hi'

// ---------------------------------------------------------------------------------------------

var obj = {
text: "John",
fun: function () {
$("#log").append(this.text)
$("#test2").off("click", obj.fun) // off
}
};
$("#test1").on("click", $.proxy(obj, "fun")) // John

// ---------------------------------------------------------------------------------------------

var obj_1 = {
text: "obj_1",
fun1: function (e) {
var element = e.target
$(element).css("background-color", "red")

$("#log").append("<h3>" + this.text + "</h3>")
$("#test2").off("click", this.fun1) // off
}
}

var obj_2 = {
text: "obj_2",
fun2: function (e) {
$("#log").append("<h4>" + this.text + "</h4>")
}
}

$("#test2")
.on("click", $.proxy(obj_1.fun1, obj_1)) // obj_1
.on("click", $.proxy(obj_2.fun2, obj_2)) // obj_2
.on("click", $.proxy(obj_2.fun2, obj_1)) // obj_1
.on("click", obj_2.fun2) // undefined

// me2 e.target : <button type=​"button" id=​"test2" style=​"background-color:​ red;​">​Test2​</button>
// you2 e.target : <button type=​"button" id=​"test2" style=​"background-color:​ red;​">​Test2​</button>
// you2 e.target : <button type=​"button" id=​"test2" style=​"background-color:​ red;​">​Test2​</button>
// you2 e.target : <button type=​"button" id=​"test2" style=​"background-color:​ red;​">​Test2​</button>​

// ---------------------------------------------------------------------------------------------

var obj_3 = {
type: "dog",
test: function (one, two, e) {

console.log(one) // {type: "cat"}
console.log(two) // {type: "fish"}
console.log(e)

$("#log")
.append(this.type) // dog
.append(one.type) // cat
.append(two.type) // fish
.append(e.type) // click
.append(e.target.type); // button
}
};

var they = { type: "fish" }
// var proxy = $.proxy(obj_3.test, obj_3, { type: "cat" }, they)
// $("#test3").on("click", proxy)
$("#test3").on("click", $.proxy(obj_3.test, obj_3, {type: "cat"}, they))