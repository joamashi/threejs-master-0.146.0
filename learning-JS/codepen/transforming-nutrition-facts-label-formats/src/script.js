$(function(){
    var timer, i=1;
    timer = setInterval(function(){
        if (i > 3) i = 1;
        $("main").removeClass().addClass("type--"+i);
        i++;
    }, 1600);
});

//$('input[type=radio]').change(function() {     
// 		if($(this).val() == "type-1"){   
// 	    $("main").removeClass().width();
// 			$('main').addClass('type--1');
//     }
//     else if($(this).val() == "type-2"){
// 			$("main").removeClass().width();
// 			$('main').addClass('type--2');
//     }
// 		else if($(this).val() == "type-3"){
// 			$("main").removeClass().width();
// 			$('main').addClass('type--3');
//     }
// });