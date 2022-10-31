(function(Core){
	'use strict';

	Core.register('module_switcher', function(sandbox){
		var Method = {
			moduleInit:function(){
				// structured content에서 ukkit에 switcher module를 사용할 때 categoryslider 리셋 처리
				$(this).on('show.uk.switcher', function(event, area){
					var $container = $(this).closest('.content-container').find('.tab-container.uk-switcher > *').eq($(area).index());
					var $slider = $container.find('[data-component-slider]');
					if( $slider.length > 0){

						Core.getComponents('component_slider', {context:$container}, function(){
							$(this)[0].redrawSlider();
						});

						//$slider.bxSlider().reloadSlider();
					}

					/* image lazeload를 사용하지 않아 주석처리함 */
					/*setTimeout(function(e){
						$(window).trigger("scroll");
					}, 10);*/
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-switcher]',
					attrName:'data-module-switcher',
					moduleName:'module_switcher',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);