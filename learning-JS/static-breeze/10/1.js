(function(Core){
	Core.register('module_refund_form', function (sandbox) {
		var Method = {

			moduleInit: function () {
				var $this = $(this);
				var $that = $("#refund-step2");   // 환불요청 확인창...
				var $form = $this.find('#refund_from');
				sandbox.validation.init($form);

				$this.find('[refund_send_btn]').on('click', function (e) {       //환불창 OPEN...

					e.preventDefault();
					sandbox.validation.validate($form);

					if (sandbox.validation.isValid($form)) {

						var ownerName = $this.find("#ownerName").val();   //예금주
						var accountName = $this.find("#accountCode option:selected").text();  //은팽명
						var accountCode = $this.find("#accountCode option:selected").val(); //은팽코드
						var accountNum = $this.find("#accountNum").val();  //계좌
						var refundAmount = $this.find("#str_refundAmount").val().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");   //환불금액

						//$this.find("#str_repairNumber").val(repairNumber);
						$this.find("#str_accountName").val(accountName);
						$that.find("#txt_refundAmount").text(refundAmount + '원');
						$that.find("#txt_ownerName").text(ownerName);
						$that.find("#txt_accountName").text(accountName);
						$that.find("#txt_accountNum").text(accountNum);

						UIkit.modal('#refund-step2').show();
					};
				});

				Method.$popAddressModal = UIkit.modal("#refund-etc", { modal: false });

				$this.find('[data-modal-btn]').on('click', function (e) {       //개인정보 자세히 보기...
					e.preventDefault();
					Method.$popAddressModal.show();
				});

				//환불계좌 숫자만 입력
				$this.find('#accountNum').on('keyup', function (e) {
					$(this).val($(this).val().replace(/[^0-9]/g, ""));
				});


				//환불창 submit
				$that.find('[refund_send_btn]').on('click', function (e) {

					param = $this.find('#refund_from').serialize();
					console.log(param);

					Core.Utils.ajax('repaired/refundInfo', 'post', param, function (data) {
						var jsonData = Core.Utils.strToJson(data.responseText, true) || {};

						if (jsonData.result == true) {
							UIkit.modal.alert('환불 요청이 완료되었습니다.').on('hide.uk.modal', function () {
								endPoint.call('clickEvent', { 'area': 'mypage', 'name': 'as status: bank account for refund: confirm alert (auto)' });
								sandbox.setLoadingBarState(true);
								location.reload();
							});
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
					selector: '[data-module-refund-form]',
					attrName: 'data-module-refund-form',
					moduleName: 'module_refund_form',
					handler: { context: this, method: Method.moduleInit }
				});
			}
		}
	});
})(Core);