(function(Core){
	var ForgotPasswordModal = function(){
		'use strict';

		var $this, args, endPoint;
		var setting = {
			selector:'[data-component-forgotpasswordmodal]',
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

				/* pop modal */
				$this.click(function(e){
					e.preventDefault();
					Core.getModule('module_header').setModalHide(true).popForgotPassword(function(data){
						location.reload();
					});
				});

				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_forgotpasswordmodal'] = {
		constructor:ForgotPasswordModal,
		reInit:true,
		attrName:'data-component-forgotpasswordmodal'
	}
})(Core);