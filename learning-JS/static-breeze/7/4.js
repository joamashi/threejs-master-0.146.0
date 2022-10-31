(function(Core){
	Core.register('module_category', function(sandbox){
		var $that;
		var arrViewLineClass=['uk-width-medium-1-3', 'uk-width-large-1-2', 'uk-width-large-1-3', 'uk-width-large-1-4', 'uk-width-large-1-5'];

		var stickyHeader = $(".section-header"),
				contentFooter = $('.footer-contents'),
				contentsSide = $('.contents-side');

		// 새 카테고리 해더 sticky
		var newHeaderSticky = function(){
			var // stickyHeaderPos = $("section.content-area").offset().top,
					$window = $(window).scrollTop(),
					filterWrap = $('.filter-category-wrap').offset().top, // 필터 위치
					scrollBottom = $(document).height() - $(window).height() - contentFooter.height(); // 푸터 위치

			/*if ($window >= 60) {
				stickyHeader.addClass("sticky");
			} else {
				stickyHeader.removeClass("sticky");
			}*/

			if ($window >= filterWrap) {
					contentsSide.addClass('fixed');
					contentsSide.removeClass('fixedBottom');
				if ($window > scrollBottom) {
					contentsSide.addClass('fixedBottom');
					contentsSide.removeClass('fixed');
				}
			} else {
				contentsSide.removeClass('fixed');
				contentsSide.removeClass('fixedBottom');
			}
		}

		var Method = {
			moduleInit:function(){
				$this = $(this);

				// assist category 리스트 판별
				$(this).closest('body').addClass('module_category');

				//uk-width-medium-1-3 uk-width-large-1-3
				//view Length 2:maxLen
				$this.find('.select-view > button').click(function(e){
					e.preventDefault();

					if(!$(this).hasClass('active')){
						$(this).addClass('active').siblings().removeClass('active');

						var value = $(this).attr('data-value');

						$this.find('[data-component-categoryitem]').parent()
						.removeClass(arrViewLineClass.join(' '))
						.addClass('uk-width-large-1-'+value);

						//category lineSize
						sandbox.getModule('module_pagination').setLineSize(value);

						var $customBanner = $(this).closest('section').find('.item-list-wrap').find('.product-item.customBanner');

						if( $customBanner.length > 0){
							if( value <= 2 ){
								$customBanner.addClass('uk-hidden');
							}else{
								$customBanner.removeClass('uk-hidden');
							}
						}
					}
				});

				// 첫문자 대문자
				var firstLetterCap = function(string) {
					return string.charAt(0).toUpperCase() + string.slice(1);
				}

				// wideview toggle
				var toggleValue = '';
				$(document).on('click', '.wideToggle', function(){
					$('.content-area .pt_category').toggleClass('wideArticleView');
					$('.content-area .pt_category').hasClass('wideArticleView') ? toggleValue = 'on' : toggleValue = 'off';
					endPoint.call('wideToggleClick', toggleValue);
				})
				// wideview toggle on mobile
				$(document).on('click', '.btn-filter-open', function(){
					$('.content-area .pt_category').toggleClass('wideArticleView');
					$('.content-area .pt_category').hasClass('wideArticleView') ? toggleValue = 'on' : toggleValue = 'off';
					endPoint.call('wideToggleClick', toggleValue);
				})

				// section-broadcomb 포맷 변경 스크립트
				// 글로벌 사이트에 맞게 gnb 네비게이션 nike 삭제 요청
				//20191018 문지원님 요청.
				if (document.querySelector('.section-broadcomb')) {
					var broadcombHome = document.querySelector('.section-broadcomb a');
					var currentGender = broadcombHome.nextElementSibling;
					var currentGenderContent = currentGender.textContent.trim().toLowerCase();
					document.querySelector('.section-broadcomb a').remove();   //첫번째 home 삭제
					//broadcombHome.innerHTML = 'Nike';
					currentGender.innerHTML = ' ' + firstLetterCap(currentGenderContent);
					$('.section-broadcomb').show();
				}

				// 필터 라벨 첫문자 대문자
				/* 20190521 :영문 > 한글로 변경되면서 주석처리함
				var colorLabels = document.querySelectorAll('.productcolor-label');
				for (var i=0; i < colorLabels.length; i++) {
					colorLabels[i].innerHTML = firstLetterCap(colorLabels[i].textContent);
				}
				*/

				var throttle = function(callback, limit) {
					var wait = false;
					return function () {
						if (!wait) {
							callback.call();
							wait = true;
							setTimeout(function () {
									wait = false;
							}, limit);
						}
					}
				}

				$(window).scroll(function(){
					throttle(function(){
						newHeaderSticky();
					}(), 500);
				});


				// 로컬 이미지 url 강제 세팅
				// $(window).load(function(){
				// 	$('*').each(function(){
				// 		var preUrl = 'https://static-breeze.nike.co.kr/kr/ko_kr';
				// 		if ($(this).is('img')) {
				// 			var originSrc = $(this).attr('src');
				// 			$(this).attr('src', preUrl + originSrc);
				// 		}
				// 	})
				// })

			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-category]',
					attrName:'data-module-category',
					moduleName:'module_category',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			newHeaderSticky:function(){
				newHeaderSticky();
			}
		}
	});
})(Core);