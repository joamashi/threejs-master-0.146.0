(function(Core){
	Core.register('module_mobilegnb', function(sandbox){

		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var args = arguments[0];
				var clickIS = false;
				var isSearch = false;

				// var $mobile = $('#mobile-menu');
				var $mobile = $('#' + $this.attr('id'));
				$mobile.find('.mobile-onedepth_list').on('click', '> a.mobile-menu-dynamic', function(e){
					if(!$(this).hasClass('link')){
						e.preventDefault();
						$(this).hide();
						$(this).parent().siblings().hide();
						$('#layout-mobile-menu-user').hide();
						$('#layout-mobile-menu-static').hide();
						$('ul.mobile-menu_onedepth').css("height","100%");
						$(this).siblings().show().stop().animate({'left':0}, 300);
					}
				});

				$mobile.find('.mobile-twodepth_list').on('click', '> a.mobile-menu-dynamic', function(e){
					if(!$(this).hasClass('link')){
						e.preventDefault();
						$(this).hide();
						$(this).parent().siblings().hide();
						$(this).siblings().show().stop().animate({'left':0}, 300);
					}
				});

				$mobile.find('.mobile-menu_twodepth > .location').on('click', function(e){
					e.preventDefault();
					$(this).parent().stop().animate({'left':-270}, 300, function(){
						$(this).css('left', 270).hide();
						$(this).parent().children(':first-child').show();
						$(this).parent().siblings().show();
						$('ul.mobile-menu_onedepth').css("height","auto");
						$('#layout-mobile-menu-user').show();
						$('#layout-mobile-menu-static').show();
					});
				});

				$mobile.find('.mobile-menu_threedepth > .location').on('click', function(e){
					e.preventDefault();
					$(this).parent().stop().animate({'left':-270}, 300, function(){
						$(this).css('left', 270).hide();
						$(this).parent().siblings().show();
						$(this).parent().children(':first-child').show();
					});
				});

				// 브랜드&서포트 메뉴 .mobile-onedepth_list CSS 위해서 Click 이벤트 동작하지 않아서 아래 function()로 처리
				$mobile.find('.mobile-onedepth_list').on('click', '> a.mobile-menu-static', function(e){
					var open_target = $(this).attr("target");
					if(typeof(open_target) == "undefined"){
						open_target = "_self";
					}
					if($(this).attr("href") != "#"){
						window.open($(this).attr("href"), open_target);
					}
				});

				// 모바일 , 테블릿 적용
				//검색 버튼 클릭시 검색창 오픈.
				$('.gnb-search-btn').click(function(e){
					e.preventDefault();

					//if($('body').attr('data-device')=='tablet'){
					//	$('.search-panel, .gnb-search-field').css('display', 'block');
					//	$('.search-field').find('input[type=search]').focus();
					//}

					if($('body').attr('data-device')=='mobile'){
						$("#mobile_new_search_fild").show();
					}
					//$("body").css({'position':'fixed'}); //20180516추가
				});


				$mobile.on('show.uk.offcanvas', function(event, area){
					try {
						Core.ga.pv('pageview', '/mobileMenu');
					} catch (error) {}
					//모바일메뉴 reset
					$('ul.mobile-menu_twodepth').css('left', 270).hide();
					$('ul.mobile-menu_threedepth').css('left', 270).hide();
					$('ul.mobile-menu_onedepth').css("height","auto");
					$('ul.mobile-menu_onedepth li').show();
					$('ul.mobile-menu_onedepth li a').show();
					$('#layout-mobile-menu-user').show();
					$('#layout-mobile-menu-static').show();

					//android 기본 브라우저에서 scroll down 시 메뉴 노출되지 않은 현상 때문에 clip css 삭제처리
					$('.uk-offcanvas-bar').removeAttr("style");
				});

				$mobile.on('hide.uk.offcanvas', function(event, area){
					if(isSearch){
						sandbox.getModule('module_search').searchTrigger();
					}
					isSearch = false;
				});

				$mobile.find('.mobile-lnb-search').on('click', function(e){
					e.preventDefault();
					isSearch = true;
					UIkit.offcanvas.hide();
				});
			}
		}
		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-mobilegnb]',
					attrName:'data-module-mobilegnb',
					moduleName:'module_mobilegnb',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);