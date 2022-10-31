(function(Core){
	Core.register('module_crosssale', function(sandbox){
		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var md = _GLOBAL.MARKETING_DATA();
				$this.find('[data-crosssale-chk]').on('click', function(e){
					e.preventDefault();
					var str_modelCode 	= "";     // 장바구니,주문완료된 상품 스타일코드 넣을 변수,
					var product_linkUrl = $(this).attr('date-linkUrl');   // 클릭한 상품 랜등 url
					var per_url			= "";   // 상품url + model 조합된 최종 변수
					//장부구니와 주문완료 페이지 에서만 태깅이 필요
					if(md.pageType=="cart"){
						$(".product-opt_cart").each(function(index){
							str_modelCode  = str_modelCode + $(this).find('div [data-model]').data('model') +",";
						});
					}else if(md.pageType=="confirmation"){
						$.each(md.itemList, function(index,data){
							str_modelCode  = str_modelCode + data.model +",";
						});
					}
					str_modelCode 	= str_modelCode.substr(0, str_modelCode.length -1);
					per_url			= product_linkUrl +'?fm=cs&modelCode='+str_modelCode;
					$(location).attr('href', per_url);
				});
			}
		}
		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-crosssale]',
					attrName:'data-module-crosssale',
					moduleName:'module_crosssale',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);