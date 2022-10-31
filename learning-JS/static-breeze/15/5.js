(function(Core){
	Core.register('module_qna_product', function(sandbox){
		var $this, $writeBtn, modal, textarea, args;
		var Method = {
			moduleInit:function(){
				$this = $(this);
				$writeBtn = $this.find('.qna-write');
				modal = UIkit.modal('#common-modal');
				args = arguments[0];

				$writeBtn.click(function(e){
					e.preventDefault();

					sandbox.getModule('module_header').setLogin(function(){
						var url = $(this).attr('href');
						var param = sandbox.utils.getQueryParams(url);
						sandbox.utils.ajax(url, 'GET', {}, function(data){
							var responseText = data.responseText;
							$('#common-modal').find('.contents').empty().append(responseText);
							modal.show();
						});
					});
				});

				sandbox.getComponents('component_textarea', {context:$this}, function(){
					var _this = this;
					_this.getThis().closest('form').submit(function(e){
						e.preventDefault();

						if(sandbox.getModule('module_header').getIsSignIn()){
							if(!_this.getValidateChk()){
								UIkit.notify(args.errMsg, {timeout:3000,pos:'top-center',status:'danger'});
							}else{
								var param = $(this).serialize();
								sandbox.utils.ajax($(this).attr('action'), $(this).attr('method'), $(this).serialize(), function(data){
									if(data.readyState === 4 && data.status === 200 && data.statusText === 'success'){
										location.reload();
									}else{
										UIkit.notify(args.errMsg, {timeout:3000,pos:'top-center',status:'danger'});
									}
								});
							}
						}else{
							sandbox.getModule('module_header').setLogin(function(data){
								if(data.isSignIn){
									location.reload();
								}
							});
						}
					});
				});

			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-qna-product]',
					attrName:'data-module-qna-product',
					moduleName:'module_qna_product',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);