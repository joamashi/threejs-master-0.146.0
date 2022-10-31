(function(Core){
	var Tab = function(){
		'use strict';

		var $this, $tabs, args;
		var setting = {
			selector:'[data-component-tabs]',
			tab:'a',
			attrName:'data-component-tabs',
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
				var _self = this;
				args = arguments[0] || {};

				$this = $(setting.selector);
				$tabs = $this.find(setting.tab);

				$tabs.click(function(e){
					e.preventDefault();

					if(!$(this).hasClass(setting.activeClass)){
						$(this).addClass(setting.activeClass).siblings().removeClass(setting.activeClass);
						_self.fireEvent('tabClick', this, [$(this).index()]);
					}else if($(this).hasClass(setting.activeClass) && args.unlock === 'true'){
						$(this).removeClass(setting.activeClass);
						_self.fireEvent('tabClick', this, [$(this).index()]);
					}
				});

				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_tabs'] = {
		constructor:Tab,
		reInit:true,
		attrName:'data-component-tabs'
	}
})(Core);