(function(Core){
	'use strict';

	Core.register('module_slick_slider', function(sandbox){
		var Method = {
			moduleInit:function(){
				var args = Array.prototype.slice.call(arguments).pop();
				//Method.opts = args || {}

				// method.opts 로 정의되던 값을 data로 변경
				// module 단위는 개별 instance로 사용될 수 없어서 dom 기준으로 다시 처리
				// 추후 html에서 data로 처리 하던, component로 처리하던 하자

				for( var i in args ){
					$(this).data( i, args[i] );
				}
				Method.resizeEventList = [];
				Method.startSlider( $(this), Method.resizeEventList );
			},

			probablyMobile:function() {
				var Y = navigator.appVersion;
				var isAndroid = ( /android/gi ).test( Y );
				var isIOS = ( /iphone|ipad|ipod/gi ).test( Y );
				return ( isAndroid || isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test( navigator.userAgent ) );
			},

			getCssInt:function( $item, attr ) {
				var val = parseInt( (''+$item.css(attr)).replace('px',''), 10 );
				return isNaN(val) ? 0 : val;
			},

			// 고정 비율로 리사이즈 처리
			// 리사이즈시 성능 이슈가 있음..
			// 슬라이더의 배경이 보이고, 커짐.
			// 그리고 슬라이드 1번째가 아닌 경우 좌표를 재계산하느라 버벅임..
			// Slick.prototype.setPosition 참고..
			enableResponsiveResize:function( slick ) {
				var $slider = slick.$slider;

				var sliderWidth 	 = parseInt($slider.data('width'), 10);
				var sliderHeight 	 = parseInt($slider.data('height'), 10);
				var sliderMaxWidth 	 = typeof $slider.data('maxWidth') === 'undefined' ? 0 : parseInt($slider.data('maxWidth'), 10);
				var sliderResponseRate = sliderHeight / sliderWidth;
				var isFullWidth = $slider.data('fullWidth');
				// fade 가 아닌 경우 다시 받아야 함
				var $slideList = $slider.find('.slider-slide');
				var $sliderTrack = $slider.find('.slick-track');
				var $layerList = $slider.find('.slider-layer-position');
				var $layerContents = $slider.find('.slider-layer-content');
				var $item,tagName;
				$slideList.hide();

				//var w = $slider.width();
				//var w = $slider.parent().width();
				var w = $slider.parent().css({'transition':'none'}).innerWidth();

				// fullwidth 가 아닐때
				if( !isFullWidth ){
					// 가로 사이즈가 maxwidth를 못넘기도록 처리
					if( sliderMaxWidth !== 0 && sliderMaxWidth < w ) {
						w = sliderMaxWidth;
					}
				}

				var h = Math.ceil(sliderResponseRate * w);

				var itemWidth, itemHeight, itemPosition, itemStyle;
				$slider.css({width:w+'px',height:h+'px'});
				$slideList.css({width:w+'px',height:h+'px'});

				// console.log('brz_col-1of2' + ' = ' + $('.brz_col-1of2').first().innerWidth() );
				// console.log($slider.attr('id') + ' = ' + w);

				//Layer 비율에 의한 위치 이동
				$layerList.each(function( idx, item ){
					$item = $(item);
					itemWidth = $item.data('left');
					itemHeight = $item.data('top');
					//itemPosition = $item.position();
					// 좌표 % 선언시 고정 위치 환산하여 재계산 넣을거면 position 기반 환산 처리
					itemStyle = $item[0].style;
					if( itemWidth.indexOf('%') < 0 ) {
						itemWidth = parseInt(itemWidth.replace('px',''), 10);
						$item.css('left', Math.ceil(w * itemWidth / sliderWidth) +'px');
					}
					if( itemHeight.indexOf('%') < 0 ) {
						itemHeight = parseInt(itemHeight.replace('px',''), 10);
						$item.css('top', Math.ceil(h * itemHeight / sliderHeight) +'px');
					}
				});

				// layer 원본 비율 처리
				$layerContents.each(function( idx, item ){
					$item = $(item);
					tagName = ('' + item.tagName).toLowerCase();
					if( tagName == 'div' ) {
						$item.css('fontSize', Math.ceil(w * $item.data('fontSize') / sliderWidth) );
					} else if ( tagName == 'img' ) {
						$item.css('width', Math.ceil(w * $item.data('width') / sliderWidth) );
						$item.css('height', Math.ceil(h * $item.data('height') / sliderHeight) );
					}
				});


				// 리사이즈 버그 처리
				slick.setPosition();

				$slideList.show();
			},

			videoPause:function( slider ){
				var $video = slider.find('.slider-layer-content iframe');
				$.each( $video, function(){
					var src = $(this).attr('src');
					if( src.indexOf('youtube') > -1 ){
						$(this)[0].contentWindow.postMessage('{"event":"command", "func":"pauseVideo", "args":""}','*');
					}

					if( src.indexOf('vimeo') > -1 ){
						$(this)[0].contentWindow.postMessage('{"method":"pause"}','*');
					}
				})

			},

			resizeEvent:function( slick ){
				//console.time( 'resizeEvent' );
				var $slider = slick.$slider;
				var enableResponsive = $slider.data('enableResponsive');	// 고정비율 리사이즈 사용 처리 여부
				var hideOnMobile	 = $slider.data('hideOnMobile');		// 모바일 일때 숨김
				var hideUnder		 = $slider.data('hideUnder');			//
				var hideOver		 = $slider.data('hideOver');			//

				var isShow = true;
				if( hideOnMobile ) {
					isShow = isShow && (Method.probablyMobile() ? false  : true);
				}
				if( hideUnder !== 0 ) {
					isShow = isShow && ($slider.width() < hideUnder ? false  : true);
				}
				if( hideOver !== 0) {
					isShow = isShow && ($slider.width() > hideOver ? false  : true);
				}

				var $parent = null;

				if( $slider.parent().hasClass('content-container') ){
					$parent = $slider.parent();
				}

				if(isShow) {
					$slider.show();
					if( $parent != null ) $parent.removeClass('uk-margin-bottom-remove');
				} else {
					$slider.hide();
					Method.videoPause( $slider );
					if( $parent != null ) $parent.addClass('uk-margin-bottom-remove');
				}

				if( enableResponsive ) {
					setTimeout(function(){Method.enableResponsiveResize( slick );}, 0);
				}else {
					slick.$slides.show();
				}
				//console.timeEnd( 'resizeEvent' );
			},
			startSlider:function( $slider, resizeEventList ) {

				// admin setting 처리
				var $slideList = $slider.find('.slider-slide');
				var $layerList = $slider.find('.slider-layer-position');
				var $layerContents = $slider.find('.slider-layer-content');
				var $track = $slider.find('.slick-track');
				var sliderResponseRate = 0.4; // 최초 슬라이더 비율 (600/1500)

				// 슬라이더 배경 이미지
				if( $slider.data('backgroundImage') != 'null' ) {
					$slider.css('background-image', 'url(' + $slider.data('backgroundImage') +')');
				}

				var enableResponsive = $slider.data('enableResponsive');	// 고정비율 리사이즈 사용 처리 여부
				var autoplay 		 = $slider.data('startSlideShow'); 		//
				var sliderWidth 	 = parseInt($slider.data('width'), 10); 				//
				var sliderHeight 	 = parseInt($slider.data('height'), 10); 				//
				var sliderMaxWidth 	 = typeof $slider.data('maxWidth') === 'undefined' ? 0 : parseInt($slider.data('maxWidth'), 10);
				if( sliderMaxWidth !== 0 && sliderMaxWidth < sliderWidth ) {
					sliderWidth = sliderMaxWidth;
				}
				var $item, tagName, $video;
				var baseWidth;

				if ( enableResponsive ) {
					sliderResponseRate = sliderHeight / sliderWidth;
					baseWidth = $slider.parent().width();
					$slider.data("base-width", baseWidth);
					$slider.css({width:baseWidth+'px',height:Math.ceil(sliderResponseRate * baseWidth)+'px'});
				} else {
					$slider.css({width:sliderWidth+'px',height:sliderHeight+'px'});
					$slideList.css({width:sliderWidth+'px',height:sliderHeight+'px'});
				}

				// layer 원본 사이즈 data 기록
				$layerContents.each(function( idx, item ){
					$item = $(item);
					tagName = ('' + item.tagName).toLowerCase();
					$video = $item.find('iframe');
					$.each( $video, function(){
						var src = $(this).attr('src');
						if( src.indexOf('youtube') > -1 ){
							var param = {
								enablejsapi : 1,
								rel : 0
							}
							$(this).attr('src', Core.Utils.url.appendParamToURL($(this).attr('src'), 'enablejsapi', 1));
							$(this).attr('src', Core.Utils.url.appendParamToURL($(this).attr('src'), 'rel', 0));
						}
						if( src.indexOf('vimeo') > -1 ){
							$(this).attr('src', Core.Utils.url.appendParamToURL(src, 'api', 1));
						}
						console.log( $(this).attr('src') );
					})

					if( tagName == 'div' ) {
						$item.data('font-size', Method.getCssInt($item, 'fontSize'));
					} else if ( tagName == 'img' ) {
						if( typeof $item.data('width') === 'undefined' ) {
							$item.data('width', Method.getCssInt($item, 'width'));
						} else {
							$item.data('width', $item.data('width').replace('px',''));
						}
						if( typeof $item.data('height') === 'undefined' ) {
							$item.data('height', Method.getCssInt($item, 'height'));
						} else {
							$item.data('height', $item.data('height').replace('px',''));
						}
					}
					//  else {
					// 	// $item.find("img");
					// 	// $item.data('width', Method.getCssInt($item, 'width'));
					// 	// $item.data('height', Method.getCssInt($item, 'height'));
					// }
				});

				resizeEventList.push(Method.resizeEvent);


				var _slider = $slider.slick({
				    autoplay 		: autoplay,										// 자동 시작 여부
				    autoplaySpeed 	: 4000, 										// slide 넘어가는 속도   			=> slide 별 , slide.slideDuration
				    initialSlide	: $slider.data('startWithSlide'),				// 시작 슬라이드 번호
				    rtl 			: $slider.data('twoWaySlideShow'),				// 슬라이더 방향 전환 (right to left)
				    accessibility 	: $slider.data('keyboardNavigation'),			// 키보드 방향 전환 - Enables tabbing and arrow key navigation
				    draggable 		: true,											// Enables desktop dragging
				    swipe 			: $slider.data('touchNavigation'),				// 터치 방향 전환 - Enables touch swipe
				    touchMove 		: $slider.data('touchNavigation'),				// 터치 방향 전환 - Enables slide moving with touch
				    infinite		: true,											// 반복될 방향으로 무제한 이동 , false 인 경우 1,2,3,2,1,2,3  순으로 이동
				    fade 			: true,											// 넘김시 fade 효과 사용
				    speed 			: $slider.data('fadeDuration'),					// 장면이 변하는 속도 (애니메이션 처리 속도) Slide/Fade animation speed
				    arrows  		: $slider.data('showPrevNextButton'),			// 좌, 우 버튼 노출 여부
				    dots: true,														// 하단 네비게이션 컨트롤바
				    easing:'linear',
				    waitForAnimate: false,
				    slidesToShow: 1,
				    adaptiveHeight: false,
				    prevArrow:'<button type="button" class="slick-prev slick-arrow"><i class="icon-arrow_left"></i></button>',
				    nextArrow:'<button type="button" class="slick-next slick-arrow"><i class="icon-arrow_right"></i></button>'
				});

				var limitLoopCount = 0;
				if( $slider.data('forceStopAfterLoop') == true ){
					limitLoopCount = $slider.data('loops');
				}

				var loopCount = 0;
				if( limitLoopCount > 0 ) {
					_slider.on('afterChange', function(event, slick, currentSlide, nextSlide){
						if( currentSlide === slick.slideCount-1 ){
							loopCount++;
							if( loopCount >= limitLoopCount) {
								slick.paused = true;
							}
						}
					});
				}

				if( $slider.data('pauseOnHover') && autoplay ) {
					_slider.mouseenter(function(){_slider.slick('slickPause');}).mouseleave(function(){
						if(limitLoopCount < 1 || loopCount<limitLoopCount){_slider.slick('slickPlay');}
					});
				}

				if( $slider.data('showPrevNextButtonOnHover') ) {
					var arrowBtns = _slider.find(".slick-arrow").hide();
					_slider.mouseenter(function(){arrowBtns.show();}).mouseleave(function(){arrowBtns.hide();});
				}


				var naviDots = _slider.find(".slick-dots").hide();
				if( $slider.data('showSlideNavigationButton') ) {
					naviDots.show();
				} else {
					if( $slider.data('showSlideNavigationButtonOnHover') ) {
						_slider.mouseenter(function(){naviDots.show();}).mouseleave(function(){naviDots.hide();});
					}
				}

				_slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
					Method.videoPause(slick.$slider);
					var $thumb = $(this).parent().find(".slider-thumb ul>li");
					if( $thumb.length > 0 ){
						$thumb.removeClass("active");
						$thumb.eq(nextSlide).addClass("active");
					}
				});

				_slider.on('breforeResize', function(event, slick){
					//console.log(slick);
					Method.resizeEvent( slick );
				});

				// layer hover 구현 - image 등록시만 동작
				/*
				$slider.find('img.slider-layer-content').hover(function(event){
					var _this = $(this);
					var _hover = _this.data( 'hover' );
					if( !brz.util.isEmpty(_hover) ) {
						_this.attr( 'src', _hover );
					}
				}, function(event){
					var _this = $(this);
					var _primary = _this.data( 'primary' );
					if( !brz.util.isEmpty( _primary ) ) {
						_this.attr( 'src', _primary );
					}
				});
				*/

				// 최초 실행
				if( _slider.length > 0 ) {
					Method.resizeEvent( _slider.get(0).slick );
				}
			}


		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-slick-slider]',
					attrName:'data-module-slick-slider',
					moduleName:'module_slick_slider',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);