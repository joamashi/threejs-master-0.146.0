$(function() {
	// nav
	$.fn.nav = function(){
		$(document).on('mouseenter focusin', '.gnb nav>ul>li', function (e) {
			$('header').addClass('show');
		}).on('mouseleave focusout', '.gnb nav', function (e) {
			$('header').removeClass('show');
		})
	}
	$.fn.nav();
	



	/* 20190318 Main Visual*/

    //bxslider
    $(document).ready(function(){
		var bx_s_len = $('.bx-wrapper .swiper-slide').length;
		  $('.bx-wrapper').bxSlider({
			auto: true,
			pager: true,
			touchEnabled: false,
			controls: false,
			autoControlsCombine:true,
			autoControls:true,
		  });
	   $(".bx-controls-auto").css("left", 22 * bx_s_len);
      // var mql = window.matchMedia("screen and (max-width: 768px)"); mql.addListener(function(e) { if(!e.matches) { slider.reloadSlider(); } });
    });
    
	/* // 20190318 Main Visual*/


	/*20190517 pr_center*/
	
	//thum bxslider
	$(document).ready(function(){
	  $('.pr_slider').bxSlider({
		maxSlides:3,
		minSlides:3,
		moveSlides:3,
		pager: true,
		slideWidth:380,
		slideMargin:20, 
				touchEnabled: false,
				infiniteLoop: true,
	  });
	  var rentaControlSize = $(".pr_moive_list.rt .bx-pager-item").size();
	  var groupControlSize = $(".pr_moive_list.gr .bx-pager-item").size();
	  $(".pr_moive_list.rt .bx-controls").css("width", rentaControlSize * 22 + 120)
	  $(".pr_moive_list.gr .bx-controls").css("width", groupControlSize * 22 + 120)
	});

		
	/*20190517 pr_center*/


	$(document).on('mouseenter', '.our_biz_content>div', function (e) {
		$('.our_biz_content>div').removeClass('active');
		$('.our_biz_content>div').removeAttr('title');
		if($('body').hasClass('eng')){
			$(this).addClass('active').attr('title','select');
		}else{
			$(this).addClass('active').attr('title','선택됨');
		}
		
	});
	/* rental_history 제거
	var scollFlag = 0;
	$(window).scroll(function() {
	  var $el = $('.rental_history');
	  if(scollFlag == 0 && $(this).scrollTop() >= 1200)	{
		   $el.addClass('active');
			function pathDrawing(ctx, x0, y0, x1, y1, x2, y2, duration) {
				var start = null;

				var step = function pathDrawing(timestamp) {
				if (start === null)
					start = timestamp;

					var delta = timestamp - start,
					progress = Math.min(delta / duration, 1);

					// Clear canvas
					ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); //0, 0, ctx.canvas.width, ctx.canvas.height

					// Draw curve
					bezierSplit(ctx, x0, y0, x1, y1, x2, y2, -0.1, progress);//-0.1

					if (progress < 1) {
						window.requestAnimationFrame(step);
					}
				};

				window.requestAnimationFrame(step);
			}

			function bezierSplit(ctx, x0, y0, x1, y1, x2, y2, t0, t1) {
			    ctx.beginPath();
			    
				if( 0.0 == t0 && t1 == 1.0 ) {
					ctx.moveTo( x0, y0 );
					ctx.quadraticCurveTo( x1, y1, x2, y2 );

				} else if( t0 != t1 ) {
			        var t00 = t0 * t0,
			            t01 = 1.0 - t0,
			            t02 = t01 * t01,
			            t03 = 2.0 * t0 * t01;
			        
			        var nx0 = t02 * x0 + t03 * x1 + t00 * x2,
			            ny0 = t02 * y0 + t03 * y1 + t00 * y2;
			        
			        t00 = t1 * t1;
			        t01 = 1.0 - t1;
			        t02 = t01 * t01;
			        t03 = 2.0 * t1 * t01;     //2.0
			        
			        var nx2 = t02 * x0 + t03 * x1 + t00 * x2,
			            ny2 = t02 * y0 + t03 * y1 + t00 * y2;
			        
			        var nx1 = lerp ( lerp ( x0 , x1 , t0 ) , lerp ( x1 , x2 , t0 ) , t1 ),
			            ny1 = lerp ( lerp ( y0 , y1 , t0 ) , lerp ( y1 , y2 , t0 ) , t1 );
			        
			        ctx.moveTo( nx0, ny0 );
			        ctx.quadraticCurveTo( nx1, ny1, nx2, ny2 );
				}

				var grd=ctx.createLinearGradient(0,0,360,-180);//0,0,360,-180
			 		grd.addColorStop(0,"#534f50");
			 		grd.addColorStop(1,"#bf0214");


			    ctx.lineWidth = 20;
			    ctx.strokeStyle = grd;
			    ctx.stroke();   
			    ctx.closePath();

			}

			function lerp(v0, v1, t) {
			    return ( 1.0 - t ) * v0 + t * v1;
			}

			if($('.canvas_wrap').length > 0){
				var docCanvas = document.getElementById('myCanvas');
				var ctx = docCanvas.getContext('2d');
			}

			
			if($el.hasClass('active')){
				//pathDrawing(ctx, 0, 510, 850, 500, 1115, 145, 1680);
				pathDrawing(ctx, 0, 510, 850, 500, 1115, 145, 1700);
			}
		 //   $('.count').each(function () {
			//     var countTo = $(this).attr('data-count');
			// 	$(this).prop('Counter',$(this).text()).animate({
			// 		Counter: countTo
			// 	}, {
			// 		duration: 2000,
			// 		easing: 'easeOutQuart',
			// 		step: function (now) {
			// 			$(this).text(commaSeparateNumber(Math.ceil(now)));
			// 			setTimeout(function() {
			// 			   $('.history_chart .take .unit').show();
			// 			},600);
			// 		}
			// 	});
			// });
			// function commaSeparateNumber(val)
			// {
			// 	while (/(\d+)(\d{3})/.test(val.toString())){
			// 	  val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
			// 	}
			// 	return val;
			// }
			// setTimeout(function() {
			//    $('.txt.t1').addClass('active');
			// },1000);
			// setTimeout(function() {
			//    $('.txt.t1').addClass('fadeout');
			//    $('.txt.t2').addClass('active');
			// },4000);
			// setTimeout(function() {
			//    $('.txt.t2').addClass('fadeout');
			//    $('.txt.t3').addClass('active');
			// },7000);
			scollFlag = 1;
	  	}
	});
	*/
	var $listItem = $('.our_story_content .list li a'), $panel = $('.story_view_container .panel'), $viewContainer = $('.story_view_container');
	$(document).on('click', '.our_story_content .list li a', function (e) {
		e.preventDefault();
		var $select_id = $($(this).attr('href'));
		$listItem.removeClass('active');
		$('.our_story_content .list li a').removeAttr('title');
		$(this).addClass('active').attr('title','선택됨');
		$(this).closest('.our_story_content').addClass('show');
		$panel.hide();
		$select_id.show();
		setTimeout(function() {
			$viewContainer.fadeIn(300);
		}, 300);
	}).on('click', 'a.close_story', function (e) {
		e.preventDefault();
		$listItem.removeClass('active');
		$panel.hide();
		$viewContainer.hide();
		$('.our_story_content').removeClass('show');
	});
	$('.btn_family').on('click', function (e) {
		if($('.btn_family').hasClass('active')){
			$(this).removeClass('active').attr('title','더보기');
			$(this).parent().removeClass("active");
		}else{
			$(this).addClass('active').attr('title','접기');
			$(this).parent().addClass("active");
		}
		
	});
	// a11y Combobox
	$.fn.combobox = function(){
		var $options,$combobox,$listbox,selectedIndex = -1;
		$(".combobox button").on('keydown', handleKeyDown);
		$(".combobox button").on('click', function() {
			$combobox = $(this);
			$listbox = $combobox.closest(".combobox").find("ul");
			$listbox.toggle();
			if($(this).hasClass('active')){
				$(this).removeClass('active').attr('title','더보기');
			}else{
				$(this).addClass('active').attr('title','접기');;
			}
		});
		$(".combobox ul li").on('click', function() { 
			$combobox = $(this).closest(".combobox").find("button");
			$listbox = $(this).closest(".combobox").find("ul");
			$options = $(this).closest(".combobox").find("li");
			selectedIndex = $options.index($(this));
			selectOption();
			$options.removeClass('selected');
			$(this).addClass('selected');
			var panelShow = $(this).attr('rel')
			$('.pdf_panel').hide();
			$('#'+panelShow).show();
			close();
		});
		function open() {
			$listbox.show();
		}
		function close() {
			$listbox.hide();
			$combobox.removeAttr('aria-activedescendant');
			selectedIndex = -1;
		}
		function highlightOption() {
			var $option = $($options[selectedIndex]);
			$options.removeClass('selected');
			$option.addClass('selected');
			$combobox.attr('aria-activedescendant', $option.attr('id'));
		}
		function selectOption() {
		  $combobox.html($($options[selectedIndex]).html());
		}
		function handleKeyDown(event) {
		  var keyCode = event.keyCode;
		  $combobox = $(this);
		  $listbox = $(this).closest(".combobox").find("ul");
		  $options = $(this).closest(".combobox").find("li");
		  $listbox.toggle();
		  switch(keyCode) {
			case 9: // tab, esc
			case 27:
			  close();
			  break;
			case 13: // enter
			  if ($listbox.is(':visible')) {
				selectOption();
				close();
			  } else {
				open();
			  }
			  break;
			case 40: // down
			  open();
			  if (selectedIndex < $options.length-1) {
				selectedIndex++;
				highlightOption();
			  }
			  break;
			case 38: // up
			  open();
			  if (selectedIndex > 0) {
				selectedIndex--;
				highlightOption();
			  }
			  break;
		  }
		}
	};
	$.fn.combobox();
	// a11y popup
	$.fn.modalDialog = function(){
		var $modals = this,
			$focus ='a[href], area[href], input:not([disabled]), input:not([readonly]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]',
			$body = $('body'),
			$dialog = $('.dialog'),
			$gnb = $('#gnb');
		$dialog.attr('aria-hidden','true');
		$gnb.attr('aria-hidden','true');
		$modals.on('click', function(e){
			var $this = $(this);
			var $select_id = $($(this).attr('href'));
			var $sel_id_focus = $select_id.find($focus);
			var $focus_num = $select_id.find($focus).length;
			var $closBtn = $select_id.find('.dialog_close, .dialog_ok');
			var clickAnchor = $this.attr('href');
			var hrefFocus = this;
			e.preventDefault();
			$body.addClass('no_scroll');
			$body.append('<div class="dimmed" tabindex="-1"></div>');
			$(clickAnchor).siblings().find($focus).attr('tabindex','-1');
			$select_id.attr('tabindex', '0').attr({'aria-hidden':'false','aria-live':'polit'}).fadeIn(100).addClass('show').focus();
			$select_id.on('blur', function(){ $(this).removeAttr('tabindex'); });
			$($select_id).find($focus).last().on("keydown", function(e){
				if (e.which == 9) {
					if(e.shiftKey) {
						$($select_id).find($focus).eq($focus_num - 1).focus();
						e.stopPropagation();
					} else {
						$($select_id).find($focus).eq(0).focus();
						e.preventDefault();
					};
				};
			});
			$($select_id).find($focus).first().on("keydown", function(e){
				if(e.keyCode == 9) {
					if(e.shiftKey) {
						$($select_id).find($focus).eq($focus_num - 1).focus();
						e.preventDefault();
					};
				};
			});
			$($select_id).on("keydown", {msg:clickAnchor,msg2:hrefFocus}, function(e){
				if ( e.which == 27 ) {
					e.preventDefault();
					$.fn.hide_modal (e.data.msg,e.data.msg2 );
				};
				if( $(this).is(":focus") ){
					if(e.keyCode == 9) {
						if(e.shiftKey) {
							$($select_id).find($focus).eq($focus_num - 1).focus();
							e.preventDefault();
						};
					};
				};
			});
			$closBtn.on("click", {msg:clickAnchor,msg2:hrefFocus},function(e){
				e.preventDefault();
				$.fn.hide_modal (e.data.msg,e.data.msg2 );
			});		
		});
		$.fn.hide_modal = function (info, hrefFocus){
			$body.removeClass('no_scroll');
			$(info).attr('aria-hidden','true').removeClass('show').fadeOut(300);
			$(info).siblings().find($focus).removeAttr('tabindex');
			$('.dimmed').remove();
			setTimeout(function() { $(hrefFocus).focus(); }, 100);
		};
	};
	$('.dialog_open').modalDialog();
	$(document).click(function(e) {
		var a = e.target;
		if($(a).closest('.combobox, .f_family_site').length === 0) {
			$('.f_family_site').removeClass("active");
			$('.combobox ul').hide();
		 }
	});
	$.fn.tabHandler = function(_tabNav, _tabCon, _num){
		var initActNum=_num;
		var $tabNav=$(_tabNav);
		var $tabCon=$(_tabCon);
		var $navItem = $tabNav.find("li");

		$navItem.eq(initActNum).addClass("on" )
		$tabCon.hide();
		$tabCon.eq(initActNum).show();

		$tabNav.on('click','a',function(){
			//tab con
			var clickNum = $(this).parent().index();
			$navItem.removeClass("on").eq(clickNum).addClass("on");
			$tabCon.hide();
			$tabCon.eq(clickNum).show();
			$(this).blur();
			$tabNav.find('a').removeAttr('title');

			if($("body").hasClass('eng')){
				$(this).attr('title','currently tab');
			}else{
				$(this).attr('title','현재탭 선택됨');
			}

			
		});
	}
	// Naver Map
	$.fn.naverMap = function(mapNum, lat, lng){
		setTimeout(function() {
			// 2019-03-13 지도 API 변경 네이버 지도 -> 올레맵
			if(mapNum.indexOf("popMap") < 0) {
				$(".map3").html("<div id='map3' class='viewer'></div>");
				$(".map4").html("<div id='map4' class='viewer'></div>");
				$(".map5").html("<div id='map5' class='viewer'></div>");
			}else {
				$(".popMap1").html("<div id='popMap1' class='viewer'></div>");
				$(".popMap2").html("<div id='popMap2' class='viewer'></div>");
			}

			var position = new olleh.maps.LatLng(lat, lng);
			
			var mapOpts = {
				center: position
				, panControl: false
				, zoom: 10
				, mapTypeId: 'ROADMAP'
			};
			
			var map = new olleh.maps.Map(document.getElementById(mapNum), mapOpts);
			
			var marker = new olleh.maps.overlay.Marker({
				position: position
				, map: map
			});
		},200);
	}
	$(document).ready(function() {
		if($('.domestic').length > 0){
			$.fn.naverMap('map1', 37.505342, 127.052815);
			$.fn.naverMap('map2', 37.3893871988, 126.9425581996);
			$.fn.naverMap('map3', 37.505342, 127.052815);
			$.fn.naverMap('map4', 37.519873, 126.891332);
			$.fn.naverMap('map5', 37.504396, 127.053368);
		}
		if($('.overseas').length > 0){
			//$.fn.naverMap('map6', 37.5053210134, 127.0528618384);
			//$.fn.naverMap('map7', 37.3893871988, 126.9425581996);
			//$.fn.naverMap('map8', 37.3893871988, 126.9425581996);
			//$.fn.naverMap('map9', 37.3893871988, 126.9425581996);
		}
		if($('#popMap1').length > 0){
			$.fn.naverMap('popMap1', 37.5053210134, 127.0528618384);			
		}
		if($('#popMap2').length > 0){
			$.fn.naverMap('popMap2', 37.5053210134, 127.0528618384);			
		}

		$('.acco dt').click(function(){
			$('.acco dd').slideUp();
			$('.acco dt').find('span').removeClass('active');

			if($("body").hasClass('eng')){
				$('.acco dt').attr('title','Detailed view open');
			}else{
				$('.acco dt').attr('title','상세레이어 열기');
			}
			
			if(!$(this).next().is(":visible"))
			{
				$(this).next().slideDown();
				$(this).find('span').addClass('active');
				if($("body").hasClass('eng')){
					$(this).attr('title','Detailed view close');
				}else{
					$(this).attr('title','상세레이어 닫기');
				}				
			}
		});

	});
});