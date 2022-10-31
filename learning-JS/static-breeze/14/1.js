(function(Core){
	Core.register('module_order_delivery', function(sandbox){
		var $this, $messageText;
		var Method = {
			$popAddressModal :null,
			$beforeAddress:null,
			$newAddress:null,
			$addressWrap:null,
			$addressErrorInfo: null,
			isNewAddress:false,
			isSelectAddress:false,
			isChangeCustomerAddress:false,
			addressComponent:null,
			moduleInit:function(){
				$this = $(this);

				Method.$popAddressModal = UIkit.modal("#popup-customer-address", {modal: false});
				Method.$beforeAddress = $this.find('[data-before-address]');
				Method.$newAddress = $this.find('[data-new-address]');
				Method.$addressWrap = $this.find('[data-address-wrap]');
				Method.$addressErrorInfo = $this.find('[data-address-error-info]');

				// 배송지 타입이 없는건 비회원이라는 뜻
				Method.isNewAddress = ( $this.find('[data-address-type]').length == 0 ) ? true : false;
				Method.addressComponent = Core.getComponents('component_customer_address', { context: $this });

				var $personalMsg = $(this).find('[name="personalMessageText"]');
				var $personalSelect = $(this).find('select[name="selectPersonalMessage"]');
				// select가 안되어있고 msg가 있으면 직접입력 처리
				if( $personalMsg.val() != "" && $personalSelect.val() =="" ){
					$personalSelect.val('dt_1');
					$personalMsg.closest(".input-textfield").removeClass('uk-hidden');
				}

				var $personalMsgSelect = sandbox.getComponents('component_select', {context:$this}, function(){
					this.addEvent("change", function(){
						var value = $(this).val();
						if(value == ''){
							$personalMsg.val('');
							$personalMsg.closest(".input-textfield").addClass('uk-hidden');
						}else if(value == 'dt_1'){
							// 직접입력일 경우
							$personalMsg.val('');
							$personalMsg.closest(".input-textfield").removeClass('uk-hidden');
						}else{
							//$personalMsg.val( $(this).find("option:selected").val() + "||" + $(this).find("option:selected").text() );
							$personalMsg.val( $(this).find("option:selected").text());
							$personalMsg.closest(".input-textfield").addClass('uk-hidden');
						}
					});
				});

            	samedayError = $('.dl-same').find('[data-sameday-error]');
            	isDeliverableTimeError = '오늘도착 서비스 이용 시간 외 주문은 일반배송으로 발송처리 됩니다.';
            	isDeliverableProductCountError = '한 번에 상품 2개까지 주문하시면, 오늘도착 배송으로 받으실 수 있습니다. 주문수정은 장바구니 옵션변경에서 가능합니다.';
            	isDeliverableFulfillmentCountError = '상품 발송 출고지가 다른 주문인 경우 \'오늘도착 서비스\'를 이용하실 수 없습니다.';
            	isDeliverableAddressError = '배송지 주소 서울·분당 지역에 한해 \'오늘도착 서비스\'를 이용하실 수 있습니다. 서울·분당 주소지로 변경하시면 오늘도착이 가능합니다.';
            	isDeliverableProductFlagError = '오늘도착 상품과 일반 상품을 같이 구매하시면 일반배송으로 배송됩니다.';
                samedayDeliveryCheck = function(){
        			$this.find('[data-delivery]').each(function(){
        				var delivery = $(this).data('delivery');
        				if(delivery == 'sameday'){
        					$(this).addClass('disable').removeClass('checked');
        					$(this).find('input[type=radio]').removeAttr("checked");
        					$(this).find('input[type=radio]').attr("readonly",true);
        					sandbox.validation.reset($form);
        				} else {
        					$(this).addClass('checked');
        					$(this).find('input[type=radio]').attr("checked",true);
        					$this.find('select[name=selectPersonalMessage]').removeAttr('data-parsley-required');
        				}
        			});
                }
                samedayDeliveryDisable = function(){
                	var dlSame = $this.find('.dl-same');
                	var delivery = $this.find('[data-delivery]');
					dlSame.find('[data-sameday-error]').text('');
					dlSame.find('.error-message').removeClass('filled').find('>.parsley-required').remove();
					delivery.removeClass('checked disable');
					delivery.find('input[type=radio]').removeAttr("checked");
					delivery.find('input[type=radio]').removeAttr("readonly");
					$this.find('select[name=selectPersonalMessage]').attr('data-parsley-required',true);
                }
				$this.find('.dl-same label').on('click', function(e){
					e.preventDefault();
					var delivery = $(this).parents('[data-delivery]').data('delivery');
					if(delivery == 'sameday'){
						$this.find('select[name=selectPersonalMessage]').attr('data-parsley-required',true);
					} else{
    					$this.find('select[name=selectPersonalMessage]').removeAttr('data-parsley-required');
					}
				});
				Method.isSelectAddress = ( $(this).find('[name="isSearchAddress"]').val() == 'true' );
				var $zipCodeInput = $(this).find('[name="address.postalCode"]');
				var $zipCodeDisplay = $(this).find('[data-postalCode]');
				var deliverySearch = sandbox.getComponents('component_searchfield', {context:$this, selector:'.search-field', resultTemplate:'#address-find-list'}, function(){
					// 검색된 내용 선택시 zipcode 처리
					this.addEvent('resultSelect', function(data){
						var zipcode = $(data).data('zip-code5');
						var city = $(data).data('city');
						var doro = $(data).data('doro');

						this.getInputComponent().setValue(city + ' ' + doro);

						$zipCodeInput.val( zipcode );
						$zipCodeDisplay.text( zipcode );
						$zipCodeDisplay.parent().removeClass("uk-hidden");
						Method.isSelectAddress = true;

						// 배송방식 선택
						var paramObj = {
							toAddress: encodeURIComponent(city)
						}
						BLC.ajax({
							url:sandbox.utils.contextPath +"/checkout/checkSamedayDelivery",
							type:"POST",
							dataType:"json",
							data : paramObj
						},function(data){
							if(data.isPossibleSamedayDelivery !== true) {
                                samedayDeliveryCheck();
								if (data.isDeliverableTime == true) {
									if (data.isDeliverableCustomer == true) {
										if (data.isDeliverableProductFlag == true) {
											if (data.isDeliverableProductCount == true) {
												if (data.isDeliverableFulfillmentCount == true) {
													if (data.isDeliverableAddress == true) {
														// 오류메세지 노출 안함
													} else {
														samedayError.text(isDeliverableAddressError);
													}
												} else {
													samedayError.text(isDeliverableFulfillmentCountError);
												}
											} else {
												samedayError.text(isDeliverableProductCountError);
											}
										} else {
											if (data.isDeliverableProductFlagMixed == true) {
												samedayError.text(isDeliverableProductFlagError);
											} else {
												// 오류메세지 노출 안함
											}
										}
									} else {
										// 오류메세지 노출 안함
									}
								} else {
									samedayError.text(isDeliverableTimeError);
								}
							} else{
								samedayDeliveryDisable();
							}
						});
					});
				});

				var $form = $this.find('#shipping_info');
				sandbox.validation.init( $form );

				//배송 메시지에 특수문자 " \ 저장 안되게 치환
				$personalMsg.on('keyup', function(e){
					//console.log(e.keyCode)
					$personalMsg.val(Method.getShppingMesasgeByRemoveUnusable($personalMsg.val()));
					return false;
		        });


				// 배송지 정보 submit 시
				$this.find('[data-order-shipping-submit-btn]').on('click', function(e){
					// 비회원 로그인 여부 팝업을 띄울때 labels를 설정 했는데 다른 창이 뜰때도 영향을 받아 다시 초기화 시킴
					UIkit.modal.alert('', function () {
					}, function () { },
					{
						labels: { 'Ok': '확인'}
					}).hide();
					
					e.preventDefault();
					sandbox.validation.validate( $form );
					if(sandbox.validation.isValid( $form )){
						if( Method.isNewAddress ){
							if( !Method.isSelectAddress ){
								UIkit.modal.alert("검색을 통하여 배송지를 입력해주세요.");
								return;
							}
						}else{
							/*
							// 신규 등록이 아닐때는 기존 주소가 유효 한지 체크 한다.
							var address1 = $form.find('input[name="address.addressLine1"]').eq(0).val();
							var addressId = $form.find('#addressId').eq(0).val();
							
							// 최종 주소를 다시 한번 주소 API로 유효성 체크
							var customerAddrssValidationResult = Core.Utils.addressApi.init().isEmpty(address1);
							if (customerAddrssValidationResult) {
								// 한번도 변경을 안했으면 즉 기본배송지를 사용중이면
								if (!Method.isChangeCustomerAddress) {
									if (Method.addressComponent!=null) {
										var defaultAddrss = Method.addressComponent.getDefaultAddress();
										if (defaultAddrss != null) {
											Method.removeWrongAddress(defaultAddrss.id);
										}
									}
								}else{
									Method.removeWrongAddress(addressId);
								}
								return;
							}
							*/
						}
						//주문서 입력시 010 11자리, 이외는 10자리로..
						if( ($form.find('[aria-expanded]').attr('aria-expanded')=="true")  || ($form.find('[aria-expanded]').length == 0)){  //이전주소 일 경우
							var phoneNumber = $form.find('input[name="address.phonePrimary.phoneNumber"]').eq(0).val();

							//기본 배송지 일경우  이름이 최소 2자 이어야 주문가능 하게 수정.
							if($form.find('input[name="address.fullName"]').val().length < 2){
								UIkit.modal.alert('이름은 2자 이상 가능 합니다.');
								return false;
							}
						}else{  //새로입력
							var phoneNumber = $form.find('input[name="address.phonePrimary.phoneNumber"]').eq(1).val();
						}

						//핸드폰, 일반 전화 패턴 정의
						var hp_defalult = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;    //새로 입력이 아닐경우, 기본 정규식 패턴 체크하기 위해서..
						var hp_pattern  = /^((01[16789])[1-9][0-9]{6,7})|(010[1-9][0-9]{7})$/;
						var cd_pattern  = /^(1[568][0456789][01456789][0-9]{4})|((01[16789])[1-9][0-9]{6,7})|(010[1-9][0-9]{7})|(050[0-9]{8,9})|((02|0[3-9][0-9])[0-9]{3,4}[0-9]{4})|(0001[568][0456789][01456789][0-9]{4})$/;
						var pattern_chk1 = false;      // false 로 기본 셋팅
						var pattern_chk2 = false;

						if(hp_defalult.test(phoneNumber)){
							pattern_chk1 = true;
						};

						if(hp_pattern.test(phoneNumber)){  //휴대폰 먼저 chk.
							pattern_chk2 = true;
						}else{
							if(cd_pattern.test(phoneNumber)){   //휴대폰 패턴이 false 경우, 일반 전화 패턴 chk.
								pattern_chk2 = true;
							};
						};

						if(!pattern_chk1 || !pattern_chk2) {    //검증 pattern_chk1, pattern_chk2 모두 true 이어야만..정상 연락처로....)
							UIkit.modal.alert('배송지 연락처를 정확하게 입력해 주세요!');
							return false;
						}
						
						//배송 메시지에 특수문자 " \ 저장 안되게 치환
						$personalMsg.val(Method.getShppingMesasgeByRemoveUnusable($personalMsg.val()));

						//당일배송 가능여부 체크
						$this.find('[data-delivery]').each(function(){
    						var delivery = $(this).data('delivery');
    						var radio = $(this).find('input[type=radio]').is(":checked");
    						if(delivery == 'default' && radio == true){
						        $form.submit();
						    } else if(delivery == 'sameday' && radio == true){
        						BLC.ajax({
        							url:sandbox.utils.contextPath +"/checkout/checkSamedayDelivery",
        							type:"POST",
        							dataType:"json",
        							data: {toAddress :'NONE'}
        						},function(data){
									var finishModal = UIkit.modal('#finish-refund', {center:false});
									if(data.isDeliverableTime !== true){
										finishModal.find('h1').text('오늘도착 주문마감');
										finishModal.find('.contents-wrap>p>strong').html('오늘도착 서비스 이용 시간이 지났습니다.<br>현재 상품은 일반배송으로 주문이 가능합니다.<br>일반배송으로 주문 진행하시겠습니까?');
										var html = '<a href="#none" class="btn-link large btn-enter uk-modal-close">일반배송 주문진행</a>';
										html+= '<a href="#none" class="btn-link line large uk-modal-close">취소</a>';
										finishModal.find('.btn-wrap').html(html)
										finishModal.show();
										finishModal.find('.btn-enter').off('click').on('click', function(){
											$this.find('[data-delivery]').each(function(){
						        				var delivery = $(this).data('delivery');
												if(delivery == 'default'){
													$(this).find('input[type=radio]').attr("checked",true);
											        $form.submit();
											    }
											});
										});
									} else if(data.isDeliverableLocation !== true){
										finishModal.find('h1').text('일시 품절 안내');
										finishModal.find('.contents-wrap>p>strong').html('죄송합니다. 현재 재고가 없습니다.');
										finishModal.find('.btn-wrap').html('<a href="#none" class="btn-link line large btn-enter">확인</a>')
										finishModal.show();
										finishModal.find('.btn-enter').off('click').on('click', function(){
										    location.href = sandbox.utils.contextPath
										});
									} else{
										var samedayPrice = $this.find('[data-sameday-price]').data('sameday-price');
										var samedayPriceReplace = String(samedayPrice).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
										finishModal.find('h1').text('오늘도착 주문안내');
										var text = '오늘도착 배송으로 주문 선택하셨습니다.<br>';
										text += '결제 완료 후 배송지 변경이 불가하므로 정확한 배송지 정보로 등록되어 있는지 확인해주세요.<br>';
										text += '(서비스 비용 ' + samedayPriceReplace + '원)';
										finishModal.find('.contents-wrap>p>strong').html(text);
										var html = '<a href="#none" class="btn-link line large uk-modal-close">취소</a>';
										html+= '<a href="#none" class="btn-link large btn-enter">확인</a>';
										finishModal.find('.btn-wrap').html(html)
										finishModal.show();
										finishModal.find('.btn-enter').off('click').on('click', function(){
									        $form.submit();
										});
									}
        						});
						    }
            			});
					}
				})

				// 배송지 선택 버튼
				$this.find('[data-customer-address-btn]').on('click', function(e){
					e.preventDefault();
					Method.showCustomerAddressList();
					//Method.$popAddressModal.show();
				});

				// 배송지 입력 타입 버튼 선택시
				$this.find('[data-address-type]').on('show.uk.switcher', function(){
					Method.isSelectAddress = deliverySearch.getValidateChk();
					Method.updateAddressInput();
				});
	
				// 선택된 주소가 있으면 주소가 정상적인지 한번 체크한다.
				/*
				if (Method.isSelectAddress) {
					Method.validateCustomerAddress(Method.$beforeAddress.find('input[name="address.addressLine1"]').val());
				}else{
					Method.$addressWrap.addClass('uk-hidden');
					Method.$addressErrorInfo.addClass('uk-hidden');
					Method.$beforeAddress.removeClass('uk-hidden');
				}
				*/
			},
			getShppingMesasgeByRemoveUnusable: function (message) {
				return sandbox.utils.string.removeEmojis(message.replace(/\\/g, '').replace('"', ''));
			},
			removeWrongAddress:function(addressId){
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
			addCustomerAddressEvent:function(){
				// 배송지 선택 모듈 select 이벤트 호출( 배송지 선택했을때 호출됨 )
				Core.getComponents('component_customer_address', { context: $this }, function () {
					this.addEvent('select', function (data) {
						/*
						var customerAddrssValidationResult = Core.Utils.addressApi.init().isEmpty(data.addressLine1);
						if (customerAddrssValidationResult) {
							Method.removeWrongAddress(data.id);
							return;
						}
						*/

						Method.updateCustomerAddress(data, true);
						if (Method.$popAddressModal.isActive()) {
							Method.$popAddressModal.hide();
							// 배송방식 선택
							var paramObj = {
								toAddress: encodeURIComponent(data.addressLine1)
							}
							BLC.ajax({
								url: sandbox.utils.contextPath + "/checkout/checkSamedayDelivery",
								type: "POST",
								dataType: "json",
								data: paramObj
							}, function (data) {
								if (data.isPossibleSamedayDelivery !== true) {
									samedayDeliveryCheck();
									if (data.isDeliverableTime == true) {
										if (data.isDeliverableCustomer == true) {
											if (data.isDeliverableProductFlag == true) {
												if (data.isDeliverableProductCount == true) {
													if (data.isDeliverableFulfillmentCount == true) {
														if (data.isDeliverableAddress == true) {
															// 오류메세지 노출 안함
														} else {
															samedayError.text(isDeliverableAddressError);
														}
													} else {
														samedayError.text(isDeliverableFulfillmentCountError);
													}
												} else {
													samedayError.text(isDeliverableProductCountError);
												}
											} else {
												if (data.isDeliverableProductFlagMixed == true) {
													samedayError.text(isDeliverableProductFlagError);
												} else {
													// 오류메세지 노출 안함
												}
											}
										} else {
											// 오류메세지 노출 안함
										}
									} else {
										samedayError.text(isDeliverableTimeError);
									}
								} else {
									samedayDeliveryDisable();
								}

							});
						}
					})
				});
			},
			showCustomerAddressList:function(){
				var obj = {
					'mode': 'template',
					'templatePath': '/modules/customerAddress',
					'needCustomerAddress': 'Y'
				}
				sandbox.utils.ajax(sandbox.utils.contextPath + '/processor/execute/customer_info', 'GET', obj, function (data) {
					var appendHtml = $(data.responseText);
					Method.$popAddressModal.element.find('.contents').empty().append(appendHtml[0].outerHTML);
					sandbox.moduleEventInjection(appendHtml[0].outerHTML);
					Method.addCustomerAddressEvent();
					Method.$popAddressModal.show();
				});
			},
			updateCustomerAddress:function(data, isValidate){
				Method.isChangeCustomerAddress = true;
				var $target = Method.$beforeAddress;
				//$target.addClass('uk-hidden');
				if( $target.find('[data-user-name]').length > 0 ){
					$target.find('[data-user-name]').html($.trim(data.fullName));
				}

				if( $target.find('[data-phone]').length > 0 ){
					$target.find('[data-phone]').html($.trim(data.phoneNumber));
				}

				if( $target.find('[data-postalCode]').length > 0 ){
					$target.find('[data-postalCode]').html($.trim(data.postalCode));
				}

				if( $target.find('[data-address]').length > 0 ){
					$target.find('[data-address]').html($.trim(data.addressLine1 + ' ' + data.addressLine2));
				}

				/*
				if( $target.find('[data-address2]').length > 0 ){
					$target.find('[data-address2]').text(data.addressLine2);
				}
				*/

				// 변경된 값 input 에 적용
				$target.find('#addressId').val($.trim(data.id));
				$target.find('input[name="address.fullName"]').val($.trim(data.fullName));
				$target.find('input[name="address.phonePrimary.phoneNumber"]').val($.trim(data.phoneNumber));
				$target.find('input[name="address.addressLine1"]').val($.trim(data.addressLine1));
				$target.find('input[name="address.addressLine2"]').val($.trim(data.addressLine2));
				$target.find('input[name="address.postalCode"]').val($.trim(data.postalCode));

				/*
				if (isValidate) {
					Method.validateCustomerAddress(data.addressLine1);
				}else{
					Method.$addressWrap.removeClass('uk-hidden');
					Method.$addressErrorInfo.addClass('uk-hidden');
					$target.removeClass('uk-hidden');
				}
				*/
			},

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
				// 배송방식 선택
				var data = {
				    isPossibleSamedayDelivery : samedayError.data('ispossiblesamedaydelivery') ,
				    isDeliverableProductFlag : samedayError.data('isdeliverableproductflag') ,
				    isDeliverableTime : samedayError.data('isdeliverabletime') ,
				    isDeliverableProductCount : samedayError.data('isdeliverableproductcount') ,
				    isDeliverableFulfillmentCount : samedayError.data('isdeliverablefulfillmentcount') ,
				    isDeliverableAddress : samedayError.data('isdeliverableaddress') ,
				    isDeliverableCustomer : samedayError.data('isdeliverablecustomer') ,
				    isDeliverableProductFlagMixed : samedayError.data('isdeliverableproductflagmixed')
				}
				if($('.dl-same').length !== 0 && data.isPossibleSamedayDelivery !== true) {
                    samedayDeliveryCheck();
					if (data.isDeliverableTime == true) {
						if (data.isDeliverableCustomer == true) {
							if (data.isDeliverableProductFlag == true) {
								if (data.isDeliverableProductCount == true) {
									if (data.isDeliverableFulfillmentCount == true) {
										if (data.isDeliverableAddress == true) {
											// 오류메세지 노출 안함
										} else {
											samedayError.text(isDeliverableAddressError);
										}
									} else {
										samedayError.text(isDeliverableFulfillmentCountError);
									}
								} else {
									samedayError.text(isDeliverableProductCountError);
								}
							} else {
								if (data.isDeliverableProductFlagMixed == true) {
									samedayError.text(isDeliverableProductFlagError);
								} else {
									// 오류메세지 노출 안함
								}
							}
						} else {
							// 오류메세지 노출 안함
						}
					} else {
						samedayError.text(isDeliverableTimeError);
					}
				} else{
					samedayDeliveryDisable();
				}
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-order-delivery]',
					attrName:'data-module-order-delivery',
					moduleName:'module_order_delivery',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);