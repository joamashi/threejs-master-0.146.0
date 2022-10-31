(function(Core){
	var Swipe = function () {
		'use strict';
		var _self, $this, args, opt = {}, swiper, mcShowType,
			mcSlidesPerView, mcSpaceBetween,
			tabletSlidesPerView, tabletSpaceBetween,
			pcSlidesPerView, pcSpaceBetween;

		var setting = {
			selector: '[data-component-swipe]',
			attrName: 'data-component-swipe'
		}

		var Closure = function () { }
		Closure.prototype = {
			setting: function () {
				var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
			},
			init: function () {
				_self = this;
				args = arguments[0] || {};

				// MOBILE
				mcSlidesPerView = args.mcSlidesPerView || 2;
				mcSpaceBetween = args.mcSpaceBetween || 8;

				// TABLET
				tabletSlidesPerView = args.tabletSlidesPerView || 2;
				tabletSpaceBetween = args.tabletSpaceBetween || 8;

				// PC
				pcSlidesPerView = args.pcSlidesPerView || 4;
				pcSpaceBetween = args.pcSpaceBetween || 16;

				$this = $(setting.selector);

				opt = {
					observer : true,
					observeParents : true,
					autoHeight : true,
					slidesPerView : pcSlidesPerView,
					spaceBetween : pcSpaceBetween,
					slidesPerGroup : pcSlidesPerView,
					slidesOffsetBefore : 0,
					slidesOffsetAfter : 0,
					freeMode : false,
					freeModeSticky : false,
					pagination : {
						el: '.swiper-pagination',
						clickable: true,
					},
					scrollbar : {
						el: '.swiper-scrollbar',
						hide: true,
						snapOnRelease: true,
					},
					breakpoints : {
						// TABLET & MOBILE <= 1024px
						1024: {
							slidesPerView : tabletSlidesPerView,
							spaceBetween : tabletSpaceBetween,
							slidesPerGroup : tabletSlidesPerView,
							slidesOffsetBefore : 0,
							slidesOffsetAfter : 0,
							freeMode : false,
							freeModeSticky : false,
						},
						// MOBILE <= 768px
						768: {
							slidesPerView : mcSlidesPerView,
							spaceBetween : mcSpaceBetween,
							slidesPerGroup : mcSlidesPerView,
							slidesOffsetBefore : 0,
							slidesOffsetAfter : 0,
							freeMode : true,
							freeModeSticky : true,
						}
					},
				};

				swiper = new Swiper($this, opt);
				return this;
			},
			getSwiper: function (){
				return swiper;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_swipe'] = {
		constructor: Swipe,
		reInit: true,
		attrName: 'data-component-swipe'
	}
})(Core);