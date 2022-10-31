(function(Core){
	'use strict';
	Core.register('module_wishlist', function(sandbox){

		var $this, modal;
		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var miniCartModule = sandbox.getModule('module_minicart');
				modal = UIkit.modal('#common-modal', {center:true});

				$this.on('click', '.wish-delete_btn', function(e){
					e.preventDefault();
					var $that = $(this);
					UIkit.modal.confirm('삭제 하시겠습니까?', function(){
						location.href = $that.attr('href');
					});
				});

				$this.find('.addtocart').each(function(i){
					var target = $(this).attr('data-target');
					var url = $(this).attr('data-href');

					$(this).click(function(e){
						e.preventDefault();

						Core.Utils.ajax(url, 'GET', {quickview:true, accepted:true}, function(data){
							var domObject = $(data.responseText).find('#quickview-wrap');

							if (domObject.length == 0) {
								UIkit.modal.alert('판매 중지된 상품입니다.');
							} else {
								$(target).find('.contents').empty().append(domObject[0].outerHTML);
								$(target).addClass('quickview');
								Core.moduleEventInjection(domObject[0].outerHTML);
								modal.show();

								//모바일 pdp STICKY 사이즈
								$(".pdp_sticky_sizeinfo").css('width','90%');
								$(".sticky-btn").addClass('wish_btn');

								//위시리스트 장바구니 담기.. 위시리스트 태깅(마케팅 스크립트가 미작동 되어.. 새로 data 구성...)
								e.preventDefault();
								var data = {};
								data.product_url =  $(target).find('#ctm_teg').data('url');
								data.products 	 = [];


								if( $(target).find(".product-soldout").length > 0 ){
									var isSoldOut = true;
								}else{
									var isSoldOut = false;
								}
								data.products = [
									{
										product_category : $(target).find('#ctm_teg').data('bu'), 	// products, prop1, eVar12, prop20
										product_name : $(target).find('#ctm_teg').data('name'), 			// products, prop1, eVar12, prop20
										product_id : $(target).find('#ctm_teg').data('id'), // (2018-01-03 추가)
										product_quantity : $(target).find('#ctm_teg').data('quantity'),
										product_unit_price : $(target).find('#ctm_teg').data('unit_price'),
										product_discount_price: $(target).find('#ctm_teg').data('discount_price'),
										product_inventory_status : "in stock", // 재고 상태
										avg_product_rating : ($(target).find('#ctm_teg').data('product_rating') =='0.0') ? '' : Number($(target).find('#ctm_teg').data('product_rating') / 100 * 5).toFixed(1), // 평균 review 평점
										number_of_product_review : $(target).find('#ctm_teg').data('product_review'), // review 갯수
										product_finding_method : "browse", // 상품 페이지 방문 경로

									}
								];

								// 세일중 이면 태깅 변수 추가.
								if( $(target).find('#ctm_teg').data('unit_price') > $(target).find('#ctm_teg').data('discount_price') ){

								 var queryString  = Core.Utils.url.getQueryStringParams(data.product_url);

									if( queryString.cr != null ){
										data.products[0].price_status = "clearance";
									}else{
										data.products[0].price_status = "reduced";
									}
								}
								endPoint.call( 'mini_wishlist', data );
							}
						});

						/*sandbox.utils.ajax(url, 'POST', data, function(data){
							var jsonData = sandbox.rtnJson(data.responseText);
							if(jsonData.hasOwnProperty('error')){
								UIkit.notify(jsonData.error, {timeout:3000,pos:'top-center',status:'warning'});
							}else{
								//UIkit.notify('쇼핑백에 상품이 담겼습니다.', {timeout:3000,pos:'top-center',status:'success'});
								miniCartModule.update();
							}
						});*/
					});
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-wishlist]',
					attrName:'data-module-wishlist',
					moduleName:'module_wishlist',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);