(function(Core){
	Core.register('module_social_share', function(sandbox){
		var endPoint, $this;
		var Method = {
			moduleInit:function(){
				$this = $(this);
				endPoint = Core.getComponents('component_endpoint');

				$this.on('click', '#kakao-btn-wrapper', function(){
					endPoint.call('socialShareClick', {service : 'kakaotalk'});
				})

				$this.on('click', '.at-share-btn-elements a', function(){
					var service = '';
					var className = String( $(this).attr("class") );
					if( className.indexOf('facebook') > -1){
						service = 'facebook';
					}

					if( className.indexOf('twitter') > -1){
						service = 'twitter';
					}

					if( className.indexOf('kakao') > -1){
						service = 'kakao';
					}

					if( className.indexOf('email') > -1){
						service = 'email';
					}

					if( className.indexOf('lineme') > -1){
						service = 'lineme';
					}

					if( className.indexOf('pinterest') > -1){
						service = 'pinterest';
					}
					endPoint.call('socialShareClick', {service : service});
				})
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-social-share]',
					attrName:'data-module-social-share',
					moduleName:'module_social_share',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				if($this) $this.off();
				endPoint = null;
			}
		}
	});
})(Core);