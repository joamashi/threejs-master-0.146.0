(function(Core){
    'use strict';
    Core.register('module_global_banner', function (sandbox) {
        var $this, expireTime, cookieName;
        var Method = {
            moduleInit: function (){
                $this = $(this);

                if ($this.find('[data-module-slick-slider]').length == 0) {
                    $this.remove();
                    return;
                }

                var args = Array.prototype.slice.call(arguments).pop();
                cookieName = 'CLOSE_GLOBAL_BANNER';
                expireTime = args.expireTime || null;
                $this.find('[data-btn-banner-close]').on('click', Method.close);
                
                if ($.cookie(cookieName) != 'Y') {
                    Method.show();
                }
            },
            show: function(){
                $this.show();
            },
            close: function (e){
                e.preventDefault();
                if (expireTime != null) {
                    var date = new Date();
                    date.setTime(date.getTime() + (expireTime * 3600 * 1000));
                    $.cookie(cookieName, 'Y', { expires: date });
                }
                $this.remove();
            }
        }

        return {
            init: function () {
                sandbox.uiInit({
                    selector: '[data-module-global-banner]',
                    attrName: 'data-module-global-banner',
                    moduleName: 'module_global_banner',
                    handler: { context: this, method: Method.moduleInit }
                });
            }
        }
    });
})(Core);