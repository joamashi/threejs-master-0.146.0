function _3dspin(el) {
    var zAngle = el.value,
    	xAngle = 45,
    	sqSize = 7;
	document.querySelector(".surface").style.transform = "translate(0," + (sqSize*24) + "px) rotateX(" + xAngle + "deg) rotateZ(" + zAngle + "deg)";
}
var userEvent = "ontouchstart" in document.documentElement ? "input" : "mousemove";
document.getElementById("rotate").addEventListener(userEvent, function() {
	_3dspin(this);
});
document.getElementById("rotate").addEventListener("keydown", function(e) {
  if (e.keyCode >= 37 && e.keyCode <= 40) {
    _3dspin(this);
  }
});