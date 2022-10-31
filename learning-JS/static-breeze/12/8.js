(function(Core){
    Core.register('module_thedraw_order', function(sandbox){
        var args = null;
        var Method = {
            moduleInit:function(){
                var $this = $(this);
                var url = _GLOBAL.SITE.SNKRSCONTEXT_PATH + '/cart/add?directOrder=true';
                var returnUrl = location.pathname;

                $this.find('[data-cart]').on('click', function(){

                    var csrfToken = $this.find('input[name="csrfToken"]').val();
                    var productId = $this.attr('productId');
                    var itemAttributes = $this.attr('itemAttributes');
                    var SIZE = $this.attr('SIZE');
                    var quantity = $this.attr('quantity');
                    var attributename = $this.attr('attributename');

                    //드로우용  Attribute  추가
                    var draw_itemAttributes = $this.attr('draw_itemAttributes');
                    var draw_attributename = $this.attr('draw_attributename');

                    var dataJson = {"productId" : productId,
                        "SIZE" : SIZE,
                        "quantity" : quantity,
                        "csrfToken" : csrfToken,
                        "attributename" : attributename};
                    var name         = 'itemAttributes['+attributename+']';
                    var draw_name    = 'userDefinedFields['+draw_attributename+']';

                    dataJson[name]      = itemAttributes;
                    dataJson[draw_name] = draw_itemAttributes;

                    //드로우 구매하기 버튼 태깅 추가
                    var product_name    = $this.attr('product_name');
                    var product_id      = $this.attr('product_id');
                    var product_unit_price      = $this.attr('product_unit_price');
                    var product_discount_price  = $this.attr('product_discount_price');
                    var click_area  = $this.attr('click_area');

                    data = {};
                    data.click_area = click_area;  // 마이페이지(my page) , 스니커즈pdp(pdp) 두군데 에서 진입

                    data.products = [
    					{
    						product_id : product_id,
    						product_name : product_name,
    						product_unit_price : Number(product_unit_price),
    						product_quantity : 1,   //수량
    						product_discount_price : Number(product_discount_price)
    					}
    				];

                    endPoint.call( 'the_draw', data);  //태깅 콜 발생..


                    BLC.ajax({
                        type : "POST",
                        dataType : "json",
                        url : url,
                        data : dataJson
                    },function(data){
                        if(data.error){
                            sandbox.setLoadingBarState(false);
                            UIkit.modal.alert(data.error).on('hide.uk.modal', function () {
                                window.location.href = returnUrl;
                            });
                        }else{
                            Core.Loading.show();
                            _.delay(function () {
                                window.location.assign(_GLOBAL.SITE.SNKRSCONTEXT_PATH + '/checkout');
                            }, 500);
                        }
                    });
                    return;
                });
            }
        }
        return {
            init:function(){
                sandbox.uiInit({
                    selector:'[data-module-thedraw-order]',
                    attrName:'data-module-thedraw-order',
                    moduleName:'module_thedraw_order',
                    handler:{context:this, method:Method.moduleInit}
                });
            }
        }
    });
})(Core);