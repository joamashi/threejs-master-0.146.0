(function(Core){
	Core.register('module_pageredirect', function(sandbox){

		var Method = {
			moduleInit:function(){
                var $this = $(this);
				// var args = arguments[0];
                //강제 리다이렉트..별 쓸모 없어 보임
                if($this.attr('data-type') === 'COD'){
                document.location = '/mypage';
                }
			}
		}
		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-pageredirect]',
					attrName:'data-module-pageredirect',
					moduleName:'module_pageredirect',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);