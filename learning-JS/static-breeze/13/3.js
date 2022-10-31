(function(Core){
	Core.register('module_social_login', function(sandbox){
		var Method = {
			moduleInit:function(){
				$this = $(this);
				sandbox.getComponents('component_select', {context:$this}, function(){
					this.addEvent('change', function(val){
						Method.submitFormByName( val );
					});
				});

				$(this).find('[data-social-btn]').on('click', function(e){
					e.preventDefault();
					var type = $(this).data('social-btn');
					Method.submitFormByName( type );
				})


			},
			submitFormByName:function(name){

				//페북, 카카오 클릭시 소셜 로그인 태깅 작업을 위해서. 쿠키를 생성한다.
				$.cookie('social_type', name);

				//로그인 진행..
				var $form = $this.find('form[name="' + name + '"]');
				var url = sandbox.utils.url.getUri(encodeURI(sandbox.utils.url.getCurrentUrl()));
				/*
				var locationHref = url.path.replace(sandbox.utils.contextPath, '') + url.query;
				*/
				var locationHref = window.location.href;

				if (!_.isEmpty(url.queryParams.successUrl)){
					locationHref = url.queryParams.successUrl;
				}
				if( $form ){
					$form.append('<input type="hidden" name="state" value="'+ locationHref +'" />');
					$form.submit();
				}
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-social-login]',
					attrName:'data-module-social-login',
					moduleName:'module_social_login',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);