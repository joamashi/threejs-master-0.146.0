(function(Core){
	Core.register('module_before_payment', function(sandbox){
		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var args = arguments[0] || {};
				var defer = $.Deferred();

				sandbox.utils.promise({
					url:sandbox.utils.contextPath + '/checkout/orderRegeneration',
					method:'GET',
					isLoadingBar:false
				}).then(function(data){
					if(!data['result']){
						UIkit.modal.alert(data['errorMsg']).on('hide.uk.modal', function() {
							location.href = sandbox.utils.contextPath + '/cart';
						});
						defer.reject('');
					}else{
						if(args.fulfillmentType === 'PHYSICAL_SHIP'){
							defer.resolve(data);
						}else{
							defer.reject('');
							//defer.reject('PHYSICAL_PICKUP or DIGITAL');
						}
					}
					return defer.promise();
				}).then(function(){
					return sandbox.utils.promise({
						url:sandbox.utils.contextPath + '/checkout',
						method:'GET',
						isLoadingBar:false
					});
				}).then(function(data){
					var $target = $(data).find('#payment-review');
					$this.empty().append($target[0].outerHTML);
					sandbox.moduleEventInjection($target[0].outerHTML);
					$this.find('#payment-review').show();
				}).fail(function(msg){
					if(msg !== '' || msg !== undefined){
						UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'danger'});
					}
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-before-payment]',
					attrName:'data-module-before-payment',
					moduleName:'module_before_payment',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);