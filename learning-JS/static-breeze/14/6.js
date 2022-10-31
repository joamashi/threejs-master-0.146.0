(function(Core){
	Core.register('module_sleeping_customer', function (sandbox) {
		var $this;
		var Method = {
			moduleInit: function () {
				var args = Array.prototype.slice.call(arguments).pop();
				$.extend(Method, args);
				var $this = $(this);
				$this.find('[data-btn-change-sleeping-section]').on("click", Method.changeSleepCustomerState);
			},
			changeSleepCustomerState:function(e){
				e.preventDefault();
				var encodeUrl = $('input[data-input-encode-url]').val();
				var toUrl = $('input[data-input-to-url]').val();
				//console.log('encodeUrl: ', encodeUrl);
				//return;
				$.ajax({
					type: "GET",
					url: Core.Utils.contextPath + "/support/activateAccount/" + encodeUrl,
					data: {},
					success: function (data) {
						UIkit.modal.alert('계정이 복원되었습니다.<br/>이제부터 정상적으로 서비스를 이용하실 수 있습니다.').on('hide.uk.modal', function () {
							window.location.replace(sandbox.utils.contextPath + toUrl);
						});
					},
					error: function (e) {
						UIkit.modal.alert('계정 복원에 실패 하였습니다.<br/>3회 이상 실패시 고객센터로 연락바랍니다.').on('hide.uk.modal', function () {
							window.location.reload();
						});
					}
				});
			}
		}

		return {
			init: function () {
				sandbox.uiInit({
					selector: '[data-module-sleeping-customer]',
					attrName: 'data-module-sleeping-customer',
					moduleName: 'module_sleeping_customer',
					handler: { context: this, method: Method.moduleInit }
				});
			}
		}
	});
})(Core);