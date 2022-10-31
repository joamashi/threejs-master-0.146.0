(function(Core){
	Core.register('module_global_alert', function(sandbox){
		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var msg = $(this).find('span').text();

				if( msg != null && $.trim(msg) ){
					UIkit.notify(msg, {timeout:0,pos:'top-center',status:'danger'});
				}
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[ data-module-global-alert]',
					attrName:'data-module-global-alert',
					moduleName:'module_global_alert',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);