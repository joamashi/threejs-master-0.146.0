(function(Core){
	'use strict';

	Core.register('module_dynamicentity', function(sandbox){
		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var $submitInput = $(this).find('input[name=_find]');
				var search = sandbox.getComponents('component_searchfield', {context:$this}, function(){
					this.addEvent('submit', function(target, val){
						$submitInput.val(val);
						target.submit();
					});
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-dynamicentity]',
					attrName:'data-module-dynamicentity',
					moduleName:'module_dynamicentity',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);