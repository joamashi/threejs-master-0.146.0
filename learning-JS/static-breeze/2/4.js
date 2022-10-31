(function(Core){
	var ISwiper = function(){
		'use strict';

		var $this, args, $slider, opt, $list, defaultWidth, widthMatch;
		var setting = {
			selector:'[data-component-slider]',
			list:'.slider-wrapper, ul',
			prev:'<i class="icon-arrow_left"></i>',
			next:'<i class="icon-arrow_right"></i>'
		}

		var slideWidth = function(sWidth){
			return sWidth / (args.maxSlides || 1) - (args.slideMargin || 0);
		}

		var Closure = function(){}
		Closure.prototype = {
			setting:function(){
				var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
			},
			init:function(){
				var _self = this;

				$this = $(setting.selector);
				$list = $this.find(setting.list);

				args = arguments[0];

				//var maxSlides = (Core.Utils.mobileChk === null) ? args.maxSlides||1 : args.minSlides||1;
				//console.log(_GLOBAL.LAYOUT.MAX_WIDTH / (args.maxSlides || 1) - (args.slideMargin||0));

				defaultWidth = (args.slideWidth === 'full' ? slideWidth($('body').width()) : args.slideWidth) || slideWidth(_GLOBAL.LAYOUT.MAX_WIDTH);
				opt = {
					//slideWidth:args.slideWidth || $this.width() / maxSlides,
					slideWidth:defaultWidth,
					minSlides:args.minSlides || 1,
					maxSlides:args.maxSlides || 1,
					moveSlides:args.moveSlide||args.maxSlide,
					slideMargin:parseInt(args.slideMargin)||0,
					auto:(args.auto != undefined) ? args.auto : false,
					autoHover: true,
					pager:(args.pager != undefined) ? args.pager : true,
					pagerCustom: (args.pagerCustom != undefined) ? args.pagerCustom : false,
					controls:(args.controls != undefined) ? args.controls : false,
					responsive:(args.responsive != undefined) ? args.responsive : true,
					infiniteLoop:(args.infiniteLoop != undefined) ? args.infiniteLoop  :  false,
					mobileViewType:(args.mobileViewType != undefined) ? args.mobileViewType : 'slider',
					mode:args.mode || 'horizontal',
					preloadImages:'all',
					hideControlOnEnd: args.hideControlOnEnd || false,
					prevText: setting.prev,
					nextText: setting.next,
					startSlide:(args.startSlide != undefined) ? args.startSlide : 0,

					onSliderLoad:function($slideElement, currnetIndex){
						setTimeout(function(){
							_self.fireEvent('onInit', $slider, [$slideElement, currnetIndex]);
						});
					},
					onSlideAfter: function($slideElement, oldIndex, newIndex){
						_self.fireEvent('slideAfter', $slider, [$slideElement, oldIndex, newIndex]);

                        /*setTimeout(function(e) {
                            $(window).trigger("scroll");
                        }, 10);*/
                    },
					onSlideBefore: function($slideElement, oldIndex, newIndex){
						_self.fireEvent('slideBefore', $slider, [$slideElement, oldIndex, newIndex]);

                        /*setTimeout(function(e) {
                            $(window).trigger("scroll");
                        }, 10);*/
                    }

				}

				$this.show();

				if( opt.minSlides == 1 || opt.mobileViewType == 'list' ){
					widthMatch = matchMedia("all and (max-width: 767px)");
					var widthHandler = function(matchList) {
					    if (matchList.matches) {
					    	opt.slideWidth = "767px";
					    	if( opt.mobileViewType == 'list' ){
								if( $slider ){
								    $($slider.closest(".swipe-container").context).addClass("destroy");
						    	    $slider.destroySlider();
						    	}else{
						    	    $($list.closest(".swipe-container").context).addClass("destroy");
						    	}
					    	}else{
					    		if( $slider ){
						    	    $slider.reloadSlider( opt );
						    	}else{
						    	    $slider = $list.bxSlider(opt);
						    	}
					    	}
					    } else {
							opt.slideWidth = defaultWidth;
					    	if( $slider ){
					    	   $($slider.closest(".swipe-container").context).removeClass("destroy");
					    	    $slider.reloadSlider( opt );
					    	}else{
					    	    $($list.closest(".swipe-container").context).removeClass("destroy");
					    	    $slider = $list.bxSlider(opt);
					    	}
					    }
					};
					widthMatch.addListener(widthHandler);
					widthHandler(widthMatch);
				}else{
					$slider = $list.bxSlider(opt);
				}

				$this.find('.bxslider-controls .btn-next').on('click', function(e) {
					e.preventDefault();
					$slider.goToNextSlide();
				});
				$this.find('.bxslider-controls .btn-prev').on('click', function(e) {
					e.preventDefault();
					$slider.goToPrevSlide();
				});

				$this.find('a').on('click', function(e) {
					_self.fireEvent('slideClick', this);
				});

				return this;
			},
			reloadSlider:function(index){
				opt.startSlide = (index) ? index : 0;
				$slider.reloadSlider( opt );
				return this;
			},
			redrawSlider:function(){
				$slider.redrawSlider();
				return this;
			},
			goToSlide:function(index){
				$slider.goToSlide(index);
				return this;
			},
			goToNextSlide:function(){
				$slider.goToNextSlide();
				return this;
			},
			goToPrevSlide:function(){
				$slider.goToPrevSlide();
				return this;
			},
			destroySlider:function(){
				$slider.destroySlider();
				return this;
			},
			getCurrentSlide:function(){
				return $slider.retCurrentSlide();
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_slider'] = {
		constructor:ISwiper,
		attrName:'data-component-slider',
		reInit:true
	}
})(Core);