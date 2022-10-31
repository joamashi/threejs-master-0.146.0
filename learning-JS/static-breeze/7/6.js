(function(Core){
	Core.register('module_cart', function(sandbox){
		var $this, endPoint;
		var Method = {
			moduleInit:function(){
				// modal layer UIkit 사용
				$this = $(this);
				var modal = UIkit.modal('#common-modal');
				endPoint = Core.getComponents('component_endpoint');

				var addonComponents = sandbox.getComponents('component_addon_product_option', {context:$this, optionTemplate:'#order-addon-sku-option'}, function(i){
					var _self = this;

					this.addEvent('submit', function(data){
						var $this = $(this);

						UIkit.modal.confirm('장바구니에 상품을 담으시겠습니까?', function(){
							var itemRequest = {};
							var addToCartItems = _self.getChildAddToCartItems();
							var keyName='';

							for(var i=0; i<addToCartItems.length; i++){
								keyName = 'childOrderItems[' + i + ']';
								for(var key in addToCartItems[i]){
									itemRequest['childAddToCartItems['+i+'].'+key] = addToCartItems[i][key];
								}
							}

							//애드온 orderId 알아야함
							itemRequest['addOnOrderId'] = _self.getAddOnOrderId();
							itemRequest['isAddOnOrderProduct'] = true;
							itemRequest['csrfToken'] = $this.closest('form').find('input[name=csrfToken]').val();

							BLC.ajax({
								url:$this.closest('form').attr('action'),
								type:"POST",
								dataType:"json",
								data:itemRequest
							}, function(data){
								if(data.error){
									UIkit.modal.alert(data.error);
								}else{
									location.href = sandbox.utils.url.getCurrentUrl();
								}
							});
						});
					});
				});
				/*
				@pck 2020-11-13
				Core _swipe.js 와 중복 정의 부
				var md = new MobileDetect(window.navigator.userAgent);
				var crossSaleswiper = null;
				
				if (md.mobile()) {
					crossSaleswiper = new Swiper('.swipe-container', {
						slidesPerView: 'auto',
						spaceBetween: 10,
						pagination: {
							el: '.swiper-pagination',
							clickable: true,
						},
					});
				} else {
					crossSaleswiper = new Swiper('.swipe-container', {
						slidesPerView: 5,
						slidesPerGroup: 5,
						spaceBetween: 16,
						DOMAnimation: false,
                        followFinger: false,
						pagination: {
							el: '.swiper-pagination',
							clickable: true,
						},
					});
				}
				var crossSale = $(".swipe-container")
				if (crossSale.find(".swiper-wrapper>li").length < 1) {
					crossSale.parent(".category-slider").parent(".related-items").hide();
				}
				*/

				(function () {
					var ev = new $.Event('display'),
						orig = $.fn.css;
					$.fn.css = function () {
						var ret = orig.apply(this, arguments);
						$(this).trigger(ev);
						return ret; // must include this
					}
				})();

				/*
				2020-05-25 @pck 단일 swiper 사용으로 필요 없는 부이나 추후에 다중으로 사용 시 사용  
				$('div[id^="relatedProducts-"]').bind('display', function (e) {
					if (crossSaleswiper != null) {
						crossSaleswiper.update();
					}
				});
				*/

				// 품절상태 주문하기 버튼 disabled
				var arr = [];
				$(this).find('.product-opt_cart').each(function (i, v) {
					var _this = $(this);
					arr.push(_this.data('containskey') == true);
				});
				var arrWrap = _.some(arr, Boolean);
				if (arrWrap) $(this).find('.btn-order').attr('href', '#').addClass('disabled');


				//주문하기
				$(this).on('click', '.btn-order', function(e){
					e.preventDefault();
					endPoint.call('checkoutSubmit');
					if (_GLOBAL.DEVICE.IS_KAKAO_INAPP && !_GLOBAL.CUSTOMER.ISSIGNIN) {
						sandbox.getModule('module_kakao_in_app').submit('/checkout');
					} else {
						/* CUSTOM _customproduct.js 으로 이동 */
						if (Core.Utils.customProduct.cartCustomProduct()) return;
						
						if(addonComponents){
							e.preventDefault();
							if(sandbox.utils.getValidateChk(addonComponents)){
								var isAddOnOrderNoChoice = $("input[name='isAddOnOrderNoChoice']").is(":checked");
								var param = "";
	
								if( isAddOnOrderNoChoice  == true ){
									param = "?isAddOnOrderNoChoice=true";
								}
	
								location.href = $(this).attr('href') + param;
							}
						}else{
							location.href = $(this).attr('href');
						}
					}
				});


				//옵션 변경
				$(this).on('click', '.optchange-btn', function(e){
					e.preventDefault();
					/* CUSTOM _customproduct.js 기능 이동 : 분기처리 */
					var cartCustomYN = Core.Utils.customProduct.isCartCustomProduct(this);
					if(cartCustomYN == 'true'){
					  UIkit.modal.alert("패치 선택 가능 상품은 옵션 변경 및 주문이 불가능합니다.<br/>상품페이지에서 바로 구매해주세요.");
					}else{
						var _this = $(this);
						var target = $(this).attr('href');
						var $parent = $(this).closest('.product-opt_cart');
						var id = $parent.find('input[name=productId]').attr('value');
						var quantity = $parent.find('input[name=quantity]').attr('value');
						var url = $parent.find('input[name=producturl]').attr('value');
						var orderItemId = $parent.find('input[name=orderItemId]').attr('value');
						var size = $parent.find('input[name$=SIZE]').attr('value');
						var obj = {'qty':quantity, 'orderitemid':orderItemId, 'quickview':true, 'size':size, 'accepted':true}
						$parent.find('[data-opt]').each(function(i){
							var opt = sandbox.rtnJson($(this).attr('data-opt'), true);
							for(var key in opt){
								obj[key] = opt[key];
							}
						});
						sandbox.utils.ajax(url, 'GET', obj, function(data){
							var domObject = $(data.responseText).find('#quickview-wrap');
							$(target).find('.contents').empty().append(domObject[0].outerHTML)
							$(target).addClass('quickview');
							sandbox.moduleEventInjection(domObject[0].outerHTML);
							modal.show();

							// 개인화 상품쪽 장바구니 confirm창 별도 사용
							// 해당 버튼에 addcart-btn-confirm 클래스가 있을 경우 action-type 타입 confirm으로 변경
							if(_this.hasClass('addcart-btn-confirm')) {
						        $('.addcart-btn').attr('action-type', 'confirm')
						    }
						});
					}
				});

				//나중에 구매하기
				$(this).on('click', '.later-btn', function(e){
					e.preventDefault();

					$.cookie('pageMsg', $(this).attr('data-msg'));
					Method.addItem.call(this, {type:'later'});
				});

				//카트에 추가
				$(this).on('click', '.addcart-btn', function(e){
					e.preventDefault();

					$.cookie('pageMsg', $(this).attr('data-msg'));
					Method.addItem.call(this, {type:'addcart'});
				});

				//카트 삭제
				$(this).on('click', '.delete-btn .btn-delete', Method.removeItem );

				//카트 전체삭제
				$(this).on('click', '.btn-cart-delete-All', Method.removeItemAll);

				//페이지 상태 스크립트
				var pageMsg = $.cookie('pageMsg');
				if(pageMsg && pageMsg !== '' && pageMsg !== 'null'){
					$.cookie('pageMsg', null);
					UIkit.notify(pageMsg, {timeout:3000,pos:'top-center',status:'success'});
				}
			},
			addItem:function(opt){

				var $parent = $(this).closest('.product-opt_cart');
				var id = $parent.find('input[name=productId]').attr('value');
				var orderItemId = $parent.find('input[name=orderItemId]').attr('value');
				var quantity = $parent.find('input[name=quantity]').attr('value');
				var sessionId = $(this).siblings().filter('input[name=csrfToken]').val();
				var obj = {'productId':id, 'orderItemId':orderItemId ,'quantity':quantity, 'csrfToken':sessionId}
				var url = $(this).closest('form').attr('action');
				var method = $(this).closest('form').attr('method');

				$parent.find('[data-opt]').each(function(i){
					var opt = sandbox.rtnJson($(this).attr('data-opt'), true);
					for(var key in opt){
						obj['itemAttributes['+ $(this).attr('data-attribute-name') +']'] = opt[key];
					}
				});

				sandbox.utils.ajax(url, method, obj, function(data){
					var jsonData = sandbox.rtnJson(data.responseText, true) || {};
					var url = sandbox.utils.url.removeParamFromURL( sandbox.utils.url.getCurrentUrl(), $(this).attr('name') );

					if(jsonData.hasOwnProperty('error')){
						$.cookie('pageMsg', jsonData.error);
					}
					window.location.assign(url);
				});
			},
			removeItem:function(e){
				e.preventDefault();
				var url = $(this).attr('href');

				// TODO
				// 모델값이 없다;
				var model = $(this).closest(".item-detail").find("[data-model]").data("model");
				var name = $(this).closest(".item-detail").find("[data-eng-name]").data("eng-name");

				UIkit.modal.confirm('삭제하시겠습니까?', function(){
					Core.Loading.show();

					var param = sandbox.utils.url.getQueryStringParams( url );
					param.model = model;
					param.name = name;

					endPoint.call( 'removeFromCart', param);
					_.delay(function(){
						window.location.href = url;
					}, 1000);
				}, function(){},
				{
					labels: {'Ok': '확인', 'Cancel': '취소'}
				});


			},

			// 전체삭제 추가 2018.7.6
			removeItemAll:function(e){
				e.preventDefault();
				var url = $(this).attr('href');

				UIkit.modal.confirm('장바구니에 담긴 상품을 모두 삭제하시겠습니까?', function(){
					Core.Loading.show();

					BLC.ajax({
						url: url,
						type: "GET"
					}, function(data) {
						if (data.error ) {
							UIkit.modal.alert(data.error);
						} else {
							window.location.reload();
						}
					});

				}, function(){},
				{
					labels: {'Ok': '확인', 'Cancel': '취소'}
				});






				// BLC.ajax({
				// 	url:$this.closest('form').attr('action'),
				// 	type:"POST",
				// 	dataType:"json",
				// 	data:itemRequest
				// }, function(data){
				// 	if(data.error){
				// 		UIkit.modal.alert(data.error);
				// 	}else{
				// 		location.href = sandbox.utils.url.getCurrentUrl();
				// 	}
				// });





			}
			// 전체삭제 추가 2018.7.6 : end


		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-cart]',
					attrName:'data-module-cart',
					moduleName:'module_cart',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);