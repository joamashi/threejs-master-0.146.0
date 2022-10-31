(function(Core){
	Core.register('module_newsletter', function(sandbox){
		var $this, args, $submitBtn, endPoint;
		var Method = {
			moduleInit:function(){
				$this = $(this);
				$submitBtn = $this.find('.btn_join')
				args = arguments[0];
				endPoint = Core.getComponents('component_endpoint');

				var modal = UIkit.modal('#common-modal');
				var checkboxComponent = sandbox.getComponents('component_checkbox', {context:$this});
				var inputComponent = sandbox.getComponents('component_textfield', {context:$this}, function(){
					this.addEvent('enter', function(e){
						$submitBtn.trigger('click');
					});
				});

				$submitBtn.click(function(e){
					e.preventDefault();
					var _self = this;

					var $form = $(_self).closest('form');
					var param = $form.serialize();

					if(inputComponent.getValidateChk() && checkboxComponent.getValidateChk()){
						sandbox.utils.ajax($form.attr('action'), $form.attr('method'), param, function(data){
							var response = sandbox.rtnJson(data.responseText);

							if(response.hasOwnProperty('isSuccess')){
								endPoint.call('newsletterSubscribed');
								UIkit.notify(args.successMsg, {timeout:3000,pos:'top-center',status:'success'});
							}else if(response.hasOwnProperty('error')){
								UIkit.notify(response.error, {timeout:3000,pos:'top-center',status:'success'});
							}

							inputComponent.setValue('');
							checkboxComponent.getThis().trigger('click');
						});
					}
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-newsletter]',
					attrName:'data-module-newsletter',
					moduleName:'module_newsletter',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				console.log('newsLetter destory');
			}
		}
	});
})(Core);