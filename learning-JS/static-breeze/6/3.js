(function(Core){
	Core.register('module_giftcard_credit', function(sandbox){
		var Method = {
			moduleInit:function(){
				var $this = $(this);
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[ data-module-giftcard-credit]',
					attrName:'data-module-giftcard-credit',
					moduleName:'module_giftcard_credit',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);