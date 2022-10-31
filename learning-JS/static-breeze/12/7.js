(function(Core){
	Core.register('module_refund_account', function(sandbox){
		var serialize = function($form){
			//jquery에 있는 serialize가 한글을 escape 치리가 되어 처리 안되게 따로 만듬;
			var inputs = $form.find('input[type=hidden]');
			var queryParams = {};
			for(var i=0; i<inputs.length; i++){
				queryParams[inputs.eq(i).attr('name')] = inputs.eq(i).val();
			}
			return queryParams;
		}
		var Method = {
			$that:null,
			$popModal:null,
			$popSubmitBtn:null,
			$refundAccountInfo:null,
			moduleInit:function(){
				var $this = $(this);
				Method.$that = $this;
				Method.$popModal = UIkit.modal("#popup-refund-account");
				Method.$popSubmitBtn = Method.$popModal.find('[data-refund-account-submit]');
				Method.$refundAccountInfo = Method.$popModal.find('[data-refund-account-info]');

				// 환불 신청 팝업 open
				$this.find('[data-refund-account-btn]').on('click', function(e){
					e.preventDefault();
					Method.openRefundAccountPopup( $(this).closest('form') );
				});

				// 환불 신청 submit
				Method.$popSubmitBtn.on('click', Method.refundAccountSumit );
			},
			openRefundAccountPopup:function($form){
				/*var id = $form.closest('[data-order]').find('[name="id"]').val();
				var amount = $form.closest('[data-order]').find('[name="amount"]').val();*/
				var formData = serialize($form);

				if(formData.hasOwnProperty('account')){
					for(var key in formData){
						if(key === 'amount'){
							Method.$popModal.dialog.find('[data-total-amount]').find('.price').text(sandbox.utils.price(formData[key]));
						}else if(key === 'accountCode'){
							Method.$popModal.dialog.find('select[name="accountCode"]').val(formData[key]);
						}else{
							Method.$popModal.dialog.find('input[name="'+ key +'"]').val(formData[key]);
						}
					}

					sandbox.getComponents('component_textfield', {context:Method.$that}, function(i){
						//초기값에 따라 인풋라벨 초기화
						this.setValueLabel();
					});

					sandbox.getComponents('component_select', {context:Method.$that}, function(i){
						//초기값에 따라 셀랙트박스 리페인팅
						this.rePaintingSelect();
					});

					Method.$popModal.dialog.find('[data-refund-account-submit]').text('수정');
				}

				sandbox.moduleEventInjection(Method.$popModal.dialog.html());
				Method.$popModal.show();

				// 숨겨있는 내용은 init에 처리 되지 않아 show이후
				sandbox.validation.reset( Method.$refundAccountInfo.find('form'));
			},
			refundAccountSumit:function(e){
				e.preventDefault();
				var $refundAccountInfoForm = Method.$refundAccountInfo.find('form');
				sandbox.validation.validate( $refundAccountInfoForm );

				if( !sandbox.validation.isValid( $refundAccountInfoForm )){
					return;
				}

				//전체 form을 체크하여 체크된 아이템 처리
				UIkit.modal.confirm("환불을 요청 하시겠습니까?", function(){
					var accountName = $refundAccountInfoForm.find('[name="accountCode"] option:selected').text();
					$refundAccountInfoForm.find('[name="accountName"]').val(accountName);

					var url = $refundAccountInfoForm.attr('action');
					var method = $refundAccountInfoForm.attr('method');

					Core.Utils.ajax(url, method, $refundAccountInfoForm.serialize(), function(data){
					//Core.Utils.ajax(url + Method.cancelOrderId, "GET", "", function(data){
						var data = sandbox.rtnJson(data.responseText, true);
						var result = data['result'];
						if( result == true ){
							UIkit.modal.alert("환불 요청 되었습니다.").on('hide.uk.modal', function() {
								window.location.reload();
							});
						}else{
							UIkit.modal.alert(data['errorMsg']).on('hide.uk.modal', function() {
								window.location.reload();
							});
						}
					}, true);
				}, function(){},
				{
					labels: {'Ok': '확인', 'Cancel': '취소'}
				});

			}
		}
		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-refund-account]',
					attrName:'data-module-refund-account',
					moduleName:'module_refund_account',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);