(function(Core){
	'use strict';

	Core.register('module_text_banner', function(sandbox){
		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var $banner = $this.find('ul');
				var args = Array.prototype.slice.call(arguments).pop();
				
				//fade, horizontal, vertical
				$(this).removeClass('uk-hidden');
				var defaultOption = {
					onSliderLoad : function(){
						//$this.find('.text-wrap').width($this.find( ".bx-viewport" ).width() )
					},
					auto: true,
					autoDelay: 3000,	
					autoHover: true,
					speed: 800,
					pause: 3000,
					adaptiveHeight: true,
					pager: false,
					useCSS: false,
					mode: 'fade'
				}

				defaultOption = $.extend(defaultOption, args);

				if (defaultOption.mode === 'vertical') {
					defaultOption.adaptiveHeight = false;
				}

				if (defaultOption.pause == null && defaultOption.autoDelay != null) {
					defaultOption.pause = defaultOption.autoDelay;
				}

				var slider = $banner.bxSlider(defaultOption);

				$(this).find('.bxslider-controls .btn-next').on('click', function(e) {
					e.preventDefault();
					slider.goToNextSlide();
				});
				$(this).find('.bxslider-controls .btn-prev').on('click', function(e) {
					e.preventDefault();
					slider.goToPrevSlide();
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-text-banner]',
					attrName:'data-module-text-banner',
					moduleName:'module_text_banner',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);