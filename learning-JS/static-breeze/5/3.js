(function(Core){
	Core.register('module_order_payment', function(sandbox){
		var endPoint, isOrder = false, inflowUrl= null, inflowParam = null;
		var Method = {
			$that:null,
			$submitBtn:null,
			$usafeContent:null,
			$agreeForm:null,
			moduleInit:function(){
				var $this = $(this);
				var args = Array.prototype.slice.call(arguments).pop();
				//as 진행 현황 에서 스크립트 오류 발생.
				if(args.orderEntryTime != undefined){
				        var orderEntryReplaceTime = args.orderEntryTime.replace(/-/g, '/').replace(/\.+[0-9]*/, '');
				}
				var orderEntryTime = (args.orderEntryTime !== 'null') ? new Date(orderEntryReplaceTime).getTime() : new Date(args.currentTime).getTime();
				var limitTime = (args.limitTime !== 'null') ? (orderEntryTime + (args.limitTime*1000)) : orderEntryTime;
				var currentTime = new Date(args.currentTime).getTime();

				$.extend(Method, args);
				endPoint = Core.getComponents('component_endpoint');

				inflowUrl = sessionStorage.getItem('AFFILIATE_INFLOW_URL');
				inflowParam = sessionStorage.getItem('AFFILIATE_INFLOW_PARAM');

				Method.$that = $this;
				Method.$submitBtn = $this.find('[data-checkout-btn]');
				Method.$submitBtn.on("click", function(e){
					e.preventDefault();
					if(isOrder){
						Method.checkout.call(this, e);
					}
				});

				if(limitTime > currentTime){
					console.log(limitTime - currentTime);
					isOrder = false;
					setTimeout(function(){
						isOrder = true;
						Method.$submitBtn.removeClass('disabled');
					}, (limitTime - currentTime <= 0) ? 0 : limitTime - currentTime);
				}else{
					isOrder = true;
					Method.$submitBtn.removeClass('disabled');
				}

				$this.find('[data-payment-method]').find('.payment-method-item-title').on('click', Method.changePaymentMethod);
				$this.find('[data-cod-btn]').on("click", Method.codCheckout );

				/*
					Method.$agreeForm = $this.find('form[name="checkout-agree-form"]');
					sandbox.validation.init( Method.$agreeForm );
				*/

				Method.$usafeContent = $this.find('[data-usafe-content]');

				sandbox.getComponents('component_radio', {context:$this}, function(i){
					this.addEvent('change', function(target, val){
						if( $(this).attr('name') == 'usafeIsAgree'){
							Method.toggleUsafeContent( val == "true" );
						}
					});
				});
			},

			toggleUsafeContent:function($bool){
				if( $bool ){
					Method.$usafeContent.show();
				}else{
					Method.$usafeContent.hide();
				}
			},

			// payment 정보 선택시
			changePaymentMethod:function(e){
				e.preventDefault();
				var $item = $(this).closest('.payment-method-item');
				if(!$item.hasClass('pausable')){
					if(!$item.hasClass('active')){
						$item.siblings().removeClass('active');
						$item.addClass('active');
					}
				}
			},

			updateSubmitBtn:function( $bool ){
				if( $bool ){
					Method.$submitBtn.removeAttr('disabled').removeClass('disabled');
				}else{
					Method.$submitBtn.attr('disabled','true').addClass('disabled');
				}
			},

			checkout:function(e){
				e.preventDefault();
				$(this).attr("enabled")
				var isCheckoutAgree = Method.$that.find('[name="isCheckoutAgree"]').is(':checked');
				var _self = $(this);

				// 결제 방법에 따른 처리
				var $activeItem = Method.$that.find("[data-payment-method]").find(".payment-method-item.active");
				// 무통장일때
				if( $activeItem.data("type") == 'WIRE' ){
					var $form = $activeItem.find('form[name="checkout-useInsureGarantee-form"]');

					// 보증보험 사용할 때
					if( $form.length > 0 ){
						var usafeIsAgree = $activeItem.find('[name="usafeIsAgree"]:checked').val();

						if( usafeIsAgree == 'true'){
							sandbox.validation.init( $form );
							sandbox.validation.reset( $form );

							// 모두 선택 체크하고
							if( sandbox.validation.isValid( $form )){
								// 동의 여부 체크
								if( $activeItem.find('[name="usafeInfoAgree"]:checked').val() == 'false'){
									UIkit.modal.alert("개인정보 이용동의에 동의해주세요");
									return;
								}
							}else{
								return;
							}
						}
					}
				}

				if (_self.data('checkout-btn') == 'payment' && $activeItem.length != 1 ){
					UIkit.modal.alert('결제 수단을 선택해주세요.');
					return;
				}

				if( !isCheckoutAgree ){
					UIkit.modal.alert("상품, 가격, 할인, 배송정보에 동의해주세요");
					return;
				}

				// 네이버페이 최소 결제금액은 100원 이상 가능. 2020-10-14
				var pg = $activeItem.data("pg");
				var $priceInfo = $("#order-summary");

				if( pg == 'naverpay'){
					var checkoutAmount = $priceInfo.find('[data-amount]').data('amount');
					if (parseInt(checkoutAmount) < 100) {
						UIkit.modal.alert('네이버페이 최소 결제금액은 100원 입니다.');
						return;
					}
				}

				/*
					checkoutIamport를 실행하기 전에 checkout-request 에 먼저 결제가 가능한지 체크하고
					상태가 true 일떄 checkoutIamport를 호출한다.
					as-is : checkoutIamport
					to-be : checkoutRequest -> true -> checkoutIamport
				*/

		    	Method.updateSubmitBtn( false );

				if(sandbox.getModule('module_certification') !== null){
					if(!sandbox.getModule('module_certification').getIsAuthenticate()){
						UIkit.modal.confirm('상품 구매 시 본인 인증 완료된 1개의 아이디만 사용 가능합니다.', function(){
							location.href = sandbox.utils.contextPath + '/cart';
						});
						return;
					}
				}

				if(Method.isRecaptcha === 'true'){
					grecaptcha.ready(function(){
						grecaptcha.execute(Method.reCaptchaKey, {action: 'checkout_request'}).then(function(token) {
							// Verify the token on the server.
							Method.checkoutRequest(_self, token,  $activeItem);
						});
					});
				}else{
					Method.checkoutRequest(_self, null,  $activeItem);
				}
			},
			checkoutRequest:function(_self, token, $activeItem){
				var payMethodParam = '';
				var sessionToken = token;
				var paramData = {
					gToken: sessionToken
				}

				if(Method.$that.find("[data-payment-method]").find(".payment-method-item.active").data("type") == 'KAKAO_POINT'){
					payMethodParam = '?pay_method=point';
				}

				if(Method.$that.find("[data-payment-method]").find(".payment-method-item.active").data("type") == 'PAYCO'){ // 2019-08-12
					payMethodParam = '?pay_method=payco';
				}

				if(Method.$that.find("[data-payment-method]").find(".payment-method-item.active").data("type") == 'NAVER_PAY'){ // 2020-09-08
					payMethodParam = '?pay_method=naver_pay';
				}

				if ( !_.isEmpty(inflowUrl) && !_.isEmpty( inflowParam ) ){
					paramData.NIKE_AFFILIATE_INFLOW_URL = inflowUrl
					paramData.NIKE_AFFILIATE_INFLOW_PARAM = inflowParam
				}

				sandbox.utils.promise({
					url: sandbox.utils.contextPath + '/checkout/request' + payMethodParam,
					data: paramData,
					type: 'GET'
				}).then(function(data){
					sandbox.setLoadingBarState(true);
					if (data.isError == false) {
						var paymentType = ($activeItem.length > 0) ? $activeItem.data("type") : null;

						//보피스 태깅  추가
						var physicaltype = Method.$that.find('[data-physical-type]').data('physical-type');
						endPoint.call("orderSubmit", { 'paymentType': paymentType, 'physicaltype': physicaltype });

						// 결제 완료 상태 일때
						if (_self.data('checkout-btn') == 'complete') {
							_self.closest('form').submit();
							return;
						}

						//iamport 모듈
						if ($activeItem.data('provider') == 'IAMPORT') {
							Method.checkoutIamport($activeItem, data.total_amount);
						}
					} else {
						sandbox.setLoadingBarState(false);

						if (data._global == '선택한 상품의 재고가 없습니다') {
							//custom _customproduct.js 기능 이동 : 분기처리
							var customYN = Core.Utils.customProduct.isCheckoutPaymentCustomProduct();
							if (customYN == 'Y') {//custom 있는 경우
								UIkit.modal.alert(data._global);
							} else {//custom 없는 경우 (기존)
								UIkit.modal.confirm(data._global + '<br/>해당상품의 수량변경 또는 삭제하여야 주문이 가능합니다.<br/>장바구니로 이동하시겠습니까?', function () {
									location.href = sandbox.utils.contextPath + '/cart';
								});
							}
						} else if (data._global == 'error.checkout.snkrs.catalog.product.validate'){
							UIkit.modal.alert('SNKRS 전용 상품입니다. 해당 주문서로 이동합니다.').on('hide.uk.modal', function () {
								Core.Loading.show();
								if (Core.Utils.url.getCurrentUrl().indexOf('www.nike') > -1) {
									location.replace('https://www.nike.com/kr/launch/checkout');
								} else if (Core.Utils.url.getCurrentUrl().indexOf('stg-www') > -1) {
									location.replace('https://stg-www-nike.brzc.kr/kr/launch/checkout');
								} else {
									alert('개발시는 이동 되지 않습니다.');
								}
							})
						} else {
							Method.updateSubmitBtn(true);
							UIkit.modal.alert(data._global);
						}
					}
				}).fail(function (msg) {
					sandbox.setLoadingBarState(false);
					UIkit.notify(msg, { timeout: 3000, pos: 'top-center', status: 'danger' });
					Method.updateSubmitBtn(true);
				});
			},
			codCheckout:function(e){
				e.preventDefault();
				var _self = $(this);

				if(sandbox.getModule('module_certification') !== null){
					if(!sandbox.getModule('module_certification').getIsAuthenticate()){
						UIkit.modal.confirm('상품 구매 시 본인 인증 완료된 1개의 아이디만 사용 가능합니다.', function(){
							location.href = sandbox.utils.contextPath + '/cart';
						});
						return;
					}
				}

				if(Method.isRecaptcha === 'true'){
					grecaptcha.ready(function(){
						grecaptcha.execute(Method.reCaptchaKey, {action: 'checkout_request'}).then(function(token) {
							// Verify the token on the server.
							Method.codCheckoutRequest(_self, token);
						});
					});
				}else{
					Method.codCheckoutRequest(_self, null);
				}
			},
			codCheckoutRequest:function(_self, token){
				var sessionToken = token;
				var paramData = {
					gToken: sessionToken
				}
				if (!_.isEmpty(inflowUrl) && !_.isEmpty(inflowParam)) {
					paramData.NIKE_AFFILIATE_INFLOW_URL = inflowUrl
					paramData.NIKE_AFFILIATE_INFLOW_PARAM = inflowParam
				}

				sandbox.utils.promise({
					url: sandbox.utils.contextPath + '/checkout/request',
					data: paramData,
					type: 'GET'
				}).then(function(data){
				    if(data.isError == false){
						sandbox.setLoadingBarState(true);

            			//ctm  orderSubmit  태깅 추가.
						//var paymentType  = null;
						//var physicaltype = Method.$that.find('[data-physical-type]').data('physical-type');   //PHYSICAL_ROPIS
						//로피스 결제 완료 태깅 추가.
						endPoint.call("ropis_submit_final");

						_self.closest('form').submit();
						return;
				    }else{
						sandbox.setLoadingBarState(false);
						UIkit.modal.alert(data._global);
				    }
				}).fail(function(msg){
					sandbox.setLoadingBarState(false);
					UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'danger'});
				});
			},
			checkoutIamport:function( $activeItem, totalAmount ){
				// 결제 전일때
				var $orderinfo = $("#orderinfo-review");
				var $shippingInfo = $("#shipping-review");
				var $priceInfo = $("#order-summary");

				var IMP = window.IMP;
				//var in_app = $(frm.in_app).is(':checked');

				//IMP.init('imp29019801');
				//결제 처리 전에 이미 전달해놓은 상품가격 값과 비교해야함
				//$paymentInfo.find("input[name='cartId']").val()

				var paymentMethod = $activeItem.data("method"); // 결제 수단
				var mRedirectUrl = $activeItem.data("m-redirect-url"); // 모바일 url
				var noticeUrl = $activeItem.data("notice-url"); // 노티피케이션 url
				var version = $activeItem.data("version") || 'old'; // 에스크로 분기 처리를 위한 값  new or old
				var escrow = $activeItem.data("escrow"); // 에스크로 사용 여부

				var useReplaceReturnUrl = false;
				var cUrl = Core.Utils.url.getCurrentUrl();

				// 접근한 URL이 mshop 일 때
				if( cUrl.indexOf( 'www.nike' ) > -1 ){
					useReplaceReturnUrl = true;
				}else{
					// 접근한 URL이 mshop 이 아닌데 deviceOs 가 ios 일때
					if( String(Core.Utils.url.getQueryStringParams(cUrl).deviceOs ).toLowerCase() == 'ios' ){
						useReplaceReturnUrl = true;
					}
				}

				if( useReplaceReturnUrl ){
					if( mRedirectUrl != null ){
						mRedirectUrl = mRedirectUrl.replace('m.nike', 'www.nike');
					}
				}

				if (Core.Utils.contextPath == '/kr/launch') {
					if (mRedirectUrl != null) {
						mRedirectUrl = mRedirectUrl.replace('/kr/ko_kr', '/kr/launch');
					}
				}
				
				var appScheme = $activeItem.data("app-scheme"); // 모바일 앱 스키마 정보
				var identityCode = $activeItem.data("identity-code"); // iamport key
				var pg = $activeItem.data("pg");

				if( paymentMethod == '' || identityCode == '' || pg == ''){
					UIkit.modal.alert('결제 수단 정보로 인한 문제가 발생하였습니다.<br/>고객센터('+_GLOBAL.SITE.TEL+ ')로 문의 주시면 신속히 처리 도와드리겠습니다.');
					return;
				}

				IMP.init(identityCode);

				var $orderList = $priceInfo.find('[data-order]');
				var name = $orderList.eq(0).find('[data-name]').eq(0).text();
				
				// naverpay 는 상품명에 "xxxx 외 2개" 와 같은 표현은 사용하지 않습니다. 2020-09-09
				if (pg != 'naverpay') {
					if($priceInfo.find('.order-list').length > 1 ){
						name += ' 외 ' + ($priceInfo.find('.order-list').length-1) +'건';
					}
				}

				// naverpay 파라미터 naverProducts 2020-09-09
				var naverProductsList = [];
				$priceInfo.find('.order-list').each(function(index, data){
					naverProductsList.push({
						categoryType: "PRODUCT",
						categoryId: "GENERAL",
						uid: $(data).find('[data-model]').data('model'),
						name : $(data).find('.order-info').find('[data-name]').data('name'),
						count : parseInt($(data).find('[data-quantity]').data('quantity'))
					});
				})

				// 상품명 중에 " 있을수 있으므로 ' 로 변환,
				name  = name.replace(/"/gi, "'");

				var buyerName = $.trim($orderinfo.find('[data-name]').data('name')) || $shippingInfo.find('[data-name]').data('name');

		    	var param = {
					//pay_method : _GLOBAL.PAYMENT_TYPE_BY_IAMPORT[ paymentMethod ], // 추후 provider 에 따라 변수변경 *서버에서 내려오고 있음
					pg : pg,
					pay_method : paymentMethod, // 추후 provider 에 따라 변수변경
					merchant_uid : Method.$that.find("input[name='cartId']").val() + '_' + new Date().getTime(),
					name: name,
					amount:totalAmount.amount || $priceInfo.find('[data-amount]').data('amount'),
					buyer_email:$orderinfo.find('[data-email]').data('email'),
					//buyer_name:$orderinfo.find('[data-email]').data('email'),
					buyer_name:buyerName,
					buyer_tel:$shippingInfo.find('[data-phone]').data('phone'),
					buyer_addr:$shippingInfo.find('[data-address]').data('address'),
					buyer_postcode:$shippingInfo.find('[data-zipcode]').data('zipcode'),
					m_redirect_url:mRedirectUrl,
					app_scheme:appScheme,
					notice_url:noticeUrl,
					bypass:{acceptmethod:"SKIN(#111)"}
				};

				// naverpay 추가 파라미터 2020-09-09
				if (pg == 'naverpay') {
					// Mobile결제 : Redirection 방식, PC결제 : 팝업방식
					if (Core.Utils.mobileChk) {
						param.naverPopupMode = false;
					} else {
						param.naverPopupMode = true;
					}
					param.naverProducts = naverProductsList;
				}

				var depositPeriod = $activeItem.find('[name="depositPeriod"]').val() || 2;

				if( paymentMethod == 'vbank' ) {
					param.vbank_due = moment().add(depositPeriod, 'day').format('YYYYMMDD2359');
					param.custom_data = $activeItem.find('form').serialize().replace(/=/gi, ':').replace(/&/gi, '|');
				}

				if( escrow == true ){
					param.escrow = true;
				}
				/*
				if( paymentMethod == 'escrow') {
					if( version == 'new'){
						// 신 버전
					    param.pay_method='vbank';
						param.escrow = true;
					}else{
						// 기존 버전
						param.vbank_due = moment().add(depositPeriod, 'day').format('YYYYMMDD2359');
						param.custom_data = 'paymethod:escrow';
						param.escrow = false;
					}
				}
				*/

				// 주문서 결제 모듈이 뜬 상태에서 뒤로 가기 했을시 처리를 위한 쿠키값
				Core.cookie.setCookie("oldCartId", Method.$that.find("input[name='cartId']").val());

				IMP.request_pay(param, function(rsp) {
					//결제 완료시
					if ( rsp.success ) {
						var msg = '결제가 완료되었습니다.<br>';
						msg += '고유ID : ' + rsp.imp_uid + '<br>';
						msg += '상점 거래ID : ' + rsp.merchant_uid + '<br>';
						msg += '결제 금액 : ' + rsp.paid_amount + '<br>';
						msg += 'custom_data : ' + rsp.custom_data + '<br>';

						if ( rsp.pay_method === 'card' ) {
							msg += '카드 승인번호 : ' + rsp.apply_num + '<br>';
						} else if ( rsp.pay_method === 'vbank' ) {
							msg += '가상계좌 번호 : ' + rsp.vbank_num + '<br>';
							msg += '가상계좌 은행 : ' + rsp.vbank_name + '<br>';
							msg += '가상계좌 예금주 : ' + rsp.vbank_holder + '<br>';
							msg += '가상계좌 입금기한 : ' + rsp.vbank_date + '<br>';
						}
						//alert( msg );
						sandbox.setLoadingBarState(true);

						if(rsp.pg_provider == 'kakaopay'){
				         rsp.pay_method = 'point';
				     }

						_.delay(function(){
							location.href = sandbox.utils.contextPath + '/checkout/iamport-checkout/hosted/return?imp_uid=' + rsp.imp_uid + '&pay_method=' + rsp.pay_method + '&custom_data=' + rsp.custom_data;
						}, 3000);

					} else {

						//실패 메시지에 따라 그냥 넘길것인지 어떤 액션을 취할것인지 확인
						//var msg = '결제에 실패하였습니다.' + '<br>';
						//msg += '에러내용 : ' + rsp.error_msg + '<br>';
//						UIkit.modal.alert(rsp.error_msg);

						sandbox.setLoadingBarState(false);

						if( (rsp.error_msg == '사용자가 결제를 취소하셨습니다') || (rsp.error_msg == '[결제포기] 사용자가 결제를 취소하셨습니다')){
							endPoint.call('orderCancel');
						}

						Core.cookie.setCookie("oldCartId", 'none');

						UIkit.modal.alert( rsp.error_msg ).on('hide.uk.modal', function() {
							//custom _customproduct.js 기능 이동 : 분기처리
							var customYN = Core.Utils.customProduct.isCheckoutPaymentCustomProduct();
							if(customYN != 'Y'){//custom 없는 경우
								sandbox.setLoadingBarState(true);
								var cartId = Method.$that.find("input[name='cartId']").val();
								location.href = sandbox.utils.contextPath + '/checkout/request/'+ cartId;
							}
						});
						//alert( msg );
					}
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-order-payment]',
					attrName:'data-module-order-payment',
					moduleName:'module_order_payment',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);