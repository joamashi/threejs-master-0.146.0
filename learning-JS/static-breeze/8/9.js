(function(Core){
	Core.register('module_register', function(sandbox){
		var Method = {
			moduleInit:function(){
				var args = Array.prototype.slice.call(arguments).pop();
				$.extend(Method, args);

				var $this = $(this);
				var $submitBtn = $this.find('button[type="submit"]');

				sandbox.getComponents('component_textfield', {context:$this}, function(){
					this.addEvent('enter', function(e){
						$submitBtn.trigger("click");
					});
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-register]',
					attrName:'data-module-register',
					moduleName:'module_register',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);