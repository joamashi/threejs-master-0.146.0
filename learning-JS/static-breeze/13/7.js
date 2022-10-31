(function(Core){
	'use strict';

	Core.register('module_global_popup', function(sandbox){
		var Method = {
			moduleInit:function(){
				var args = Array.prototype.slice.call(arguments).pop();
				$.extend(Method, args);

				var options = {
					id : Method.id,
					width : Method.width,
					height : Method.height,
					marginLeft : Method.marginLeft || 0,
					marginTop : Method.marginTop || 0,
					marginBottom : Method.marginBottom || 0,
					layoutType : Method.layoutType,
					backgroundColor : Method.backgroundColor,
					borderWidth : Method.borderWidth || 0,
					boxPosition : Method.boxPosition,
					triggerActionType : Method.triggerActionType,
					triggerActionValue : Method.triggerActionValue,
					animationType : Method.animationType,
					closeExpireTime : Method.closeExpireTime,
					useCloseMessage : Method.useCloseMessage,
					closeType : Method.closeType,
					closePosition : Method.closePosition,
					closeMarginTop : Method.closeMarginTop || 0,
					closeMarginLeft : Method.closeMarginLeft || 0,
					closePaddingTop : Method.closePaddingTop || 0,
					closePaddingRight : Method.closePaddingRight || 0,
					closePaddingBottom : Method.closePaddingBottom || 0,
					closePaddingLeft : Method.closePaddingLeft || 0,
					closeBackgroundHeight : Method.closeBackgroundHeight || 0
				}

				var pop = $("#global_popup_" + options.id);
				// productList 있을시에는 상품 정보가 있는 페이지( cart, checkout, confirmation ) 에서만 팝업이 동작한다.
				// 팝업 role 설정에서 위 3페이지에 대한 설정을 해야 정상적으로 동작할수 있다.
				if( Method.productList != 'none' ){
					var itemList = _GLOBAL.MARKETING_DATA().itemList;
					var productList = Method.productList;

					if( itemList != null ){
						productList = String(productList).replace(/\s/gi, "");
						productList = productList.split(',');
						itemList = $.map(itemList, function(item){ return item.model });

						if(_.intersection( productList, itemList ).length > 0){
							pop.brzPopup(options);	
						}else{
							pop.remove();
						}
					}else{
						pop.remove();
					}
				}else{
					pop.brzPopup(options);	
				}
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-global-popup]',
					attrName:'data-module-global-popup',
					moduleName:'module_global_popup',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);