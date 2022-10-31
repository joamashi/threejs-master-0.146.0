(function(Core){
    Core.register('module_kakao_in_app', function (sandbox) {
        var $this;

        var Method = {
            moduleInit: function () {
                $this = $(this);    
            },
            submitFormKakao: function (redirectUrl){
                var $form = $this.find('form[name="social_kakao_in_app"]');
                var url = sandbox.utils.url.getUri(sandbox.utils.url.getCurrentUrl());
                /*
                var locationHref = redirectUrl || url.path.replace(sandbox.utils.contextPath, '') + url.query;
                */
                var locationHref = redirectUrl || window.location.href;
                
                // 현재 url param에 successUrl 정보가 있으면 그쪽으로 이동
                if (_.isEmpty(redirectUrl) && !_.isEmpty(url.queryParams.successUrl)) {
                    locationHref = url.queryParams.successUrl;
                }
                if ( locationHref.indexOf( 'http' ) == -1){
                    locationHref = url.protocol + '//' + url.host + sandbox.utils.contextPath + locationHref;
                }
                if ($form) {
                    $form.append('<input type="hidden" name="state" value="' + locationHref.replace(/&/g, '%26') + '" />');
                    $form.submit();
                }
            }
        }

        return {
            init: function () {
                sandbox.uiInit({
                    selector: '[data-module-kakao-in-app]',
                    attrName: 'data-module-kakao-in-app',
                    moduleName: 'module_kakao_in_app',
                    handler: { context: this, method: Method.moduleInit }
                });
            },
            submit: function( redirectUrl ){
                Method.submitFormKakao(redirectUrl);
            }
        }
    });

})(Core);