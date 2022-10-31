(function(Core){
	'use strict';
	Core.register('module_minicart', function(sandbox){
		var args, cartItemLenComponent, endPoint;
		var Method = {
			$that:null,
			$closeBtn:null,

			moduleInit:function(){
				var $this = $(this);
				Method.$that = $this;
				args = arguments[0];
				cartItemLenComponent = Core.getComponents('component_cartitemlen', {context:$('body')});
				endPoint = Core.getComponents('component_endpoint');

				$this.on('click', '[data-remove-item]',  function(e){
					e.preventDefault();
					var model = $(this).closest(".order-list").find("input[name='model']").val();
					var name = $(this).closest(".order-list").find("[data-eng-name]").data("eng-name");
					Method.removeItem( $(this).attr('href'), model, name);
				});

				$this.on('click', '[data-checkout-btn]', function(e){
					e.preventDefault();
					var info = $this.find('.cart-order_list .order-list');
					var itemList = [];
					$.each(info, function (index, productData) {
						var id = $(productData).find('[data-id]').data('id');
						var model = $(productData).find('[data-model]').data('model');
						var name = $(productData).find('[data-name]').data('name');
						var retailPrice = $(productData).find('[data-retail-price]').data('retail-price');
						var salePrice = $(productData).find('[data-sale-price]').data('sale-price');
						var quantity = $(productData).find('[data-quantity]').data('quantity');
						itemList.push({
							id: id,
							model: model,
							name: name,
							price: salePrice,
							retailPrice: retailPrice,
							quantity: quantity
						})
					})
					endPoint.call('checkoutSubmit', { itemList: itemList });
					if (_GLOBAL.DEVICE.IS_KAKAO_INAPP && !_GLOBAL.CUSTOMER.ISSIGNIN) {
						sandbox.getModule('module_kakao_in_app').submit('/checkout');
					} else {
						location.href = $(this).attr('href');
					}
				});

				$this.on('click', '[data-keep-shopping]', function(e){
					// e.preventDefault();
					Method.hide();
				});
			},
			show:function(){
				//UIkit.offcanvas arguments type : selector:string, option:object
				UIkit.offcanvas.show('#minicart', {target:'#minicart', mode:'slide'});
			},
			hide:function(){
				//uikit 사용으로 hide는 필요없는 상황
				UIkit.offcanvas.hide('#minicart');
			},

			update:function( callback ){
				var obj = {
					'mode':'template',
					'templatePath':'/cart/partials/miniCart',
					'resultVar':'cart',
					'cache':new Date().getTime()
				}

				sandbox.utils.ajax(sandbox.utils.contextPath + '/processor/execute/cart_state', 'GET', obj, function(data){
					Method.$that.empty().append(data.responseText);
					var $data = $(data.responseText);
					var itemSize = $data.filter('input[name=itemSize]').val();
					var cartId = $data.filter('input[name=cartId]').val();

					if(Array.isArray(cartItemLenComponent)){
						for(var i=0, len=cartItemLenComponent.length; i<len; i++){
							cartItemLenComponent[i].setItemLength(itemSize);
						}
					}else{
						cartItemLenComponent.setItemLength(itemSize);
					}

					var callbackResult = null;
					if( callback ){
						callbackResult = callback( { cartId : cartId} );
					}
					
					// 상단 장바구니 아이콘 수량 반영 외 미니카트는 안보이게 처리
					// callback 함수 return 값이 객체가 아닐 경우 미니장바구니 노출
					if (typeof callbackResult !== 'object') {
						Method.show();
					}
					
				}); 
			},
			removeItem:function( url, model, name ){
				// error 체크와 ajax 로딩 처리 추가 되야 함
				UIkit.modal.confirm("상품을 삭제 할까요?", function(){
					sandbox.utils.ajax(url, 'GET', {}, function(data){
						var param = sandbox.utils.url.getQueryStringParams( url );
						param.model = model;
						param.name = name;
						endPoint.call( 'removeFromCart', param );
						Method.update();
					});
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-minicart]',
					attrName:'data-module-minicart',
					moduleName:'module_minicart',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			show:Method.show,
			hide:Method.hide,
			update:Method.update
		}
	});
})(Core);