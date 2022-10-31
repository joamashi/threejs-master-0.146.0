(function(Core){
	var LaunchItem = function(){
		'use strict';

		var $this, args, endPoint;
		var setting = {
			selector:'[data-component-launchitem]'
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
				endPoint = Core.getComponents('component_endpoint');

				// FEED IMAGES Lazy()
				// @pck 2020-10-26 호출 타이밍을 전체 카테고리 아이템 로드 후 로 변경
				//$('.launch-category .img-component').Lazy();

				// Launch 리스트 NOTIFY ME 버튼 노출
				if (!Core.Utils.mobileChk) {
					$this.find('.btn-box-notify')
						.mouseenter(function() {
							$this.find('.info-sect').addClass('opacity');
						})
						.mouseleave(function() {
							$this.find('.info-sect').removeClass('opacity');
						});
				}

				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_launchitem'] = {
		constructor:LaunchItem,
		reInit:true,
		attrName:'data-component-launchitem'
	}
})(Core);
