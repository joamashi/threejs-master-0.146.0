(function(Core){
	Core.register('module_latest', function(sandbox){
		var $this, args, productId, arrLatestItems;
		var Method = {
			moduleInit:function(){
				$this = $(this);
				args = arguments[0];
				productId = args.productId || null;

				//최근본상품 cookie
				var latestItemsMaxLength = args.latestItemsMaxLength;
				var latestItems = $.cookie('latestItems');

				if( productId != null){
					var pattern = new RegExp(productId, 'g');
					if(latestItems){
						arrLatestItems = latestItems.replace(pattern, '').match(/[0-9]+/g) || [];
						arrLatestItems.unshift(productId);

						if(arrLatestItems.length >= latestItemsMaxLength){
							arrLatestItems = arrLatestItems.slice(0, -1);
						}
						$.cookie('latestItems', arrLatestItems.join(','), {path:'/'});
					}else if(!latestItems){
						$.cookie('latestItems', productId, {path:'/'});
						$this.remove();
					}
				}

				addLatestItem(latestItems);
			}
		}

		var addLatestItem = function(items){
			var obj = {
				'id':items || 0, // 무조건 dom을 가져오기 위해서 가지고 있는 productid가 없어도 0을 넘겨 비어있음 나오게 한다.
				'mode':'template',
				'templatePath':'/modules/latest',
				'resultVar':'productList',
				'minSlides':args.minSlides || 2,
				'maxSlides':args.maxSlides || 4,
				'slideMargin':args.slideMargin || 0
			}

			sandbox.utils.ajax(sandbox.utils.contextPath + '/processor/execute/product', 'GET', obj, function(data){
				$this.append(data.responseText);
				sandbox.moduleEventInjection(data.responseText);
			}, false, true);
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-latest]',
					attrName:'data-module-latest',
					moduleName:'module_latest',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				console.log('latest destory');
			}
		}
	});
})(Core);