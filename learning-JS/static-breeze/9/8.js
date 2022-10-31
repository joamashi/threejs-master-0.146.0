(function(Core){
	Core.register('module_repairable_result', function (sandbox) {
		var Method = {

			$newAddress: null,
			isNewAddress: false,
			isSelectAddress1: false,
			isSelectAddress2: false,

			moduleInit: function () {
				var $this = $(this);
				var $form = $this.find('#sfrm');
				sandbox.validation.init($form);

				// 배송지 정보 submit
				$this.find('[data-repairRequest-chk-btn]').on('click', function (e) {

					e.preventDefault();
					sandbox.validation.validate($form);

					if (sandbox.validation.isValid($form)) {

						// as유형 글자수
						// if($this.find("#repairReason").val().length < 10){
						//	 UIkit.modal.alert("고객님의 상품 AS 를 접수하기 위해 최소 10글자 이상 입력해주세요.");
						//	 return;
						// }

						if (sandbox.utils.has.hasEmojis($this.find('#repairReason').val())) {
							sandbox.ui.modal.alert('AS 접수 작성시 이모지를 사용 할 수 없습니다.');
							return false;
						}

						//유의사항 show....
						$this.find('#jq_tab').eq(0).removeClass('uk-hidden');

						//수거지 새로 입력일 경우
						if ($this.find("[aria-expanded]").eq(1).attr('aria-expanded') == 'true') {
							$("#s_receiveAddressPostalCode").val($("span[data-postalcode]").eq(0).text());
							$("#s_receiveAddressLine1").val($("#s_addr1").val());
							$("#s_receiveAddressLine2").val($("#s_addr2").val());
							$("#s_receiveAddressFullName").val($("#s_name").val());
							$("#s_receiveAddressPhone").val($("#s_phone").val());
						};

						//받으시는 분 새로 입력일 경우
						if ($this.find("[aria-expanded]").eq(3).attr('aria-expanded') == 'true') {
							$("#r_deliveryAddressPostalCode").val($("span[data-postalcode]").eq(1).text());
							$("#r_deliveryAddressLine1").val($("#r_addr1").val());
							$("#r_deliveryAddressLine2").val($("#r_addr2").val());
							$("#r_deliveryAddressFullName").val($("#r_name").val());
							$("#r_deliveryAddressPhone").val($("#r_phone").val());
						};

						//수선 수리범위 배열처리.
						var seq = $('input#st_repairReasonAttr:checked').map(function () {
							return this.value;
						}).get().join(',');

						$this.find('#repairReasonAttr').val(seq);  //수선 범위...

						//첨부 이미지 배열
						var tempArray = [];
						//		$this.find('[data-component-file]').find('.preview-up-img').find('img').each(function(){
						//		   tempArray.push($(this).attr("src"));
						//		});
						//    $this.find('#r_personalMessage').val(tempArray.join( '|' ));

						var ii = 1;
						$this.find('[data-component-file]').find('.as-lode-img').find('img').each(function () {
							//tempArray.push($(this).attr("src"));
							$this.find('#imageFullUrl' + ii).val($(this).attr("src"));
							ii = ii + 1;
						});

						//수거지 배송 메모저장..
						if ($this.find('#selectPersonalMessage option:selected').eq(0).text() == '직접입력') {
							$this.find('#r_personalMessage').val($this.find('input#personalMessageText').eq(0).val());
						} else if ($this.find('#selectPersonalMessage option:selected').eq(0).val() != '') {
							var r_msg = $this.find('#selectPersonalMessage option:selected').eq(0).text();
							$this.find('#r_personalMessage').val(r_msg);
						}

						//받는분 배송 메모저장..
						if ($this.find('#selectPersonalMessage option:selected').eq(1).text() == '직접입력') {
							$this.find('#d_personalMessage').val($this.find('input#personalMessageText').eq(1).val());
						} else if ($this.find('#selectPersonalMessage option:selected').eq(1).val() != '') {
							var d_msg = $this.find('#selectPersonalMessage option:selected').eq(1).text();
							$this.find('#d_personalMessage').val(d_msg);
						}

						// if($("span[data-postalcode]").eq(0).text()==""){
						//	   UIkit.modal.alert("검색을 통하여 배송지를 입력해주세요.");
						//	 	 return;
						// };

						//수거지 주소
						sandbox.validation.validate($form);
						if (sandbox.validation.isValid($form)) {
							if ($this.find("[aria-expanded]").eq(1).attr('aria-expanded') == 'true') {
								if (!Method.isSelectAddress1) {
									UIkit.modal.alert("검색을 통하여 배송지를 입력해주세요.");
									return;
								}
							}
						}
						//받는분 주소 체크
						if (sandbox.validation.isValid($form)) {
							if ($this.find("[aria-expanded]").eq(3).attr('aria-expanded') == 'true') {
								if (!Method.isSelectAddress2) {
									UIkit.modal.alert("검색을 통하여 배송지를 입력해주세요.");
									return;
								}
							}
						}


						//작성완료시 모달
						if ($(this).attr('data-repairRequest-chk-btn') == 'step2') {

							//수거지 정보 validation
							if ($this.find("[aria-expanded]").eq(1).attr('aria-expanded') == 'false') {
								if ($("#s_receiveAddressPostalCode").val() == null || $("#s_receiveAddressPostalCode").val() == '') {
									UIkit.modal.alert('수거지 우편 번호가 누락 되었습니다.주소를 새로 입력해 주세요.');
									return;
								}

								if ($("#s_receiveAddressLine1").val() == null || $("#s_receiveAddressLine1").val() == '') {
									UIkit.modal.alert('수거지 주소가 누락 되었습니다. 주소를 새로 입력해 주세요.');
									return;
								}

								if ($("#s_receiveAddressFullName").val() == null || $("#s_receiveAddressFullName").val() == '') {
									UIkit.modal.alert('수거지 고객명이 누락 되었습니다. 고객명을 새로 입력해 주세요.');
									return;
								}

								if ($("#s_receiveAddressPhone").val() == null || $("#s_receiveAddressPhone").val() == '') {
									UIkit.modal.alert('수거지 전화번호가 누락 되었습니다.전화번호를 새로 입력해 주세요.');
									return;
								}

								var checkRegular = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})/;
								if (!checkRegular.test($("#s_receiveAddressPhone").val())) {
									UIkit.modal.alert('올바른 수거지 휴대폰 번호를 새로 입력해주세요.');
									return;
								};
							};


							//배송지 정보 validation
							if ($this.find("[aria-expanded]").eq(3).attr('aria-expanded') == 'false') {
								if ($("#r_deliveryAddressPostalCode").val() == null || $("#r_deliveryAddressPostalCode").val() == '') {
									UIkit.modal.alert('배송지 우편 번호가 누락 되었습니다.주소를 새로 입력해 주세요.');
									return;
								}

								if ($("#r_deliveryAddressLine1").val() == null || $("#r_deliveryAddressLine1").val() == '') {
									UIkit.modal.alert('배송지 주소가 누락 되었습니다. 주소를 새로 입력해 주세요.');
									return;
								}

								if ($("#r_deliveryAddressFullName").val() == null || $("#r_deliveryAddressFullName").val() == '') {
									UIkit.modal.alert('배송지 고객명이 누락 되었습니다. 고객명을 새로 입력해 주세요.');
									return;
								}

								if ($("#r_deliveryAddressPhone").val() == null || $("#r_deliveryAddressPhone").val() == '') {
									UIkit.modal.alert('배송지 전화번호가 누락 되었습니다.전화번호를 새로 입력해 주세요.');
									return;
								}

								var checkRegular = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})/;
								if (!checkRegular.test($("#r_deliveryAddressPhone").val())) {
									UIkit.modal.alert('올바른 배송지 휴대폰 번호를 새로 입력해주세요.');
									return;
								};
							};
							
							UIkit.modal('#popup-as-application').show();
						}
					};
				});


				var deliverySearch = sandbox.getComponents('component_searchfield', { context: $this, selector: '.search-field', resultTemplate: '#address-find-list' }, function () {
					// 검색된 내용 선택시 zipcode 처리
					this.addEvent('resultSelect', function (data) {
						if ($("[aria-expanded]").eq(1).attr('aria-expanded') == 'true') {
							Method.isSelectAddress1 = true;
						}
						if ($("[aria-expanded]").eq(3).attr('aria-expanded') == 'true') {
							Method.isSelectAddress2 = true;
						}
					});
				});


				//배송지 목록 선택
				$this.find('[data-customer-address-select-btn]').on('click', function (e) {

					var i = $("button[data-customer-address-select-btn]").index(this);     //배송지 목록
					var t_x = $("#addt_tab_index").val();    //배송지 목록  선택한 index

					var city = $("input[name='city']").eq(i).val();
					var fullName = $("input[name='fullName']").eq(i).val();
					var postalCode = $("input[name='postalCode']").eq(i).val();
					var addressLine1 = $("input[name='addressLine1']").eq(i).val();
					var addressLine2 = $("input[name='addressLine2']").eq(i).val();
					var phoneNumber = $("input[name='phoneNumber']").eq(i).val();

					//tetx 변경
					$(".txt-name").eq(t_x).text(fullName);
					$("span#txt-zip").eq(t_x).text(postalCode);
					$(".text-box").eq(t_x).text(addressLine1 + '  ' + addressLine2);
					$("span#txt-phone").eq(t_x).text(phoneNumber);

					var addr_model_pop = UIkit.modal('#popup-customer-address', { modal: false });
					addr_model_pop.hide();

					//배송지 목록, 선택시 hidden insert..
					if (t_x == 0) {    //수거지....
						$("input#s_receiveAddressCity").val(city);
						$("input#s_receiveAddressFullName").val(fullName);
						$("input#s_receiveAddressPostalCode").val(postalCode);
						$("input#s_receiveAddressLine1").val(addressLine1);
						$("input#s_receiveAddressLine2").val(addressLine2);
						$("input#s_receiveAddressPhone").val(phoneNumber);
					} else {
						$("input#r_deliveryAddressCity").val(city);
						$("input#r_deliveryAddressFullName").val(fullName);
						$("input#r_deliveryAddressPostalCode").val(postalCode);
						$("input#r_deliveryAddressLine1").val(addressLine1);
						$("input#r_deliveryAddressLine2").val(addressLine2);
						$("input#r_deliveryAddressPhone").val(phoneNumber);
					}
					return false;
				});

				inAjaxing = false;  //중복신청 방지...
				//   $("#sfrm").submit();
				$('[data-repairRequest-sendit-btn]').on('click', function (e) {
					var per_url = "repairRequest";
					var obj = $("#sfrm").serialize();
					var addr_model_pop = UIkit.modal('#popup-as-application', { modal: false });

					if (inAjaxing) {  //중복 신청 방지...
						UIkit.modal.alert('처리중 입니다.').on('hide.uk.modal', function () {
						});
						return;
					}

					inAjaxing = true;

					// obj = {'orderId' : 1818};
					Core.Utils.ajax(per_url, 'POST', obj, function (data) {
						var jsonData = Core.Utils.strToJson(data.responseText, true) || {};
						if (jsonData.result == true) {
							UIkit.modal.alert('신청되었습니다.').on('hide.uk.modal', function () {
								sandbox.setLoadingBarState(true);
								location.href = 'repaired';
							});

							//UIkit.notify("입고 알림 신청이 삭제 되었습니다." , {timeout:3000,pos:'top-center',status:'success'});
						} else {
							//	UIkit.notify(args.removeMsg, {timeout:3000,pos:'top-center',status:'warning'});
							addr_model_pop.hide();
							UIkit.modal.alert(jsonData.errorMsg).on('hide.uk.modal', function () {
								sandbox.setLoadingBarState(true);
								location.href = 'repairable?dateType=1';
							});
						}
					});
				});

				//이미지 첨부S  -------------------

				$this.find('[data-upload-btn]').on('click', function (e) {

					if ($('[data-component-file] .as-lode-img').length == 6) {
						UIkit.modal.alert('파일은 6개 까지만 가능 합니다.');
						return false;
					};

					$this.find('#input-file').trigger('click');
					return false;
				});


				$this.find('#input-file').change(function (e) {
					setImgPreview.call(this);
				});


				var setImgPreview = function (target) {

					var _errorMsg = "이미지 전송을 실패하였습니다.";

					if ($(this).val() === '') return false;

					$this.find("#fileupload-form").ajaxSubmit({
						success: function (data) {

							if (data.result == false) {  //실패시....
								UIkit.notify(_errorMsg, { timeout: 3000, pos: 'top-center', status: 'danger' });
								return false;
							};

							var imgTemplate = '<span class="as-lode-img"><a href="javascript:;" class="file-remove_btn"></a><img src="/kr/ko_kr{{imgUrl}}" alt="{{imgAlt}}" style="width:56px;height:56px;"/></span>';
							var fileUrl = data.fullUrl;
							var fileName = data.fileName;

							$(".thumbnail-wrap").append(sandbox.utils.replaceTemplate(imgTemplate, function (pattern) {
								switch (pattern) {
									case 'imgUrl':
										return fileUrl;
										break;
									case 'imgAlt':
										return fileName;
										break;
								}
							}));
							//$(".thumbnail-wrap").append('<img src="/kr/ko_kr'+ data.fullUrl +'">');
						},
						error: function (data) {
							UIkit.notify(_errorMsg, { timeout: 3000, pos: 'top-center', status: 'danger' });
							return false;
						}
					});
				};
				//이미지 첨부 E ---------------------------

				//첨부 이미지 삭제...
				$this.find('.thumbnail-wrap').on('click', '.file-remove_btn', function (e) {
					e.preventDefault();
					$(this).parent().remove();
				});

				//배송지 목록 클릭한 팝업 index
				$this.find('[data-customer-address-btn]').on('click', function (e) {
					$("#addt_tab_index").val($("[data-customer-address-btn]").index(this));
				});

				//배송지 목록 클릭한 팝업 index
				$this.find('input#isCheckoutAgree').on('change', function (e) {
					if ($this.find('input#isCheckoutAgree:checked').length == 3) {
						$this.find('div#jq_tab').eq(1).removeClass('uk-hidden');
						$this.find('div#jq_tab').eq(2).removeClass('uk-hidden');
					}
				});
			}
		}

		return {
			init: function () {
				sandbox.uiInit({
					selector: '[data-module-repairable-result]',
					attrName: 'data-module-repairable-result',
					moduleName: 'module_repairable_result',
					handler: { context: this, method: Method.moduleInit }
				});
			}
		}
	});
})(Core);