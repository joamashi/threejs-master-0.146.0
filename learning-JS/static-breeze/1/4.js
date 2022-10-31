(function(Core){
	var Phone = function(){
		'use strict';

		var setting = {
			selector:'[data-component-phone]'
		}

		var Closure = function(){}
		Closure.prototype = {
			setting:function(){
				var opt = Array.prototype.slice.call(arguments).pop();

				$.extend(setting, opt);
				return this;
			},
			init:function(){
				var args = arguments[0] || {};
				var $this = $(setting.selector);
				$this.text(args.phonenum.replace(/(^[0-9]{2,3})-?([0-9]{3,4})-?([0-9]{4})$/g, '$1-$2-$3'));
				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_phone'] = {
		constructor:Phone,
		reInit:true,
		attrName:'data-component-phone'
	}
})(Core);