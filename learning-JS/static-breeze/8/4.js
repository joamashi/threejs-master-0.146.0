(function(Core){
	Core.register('module_checkout_address_review', function(sandbox){
		var $this, args;
		var Method = {
			moduleInit:function(){
				$this = $(this);
				args = arguments[0];

				sandbox.utils.ajax(sandbox.utils.contextPath + '/checkout/orderRegeneration', 'GET', {}, function(data){
					var data = sandbox.rtnJson(data.responseText);
					if(!data['result']){
						UIkit.modal.alert(data['errorMsg']).on('hide.uk.modal', function() {
							location.href = sandbox.utils.contextPath + '/cart';
						});
					}
				}, false, true);
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-checkout-address-review]',
					attrName:'data-module-checkout-address-review',
					moduleName:'module_checkout_address_review',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				console.log('module_checkuot_address_review destory');
			}
		}
	});
})(Core);