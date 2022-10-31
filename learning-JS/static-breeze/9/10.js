(function(Core){
	Core.register('module_repairable_pop', function (sandbox) {
		var Method = {

			moduleInit: function () {
				var $this = $(this);

				//주소변경....
				$this.find('[data-repairaddr-chk-btn]').on('click', function (e) {

					var ix = $("[data-repairaddr-chk-btn]").index(this);   //저장 버튼 index
					var $form1 = $this.find($(this).attr('data-repairaddr-chk-btn'));
					var str_text = $(this).text();
					var jq_obj = $(this).attr('jq_obj');  // 1,2

					if (str_text == "주소변경") {
						$this.find("li#jq_h_tab").eq(ix).removeClass('uk-hidden');
						$(this).text('변경확인');
					} else {

						if ($this.find("[aria-expanded]").eq(jq_obj).attr('aria-expanded') == 'true') {   //이전주소면....
							$this.find("li#jq_h_tab").eq(ix).addClass('uk-hidden');
							$(this).text('주소변경');

						} else {  // 새로입력...

							sandbox.validation.init($form1);
							e.preventDefault();
							sandbox.validation.validate($form1);

							if (sandbox.validation.isValid($form1)) {

								//배송 메세지 hidden....
								if (ix == 0) {	    //수거지 배송 메모저장..
									if ($this.find('#selectPersonalMessage option:selected').eq(0).text() == '직접입력') {
										$this.find('#r_personalMessage').val($this.find('input#personalMessageText').eq(0).val());
									} else if ($this.find('#selectPersonalMessage option:selected').eq(0).val() != '') {
										var r_msg = $this.find('#selectPersonalMessage option:selected').eq(0).text();
										$this.find('#r_personalMessage').val(r_msg);
									}

									if ($this.find("#receiveAddressPostalCode").val() == "") {
										UIkit.modal.alert("검색을 통하여 배송지를 입력해주세요.");
										return;
									}

								} else {	//받는분 배송 메모저장..
									if ($this.find('#selectPersonalMessage option:selected').eq(1).text() == '직접입력') {
										$this.find('#d_personalMessage').val($this.find('input#personalMessageText').eq(1).val());
									} else if ($this.find('#selectPersonalMessage option:selected').eq(1).val() != '') {
										var d_msg = $this.find('#selectPersonalMessage option:selected').eq(1).text();
										$this.find('#d_personalMessage').val(d_msg);
									}

									if ($this.find("#deliveryAddressPostalCode").val() == "") {
										UIkit.modal.alert("검색을 통하여 배송지를 입력해주세요.");
										return;
									}
								}

								var per_url = "repaired/updateAddress";
								var obj = $form1.serialize();

								//	 console.log(obj);

								Core.Utils.ajax(per_url, 'POST', obj, function (data) {
									var jsonData = Core.Utils.strToJson(data.responseText, true) || {};

									if (jsonData.result == true) {
										UIkit.modal.alert('저장 되었습니다.').on('hide.uk.modal', function () {
											sandbox.setLoadingBarState(true);
											location.reload();
										});

										// location.href = 'repaired';
									} else {
										UIkit.modal.alert(jsonData.result);
									}
								});
							};
						};
					};
				});

				//수정
				var deliverySearch = sandbox.getComponents('component_searchfield', { context: $this, selector: '.search-field', resultTemplate: '#address-find-list' }, function () {

					this.addEvent('resultSelect', function (data) {
						if ($("[aria-expanded]").eq(1).attr('aria-expanded') == 'true') {
							var zipcode = $(data).data('zip-code5');
							$("#receiveAddressPostalCode").val(zipcode);
						}

						if ($("[aria-expanded]").eq(3).attr('aria-expanded') == 'true') {
							var zipcode = $(data).data('zip-code5');
							$("#deliveryAddressPostalCode").val(zipcode);
						}
					});
				});

			}
		}
		return {
			init: function () {
				sandbox.uiInit({
					selector: '[data-module-repairable-pop]',
					attrName: 'data-module-repairable-pop',
					moduleName: 'module_repairable_pop',
					handler: { context: this, method: Method.moduleInit }
				});
			}
		}
	});
})(Core);