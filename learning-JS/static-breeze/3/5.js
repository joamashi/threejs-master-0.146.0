(function(Core){
	var LoginModal = function(){
		'use strict';

		var $this, args, endPoint;
		var setting = {
			selector:'[data-component-loginmodal]',
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
				var useKakaoEventPopup = _GLOBAL.SITE_PROPERTY.USE_KAKAO_EVENT_POPUP;

				/* login */
				$this.click(function(e){
					e.preventDefault();
					var isPopup = $(this).data('is-popup');
					if (useKakaoEventPopup && isPopup!=true) {
						_.delay( function(){
							Core.Loading.hide();
							UIkit.modal('#kakao-sync-modal-login').show();
						}, 300)
					}else{
						// var _self = $(this);
						Core.getModule('module_header').setModalHide(true).setLogin(function(data){
							// console.log('callback');
							location.reload();
						});
					}
				});

				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_loginmodal'] = {
		constructor:LoginModal,
		reInit:true,
		attrName:'data-component-loginmodal'
	}
})(Core);