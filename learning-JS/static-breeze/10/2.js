(function(Core){
	Core.register('module_repared_payment', function (sandbox) {
		var endPoint;
		var Method = {
			$that: null,
			$submitBtn: null,
			$usafeContent: null,
			$agreeForm: null,
			moduleInit: function () {
				var args = Array.prototype.slice.call(arguments).pop();
				$.extend(Method, args);

				endPoint = Core.getComponents('component_endpoint');

				var $this = $(this);
				Method.$that = $this;
				Method.$submitBtn = $this.find('[data-checkout-btn]');
				Method.$submitBtn.on("click", Method.checkout);
				$this.find('[data-payment-method]').find('.payment-method-item-title').on('click', Method.changePaymentMethod);
				$this.find('[data-cod-btn]').on("click", Method.codCheckout);

				$(document).on('click', '.payment-method-item-title', Method.changePaymentMethod_1);  //payment 종류 선택.

				//	 sandbox.validation.init( $this );
				//회원정보 셋팅
				var member_data = sandbox.getModule('module_header').getCustomerInfo();
				sfirstName = member_data.firstName;
				sphoneNumber = member_data.phoneNumber;
				semailAddress = member_data.emailAddress;
			},

			checkout: function (e) {
				e.preventDefault();
				$(this).attr("enabled")
				//var isCheckoutAgree = Method.$that.find('[name="isCheckoutAgree"]').is(':checked');
				var _self = $(this);

				// 결제 방법에 따른 처리
				var $activeItem = Method.$that.find("[data-payment-method]").find(".payment-method-item.active");

				//카카오 페이 chk...
				var payMethodParam = '';

				if (Method.$that.find("[data-payment-method]").find(".payment-method-item.active").data("type") == 'KAKAO_POINT') {
					payMethodParam = '?pay_method=point';
				}
				
				// PAYCO 2019-08-12
				if (Method.$that.find("[data-payment-method]").find(".payment-method-item.active").data("type") == 'PAYCO') {
					payMethodParam = '?pay_method=payco';
				}

				// NAVER_PAY 2020-09-08
				if (Method.$that.find("[data-payment-method]").find(".payment-method-item.active").data("type") == 'NAVER_PAY') {
					payMethodParam = '?pay_method=naver_pay';
				}

				var paymentType = $activeItem.data('paymenttype');   //pay_method
				var provider = $activeItem.data('provider');   //provider
				var repair_id = Method.$that.find("#result_payment_btn").attr('data-repairid');   //repairId
				var repairNumber = Method.$that.find("#result_payment_btn").attr('data-repaired-number');   //repairNumber

				sandbox.utils.promise({
					url: sandbox.utils.contextPath + '/account/repairCheckout?repairNumber=' + repairNumber + '&repair_id=' + repair_id + '&paymentType=' + paymentType + '&provider=' + provider,
					//url:sandbox.utils.contextPath + '/checkout/request'+payMethodParam,
					type: 'GET'
				}).then(function (data) {  //....
					sandbox.setLoadingBarState(true);
					if (data.result == true) {
						var paymentType = ($activeItem.length > 0) ? $activeItem.data("type") : null;
						reparired_amount = data.totalAmount.amount;  //결제금액
						// 결제 완료 상태 일때
						if (_self.data('checkout-btn') == 'complete') {
							_self.closest('form').submit();
							return;
						}
						//iamport 모듈..
						if ($activeItem.data('provider') == 'IAMPORT') {
							Method.checkoutIamport($activeItem, data.total_amount);
						}
					} else {
						sandbox.setLoadingBarState(false);


					}
				}).fail(function (msg) {
					sandbox.setLoadingBarState(false);
					UIkit.notify(msg, { timeout: 3000, pos: 'top-center', status: 'danger' });
					//	Method.updateSubmitBtn( true );
				});
			},

			// payment 정보 선택시
			changePaymentMethod_1: function (e) {
				e.preventDefault();
				var $item = $(this).closest('.payment-method-item');
				if (!$item.hasClass('active')) {
					$item.siblings().removeClass('active');
					$item.addClass('active');
				}
			},

			checkoutIamport: function ($activeItem, totalAmount) {
				// 결제 전일때
				var $orderinfo = $("#orderinfo-review");
				var $shippingInfo = $("#shipping-review");
				var $priceInfo = $("#order-summary");

				var IMP = window.IMP;


				var paymentMethod = $activeItem.data("method"); // 결제 수단
				var mRedirectUrl = $activeItem.data("m-redirect-url"); // 모바일 url
				var noticeUrl = $activeItem.data("notice-url"); // 노티피케이션 url
				var version = $activeItem.data("version") || 'old'; // 에스크로 분기 처리를 위한 값  new or old
				var escrow = $activeItem.data("escrow"); // 에스크로 사용 여부
				var identityCode = $activeItem.data("identity-code");       //IMP-CODE
				var appScheme = $activeItem.data("app-scheme"); // 모바일 앱 스키마 정보
				var pg = $activeItem.data("pg");

				var useReplaceReturnUrl = false;
				var cUrl = Core.Utils.url.getCurrentUrl();

				// 접근한 URL이 mshop 일 때
				if (cUrl.indexOf('www.nike') > -1) {
					useReplaceReturnUrl = true;
				} else {
					// 접근한 URL이 mshop 이 아닌데 deviceOs 가 ios 일때
					if (String(Core.Utils.url.getQueryStringParams(cUrl).deviceOs).toLowerCase() == 'ios') {
						useReplaceReturnUrl = true;
					}
				}

				if (useReplaceReturnUrl) {
					if (mRedirectUrl != null) {
						mRedirectUrl = mRedirectUrl.replace('m.nike', 'www.nike');
					}
				}

				if (Core.Utils.contextPath == '/kr/launch') {
					if (mRedirectUrl != null) {
						mRedirectUrl = mRedirectUrl.replace('/kr/ko_kr', '/kr/launch');
					}
				}

				if (paymentMethod == '' || identityCode == '' || pg == '') {
					UIkit.modal.alert('결제 수단 정보로 인한 문제가 발생하였습니다.<br/>고객센터(' + _GLOBAL.SITE.TEL + ')로 문의 주시면 신속히 처리 도와드리겠습니다.');
					return;
				}

				var $orderList = $priceInfo.find('[data-order]');
				var name = "나이키";
				if ($orderList.length > 1) {
					name += ' 외 ' + ($orderList.length - 1);
				}

				var buyerName = $.trim($orderinfo.find('[data-name]').data('name')) || $shippingInfo.find('[data-name]').data('name');
				//var reparired_amount   = Method.$that.find("#result_payment_btn").attr('data-reparired-amount');  //수선비
				var repairId = Method.$that.find("#result_payment_btn").attr('data-repairid');       //repairId
				var repaired_number = Method.$that.find("#result_payment_btn").attr('data-repaired-number');   //repair-number

				IMP.init(identityCode);

				param = {
					//pay_method : _GLOBAL.PAYMENT_TYPE_BY_IAMPORT[ paymentMethod ], // 추후 provider 에 따라 변수변경 *서버에서 내려오고 있음
					pg: pg,
					pay_method: paymentMethod, // 추후 provider 에 따라 변수변경
					merchant_uid: repairId + '_' + new Date().getTime(),
					name: "A/S비용 결제",
					amount: reparired_amount,     //결제금액
					buyer_email: semailAddress,
					//buyer_name:$orderinfo.find('[data-email]').data('email'),
					buyer_name: sfirstName,
					buyer_tel: sphoneNumber,
					buyer_addr: "서울특별시",
					buyer_postcode: "03470",
					m_redirect_url: mRedirectUrl,
					app_scheme: "undefined",
					notice_url: noticeUrl,
					repairId: repairId,
					bypass: { acceptmethod: "SKIN(#111)" }
				};

				var depositPeriod = $activeItem.find('[name="depositPeriod"]').val() || 2;

				if (paymentMethod == 'vbank') {
					param.vbank_due = moment().add(depositPeriod, 'day').format('YYYYMMDD2359');
					param.custom_data = $activeItem.find('form').serialize().replace(/=/gi, ':').replace(/&/gi, '|');
				}

				if (escrow == true) {
					param.escrow = true;
				}

				IMP.request_pay(param, function (rsp) {
					//결제 완료시
					if (rsp.success) {
						var msg = '결제가 완료되었습니다.<br>';
						msg += '고유ID : ' + rsp.imp_uid + '<br>';
						msg += '상점 거래ID : ' + rsp.merchant_uid + '<br>';
						msg += '결제 금액 : ' + rsp.paid_amount + '<br>';
						msg += 'custom_data : ' + rsp.custom_data + '<br>';

						if (rsp.pay_method === 'card') {
							msg += '카드 승인번호 : ' + rsp.apply_num + '<br>';
						} else if (rsp.pay_method === 'vbank') {
							msg += '가상계좌 번호 : ' + rsp.vbank_num + '<br>';
							msg += '가상계좌 은행 : ' + rsp.vbank_name + '<br>';
							msg += '가상계좌 예금주 : ' + rsp.vbank_holder + '<br>';
							msg += '가상계좌 입금기한 : ' + rsp.vbank_date + '<br>';
						}
						//alert( msg );
						sandbox.setLoadingBarState(true);

						if (rsp.pg_provider == 'kakaopay') {
							rsp.pay_method = 'point';
						}

						_.delay(function () {
							location.href = sandbox.utils.contextPath + '/repairCheckout/iamport-checkout/repair/hosted/return?merchant_uid=' + rsp.merchant_uid + '&imp_uid=' + rsp.imp_uid + '&pay_method=' + rsp.pay_method + '&custom_data=' + rsp.custom_data;
						}, 3000);

					} else {

						//실패 메시지에 따라 그냥 넘길것인지 어떤 액션을 취할것인지 확인
						//var msg = '결제에 실패하였습니다.' + '<br>';
						//msg += '에러내용 : ' + rsp.error_msg + '<br>';
						//UIkit.modal.alert(rsp.error_msg);

						sandbox.setLoadingBarState(false);

						if (rsp.error_msg == '결제를 취소하셨습니다') {
							endPoint.call('orderCancel');
						}

						UIkit.modal.alert(rsp.error_msg).on('hide.uk.modal', function () {
							sandbox.setLoadingBarState(true);
							//		var cartId = Method.$that.find("input[name='cartId']").val();
							location.href = sandbox.utils.contextPath + '/account/repaired';
						});
						//alert( msg );
					}
				});


			}
		}

		return {
			init: function () {
				sandbox.uiInit({
					selector: '[data-module-repared-payment]',
					attrName: 'data-module-repared-payment',
					moduleName: 'module_repared_payment',
					handler: { context: this, method: Method.moduleInit }
				});
			}
		}
	});
})(Core);