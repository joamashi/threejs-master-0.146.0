(function(Core){
	var ProductQuickView = function () {
		'use strict';
		var _self, $this, args;
		var setting = {
			url: Core.Utils.contextPath + '/processor/execute/product'
		};

		function open(url, option){
			if (!_.isEmpty(args.showActionButton)) {
				option.showActionButton = args.showActionButton;
			}

			// 상품 팝업 호출
			Core.ui.modal.ajax(url,{
				param: option,
				selector: '#quickview-wrap',
				fullscreen: false,
				show : function(){
					$(this).addClass('quickview');
					if (_.isEqual(args.actionType, 'confirm')) {
						// 장바구니 add 되었을 때 미니카트가 나오지 않고 confirm 창 오픈
						$('[data-btn-add-cart]').attr('action-type', 'confirm');
						//snkrs miniPDP의 경우 인터렉션 추가
						if( UI_SNKRS !== 'undefined' && document.body.classList.contains('snkrs') ){
							var targetEl = this.querySelector('[data-component-gallery]');
							if(targetEl !== null){
								UI_SNKRS().PDP.initGallerySwiper(targetEl);
							}
							UI_SNKRS().MINI_PDP.init(this); //스티키 외 miniPDP용 인터렉션 부 init 호출

							//SNKRS Collection Mini PDP opened event tagging
							var data = this.querySelector('#ctm_teg');
							if(data !== null){

								var isSoldOut = (this.querySelector('.product-soldout') !== null) ? true : false ;

								var param = {}; //초기화
								param.product_url = data.dataset.url;
								param.product = {
									product_category : (data.dataset.category !== undefined) ? data.dataset.category : '',
									product_name : (data.dataset.name !== undefined) ? data.dataset.name : '',
									product_id : (data.dataset.id !== undefined) ? data.dataset.id : '',
									product_quantity : (data.dataset.quantity !== undefined) ? data.dataset.quantity : '',
									product_unit_price : (data.dataset.unit_price !== undefined) ? data.dataset.unit_price : '',
									product_discount_price : (data.dataset.discount_price !== undefined) ? data.dataset.discount_price : '',
									product_inventory_status : (isSoldOut ? 'out of stock' : 'in stock'),
									avg_product_rating : (data.dataset.product_rating !== undefined) ? data.dataset.product_rating : '',
									price_status : (data.dataset.price_status !== undefined) ? data.dataset.price_status : '',
									number_of_product_review : (data.dataset.product_review !== undefined) ? data.dataset.product_review : '',
									product_finding_method : (data.dataset.finding_method !== undefined) ? data.dataset.finding_method : '',
								}

								endPoint.call('snkrsMiniPDPOpened', param);
							}

						}
					}
				}
			})

			/*  
			var modal = UIkit.modal('#common-modal');
			Core.Utils.ajax(url, 'GET', option, function (data) {
				var $modal = $('#common-modal');
				var domObject = $(data.responseText).find('#quickview-wrap');
				if (domObject.length < 1){
					UIkit.modal.alert('상품 정보를 불러올 수 없습니다.');
					return;
				}
				$modal.find('.contents').empty().append(domObject[0].outerHTML);
				$modal.addClass('quickview');
				Core.moduleEventInjection(domObject[0].outerHTML);

				if (_.isEqual(args.actionType,'confirm')){
					$('[data-btn-add-cart]').attr('action-type', 'confirm');
				}
				modal.show();
			}, true, false, 1500)
			*/
		}
		function openByProductId(productId) {
			var obj = {
				'id': productId,
				'mode': 'template',
				'accepted': true,
				'quickview': true,
				'templatePath': '/catalog/product',
			}
			open(setting.url, obj);
		}
		function openByProductUrl(url) {
			var obj = {
				'accepted': true,
				'quickview': true,
			}
			open(url, obj);
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
				args = arguments[0];
				$this = $(setting.selector);

				if (!_.isEmpty(args.productId)) {
					$this.on('click', function (){
						openByProductId(args.productId);
					});
					return this;
				} else if (!_.isEmpty(args.productUrl)) {
					$this.on('click', function () {
						openByProductUrl(args.productUrl);
					});
					return this;
				}
				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_product_quick_view'] = {
		constructor: ProductQuickView,
		reInit: true,
		attrName: 'data-component-product-quick-view'
	}
})(Core);