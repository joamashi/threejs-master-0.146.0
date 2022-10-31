(function(Core){
	var ResisterExtends = function(){
		'use strict';

		var $this, args;
		var setting = {
			selector:'[data-component-register-extends]'
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
				args = arguments[0];
				$this = $(setting.selector);

				Core.getComponents('component_textfield', {context:$this}, function(i){
					this.addEvent('focusout', function(){
						if($(this).attr('id') === 'emailAddress'){
							$this.find('input[name=userId]').val($(this).val());
						}
					});
				});

				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_register_extends'] = {
		constructor:ResisterExtends,
		reInit:true,
		attrName:'data-component-register-extends'
	}
})(Core);