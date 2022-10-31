(function(Core){
	'use strict';

	Core.register('module_returnorder', function(sandbox){
		var Method = {
			$that:null,
			$allCheck:null, // 팝업 전체 선택 체크박스
			$itemList:null, // 선택 해서 popup에 노출되는 아이템 리스트
			$popModal:null,
			$returnBtn:null,
			$returnItemList:null,
			$popSubmitBtn:null,
			$beforeAddress:null,
			$refundAccountInfo:null, //환불정보 입력 폼
			$refundAccountInfoGuide:null, //환불정보 입력 폼 -> 가이드 텍스트 2019-04-12
			$newAddress:null,
			isAble:null,
			isAblePartialVoid:null,
			deliverySearch:null,
			isNewAddress:false,
			isDoubleClickFlag:true,
			isCheckeds:false,
			isRefundAccount:false,
			isMid:false,
			isFdk:false,
			isChangeCustomerAddress:false,
			addressComponent: null,
			// isSearchAddress:true,

			moduleInit:function(){
				var args = Array.prototype.slice.call(arguments).pop();
				$.extend(Method, args);

				var $this = $(this);
				Method.$that = $this;
				Method.$popModal = UIkit.modal("#popup-return");
				Method.$returnBtn = $this.find('[data-return-btn]');
				Method.$popCuntBtn = Method.$popModal.find('[data-cunt-submit]');
				Method.$popSubmitBtn = Method.$popModal.find('[data-return-submit]');
				Method.$popAddressModal = UIkit.modal("#popup-customer-address", {modal: false});
				Method.$beforeAddress = Method.$popModal.dialog.find('[data-before-return-address]');
				Method.$newAddress = Method.$popModal.dialog.find('[data-new-return-address]');
				Method.$refundAccountInfo = Method.$popModal.find('[data-refund-account-info]');
				Method.$refundAccountInfoGuide = Method.$popModal.find('[data-refund-account-info-guide]'); // 2019-04-12
				Method.addressComponent = Core.getComponents('component_customer_address', { context: $this });

				// 반품 사유 변경시
				$this.find('[data-return-reason-type]').on("change", function(){
					Method.updatePaymentInfo( false );
					var val = $(this).val();
					var target = $(this).parents('.container').find('.uk-text-danger');
					if(val == 'COLOR_SIZE_CHANGE' || val == 'NO_PURCHASE_INTENT'){
						target.parent('.uk-form-row').removeClass('uk-hidden');
						target.text('구매자귀책인 경우 주문배송비는 환불되지 않습니다.');
					} else if(val == null || val == ''){
						target.parent('.uk-form-row').addClass('uk-hidden');
					} else{
						target.parent('.uk-form-row').removeClass('uk-hidden');
						target.text('고객님의 책임으로 상품이 멸실 또는 훼손인 경우 반품이 불가합니다.');
					}
				});

				// 전체 선택 체크박스 처리
				Method.$allCheck = Method.$popModal.find('input[name="check-all"]');
				Method.$allCheck.on("change", Method.changeAllCheck );

				// 주문별 전체 반품
				$this.find('[data-return-order-btn]').on('click', function(e){
					e.preventDefault();
					// console.log($(this).closest('[data-return-order]').find('[data-return-order-item]'))
					// Method.openReturnOrderPopup( $(this).closest('[data-return-order]').find('[data-return-order-item]') );
					Method.openReturnOrderPopup($(this).data("orderid"));
				});


				// 반품 신청 노출 여부
				// $this.find('.order-item-wrap').each(function (i) {
				//	var arrWrap = [];
				//	$(this).find('.item-info').each(function (i) {
				//		var arr = [];
				//		$(this).find('ul li').each(function (i) {
				//			arr.push($(this).find('[data-availablequantity]').data('availablequantity') == 0);
				//		});
				//		arrWrap = _.every(arr, Boolean)
				//	});
				//	if (!arrWrap) $(this).find('.item-btn').show();
				// });

				// 반품 신청 노출 여부
				$this.find('.order-item-wrap').each(function (i) {
				var arrWrap = false;
				var item_btn_len  = $(this).find('button').length;  //오더당 반품 버튼 갯수

				$(this).find('.item-info').each(function (i) {
					$(this).find('ul li').each(function (i) {
						if( $(this).find('[data-availablequantity]').data('availablequantity') > 0){

						 arrWrap = true;
						 return false;;
						}
					});
				});
				    if (arrWrap){
				         for(var i=0; i < item_btn_len; i++){
				           if(i<1){
						      $(this).find('.item-btn').eq(0).show();
						    } else {
						      $(this).find('.item-btn').eq(i).hide();
						    }
						 }
					 } else{
 					   $(this).find('.item-btn').hide();
 					}
				});


				// 배송지 선택 버튼
				$this.find('[data-customer-address-btn]').on('click', function(e){
					e.preventDefault();
					Method.$popAddressModal.show();
				});

				// 배송지 선택 모듈 select 이벤트 호출( 배송지 선택했을때 호출됨 )
				Core.getComponents('component_customer_address', {context:$this}, function(){
					this.addEvent('select', function(data){
						Method.updateCustomerAddress( data );
						if( Method.$popAddressModal.isActive()){
							Method.$popAddressModal.hide();
						}
					})
				});

				var addressList = Method.$popAddressModal.find('[data-customer-address-select-btn]');
				// 등록되어있는 배송지가 없다면
				// TODO customer_address compnent에 size 추가 하자
				if( !Core.getModule('module_header').getIsSignIn()){
					$this.find('[data-return-address-type] a').removeClass('uk-active').eq(1).addClass('uk-active');
					Method.updateAddressInput();
					$this.find('[data-return-address-type]').hide();
					$this.find('#return-address').removeClass('uk-margin-top');

					// Method.isSearchAddress = false;

					$this.find('.input-textfield.value > label').hide();

					var nonmemberinfo = $this.find('#NonMemberInfo');
					var newReturnAddress = $this.find('#new-return-address');
					newReturnAddress.find('input[name="addressFirstName"]').val(nonmemberinfo.data('name'));
					newReturnAddress.find('input[name="addressPhone"]').val(nonmemberinfo.data('phonenumber'));
					newReturnAddress.find('input[name="addressLine1"]').val(nonmemberinfo.data('addressline1'));
					newReturnAddress.find('input[name="addressLine2"]').val(nonmemberinfo.data('addressline2'));
					newReturnAddress.find('input[name="addressPostalCode"]').val(nonmemberinfo.data('addresspostalcode'));
					newReturnAddress.find('input[name="addressCity"]').val(nonmemberinfo.data('addresscity'));
				}else{
					// 첫번째 주소 선택
					$this.find('[data-return-address-type]').show();
					$this.find('#return-address').addClass('uk-margin-top');
					// addressList.eq(0).trigger('click');
				}

				// 주소 입력 처리
				var $zipCodeInput = $(this).find('[name="addressPostalCode"]');
				var $cityInput = $(this).find('[name="addressCity"]');

				Method.deliverySearch = sandbox.getComponents('component_searchfield', {context:$this, selector:'.search-field', resultTemplate:"#address-find-list"}, function(){
					// 검색된 내용 선택시 zipcode 처리
					this.addEvent('resultSelect', function(data){
						var zipcode = $(data).data('zip-code5');
						var city = $(data).data('city');
						var doro = $(data).data('doro');

						var $input = this.getInputComponent().setValue( '(' + zipcode + ')' + city + doro );

						$zipCodeInput.val( zipcode );
						$cityInput.val( city.split(' ')[0] );
					});
				});

				// 배송지 입력 타입 버튼 선택시
				$this.find('[data-return-address-type]').on('show.uk.switcher', function(){
					Method.updateAddressInput();
				});

				// 수거메모 선택시
				$this.find('[data-personal-message-select]').on('change', Method.updatePersonalMessage )

				Method.$popSubmitBtn.on('click', Method.returnOrderSubmit );
			},

			updatePersonalMessage:function(e){
				e.preventDefault();
				var $msgContainer = Method.$popModal.dialog.find('[data-personal-message]');
				var $personalMsg = $msgContainer.find('[name="personalMessageText"]');

				var value = $(this).val();
				if(value == ''){
					$personalMsg.val('');
					$msgContainer.addClass('uk-hidden');
				}else if(value == 'dt_1'){
					// 직접입력일 경우
					$personalMsg.val('');
					$msgContainer.removeClass('uk-hidden');
				}else{
					//$personalMsg.val( $(this).find("option:selected").val() + "||" + $(this).find("option:selected").text() );
					$personalMsg.val( $(this).find("option:selected").text());
					$msgContainer.addClass('uk-hidden');
				}
			},
			removeWrongAddress: function (addressId) {
				if (Method.addressComponent != null) {
					// 처음 들어오는건 기본 배송지지만 선택을 해서 변경
					UIkit.modal.alert('배송지가 유효하지 않아 삭제 됩니다. 다른 배송지를 사용하거나 배송지를 새로 입력하세요.').on('hide.uk.modal', function () {
						Core.Loading.show();
						Method.addressComponent.removeAddress(addressId, function (data) {
							window.location.reload();
						});
					});
				}
			},
			// 반품 신청 팝업
			openReturnOrderPopup:function( orderId ){
				var $modal = Method.$popModal;
				var $modalForm = $modal.dialog.find('form');
				Method.$itemList = $modal.dialog.find('[data-return-reason-list]>ul');

				var $reasonItem = $modal.dialog.find('[data-return-reason-item]');
				var $returnAddress = $modal.dialog.find('input[name="return-address"]');

				Method.$itemList.empty();

				var $paymentList = $modal.find('[data-payment-list]');
				var $paymentItem = $modal.find('.uk-hidden[data-payment-item]');

				$paymentList.empty();

                var $newItem1 = Method.getReplacePaymentItem( $paymentItem, "상품금액 합계 : ", '' );
                $newItem1.appendTo( $paymentList );
                var $newItem2 = Method.getReplacePaymentItem( $paymentItem, "주문 배송비 : ", '' );
                $newItem2.appendTo( $paymentList );
                var $newItem3 = Method.getReplacePaymentItem( $paymentItem, "반품 배송비 : ", '' );
                $newItem3.appendTo( $paymentList );

				// sandbox.getModule('module_header').reDirect().setLogin(function(){
					sandbox.utils.promise({
						url:sandbox.utils.contextPath + '/account/orders/returnable/request/' + orderId,
						method:'GET',
					}).then(function(data){
						var defer = $.Deferred();

						$modal.find('#returnReasonItem').remove();
						$modal.find("input[name='never-cause']").remove();
						$modal.find('[data-return-reason-list]').append(data);

						/*
						isAble 				: 주문 취소, 반품 가능 여부
						isRefundAccount 	: 환불 계좌 필요 여부
						isAblePartial   	: 부분 취소, 반품 가능 여부
						*/
						Method.isAble = $modal.find('#returnReasonItem').data('isable');
						Method.isAblePartialVoid = $modal.find('#returnReasonItem').data('isablepartial');
						Method.isRefundAccount = $modal.find('#returnReasonItem').data('isrefundaccount');
						Method.isFdk = $modal.find('#returnReasonItem').data('isfdk');
						Method.isMid = $modal.find('#returnReasonItem').data('ismid');
						Method.isMobilePayment = $modal.find('#returnReasonItem').data('ismobilepayment');

						// 모달창 초기화
						$modal.find('.exception_request').hide();
						$modal.find('.input-checkbox').css({'opacity':1, 'padding-left':18});
						$modal.find('.dynamic-form').show();
						$modal.find('#panel-box').show();

						// 매입전 주문 반품 신청 시 예외처리
						if (Method.isFdk == true && Method.isMid == false) {
							Method.isAble = false;
							$modal.find('.exception_request').text($modal.find('.exception_request').data('deafult-message')).show();
						}else{
							// 매입전 예외처리 이외의 반품 불가능 상태에 대한 메시지 처리
							if( Method.isAble == false ){
								$modal.find('.exception_request').text($modal.find("input[name='never-cause']").val()).show();
							}
						}

						// 반품 불가능시 불필요한 UI 숨김
						if( Method.isAble == false ){
							$modal.find('.input-checkbox').css({'opacity':0, 'padding-left':0});
							$modal.find('.dynamic-form').hide();
							$modal.find('#panel-box').hide();
						}

						// 환불 계좌 필요 여부
						if (Method.isRefundAccount) {
							Method.$refundAccountInfo.show();
						} else {
							Method.$refundAccountInfo.hide();
						}

						// Mobile 주문시, 가이드 텍스트 노출. 2019-04-12 by Kim.H.G
						if (Method.isMobilePayment) Method.$refundAccountInfoGuide.show();

						var $newItem = $reasonItem.removeClass("uk-hidden");
						var $info = $newItem.find('[return-reason-info]');
						var $thumb = $newItem.find('[return-reason-thumb]');
						var $item = $modal.find('[data-return-reason-list]>ul>li');
						var sum_Quantity = 0;  // // 반품 가능 상품이 2개 이상이면 안내멘트 div 노출시킴,

						$item.each(function () {
							// 반품 가능 수량
							var returnableQuantity = $(this).find('input[name="returnableQuantity"]').val();
							// 반품 된 수량
							var returnedQuantity = $(this).find('input[name="returnedQuantity"]').val();

							   sum_Quantity = sum_Quantity+returnedQuantity;

							// 복사된 정보중 수량은 삭제
							$info.find('.opt.quantity').remove();

							if( Method.isAblePartialVoid ){
								var $quantitySelectbox = $(this).find('[return-reason-partials-quantity]').find("select");
								$quantitySelectbox.removeAttr('disabled');

								var isSelected = '';
								for( var i=1; i<=returnedQuantity; i++){
									if(i == returnedQuantity) isSelected = 'selected=selected';
									$quantitySelectbox.append( '<option value="' + i + '" ' + isSelected + '>' + i +'</option>');
									isSelected = '';
								}
							}else{
								var $quantity = $(this).find('[return-reason-order-quantity]').show();
								$quantity.find('input[name="quantity"]').removeAttr('disabled').val(returnedQuantity);
								$quantity.find('[data-quantity]').text(returnedQuantity);
							}
						});


						// 반품 가능 상품이 2개 이상이면 안내멘트 div 노출시킴,
						if(($item.length>1)||(sum_Quantity>1)){
							$modal.find('#jq_etc_guid').show();
						}else{
							$modal.find('#jq_etc_guid').hide();
						};

						// 팝업에서 수량 셀렉트 변경시
						//Method.$itemList.find('select').off('change').on("change", Method.updateStatus );

						Method.updatePaymentInfo( false );

						// 부분반품 불가  / 신청가능
						if( Method.isAblePartialVoid ){
							Method.updateSubmitBtn( false );
						} else {
							Method.updateSubmitBtn( true );
						}

						//Method.updateStatus();

						if( Method.isAblePartialVoid ){
							// console.log( '부분 반품' );
							$modal.find('[data-return-reason-list]>ul>li').find('input[type="checkbox"]').on("change", Method.changeItemCheck );

							// $modal.find('[data-return-reason-list]>ul>li').find('select').on("change", Method.updateStatus );

							Method.updateInfoByIsPartial( true );
							// Method.updateSubmitBtn( true );

							// 전체 취소로 초기화
							Method.$allCheck.prop('checked', false ).trigger('change');
						}else{
							// console.log( '전체 반품' );
							Method.updateInfoByIsPartial( false );
							// Method.updateSubmitBtn( true );
							// Method.updateStatus();
						}

						// 반품주소 default 셑팅
						Method.$beforeAddress.find('[data-user-name]').html($.trim($modal.find('#returnReasonItem').data('returnaddress-fullname')));
						Method.$beforeAddress.find('[data-phone]').html($.trim($modal.find('#returnReasonItem').data('returnaddress-phonenumber')));
						Method.$beforeAddress.find('[data-postalCode]').html($.trim($modal.find('#returnReasonItem').data('returnaddress-postalcode')));
						Method.$beforeAddress.find('[data-address1]').html($.trim($modal.find('#returnReasonItem').data('returnaddress-addressline1')));
						Method.$beforeAddress.find('[data-address2]').html($.trim($modal.find('#returnReasonItem').data('returnaddress-addressline2')));
						
						Method.$beforeAddress.find('input[name="addressId"]').val($.trim($modal.find('#returnReasonItem').data('returnaddress-id')));
						Method.$beforeAddress.find('input[name="addressFirstName"]').val($.trim($modal.find('#returnReasonItem').data('returnaddress-fullname')));
						Method.$beforeAddress.find('input[name="addressPhone"]').val($.trim($modal.find('#returnReasonItem').data('returnaddress-phonenumber')));
						Method.$beforeAddress.find('input[name="addressLine1"]').val($.trim($modal.find('#returnReasonItem').data('returnaddress-addressline1')));
						Method.$beforeAddress.find('input[name="addressLine2"]').val($.trim($modal.find('#returnReasonItem').data('returnaddress-addressline2')));
						Method.$beforeAddress.find('input[name="addressPostalCode"]').val($.trim($modal.find('#returnReasonItem').data('returnaddress-postalcode')));
						Method.$beforeAddress.find('input[name="addressCity"]').val($.trim($modal.find('#returnReasonItem').data('returnaddress-city')));
						
						$modal.show();
						sandbox.validation.reset( $modal.dialog.find('form'));

						sandbox.getComponents('component_select', {context:$modal.dialog}, function(i){
							this.addEvent('change', function(val, $selected, index){
								if($(this).attr('name') == 'accountCode'){
									$(this).closest('.input-btn-group').find('input[name=accountName]').val($selected.text());
								}
								Method.updatePaymentInfo( false );
							});
						});

						sandbox.moduleEventInjection(data, defer);

						Method.$itemList = $modal.dialog.find('[data-return-reason-list]>ul');

						return defer.promise();
					}).then(function(data){
						// UIkit.modal.alert("취소 되었습니다.").on('hide.uk.modal', function() {
						// 	window.location.reload();
						// });
					}).fail(function(error){
						// if(error){
						// 	UIkit.modal.alert(error).on('hide.uk.modal', function() {
						// 		window.location.reload();
						// 	});
						// }else{
						// 	window.location.reload();
						// }
					});
				// });
			},

			// 아이템 단위로 수량 선택할 수 있는 select 노출 처리
			showHideAvailabeQuantity:function( $checkbox ){
				var $cancelQuantity = $checkbox.closest('li').find('[return-reason-partials-quantity]');
				if( $checkbox.prop('checked')){
					$cancelQuantity.slideDown('fast');
				}else{
					$cancelQuantity.slideUp('fast');
				}
			},

			// 부분 반품 가능 여부에 따른 정보 노출 처리
			updateInfoByIsPartial:function( $bool ){
				var $checkAllContainer = Method.$popModal.dialog.find('.container.check-all');
				var $checkboxs = Method.$itemList.find('.checkbox');
				var $info = Method.$popModal.dialog.find('[data-info-text]');

				if( $bool ){
					$checkAllContainer.show();
					$checkboxs.show();
					$info.show();
					Method.$popSubmitBtn.text('선택상품 주문 반품');
				}else{
					$checkAllContainer.hide();
					$checkboxs.hide();
					$info.hide();
					Method.$popSubmitBtn.text('주문 반품');
				}
			},

			// 체크 여부에 따른 리턴 버튼 활성화 처리
			updateRetunBtnStatus:function(){
				var isChecked =  Method.$that.find('[data-return-order]').find('[data-return-order-list]').find('input[type="checkbox"]').is(':checked');
				if( isChecked ){
					Method.$returnBtn.removeAttr('disabled').removeClass('disabled');
					Method.$returnBtn.text('부분 반품하기');
				}else{
					Method.$returnBtn.attr('disabled','true').addClass('disabled');
					Method.$returnBtn.text('부분 반품할 상품을 선택해주세요');
				}
			},

			// modal에서 전체 선텍
			changeAllCheck:function(e){
				var isCheck = $(this).prop('checked');

				// console.log('Method.$itemList : ', Method.$itemList.find('>li'))

				Method.$itemList.find('>li').each( function(){
					$(this).find('input[type="checkbox"]').prop( 'checked', isCheck );
					if( isCheck ){
						// 전체 수량을 선택 시켜 노출
						$(this).find('select[name="quantity"]').val( $(this).find('[data-quantity]').text()).trigger('update');
					}
					Method.showHideAvailabeQuantity( $(this).find('input[type="checkbox"]') );
				});
				Method.updateStatusChecked();

				if (Method.isCheckeds) {
					Method.updatePaymentInfo( false );
					Method.isCheckeds = false;
				}
			},

			// modal에서 체크박스 선택시
			changeItemCheck:function(e){
				Method.showHideAvailabeQuantity( $(this ));
				// Method.updateCheckAll();

				Method.updateStatusChecked();
				if (Method.isCheckeds) {
					Method.updatePaymentInfo( false );
					Method.isCheckeds = false;
				}
			},

			// 아이템 체크박스 변경시 전체 선택 체크박스 상태처리
			updateCheckAll:function(){
				if( Method.$itemList.find('>li').length == Method.$itemList.find('>li').find('input[type="checkbox"]:checked').length ){
					Method.$allCheck.prop( 'checked', true );
				}else{
					Method.$allCheck.prop( 'checked', false );
				}
			},

			// 리턴 상황에 따른 가격정보와
			updatePaymentInfo:function( $bool ){
				var $paymentContainer = Method.$popModal.find('[data-payment-conatiner]');
				$paymentContainer.hide();

				if( $bool ){
					$paymentContainer.show();
					Method.$popCuntBtn.hide();
				}else{
					$paymentContainer.hide();
					Method.$popCuntBtn.show();
				}
			},

			updateStatusChecked:function(){
				var $modal = Method.$popModal;
				// 부분반품이 가능한 경우
				if( Method.isAblePartialVoid ){
					var $items = Method.$itemList.find('>li').find('input[type="checkbox"]:checked').closest('li');
				}else{
					var $items = Method.$itemList.find('>li');
				}

				if( $items.length > 0 ){
					if (Method.isDoubleClickFlag) {
						Method.updateSubmitBtn( true ); // 체크박스 선택 가능
						Method.isDoubleClickFlag = false;
					}
				} else {
					// 아이템 없을때
					// 부분 취소, 반품 가능 여부
					var isablepartial = true;

					if (!isablepartial) {
						Method.updateSubmitBtn( true );
					} else {
						if (!Method.isDoubleClickFlag) {
							Method.updateSubmitBtn( false ); // 체크박스 선택 불가능
							Method.isDoubleClickFlag = true;
						}
					}
				}
			},
			checkHasEmojiReturnReason:function(){
				if (sandbox.utils.has.hasEmojis(Method.$popModal.dialog.find('form').find('input[name="reason"]').val())) {
					sandbox.ui.modal.alert('반품 사유에 이모지를 사용 할 수 없습니다.');
					return false;
				}
				return true;
			},
			// 버튼 활성화/비활성화 처리
			updateSubmitBtn:function( $bool ){
				var $paymentContainer = Method.$popModal.find('[data-payment-conatiner]');

				var _bool = [];
				Method.$popModal.find('[data-return-reason-list]>ul>li').each( function(){
					_bool.push($(this).find('input[type="checkbox"]').attr('disabled') == 'disabled')
				});
				var _disabledCheck = _.every(_bool, Boolean); // true

				if (_disabledCheck) {
					Method.$allCheck.attr('disabled', true).closest('.input-checkbox').addClass('disabled');
				} else {
					Method.$allCheck.attr('disabled', false).closest('.input-checkbox').removeClass('disabled');
				}

				if ($bool) {
					$paymentContainer.hide();
					Method.$popCuntBtn.show();

					// 총 결제금액 버튼
					Method.$popCuntBtn.on('click', function (e) {
						e.preventDefault();
						var $modalForm = Method.$popModal.dialog.find('form');
						sandbox.validation.validate($modalForm);
						if( sandbox.validation.isValid($modalForm)){
							if (!Method.checkHasEmojiReturnReason()) {
								return false;
							}
							Method.updatePaymentInfo(true);
							Method.updateStatus();
						}
					});

					Method.$popSubmitBtn.removeAttr('disabled').removeClass('disabled');
					Method.$popCuntBtn.removeAttr('disabled').removeClass('disabled');
				} else {
					// console.log('버튼 활성화/비활성화 처리 false')
					Method.$popSubmitBtn.attr('disabled','true').addClass('disabled');
					Method.$popCuntBtn.attr('disabled', 'true').addClass('disabled');
					Method.$popCuntBtn.off();
				}
			},

			// 취소 가격 및 추가 정보 입력 여부 처리
			updateStatus:function(){
				//console.log('updateStatus');
				var $modal = Method.$popModal;

				if( Method.isAblePartialVoid ){
					var $items = Method.$itemList.find('li').find('input[type="checkbox"]:checked').closest('li');
				} else {
					var $items = Method.$itemList.find('li');
				}

				var $form = $modal.dialog.find('form');
				var action = $form.attr('action') + '/calculator';
				var $itemForm = Method.getFormByPartialItem( $items );
				var param = $itemForm.serialize() + '&' + $form.serialize();

				if( Method.isAblePartialVoid ){
					if( !Method.getIsAvailablePartialReturn()){
						param += '&entireReturn=true';
					}
				}else{
					param += '&entireReturn=true';
				}

				// console.log('param--', param)
				Core.Utils.ajax( action, 'POST', param, function(data){

					var data = sandbox.rtnJson(data.responseText, true);
					var $paymentList = $modal.find('[data-payment-list]');
					var $paymentItem = $modal.find('.uk-hidden[data-payment-item]');
					$paymentList.empty();

					if( !data ){
						var $newItem = Method.getReplacePaymentItem( $paymentItem, '서버 통신 오류' );
						$newItem.appendTo( $paymentList );
					}

					var result = data.result;

					if( result == true ){
            			// 주문아이템총액
            			var totalItemAmount = data.ro.totalItemAmount;

            			// 반품 배송비
            			var returnFgChargeFeeTotal = data.ro.returnFulfillmentFee;

            			// 추가 배송비
            			var parentFgChargeFeeTotal = data.ro.originFulfillmentChargeFee;

            			// 주문 배송비
            			var parentFgFeeTotal = data.ro.originRefundableFulfillmentFee;

						// 총 환불 예정 금액
						var refundAmountTotal = data.ro.totalRefundableAmount.amount;
						var refundAmountTotalReplace = String(refundAmountTotal).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');

            			// 결제수단
            			var originPaymentMethod = data.ro.originPaymentMethod;

            			$('.retu-pop-header>.panel-box').html('환불예정금액 (' + originPaymentMethod + ') <span>' + refundAmountTotalReplace + ' 원</span>');

                        // 결제 정보
                        if( totalItemAmount != null
                          || parentFgFeeTotal != null
                          || parentFgChargeFeeTotal != null
                          || returnFgChargeFeeTotal != null ) {

							// 주문아이템총액
							if( totalItemAmount != null && totalItemAmount.amount > 0 ){
								var $newItem = Method.getReplacePaymentItem( $paymentItem, "상품금액 합계 : ", totalItemAmount.amount );
								$newItem.appendTo( $paymentList );
							}

							// 주문 배송비
							if( parentFgFeeTotal != null && parentFgFeeTotal.amount > 0 ){
								var $newItem = Method.getReplacePaymentItem( $paymentItem, "주문 배송비 : ", parentFgFeeTotal.amount );
								$newItem.appendTo( $paymentList );
 							} else{
								var $newItem = Method.getReplacePaymentItem( $paymentItem, "주문 배송비 : ", '' );
								$newItem.appendTo( $paymentList );
 							}

							// 추가 배송비
							if( parentFgChargeFeeTotal != null && parentFgChargeFeeTotal.amount > 0 ){
								var $newItem = Method.getReplacePaymentItem( $paymentItem, "추가 배송비 : ", parentFgChargeFeeTotal.amount );
								$newItem.appendTo( $paymentList );
							}

							// 반품 배송비
							if( returnFgChargeFeeTotal != null && returnFgChargeFeeTotal.amount > 0 ){
		                        var $newItem = Method.getReplacePaymentItem( $paymentItem, "반품 배송비 : ", returnFgChargeFeeTotal.amount );
		                        $newItem.appendTo( $paymentList );
 							} else{
		                        var $newItem = Method.getReplacePaymentItem( $paymentItem, "반품 배송비 : ", '' );
		                        $newItem.appendTo( $paymentList );
 							}
                       } else {
							var $newItem = Method.getReplacePaymentItem( $paymentItem, 'PAYMENTS 정보 오류' );
							$newItem.appendTo( $paymentList );
                        }

						Method.isCheckeds = true;
					}else{
						// var $newItem = Method.getReplacePaymentItem( $paymentItem, data.errorMsg );
						// $newItem.appendTo( $paymentList );
						Method.updatePaymentInfo( false );
						Method.isCheckeds = false;
						UIkit.modal.alert(data.errorMsg).on('hide.uk.modal', function () {
							window.location.reload();
						});
					}
				}, true);
			},

			// 계산 결과 dom 생성
			getReplacePaymentItem:function( $base, type, amount ){
				var $newItem = $base.clone().removeClass("uk-hidden");
				$newItem.find('[data-type]').text( type );
				if( amount ){
					$newItem.find('[data-amount]').text( sandbox.utils.price(amount) );
				}else{
					$newItem.find('[data-amount]').text( sandbox.utils.price(0) );
				}
				return $newItem;
			},

			// 선택된 아이템의 order dom
			getOrderElementByChecked:function($checkbox){
				var $order = $checkbox.closest('[data-return-order]');
				return {
					order : $order,
					allCheckbox : $order.find('input[name="check-all"]'),
					itemList : $order.find('[data-return-order-list]')
				}
			},

			// 배송지 선택으로 주소 입력시
			updateCustomerAddress:function( data ){
				Method.isChangeCustomerAddress = true;
				var $target = Method.$popModal.dialog.find('[data-before-return-address]');
				if( $target.find('[data-user-name]').length > 0 ){
					$target.find('[data-user-name]').html($.trim(data.fullName));
				}

				if( $target.find('[data-phone]').length > 0 ){
					$target.find('[data-phone]').html($.trim(data.phoneNumber));
				}

				if( $target.find('[data-postalCode]').length > 0 ){
					$target.find('[data-postalCode]').html($.trim(data.postalCode));
				}

				if( $target.find('[data-address1]').length > 0 ){
					$target.find('[data-address1]').html($.trim(data.addressLine1));
				}

				if( $target.find('[data-address2]').length > 0 ){
					$target.find('[data-address2]').html($.trim(data.addressLine2));
				}

				// 변경된 값 input 에 적용
				$target.find('input[name="addressId"]').val($.trim(data.id));
				$target.find('input[name="addressFirstName"]').val($.trim(data.fullName));
				$target.find('input[name="addressPhone"]').val($.trim(data.phoneNumber));
				$target.find('input[name="addressLine1"]').val($.trim(data.addressLine1));
				$target.find('input[name="addressLine2"]').val($.trim(data.addressLine2));
				$target.find('input[name="addressPostalCode"]').val($.trim(data.postalCode));
				$target.find('input[name="addressCity"]').val($.trim(data.city));
			},

			// 실제 전송될 주소 정보를 설정하기 위해 불필요 정보 disabled
			updateAddressInput:function(){
				if( Method.$beforeAddress.hasClass('uk-active')){
					Method.isNewAddress = false;
					Method.$beforeAddress.find('input').attr('disabled', false );
					Method.$newAddress.find('input').attr('disabled', true );
				}else{
					Method.isNewAddress = true;
					Method.$beforeAddress.find('input').attr('disabled', true );
					Method.$newAddress.find('input').attr('disabled', false );
				}
			},

			// 선택된 아이템을 하나의 form으로 만들어 리턴
			getFormByPartialItem:function( $items ){
				var $itemForm = $('<form></form>');

				//체크되어있는 아이템 가져와 form에 append
				$items.each( function(){
					var quantity = $(this).find('[name="quantity"]:enabled').val();
					var $newItem = $(this).clone();

					$newItem.find('[name="quantity"]').val(quantity);
					$newItem.appendTo( $itemForm );
				});
				return $itemForm;
			},

			returnOrderSubmit:function(e){
				e.preventDefault();

				var $modalForm = Method.$popModal.dialog.find('form');
				sandbox.validation.validate( $modalForm );

				if( sandbox.validation.isValid( $modalForm )){

					// if (Method.isSearchAddress) {
						if( Method.isNewAddress ){
							if( !Method.deliverySearch.getValidateChk() ){
								UIkit.modal.alert("검색을 통하여 배송지를 입력해주세요.");
								return false;
							}
						}else{
							/*
							// 기본으로 들어가있는 주소는 확인해도 삭제가 불가능하고 새로 선택한 경우에만 검사해서 잘못된 주소를 지운다.
							if (Method.isChangeCustomerAddress) {
								var address1 = Method.$beforeAddress.find('input[name="addressLine1"]').val();
								var addressId = Method.$beforeAddress.find('input[name="addressId"]').val();
								// 최종 주소를 다시 한번 주소 API로 유효성 체크
								var customerAddrssValidationResult = Core.Utils.addressApi.init().isEmpty(address1);
								if (customerAddrssValidationResult) {
									Method.removeWrongAddress(addressId);
									return;
								}
							}
							*/
						}
					// }

					//console.log( $modalForm.attr('action'))
					UIkit.modal.confirm('반품 하시겠습니까?', function(){
						// 주소에 노출된 우편번호 제거
						if( Method.isNewAddress ){
							var $addressLine1 = $modalForm.find('[name="addressLine1"]:visible');
							if( $addressLine1 ){
								var address1 = $addressLine1.val().split(')');
								if( address1.length > 1 ){
									$addressLine1.val( $.trim( address1[1]) );
								}
							}
						}

						if (!Method.checkHasEmojiReturnReason()) {
							return false;
						}

						var isPartial = false;
						var param = '';

						if( Method.isAblePartialVoid ){
							isPartial = true;
							if( !Method.getIsAvailablePartialReturn()){
								isPartial = false;
							}
						}

						// 부분 취소일때는 상품별
						if( isPartial ){
							var $itemForm = Method.getFormByPartialItem( Method.$itemList.find('>li').find('input[type="checkbox"]:checked').closest('li') );
							param = $itemForm.serialize() +'&'+ $modalForm.serialize();
						}else{
							var $itemForm = Method.getFormByPartialItem( Method.$itemList.find('>li'));
							param = $itemForm.serialize() +'&'+ $modalForm.serialize();
							param += '&entireReturn=true';
						}

						// Method.updateSubmitBtn( false );

						Core.Utils.ajax( $modalForm.attr('action'), 'POST', param, function(data){
							var data = sandbox.rtnJson(data.responseText, true);
							var result = data['result'];
							if( result == true ){
								if( _GLOBAL.MARKETING_DATA().useGa == true ){
									var marketingOption = {
										orderType : 'RETURN',
										orderId : data.ro.returnOrderId
									};
									Core.ga.processor( marketingOption );
								}
								UIkit.modal.alert("반품신청이 완료되었습니다.").on('hide.uk.modal', function() {
									window.location.href = sandbox.utils.contextPath + "/account/orders/returned";
								});
							}else{
								UIkit.modal.alert(data['errorMsg']).on('hide.uk.modal', function() {
									window.location.reload();
								});
							}
							//$('.customer-contents').replaceWith($(data.responseText).find('.customer-contents'));

						},true)

					}, function(){},
					{
						labels: {'Ok': '확인', 'Cancel': '취소'}
					});
				}

			},

			// 부분반품 가능 여부 판단
			getIsAvailablePartialReturn:function(){

				var itemList = {};
				var $checkedList = Method.$itemList.find('>li').find('input[type="checkbox"]:checked').closest('li');

				$checkedList.each( function(){
					isAvailable = false;
					var orderItemSize = $(this).find('input[name="orderItemSize"]').val();
					var ableEntireReturn = $(this).find('input[name="ableEntireReturn"]').val();
					var returnableQuantity = $(this).find('input[name="returnableQuantity"]').val();
					var returnedQuantity = $(this).find('input[name="returnedQuantity"]').val();
					var orderId = $(this).find('input[name="orderId"]').val();
					var quantity = $(this).find('[name="quantity"]:not(:disabled)').val();

					if( itemList[orderId] == undefined ){
						itemList[orderId] = {};
						itemList[orderId].ableEntireReturn = ableEntireReturn;
						itemList[orderId].orderItemSize = orderItemSize;
						itemList[orderId].items = [];
					}

					var itemObj = {
						returnedQuantity : Number(returnedQuantity),
						returnableQuantity : Number(returnableQuantity),
						quantity : Number(quantity)
					}

					itemList[orderId].items.push( itemObj );
				})

				//console.log( itemList );

				var isAvailable = false;
				$.each( itemList, function(){
					// 전체 반품이 불가능하거나 현재 주문의 전체 아이템 사이즈와 선택된 아이템 사이즈가 같지 않다면
					// console.log( this.orderItemSize + ' : ' + this.items.length );
					if( this.ableEntireReturn == "false" || this.orderItemSize != this.items.length ){
						//console.log( '전체 반품이 불가능하거나 현재 주문의 전체 아이템 사이즈와 선택된 아이템 사이즈가 같지 않다면')
						isAvailable = true;
					}else{
						$.each( this.items, function(){
							//console.log( this.returnableQuantity + ' : ' + this.quantity);
							if( this.returnedQuantity != 0 || this.returnableQuantity != this.quantity ){
								//console.log('반품된 수량이 있거나 전체 수량이 아닌것 있음');
								isAvailable = true;
								return;
							}
						})
					}

					if( isAvailable == false ){
						//console.log('부분반품 불가능한 order가 있음');
						return false;
					}
				})
				return isAvailable;
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-returnorder]',
					attrName:'data-module-returnorder',
					moduleName:'module_returnorder',
					handler:{
						context:this,
						method:Method.moduleInit
					}
				});
			}
		}
	});
})(Core);