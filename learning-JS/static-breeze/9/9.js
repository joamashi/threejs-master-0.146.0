(function(Core){
	Core.register('module_repaired_list', function (sandbox) {

		var Method = {

			moduleInit: function () {
				var $this = $(this);
				var $_this = $("#popup-as-detail");

				//판정 결과버튼 없을시, 라인 삭제..
				$this.find('.order-list').each(function (i) {
					if ($(this).find("[data-click-area]").length == 0) {
						$(this).find(".item-btn").remove();
					}
				});

				//상세 조회
				$this.find("[data-repaired-number]").on('click', function (e) {

					UIkit.modal('#popup-as-detail').show();

					//var ix             = $("a[data-repaired-number]").index(this);
					var per_url = "repaired/detail";
					var obj = "repairNumber=" + $(this).attr('data-repaired-number');

					//모달창 초기화....
					$("a[aria-expanded]").eq(0).trigger('click');
					$("a[aria-expanded]").eq(2).trigger('click');
					$("li#jq_h_tab").addClass('uk-hidden');
					$("[data-repairaddr-chk-btn]").text('주소변경');

					Core.Utils.ajax(per_url, 'get', obj, function (data) {
						var jsonData = Core.Utils.strToJson(data.responseText, true) || {};

						if (jsonData.result == true) {

							str_price = String(jsonData.ro.repairOrderItem.price.amount);
							str_price = str_price.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');

							// item_option =  $this.find("span[data-item-option]").eq(ix).attr('data-item-option');  //상품옵션
							//	console.log(item_option);

							//카테고리
							var categoryUrl = jsonData.ro.repairOrderItem.productUrl;

							if ((categoryUrl.indexOf("/men/fw") != -1) || (categoryUrl.indexOf("/women/fw") != -1)) {
								categoryUrl = "신발";
								$_this.find("div#div_repairReasonAttr").eq(0).show();
								$_this.find("div#div_repairReasonAttr").eq(1).hide();

							} else if ((categoryUrl.indexOf("/men/ap") != -1) || (categoryUrl.indexOf("/women/ap") != -1)) {
								categoryUrl = "의류";
								$_this.find("div#div_repairReasonAttr").eq(0).hide();
								$_this.find("div#div_repairReasonAttr").eq(1).show();
							} else {
								categoryUrl = "기타";
								$("div#div_repairReasonAttr").hide();
							};

							//유형
							var repairReasonType = jsonData.ro.repairReasonType;
							//console.log(repairReasonType);

							if (repairReasonType == "A") {
								repairReasonType = "유무상 수선 의뢰";
							} else {
								repairReasonType = "봉제/원단/부자재/사이즈 불량";
							};

							//as수선범위 선택.. 체크박스..
							$("span[data-component-checkbox]").removeClass('checked');  //체크초기화
							var str_repairReasonAttr = jsonData.ro.repairOrderItem.repairReasonAttr;

							$_this.find("span[data-component-checkbox]").each(function () {
								var vl = $(this).attr('data-component-checkbox');
								if (str_repairReasonAttr.indexOf(vl) != -1) {
									$(this).addClass('checked');
								}
							});

							//첨부이미지...
							$_this.find("div.thumbnail-wrap").html('');

							for (var i = 1; i < 7; i++) {

								if (eval('jsonData.ro.repairOrderItem.repairImg' + i) != null) {
									$_this.find("div.thumbnail-wrap").append("<span class='preview-up-img'><img src='" + eval('jsonData.ro.repairOrderItem.repairImg' + i) + "' style='width:56px;height:56px;'>&nbsp; </span> ");
								};
							};

							//동의
							for (var i = 1; i < 4; i++) {
								if (eval('jsonData.ro.repairOrderItem.repairAgree' + i)) {
									$_this.find("span#repairAgree").eq(i - 1).addClass('check');
								};
							};


							var resulr_status = jsonData.ro.status.type;  //진행사항...


							//주소변경 버튼.....
							if (resulr_status != "REQUEST") {
								$("a#btn_addr_send").hide();
							} else {
								$("a#btn_addr_send").show();
							}

							$_this.find("#categoryUrl").text(categoryUrl);   //카테고리
							$_this.find("#repairReasonType").text(repairReasonType);   //as유형
							//$_this.find("#jq_repairReason").text(result_repairReason(jsonData.ro.repairReason));  //설명
							$_this.find("#jq_repairReason").text(result_repairReason(jsonData.ro.repairReason));

							$_this.find("#jq_receiveAddressFullName").text(jsonData.ro.receiveAddress.fullName);   //우편번호
							$_this.find(".jq_receiveAddressPostalCode").text(jsonData.ro.receiveAddress.postalCode);   //주소1
							$_this.find("#jq_receiveAddr").text(jsonData.ro.receiveAddress.addressLine1 + '  ' + jsonData.ro.receiveAddress.addressLine2);   //주소2
							$_this.find("#jq_receiveAddressPhone").text(jsonData.ro.receiveAddress.phonePrimary.phoneNumber);   //핸드폰
							$_this.find("input#repairNumber").eq(0).val(jsonData.ro.repairNumber);   //repairNumber

							//	 if(jsonData.ro.r_personalMessage==null || jsonData.ro.r_personalMessage==''){  //수거메모
							//		 $("#jq_recevie").hide();
							//	} else{
							//
							//	}
							$_this.find("#jq_recevie_memotext").text(result_repairReason(jsonData.ro.r_personalMessage));   //수거메모
							$_this.find("#jq_deliveryAddressFullName").text(jsonData.ro.deliveryAddress.fullName);   //우편번호
							$_this.find(".jq_deliveryAddressPostalCode").text(jsonData.ro.deliveryAddress.postalCode);   //주소1
							$_this.find("#jq_deliveryAddr").text(jsonData.ro.deliveryAddress.addressLine1 + '  ' + jsonData.ro.deliveryAddress.addressLine2);   //주소2
							$_this.find("#jq_deliveryAddressPhone").text(jsonData.ro.deliveryAddress.phonePrimary.phoneNumber);   //핸드폰
							$_this.find("input#repairNumber").eq(1).val(jsonData.ro.repairNumber);   //repairNumber
							$_this.find("#jq_delivery_memo").text(result_repairReason(jsonData.ro.d_personalMessage));  //받는 메모

							//	 if(jsonData.ro.d_personalMessage==null || jsonData.ro.d_personalMessage==''){   //배송메모
							//		 $("#jq_delivery").hide();
							//	} else{
							//		 $_this.find("#jq_delivery_memo").text(jsonData.ro.d_personalMessage);
							//	}
						} else {
							UIkit.modal.alert(jsonData.result);
						}
					});
				});


				//취소..data-cancel-btn
				$this.find("[data-cancel-btn]").on('click', function (e) {

					var per_url = $(this).attr('data-cancel-btn');

					UIkit.modal.confirm('A/S 신청을 취소하시겠습니까? 취소하게 되면 등록내용이 삭제됩니다', function () {
						window.document.location.href = per_url;
						return;
					});
				});



				// 글자수 마킹...
				var result_text = function (ss, str) {

					if (str != null && str != '') {
						len = str.length;

						str1 = str.substring(0, ss);
						str2 = "";
						for (var i = ss; i < len; i++) {
							str2 = str2 + '*';
						};
						return str1 + str2;
					};
				};

				//상세설명   .repairReason.replace(/&#40;/gi,'(').replace(/&#41;/gi,')')
				var result_repairReason = function (html) {
					if (html != null) {
						var txt = document.createElement('textarea');
						txt.innerHTML = html.replace(/&#40;/gi, '(').replace(/&#41;/gi, ')').replace(/&#39;/gi, "''");
						return txt.value;
					}
				};


				// 금액 콤마...
				var result_price = function (str) {
					if (str != null) {
						return (str != '0') ? str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : str;
					}
				};


				//판정결과 pop...
				$this.find("[data-repaired-opinion]").on('click', function (e) {

					//api 개발로 인해, 특정시간 alert 안내창 노출
					var sdate = new Date("2019/06/19 02:00:00");
					var edate = new Date("2019/06/19 03:00:00");

					str_msg = "서비스 이용에 불편을 드려 죄송합니다.</br>안정화된 서비스를 제공하기 위해 시스템 점검 중입니다.</br>" +
						"점검 시간 동안 일시적으로 A/S 판정 결과 확인은 불가하며,</br>6월 19일 03시 이후부터 정상적으로 서비스 이용하실 수 있습니다."
					//	"※점검 일시 : 2019.05.20 22:00 ~ 2019.05.21 10:00 (12시간)"

					if (Date.now() >= sdate && Date.now() <= edate) {
						UIkit.modal.alert(str_msg).on('hide.uk.modal', function () {
						});
						return;
					}

					UIkit.modal('#repaired-opinion_detail').show();  //판정결과 모달 open...

					var $this = $("#repaired-opinion_detail");
					var per_url = "repaired/confirm";
					var obj = "repairNumber=" + $(this).attr('data-repaired-opinion');

					sandbox.validation.init($this);
					var member_data = sandbox.getModule('module_header').getCustomerInfo();
					//-----------------------------
					// var status          = $(this).attr('data-repaired-status');  //진행사항....
					//-----------------------------

					Core.Utils.ajax(per_url, 'get', obj, function (data) {
						var jsonData = Core.Utils.strToJson(data.responseText, true) || {};

						if (jsonData.result == true) {

							var pp = jsonData.paymentInfoGroups.length;  //결제 방법cnt..
							var payment_list = "";
							var payment_lists = "";
							var sactive = " active";

							for (var ii = 0; ii < pp; ii++) {

								str0 = jsonData.paymentInfoGroups[ii];
								str1 = jsonData.paymentInfoGroups[ii].additionalInfo;

								payment_list = "<div class='payment-method-item " + sactive + "' data-m-redirect-url='" + str1.m_repair_redirect_url + "' data-paymentType='" + str0.paymentType + "' data-method='" + str1.pay_method + "' data-identity-code='" + str1.imp_identity_code + "' data-provider='" + str0.paymentProvider + "' data-notice-url='" + str1.repair_notice_url + "' data-type='" + str0.paymentType + "' data-pg='" + str1.pg + "'>" +
									"<h6 class='payment-method-item-title'>" + str0.displayText + "</h6>" +
									"</div>";
								payment_lists = payment_lists + '' + payment_list;
								sactive = "";
							};

							$this.find("[data-payment-method]").html(payment_lists);

							//환불입력창...str_refundAmount

							$this.find("#result_repairNumber").text(jsonData.dto.repairNumber);
							$("input#str_repairNumber").val(jsonData.dto.repairNumber);              //환불 pop...hidden..

							$this.find("#result_submitDate").text(jsonData.dto.submitDate.substring(0, 10));   //신청일
							$this.find("#result_itemName").text(jsonData.dto.itemName);  //상퓸명
							$this.find("#result_p_model").text(jsonData.dto.model);   //모델명

							if (jsonData.dto.asFlag == "0") {
								$this.find("#result_asPriceFlag").text("수선");
							} else if (jsonData.dto.asFlag == "1") {
								$this.find("#result_asPriceFlag").text("회송");
							} else if (jsonData.dto.asFlag == "2") {
								$this.find("#result_asPriceFlag").text("반품");
							} else if (jsonData.dto.asFlag == "3") {
								$this.find("#result_asPriceFlag").text("보류");
							}

							$this.find("#result_reDecisionDate").text(jsonData.dto.reDecisionDate.substring(0, 10));  //판정날자  result_repairAgree1
							$this.find("td#result_confirmResult").html(result_repairReason(jsonData.dto.confirmResult)); //판정내용
							$this.find("td#result_confirmKind").html(result_repairReason(jsonData.dto.confirmKind)); //판정결과  ,

							//환불입력창...
							$("#refund-step1").find("[text_refundAmount]").text(result_price(jsonData.dto.refundAmount) + '원');
							$("#refund-step1").find("#str_refundAmount").val(jsonData.dto.refundAmount);  //hidden

							var repaired_status = jsonData.dto.status;     //as 신행 현황....

							//회송일 경우에만 판정내용, 결과 보여준다.  if(jsonData.dto.asFlag == "0"){
							if (jsonData.dto.asFlag == "1") {
								$this.find("#process_confirmResult").show();
								$this.find("#process_confirmKind").show();
							} else {
								$this.find("#process_confirmResult").hide();
								$this.find("#process_confirmKind").hide();
							}

							//결제 문구  , 버튼.....
							if (repaired_status == "PENDING") {
								$this.find("#btn_submit").hide();    //확인 Btn
								$this.find("#btn_cancel").show();    //취소 btn

							} else if (repaired_status == "PAYMENT_PROCESS") {

							} else {
								str_price_process = "";
								$this.find("#btn_submit").show();
								$this.find("#btn_cancel").hide();
							};

							//수선비..
							if (jsonData.dto.asAdjPrice != null && jsonData.dto.asAdjPrice > 0) {
								str_price_process = " (결제대기)";
							} else {
								str_price_process = "";
							}

							//배송비..
							if (jsonData.dto.deliveryAdjFee != null && jsonData.dto.deliveryAdjFee > 0) {
								str_price_process1 = " (결제대기)";
							} else {
								str_price_process1 = "";
							}

							// status...
							if (repaired_status == "PAYMENT_PROCESS" || repaired_status == "PAYMENT_COMPLETE" || repaired_status == "FULFILL_OUT" || repaired_status == "DELIVERED" || repaired_status == "COMPLETE") {
								if (jsonData.dto.asAdjPrice != null && jsonData.dto.asAdjPrice > 0) {
									str_price_process = " (결제완료)";
								} else {
									str_price_process = "";
								}

								//배송비..
								if (jsonData.dto.deliveryAdjFee != null && jsonData.dto.deliveryAdjFee > 0) {
									str_price_process1 = " (결제완료)";
								} else {
									str_price_process1 = "";
								}
							}

							//수선,배송비 status 출력...
							if (str_price_process != '') {
								$this.find("span#str_price_process").eq(0).text(str_price_process);
							} else {
								$this.find("span#str_price_process").eq(0).text('');
							}

							if (str_price_process1 != '') {
								$this.find("span#str_price_process").eq(1).text(str_price_process1);
							} else {
								$this.find("span#str_price_process").eq(1).text('');
							}

							$this.find("#result_asAdjPrice").text(result_price(jsonData.dto.asAdjPrice) + '원'); //수선비
							//$this.find("#result_repaired_status").text(str_repaired_status);  //진행사항.

							if (jsonData.dto.deliveryFeeFlag == "Y") {        //배송비
								result_deliveryFeeFlag = "고객 부담";
								deliveryAdjFee = result_price(jsonData.dto.deliveryAdjFee) + '원';
							} else {
								result_deliveryFeeFlag = "나이키 부담";
								deliveryAdjFee = result_price(jsonData.dto.deliveryAdjFee) + '원';
								//$this.find("#result_delivery_price").hide();
							};

							if (jsonData.dto.deliveryAdjFee != null && jsonData.dto.deliveryAdjFee > 0) {
								$this.find("#result_deliveryFeeFlag").text(result_deliveryFeeFlag);
							} else {
								$this.find("#result_deliveryFeeFlag").text('');
							}

							$this.find("#result_delivery_price").text(deliveryAdjFee);
							$this.find("#result_payment_btn").attr('data-repaired-number', jsonData.dto.repairNumber); //결제버튼
							$this.find("#result_payment_btn").attr('data-repairid', jsonData.dto.repairId); //repairId
							// $this.find("#result_payment_btn").attr('data-reparired-amount',jsonData.dto.asAdjPrice);   //결제금액

							//환불계좌 입력 버튼
							if ((repaired_status == "REFUND_READY") || (repaired_status == "REFUND_PROCESS" && jsonData.dto.accountNum == null)) {
								$this.find("#payment-return_btn").removeClass('uk-hidden');
								$this.find("#refund_text").show();    //환불 안내 메세지.
								$this.find("#btn_submit").hide();     //확인버튼 감추기
							} else {
								$this.find("#payment-return_btn").addClass('uk-hidden');
								$this.find("#refund_text").hide();
							};

							//결제 버튼, 결제 방법........
							if (repaired_status == "PENDING") {
								$this.find("[data-order-tab]").removeClass('uk-hidden');   //결제방법..
								$this.find("#result_payment_btn").removeClass('uk-hidden');
							} else {
								$this.find("[data-order-tab]").addClass('uk-hidden');
								$this.find("#result_payment_btn").addClass('uk-hidden');
							};

							//환불정보창  DIV_REFUND_PROCESS
							if ((repaired_status == "REFUND_PROCESS" && jsonData.dto.accountNum != null) || (repaired_status == "REFUND_COMPLETE")) {
								(jsonData.dto.accountName != null) ? $this.find("#result_accountName").text(result_repairReason(jsonData.dto.accountName)) : ''; //환불정보 ,은행
								$this.find("#result_ownerName").text(result_text(1, jsonData.dto.ownerName)); //이름
								$this.find("#result_accountNum").text(result_text(5, jsonData.dto.accountNum)); //계좌
								$this.find("#result_refundAmount").text(result_price(jsonData.dto.refundAmount) + '원'); //금액
								$this.find("#DIV_REFUND_PROCESS").show();
							} else {
								$this.find("#DIV_REFUND_PROCESS").hide();
							}

						} else {
							UIkit.modal.alert(jsonData.result);
						};
					});

				});

				//as취소
				$this.find("a[data-repaired-cancel]").on('click', function () {

					var per_url = "repaired/cancel";
					var obj = "repairNumber=" + $(this).attr('data-repaired-cancel');

					Core.Utils.ajax(per_url, 'get', obj, function (data) {
						var jsonData = Core.Utils.strToJson(data.responseText, true) || {};

						if (jsonData.result == true) {
							UIkit.modal.alert(jsonData.result);
							location.href = 'repaired';
						} else {
							UIkit.modal.alert(jsonData.result);
						}
					});
				});

			}
		}
		return {
			init: function () {
				sandbox.uiInit({
					selector: '[data-module-repaired-list]',
					attrName: 'data-module-repaired-list',
					moduleName: 'module_repaired_list',
					handler: { context: this, method: Method.moduleInit }
				});
			}
		}
	});
})(Core);