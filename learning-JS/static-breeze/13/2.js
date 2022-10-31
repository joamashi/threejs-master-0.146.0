(function(Core){
	Core.register('module_personalize', function (sandbox) {

		var Method = {

			moduleInit: function () {
				// swipe 모듈을 따로 만듬
				return;

				var $this = $(this);
				
				var _slidesPerView = 5;

				// 개인화 다이나믹 스와프 기능 PC / iPad / mobile 분기처리

				if (typeof $this.data('module-personalize') === 'object') {
					_slidesPerView = $this.data('module-personalize').slidesPerView
				}
				var md = new MobileDetect(window.navigator.userAgent);
				if (md.mobile() == 'iPad') {
					var crossSaleswiper = new Swiper($this.find('.crossSale-swiper-personalize'), {
						slidesPerView: 'auto',
						slidesPerView: _slidesPerView,
						slidesPerGroup: _slidesPerView,
						spaceBetween: 10,
						pagination: {
							el: '.swiper-pagination',
							clickable: true,
						},
						scrollbar: {
							el: '.swiper-scrollbar',
							hide: true
						},
					});
				} else if (md.mobile()) {
					var crossSaleswiper = new Swiper($this.find('.crossSale-swiper-personalize'), {
						slidesPerView: 'auto',
						spaceBetween: 10,
						pagination: {
							el: '.swiper-pagination',
							clickable: true,
						},
						scrollbar: {
							el: '.swiper-scrollbar',
							hide: true
						},
					});
				} else {
					// PC
					var crossSaleswiper = new Swiper($this.find('.crossSale-swiper-personalize'), {
						slidesPerView: 5,
						slidesPerGroup: 5,
						spaceBetween: 16,
						simulateTouch: false,
						noSwiping: true,
                        noSwipingClass: 'no-swiping'
					});
				}
			}
		}

		return {
			init: function () {
				sandbox.uiInit({
					selector: '[data-module-personalize]',
					attrName: 'data-module-personalize',
					moduleName: 'module_personalize',
					handler: {
						context: this,
						method: Method.moduleInit
					}
				});
			}
		}
	});
})(Core);