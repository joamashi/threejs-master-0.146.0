(function(Core){
    'use strict';

    Core.register('module_address_change', function(sandbox){
        var $this, args, modal = null, endPoint;
        var Method = {
            moduleInit:function(){
                // modal layer UIkit 사용
                $this = $(this);

                // modal layer UIkit 사용
                $this = $(this);
                args = arguments[0];
                modal = UIkit.modal('#order_change_addresses');
                endPoint = Core.getComponents('component_endpoint');

               $this.on('click', '#data-address-change', function(e){
                    e.preventDefault();
                   modal.show();
                    //Method.modalInit('/kr/ko_kr/account/addresses');
                });
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
                    selector:'[data-module-address-change]',
                    attrName:'data-module-address-change',
                    moduleName:'module_address_change',
                    handler:{context:this, method:Method.moduleInit}
                });
            }
        }
    });
})(Core);