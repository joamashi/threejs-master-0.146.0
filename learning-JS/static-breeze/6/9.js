(function(Core){
	Core.register('module_guide', function(sandbox){
		var endPoint;
		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var args = Array.prototype.slice.call(arguments).pop();
				$.extend(Method, args);
				
				endPoint = Core.getComponents('component_endpoint');
				$(this).on('click', function(){
					var type = $(this).data('guide-type');
					if( type == 'size'){
						endPoint.call('pdpSizeGuideClick');
					}
				})
			},
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-guide]',
					attrName:'data-module-guide',
					moduleName:'module_guide',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);