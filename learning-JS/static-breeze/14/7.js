(function(Core){
	Core.register('module_giftcard', function(sandbox){
		var Method = {
			moduleInit:function(){
				
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-giftcard]',
					attrName:'data-module-giftcard',
					moduleName:'module_giftcard',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);