(function(Core){
	var InputColor = function(){
		'use strict';
		var setting = {
			selector:'[data-component-color]',
			attrName:'data-component-color',
			container:'#product-option_color',

		}
        var opt, $this, $container, endPoint;

		var Closure = function(){}
		Closure.prototype = {
			setting:function(){
				var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
			},
			init:function(){
				var _self = this;
				opt = arguments[0]||{};

				$this = $(setting.selector);
				endPoint = Core.getComponents('component_endpoint');

				//show tool tip 
				$this.find('.input-radio').each(function(){
					$(this).mouseenter(function(){
						if($(this).find('.tooltip-pos').length){
							$(this).find('.tooltip-pos').show();
						};
					});

					$(this).mouseleave(function(){
						if($(this).find('.tooltip-pos').length){
							$(this).find('.tooltip-pos').hide();
						};
					});

					$(this).on('click', function(e){
						e.preventDefault();
						if( $(this).hasClass('checked') == false){
							endPoint.call('pdpColorClick', {'model': $(this).data('model')});
							window.location.href = $(this).attr("href");
						}
					})
					
				});
				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_color'] = {
		constructor:InputColor,
		attrName:'data-component-color',
		reInit:true
	}
})(Core);