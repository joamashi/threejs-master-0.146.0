(function(Core){
	'use strict';

	Core.register('module_shipping_address', function(sandbox){
		var $this, args, modal = null, endPoint;
		var Method = {
			moduleInit:function(){
				// modal layer UIkit 사용
				$this = $(this);
				args = arguments[0];
				modal = UIkit.modal('#common-modal');
				endPoint = Core.getComponents('component_endpoint');

				$this.on('click', '.defaultAddress', function(e){
					e.preventDefault();
					endPoint.call('updateProfile', 'address book:select default shipping');
					$(this).parent().submit();
				});

				$this.on('click', '.add-address', function(e){
					e.preventDefault();
					Method.modalInit($(this).attr('href'));
				});

				$this.on('click', '.modify', function(e){
					e.preventDefault();
					Method.modalInit($(this).attr('href'));
				});

				$this.on('click', '.remove', function(e){
					e.preventDefault();
					var _self = this;
					UIkit.modal.confirm('삭제 하시겠습니까?', function(){
						$(_self).parent().submit();
					});
				});

				$this.find('.address-form').remove();
			},
			modalInit:function(url){
				sandbox.utils.ajax(url, 'GET', {}, function(data){
					var appendHtml = $(data.responseText).find('.address-form').html();
					modal.element.find('.contents').empty().append(appendHtml);
					sandbox.moduleEventInjection(appendHtml);
					modal.show();
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-shipping-address]',
					attrName:'data-module-shipping-address',
					moduleName:'module_shipping_address',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);