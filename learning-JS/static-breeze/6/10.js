(function(Core){
	Core.register('module_checkout', function(sandbox){
		var Method = {
			moduleInit:function(){
				var $this = $(this);

				/* 당일배송 */
	            var samedayDeliveryNotAvailable = $('input[name=samedayDeliveryNotAvailable]').val();
	            var samedayDeliveryNotAvailableMessage = $('input[name=samedayDeliveryNotAvailableMessage]').val();
	            if(samedayDeliveryNotAvailable == 'true'){
	                UIkit.modal.alert(samedayDeliveryNotAvailableMessage).on('hide.uk.modal', function() {
	                    Core.Loading.show();
	                    window.location.assign(sandbox.utils.contextPath + '/checkout?edit-shipping=true');
	                });
	            }

				// header
				//매장상품 확인 예약 서비스에서 진입한 경우 탭을 다 펼침
				if($this.find('[data-cod-btn]').length > 0){
					$this.find('[data-order-tab] .header').each(function(){
						var $icon = $(this).find('[class^="icon-toggle-"]');
						var $view = $(this).closest('.order-tab').find('.view');
						var $preview = $(this).find('.preview');

						if( $view.length > 0 ){
							$preview.removeClass('uk-hidden');
							$view.removeClass('uk-hidden');
							$icon.remove();
						}
					});
					//결제수단 선택 글씨 지우기.

					// console.log($('[data-checkout-step]').data('checkout-step'));

					if($this.find('.contents').length > 0){
						$this.find('.contents').addClass('reservations-wrap');
					}
					if($this.find('.order-wrap').length > 0){
						$this.find('.order-wrap').addClass('reservations-item');
					}
					if($this.find('#popup-cancel').length > 0){
						$this.find('#popup-cancel').addClass('reservations-popup');
					}
				} else {
					$this.find('[data-order-tab] .header').on("mousedown", Method.updateOrderTab);

					// SEAMLESS_START 2018-02-05
					$this.find("#idChangePickupToShip").click(function() {
						UIkit.modal.confirm('<p align="center">상품수령 방법을 택배수령으로 변경하시겠습니까?</p><p align="center">일반배송인 경우 2~3일 소요됩니다.</p>', function(){
							Method.changePickupToShip();
						});
					});
					// SEAMLESS_END
				}
				/* CUSTOM _customproduct.js 기능 이동 */
				Core.Utils.customProduct.checkoutCustomProductChangeImage();
			},
			changePickupToShip:function(e){// SEAMLESS 2018-03-20
				var formRequest = BLC.serializeObject($("form[name=formChangePickupToShip]"));
				sandbox.setLoadingBarState(true);
				BLC.ajax({
					url:sandbox.utils.contextPath +"/cart/add?directOrder=true",
					type:"POST",
					dataType:"json",
					data : formRequest
				},function(data){
					if(data.error){
						sandbox.setLoadingBarState(false);
						UIkit.modal.alert(data.error);
					}else{
						Core.Loading.show();
						endPoint.call( 'buyNow', formRequest );//???
						_.delay(function(){
							window.location.assign( sandbox.utils.contextPath +'/checkout' );
						}, 500);
					}
				}).fail(function(msg){
					sandbox.setLoadingBarState(false);
					if(commonModal.active) commonModal.hide();
					if(msg !== '' && msg !== undefined){
						UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'warning'});
					}
				});
			},
			updateOrderTab:function(e){
				e.preventDefault();
				var $icon = $(this).find('[class^="icon-toggle-"]');
				var $view = $(this).closest('.order-tab').find('.view');
				var $preview = $(this).find('.preview');

				if( $view.length > 0 ){
					$preview.toggleClass('uk-hidden');
					$icon.toggleClass('uk-hidden');
					$view.toggleClass('uk-hidden');
				}
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-checkout]',
					attrName:'data-module-checkout',
					moduleName:'module_checkout',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);