(function(Core){
	var RegisterModal = function(){
		'use strict';

		var $this, args, endPoint;
		var setting = {
			selector:'[data-component-registermodal]',
			activeClass:'active'
		}

		var Closure = function(){}
		Closure.prototype = {
			setting:function(){
				var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
			},
			init:function(){
				// var _self = this;
				args = arguments[0];
				$this = $(setting.selector);
				//endPoint = Core.getComponents('component_endpoint');

				/* register */
				$this.click(function(e){
					e.preventDefault();

					// var _self = $(this);
					Core.getModule('module_header').popRegister(function(data){
						location.reload();
					});
				});

				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_registermodal'] = {
		constructor:RegisterModal,
		reInit:true,
		attrName:'data-component-registermodal'
	}
})(Core);