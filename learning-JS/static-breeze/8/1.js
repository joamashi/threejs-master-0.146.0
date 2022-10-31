(function(Core){
	Core.register('module_ordercancel', function(sandbox){
		var $this = null,
			$modalDeferred = null, //상위 모듈에서 보낸 $.Deferred
			args = null,
			refundAmountComponent = null,
			checkboxAllCounter = 0,
			isCheckboxAll = false,
			quantitySelectComponent = null,
			checkboxComponent = null,
			reFundBankTextComponent = null,
			isToApp = false,
			callBackUrl = '';
			orderId = null;


		var checkboxCalculator = function(isValue){
			if(isCheckboxAll){
				if(isValue){
					checkboxAllCounter++;
					if((checkboxComponent.length - 1) <= checkboxAllCounter){
						isCheckboxAll = false;
						Method.submitCalculator();
					}
				}else{
					checkboxAllCounter--;
					if(checkboxAllCounter <= 0){
						isCheckboxAll = false;
						Method.emptyRefundPayment();
					}
				}
			}else{
				if(isValue){
					checkboxAllCounter++;
				}else{
					checkboxAllCounter--;
				}
				Method.submitCalculator();
			}
		}

		var arrIndexOfs = function(key, arr){
			var arrIndex = [];
			for(var i=0; i<arr.length; i++){
				if(arr[i] === key){
					arrIndex.push(i);
				}
			}
			return arrIndex;
		}

		var checkboxAllValidateChk = function(){
			var isChecked = true;
			var $itemCheckbox = $this.find('.item-checkbox');
			for(var i=0; i < $itemCheckbox.length; i++){
				if(!$itemCheckbox.eq(i).find('input[type=checkbox]').prop('checked')){
					isChecked = false;
					break;
				}
			}
			return isChecked;
		}

		var Method = {
			moduleInit:function(){
				args = arguments[0];
				$this = $(this);

				//취소할 아이템
				var items = $this.find('.return-reason-item');
				var orderStatusFormData = sandbox.utils.getQueryParams($this.find('#order-status-form').serialize().replace(/\+/g, ' '));
				var arrOrderItemId = [];
				var arrItemParentOrderItemId = [];

				orderId = args['data-module-ordercancel'].orderId;
				isToApp = (args['data-appcard-cancel']['isAppCard'] === 'true') ? true : false;
				callBackUrl = (args['data-appcard-cancel'].callbackUrl) ? args['data-appcard-cancel'].callbackUrl.replace(/\|/g, '&') : '';

				//주문에드온이 있다면 항상 전체취소만 가능하다.
				var isOrderAddon = (function(){
					var isAddon = false;
					$this.find('.return-reason-item').each(function(i){
						arrOrderItemId.push($(this).attr('data-orderItemId'));
						arrItemParentOrderItemId.push($(this).attr('data-parentOrderItemId'));
						if($(this).attr('data-isAddon') === 'true'){
							isAddon = true;
						}
					});
					return isAddon;
				})();

				var isAbleCancel = (function(){
					if(isToApp){
						return true;
					}else{
						if(orderStatusFormData.isAble === 'true'){
							if(orderStatusFormData.isFdk === 'true' && orderStatusFormData.isMid === 'false'){
								return false;
							}else{
								return true;
							}
						}else{
							return false;
						}
					}
				})();
				var isAblePartial = (isOrderAddon || isToApp) ? false : ((orderStatusFormData.isAblePartial === 'true') ? true : false);
				// 당일배송인 경우 전체취소만 가능
				if($('input[name=isSamedayDelivery]').val() == 'true'){
					isAblePartial = false;
				}


				var isRefundAccount = (orderStatusFormData.isRefundAccount === 'true') ? true : false;

				refundAmountComponent = new Vue({
					el:'#refund-amount',
					data:{
						"isAbleCancel":isAbleCancel,
						"isRefundAccount":isRefundAccount,
						"isAblePartial":isAblePartial,
						"refundPayments":[{
							"paymentType":{"type":null,"friendlyType":null,"isFinalPayment":false},
							"orgPaymentAmount":{"amount":0,"currency":"KRW"},
							"paymentAmount":{"amount":0,"currency":"KRW"},
							"shippingAmount":{"amount":0,"currency":"KRW"},
							"taxAmount":{"amount":0,"currency":"KRW"},
							"totalAmount":{"amount":0,"currency":"KRW"}
						}],
						"refundAccountNeed":(isAbleCancel && isRefundAccount) ? true:false,
						"ableEntireVoid":(isAbleCancel && isAblePartial) ? true:false,
						"fulfillmentCharge":{"amount":0,"currency":"KRW"}
					},
					created:function(){
						this.$nextTick(function(){
							if(this.refundAccountNeed){
								$this.find('.refund-account-container').addClass('need-refund-account');
							}

							checkboxComponent = sandbox.getComponents('component_checkbox', {context:$this}, function(i){
								var INDEX = i;
								this.addEvent('change', function(val){
									var $that = $(this);
									var $quantityWrap = $that.closest('.return-reason-item').find('.quantity-wrap');
									if($(this).val() === 'all'){
										//체크박스 전체선택 / 해제
										isCheckboxAll = true;
										if(val){
											$this.find('.item-checkbox').each(function(){
												if(!$(this).hasClass('checked')){
													$(this).find('> label').trigger('click');
												}
											});
										}else{
											$this.find('.item-checkbox.checked > label').trigger('click');
										}
									}else{
										if(val){
											$quantityWrap.addClass('active');
										}else{
											$quantityWrap.removeClass('active');
										}
										$quantityWrap.find('input[type=hidden]').prop('disabled', !val);
										$this.find('.all-checkbox').find('input[type=checkbox]').prop('checked', checkboxAllValidateChk());

										//product 에드온상품이 있으면, arrItemParentOrderItemId를 비교하여 같이 취소될수있도록 처리한다.
										arrIndexOfs(arrOrderItemId[INDEX - 1], arrItemParentOrderItemId).forEach(function(val, index, arr){
											$this.find('.return-reason-item').eq(val).find('input[type=hidden]').prop('disabled', !val);
										});

										checkboxCalculator(val);
									}
								});
							});

							reFundBankTextComponent = sandbox.getComponents('component_textfield', {context:$this});
							quantitySelectComponent = sandbox.getComponents('component_select', {context:$this}, function(){
								this.addEvent('change', function(val, $selected){
									if($(this).attr('name') === 'refundBank'){
										console.log($selected.attr('data-bankcode-key'));
										$(this).closest('.select-box').find('input[name="refundBankCode"]').val($selected.attr('data-bankcode-key'));
									}else if($(this).attr('name') === 'reason'){
										console.log(val);
									}else{
										$(this).closest('.select-box').siblings().filter('input[name=quantity]').val(val);
										Method.submitCalculator();
									}
								});
							});

							//isAbleCancel이 true이고, checkboxComponent가 undefined일떄 계산기를 실행한다.
							//ropis일때는 계산기 로직을 제외한다. 분명 나중에 다시 수정하게 됨.
							if(this.isAbleCancel && !checkboxComponent){
								Method.submitCalculator();
							}

							$this.find('[data-order-confirm]').click(function(e){

								      //ctm태깅 추가(주문취소 클릭)
				              var f_type = $this.find("[data-fulfillmenttype]").data('fulfillmenttype');
											var o_type = $this.find("[data-ordertype]").data('ordertype')

													if(f_type=='PHYSICAL_PICKUP'){
									                 if(o_type==true){
									                   click_name  = "inventory: ROPIS_cancellation: submit";
																	 }else{
																		 click_name  = "inventory: BOPIS_cancellation: submit" ;
																	 };

														       endPoint.call('clickEvent', {'area' : 'mypage', 'name' : click_name })
													}else {
											      endPoint.call('clickEvent', {'area' : 'mypage', 'name' :'inventory: ORDER/SHIPPING_cancellation: submit' })
									      	}


								e.preventDefault();
								if(!$(this).hasClass('disabled')){
									if(isToApp){
										Method.appCreditCardCancel();
									}else{
										Method.submitCancelOrder();
									}
								}
							});


							$this.find('[data-order-cancel]').click(function(e){
								e.preventDefault();
								if($modalDeferred === null){
									sandbox.setLoadingBarState(true);
									sandbox.utils.walkThrough('admin', callBackUrl);
								}else{
									$modalDeferred.reject();
								}
							});
						});
					},
					watch:{
						refundAccountNeed:function(){
							/*if(this.refundAccountNeed === true){
								$this.find('.refund-account-container').addClass('need-refund-account');
							}else{
								$this.find('.refund-account-container').removeClass('need-refund-account');
							}*/
						}
					},
					methods:{
						isPartialVoid:function(groupCancellable, itemCancellabel, index, reverse){
							//isAbleCancel이 false이면 취소가 불가능한 주문이다.
							if(this.isAbleCancel){
								if(arrItemParentOrderItemId[index-1]){
									if(isOrderAddon){
										return false;
									}else{
										if(reverse){
											return true;
										}else{
											return false;
										}
									}
								}

								//isAblePartial이 false이면 무조건 전체취소만 가능하다.
								if(this.isAblePartial){
									//itemCancellabel이 false이면 전체취소만 가능하다.
									if(itemCancellabel){
										if(items.length <= 1 && items.attr('data-item-quantity') <= 1){
											return false;
										}else{
											return true;
										}
									}else{
										return false;
									}
								}else{
									return false;
								}
							}else{
								if(reverse){
									return true;
								}else{
									return false;
								}
							}
						},
						isOrderPartialVoid:function(reverse){
							//isAbleCancel이 false일때는 취소불가능
							//isAbleCancel이 true 이고, isAblePartial이 true일때 부분취소가능
							//isAbleCancel이 true 이고, isAblePartial이 false일 전체취소만가능
							if(this.isAbleCancel){
								if(this.isAblePartial){
									if(items.length <= 1 && items.attr('data-item-quantity') <= 1){
										return false;
									}else{
										return true;
									}
								}else{
									return false;
								}
							}else{
								if(reverse){
									return true;
								}else{
									return false;
								}
							}
						},
						rtnCause:function(){
							if(this.isAbleCancel){
								if(this.isAblePartial){
									if(items.length <= 1 && items.attr('data-item-quantity') <= 1){
										return '하단의 취소 버튼을 클릭하시면 취소가 완료됩니다.';
									}else{
										return '주문을 취소하실 상품과 수량을 선택해 주세요.';
									}
								}else{
									if(isToApp){
										return '하단의 취소 버튼을 클릭하시면 취소가 완료됩니다.';
									}else if($('input[name=isSamedayDelivery]').val() == 'true'){//당일배송인 경우
										return '하단의 취소 버튼을 클릭하시면 취소가 완료됩니다.';
									}else{
										return decodeURIComponent(orderStatusFormData['restrict-partial']);
									}
								}
							}else{
								return (function(){
									//ErrorCode 01 - fdk결제한 주문이며, 매입전 주문이지만 마이페이지주문 목록에 노출되고 있어 결제취소가 가능하게 되어 있음(결제취소 불가 해야함)
									//조건은 fdk결제이며, 결제 mid가 있으면 취소불가 error msg 출력
									var cause = decodeURIComponent(orderStatusFormData['never-cause']);
									return (cause !== 'undefined') ? cause : '매입 전 취소는 온라인에서 불가능 합니다.';
								})();
							}
						},
						rtnPaymentType:function(paymentType){
							var label = '';
							switch(paymentType){
								case 'CUSTOMER_CREDIT' :
									label = '적립금';
									break;
								case 'GIFT_CARD' :
									label = '기프트카드';
									break;
								case 'CREDIT_CARD' :
									label = '신용카드';
									break;
								case 'MOBILE' :
									label = '휴대폰소액결제';
									break;
								case 'BANK_ACCOUNT' :
									label = '실시간계좌이체';
									break;
								case 'KAKAO_POINT' :
									label = '카카오페이'
									break;
								case 'PAYCO' : // 2019-08-12
									label = '페이코'
									break;
								case 'NAVER_PAY' : // 2020-09-08
									label = '네이버페이'
									break;
							}
							return label;
						},
						price:function(amount){
							return sandbox.utils.price(amount);
						}
					}
				});
			},
			submitCalculator:function(){
				if(!args['data-module-ordercancel'].orderId){
					UIkit.notify('orderId가 없습니다.', {timeout:3000,pos:'top-center',status:'danger'});
					return;
				}

				var formData = $this.find('#cancel-items-form').serialize();
				var url = sandbox.utils.contextPath + '/account/order/partial-cancel-calculator/' + args['data-module-ordercancel'].orderId;
				var transFormData = sandbox.utils.getQueryParams(formData);
				var isFormDataValidateChk = (transFormData.hasOwnProperty('orderItemId') && transFormData.hasOwnProperty('quantity')) ? true:false;

				if(refundAmountComponent.isAbleCancel && isFormDataValidateChk){
					sandbox.utils.ajax(url, 'POST', formData, function(data){
						var data = sandbox.rtnJson(data.responseText, true);
						var result = data['result'];
						if(data['result'] && data['ro']){
							refundAmountComponent.refundPayments = [];
							
							// 오퍼 or 배송비 정책에 따라 취소 금액이 주문금액 보다 큰 상황이 있음
							// data['ro']['refundPayments'][i].totalAmount가 마이너스로 오게 됨
							// 취소 금액 주문 금액 보다 커서 취소가 불가능합니다.


							for(var i=0; i<data['ro']['refundPayments'].length; i++){
								if(data['ro']['refundPayments'][i].paymentType.type !== 'COD'){
									refundAmountComponent.refundPayments.push(data['ro']['refundPayments'][i]);
								}
							}

							//refundAmountComponent.refundAccountNeed = data['ro']['refundAccountNeed'];
							refundAmountComponent.ablePartialVoid = data['ro']['ablePartialVoid'];
							refundAmountComponent.fulfillmentCharge = data['ro']['fulfillmentCharge'];
							refundAmountComponent.ableEntireVoid = data['ro']['ableEntireVoid'];

							//cancelBtn enabled
							$this.find('[data-order-confirm]').removeClass('disabled');
						}else{
							if($modalDeferred !== null){
								$modalDeferred.reject(data['errorMsg']);
							}else{
								UIkit.modal.alert(data['errorMsg']);
							}
						}
					}, false, false, 100);
				}else{
					Method.emptyRefundPayment();
				}
			},
			emptyRefundPayment:function(){
				//계산할 금액 없음
				refundAmountComponent.refundPayments = [];

				//cancelBtn disabled
				$this.find('[data-order-confirm]').addClass('disabled');
			},
			refundAccountValidateChk:function(){
				//refundAccount validate check
				var $deferred = $.Deferred(),
					data = '';

				if(refundAmountComponent.refundAccountNeed){
					//validateChk
					var $form = $this.find('#refund-account-form');
					sandbox.validation.init( $form );
					sandbox.validation.validate( $form );

					if(sandbox.validation.isValid( $form )){
						$deferred.resolve($this.find('#refund-account-form').serialize());
					}else{
						$deferred.reject();
					}
				}else{
					$deferred.resolve();
				}

				return $deferred.promise();
			},
			cancelReasonValidateChk:function(data){
				//cancel reason validateChk
				var defer = $.Deferred();
				var $form = $this.find('#cancel-reason-form');
				var currentData = (data) ? sandbox.utils.getQueryParams(data, 'array') : [];

				if($form.length > 0){
					sandbox.validation.init( $form );
					sandbox.validation.validate( $form );
					if(sandbox.validation.isValid( $form )){
						defer.resolve(sandbox.utils.getQueryParams($form.serialize(), 'array').concat(currentData).join('&'));
					}else{
						defer.reject();
					}
				}else{
					defer.resolve(currentData.join('&'));
				}
				return defer.promise();
			},
			submitCancelOrder:function(appCancelParams){
				if(!args['data-module-ordercancel'].orderId){
					UIkit.notify('orderId가 없습니다.', {timeout:3000,pos:'top-center',status:'danger'});
					return;
				}

				Method.refundAccountValidateChk().then(function(data){
					//cancel reason validateChk
					return Method.cancelReasonValidateChk(data);
				}).then(function(data){
					//orderCancel Item validate check
					var defer = $.Deferred();
					var cancelItemsData = $this.find('#cancel-items-form').serialize();
					var transFormData = sandbox.utils.getQueryParams(cancelItemsData);
					var currentData = sandbox.utils.getQueryParams(data, 'array');
					var isFormDataValidateChk = (transFormData.hasOwnProperty('orderItemId') && transFormData.hasOwnProperty('quantity')) ? true:false;
					if(refundAmountComponent.isAbleCancel && isFormDataValidateChk){
						defer.resolve(sandbox.utils.getQueryParams(cancelItemsData, 'array').concat(currentData).join('&'));
					}else{
						defer.reject('취소할 상품을 선택해주세요.');
					}
					return defer.promise();
				}).then(function(data){
					//submitCancelOrder confirm check
					var defer = $.Deferred();
					var message = (refundAmountComponent.ableEntireVoid) ? '취소 하시겠습니까?' : '선택한 상품을 취소하시겠습니까?';
					if(appCancelParams){
						defer.resolve(data);
					}else{
						UIkit.modal.confirm(message, function(){

							defer.resolve(data);
						},function(){
							defer.reject();
						},{
							labels: {'Ok': '확인', 'Cancel': '취소'}
						});
					}

					return defer.promise();
				}).then(function(data){
					//submitCancelOrder async

					//ctm태깅 추가(확인버튼 클릭시)
					var f_type = $this.find("[data-fulfillmenttype]").data('fulfillmenttype');
					var o_type = $this.find("[data-ordertype]").data('ordertype')

					if(f_type=='PHYSICAL_PICKUP'){
						if(o_type==true){
							click_name  = "inventory: ROPIS_cancellation: submit_final";
						}else{
							click_name  = "inventory: BOPIS_cancellation: submit_final" ;
						};
						endPoint.call('clickEvent', {'area' : 'mypage', 'name' : click_name });
					}else{
						endPoint.call('clickEvent', {'area' : 'mypage', 'name' : 'inventory: ORDER/SHIPPING_cancellation: submit_final' });
					};

					//어시스트 카드 취소시 	태깅 값이 없어서 오류 발생.
					//data-ctm-order-type ctm 관련 값이 있을경우에만 취소 태깅 진행.
					if($this.find('[data-ctm-order-type]').length > 0){
						Method.callAdobeScript();      //  ctm order cancle  태깅추가
					};

					var orderCancelApi = (isToApp)? '/account/order/appCancel/' : ((refundAmountComponent.ableEntireVoid) ? '/account/order/cancel/' : '/account/order/partial-cancel/');
					var url = sandbox.utils.contextPath + orderCancelApi + args['data-module-ordercancel'].orderId;
					var currentData = (appCancelParams) ? appCancelParams : [];
					var mixedData = sandbox.utils.getQueryParams(data, 'array').concat(currentData).join('&');
					return sandbox.utils.promise({
						url:url,
						method:'POST',
						data:mixedData
					});
				}).then(function(data){
					//part of submitCancelOrder complate
					var marketingType = (refundAmountComponent.ableEntireVoid) ? 'VOID' : 'PARTIAL_VOID';
					if( data['result'] == true ){
						var marketingData = _GLOBAL.MARKETING_DATA();
						if( marketingData.useGa == true ){
							var marketingOption = {
								orderType : marketingType,
								orderId : orderId
							};
							Core.ga.processor( marketingOption );
						}
						if($modalDeferred !== null){
							$modalDeferred.resolve(data);
						}else{
							UIkit.modal.alert('주문취소되었습니다.').on('hide.uk.modal', function(){
								sandbox.setLoadingBarState(true);
								sandbox.utils.walkThrough('admin', callBackUrl);
							});
						}
					}else{
						if($modalDeferred !== null) $modalDeferred.reject(data['errorMsg']);
					}
				}).fail(function(error){
					if(error) UIkit.modal.alert(error);
				});
			},
			callAdobeScript:function(){   // ctm 취소 태깅 진행.

				var fulfillmenttype  =  $this.find('[data-fulfillmenttype]').data('fulfillmenttype');
				var ordertype        =  $this.find('[data-ordertype]').data('ordertype');   //false:보피스 , true:로피스는
				var ctmordertype     =  $this.find('[data-ctm-order-type]').data('ctm-order-type').toLowerCase();
				//ctmordertype="com_owned";

				if(ctmordertype=="mixed"){
					ctmordertype="cloud_mixed"
				};

				//var physicaltype ="";

				// switch(fulfillmenttype){
				//	case "PHYSICAL_PICKUP","PHYSICAL_ROPIS" :
				//		if(ordertype=="false"){
				//			physicaltype = "bopis";
				//		}else{
				//			physicaltype = "ropis";
				//		};
				//		break;
				//	case "PHYSICAL_SHIP" :
				//		physicaltype = ctmordertype;
				//		break;
				// };

				var st_retailPrice    		 =  $("[data-order-retailPrice]").data('order-retailprice');  //상품 최종 결제 금액(할인전 금액)
				var st_lastprice 			 =  $("[data-order-lastprice]").data('order-lastprice');   //retailPrice상품 총 결제 금액(쿠폰 먹인후 최종 금액)

				var data = {};
				data.link_name 		 = "Order Cancel";
				data.purchase_id    	 = $("[data-ctm-purchase-id]").data('ctm-purchase-id'); // 구매 (확정) 번호
				data.ctm_order_type 	 = ctmordertype; // 주문형태 기입
				data.products 			 = [];

				var $itemCheckbox = $this.find('.item-checkbox');

				//20190320 아이템별로 할인금액 계산
				var sum_item_price = 0;  //상품에 대한 할인 먹기전 (retail-price 금액) 취소한 최종 금액
				var item_price     = 0; //상품 retail-price

				if( $("[data-component-checkbox]").length > 0 ){  //취소 가능한 상품이 여러개 일경우
					$("[data-ctm-product-type]").each(function(i){
						item_chk = $(this).find("[data-component-checkbox]").hasClass("checked");
						if(item_chk){
							//상품 할인 쿠폰을 먹인경우 retail-price, 일반 일경우 price dom 에서 가져온다.
							item_price 	= ($(this).find(".retail-price").length > 0 ? parseInt($(this).find(".retail-price").text().replace(/[^0-9]/g,"")) : parseInt($(this).find(".price").text().replace(/[^0-9]/g,"")) );
							ea			= ($(this).find(".currentOpt").length > 0 ? parseInt($(this).find(".currentOpt").text()) : 1 );
							sum_item_price = sum_item_price+(item_price*ea);  // retail-price * 취소수량 , 취소 선택한 만큼 누적시켜 준다.
						}
					});
				}else{  //취소가능한 상품이 1개일 경우
					item_price  	= ($("li[data-ctm-product-type]").find(".retail-price").length > 0 ? parseInt($("li[data-ctm-product-type]").find(".retail-price").text().replace(/[^0-9]/g,"")) : parseInt($("li[data-ctm-product-type]").find(".price").text().replace(/[^0-9]/g,"")) );
					ea			    = ($("li[data-ctm-product-type]").find(".currentOpt").length > 0 ? parseInt($("li[data-ctm-product-type]").find(".currentOpt").text()) : 1 );
					sum_item_price = item_price*ea;
				}

				//환불금액 가져오기 (retail-price * 취소 수량 , 환불금액 차이를 계산해서 할인된 금액을 구해온다.)
				var discount_amount = parseInt(sum_item_price)-parseInt($("span[data-marketing]").text().replace(/[^0-9]/g,""));
				data.page_event = {
					discount_amount :  discount_amount,
					order_cancel : true
				}

				//--------------------------------------------------------------------------
				for(var i=0; i < $("#cancel-items-form [data-ctm-product-type]").length; i++){
					if($itemCheckbox.length>1){    //  취소 가능한 상품이 1개 이상일 경우
						//취소수량
						cancel_product_unit =	$itemCheckbox.eq(i).closest("[data-ctm-product-type]").find('[data-component-select]').length > 0 ?  $itemCheckbox.eq(i).closest("[data-ctm-product-type]").find('.currentOpt').text() : 1;
						if($itemCheckbox.eq(i).find('input[type=checkbox]').prop('checked')){
							var product = {
								product_category 		: "",
								product_name 			: $itemCheckbox.eq(i).closest("[data-ctm-product-name]").data('ctm-product-name'),
								product_id 				: $itemCheckbox.eq(i).closest("[data-orderitemid]").data('orderitemid'),
								product_quantity 		: $itemCheckbox.eq(i).closest("[data-item-quantity]").data('item-quantity'),   //주문 수량
								product_unit_price 		: $itemCheckbox.eq(i).closest("[data-ctm-unit-price]").data('ctm-unit-price'),
								cancel_product_unit 	: cancel_product_unit,    //취소수량
								cancel_product_amount	: parseInt($itemCheckbox.eq(i).closest("[data-ctm-unit-price]").data('ctm-unit-price')) * parseInt(cancel_product_unit),  //취소금액
								ctm_product_type 		: $itemCheckbox.eq(i).closest("[data-ctm-product-type]").data('ctm-product-type').toLowerCase(),
							}
							data.products.push(product)
						}
					} else {   // 취소 가능한 상품이 1개 단일 상품일 경우
						//취소수량
						cancel_product_unit =	$this.find("[data-ctm-product-type]").find('[data-component-select]').length > 0 ?  $this.find("[data-ctm-product-type]").find('.currentOpt').text() : 1;
						var product = {
							product_category 		: "",
							product_name 			: $this.find("[data-ctm-product-name]").data('ctm-product-name'),
							product_id 				: $this.find("[data-orderitemid]").data('orderitemid'),
							product_quantity 		: $this.find("[data-item-quantity]").data('item-quantity'),   //주문 수량
							product_unit_price 		: $this.find("[data-ctm-unit-price]").data('ctm-unit-price'),
							cancel_product_unit 	: cancel_product_unit,    //취소수량
							cancel_product_amount 	: parseInt($this.find("[data-ctm-unit-price]").data('ctm-unit-price')) * parseInt(cancel_product_unit),  //취소금액
							ctm_product_type 		: $this.find("[data-ctm-product-type]").data('ctm-product-type').toLowerCase(),
						}
						data.products.push(product)
					}
				}
				endPoint.call('adobe_script',  data )
			 },
			appCreditCardCancel:function(){
				/* assist admin에서 앱카드 당일 취소시 사용 */
				Method.cancelReasonValidateChk().then(function(){
					var appFromData = sandbox.utils.getQueryParams($this.find('#appcancel').serialize().replace(/\+/g, '%20'));
					var arrQueryParams = [
						"callbackScript=Core.getModule('module_ordercancel').callBackCancelFdk",
						"cardCashSe=CARD",
						"delngSe=0",
						"splpc=" + appFromData.totalAmount,
						"vat="+ (appFromData.totalAmount * 1) * 0.1,
						"taxxpt=0",
						"instlmtMonth=" + appFromData.month,
						"aditInfo=order_no%3D" + args['data-module-ordercancel'].orderId,
						"srcConfmNo=" + appFromData.confmNo,
						"srcConfmDe=" + appFromData.paydate
					];
					window.location.href = "seamless://pay=cancel&mode=req&"+arrQueryParams.join('&');
				}).fail(function(error){
					if(error) UIkit.modal.alert(error);
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-ordercancel]',
					attrName:['data-module-ordercancel', 'data-appcard-cancel'],
					moduleName:'module_ordercancel',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				$modalDeferred = null;
				console.log('destroy orderCancel module');
			},
			setDeferred:function(defer){
				$modalDeferred = defer;
			},
			callBackCancelFdk:function(resp){
				/* finpay 결제취소 콜백 */
				var decodeResp = decodeURIComponent(resp);
				var respObj = sandbox.utils.getQueryParams(decodeResp);
				var respArr = sandbox.utils.getQueryParams(decodeResp, 'array');
				if(respObj.setleSuccesAt == 'X'){
					//앱카드취소 실패
					if(respObj.setleMssage === '원거래없음'){
						UIkit.modal.alert('결제 시 사용한 카드가 아니거나 원거래 내역이 존재하지 않습니다.');
					}else{
						UIkit.modal.alert(respObj.setleMssage);
					}
				}else if(respObj.setleSuccesAt == 'O'){
					//앱카드취소 성공
					respArr.push('fdkCardCancel=Y');
					Method.submitCancelOrder(respArr);
				}
			}
		}
	});
})(Core);