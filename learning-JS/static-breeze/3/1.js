(function(Core){
	var Personalize = function () {
        'use strict';

        var $this, 
            args,
            endPoint;

		var setting = {
		    selector:'[data-component-personalize]'
		}

        var Closure = function(){}

		Closure.prototype.setting = function () {
			var opt = Array.prototype.slice.call(arguments).pop();
			$.extend(setting, opt);
			return this;
		}

		Closure.prototype.init = function () {
			var _self = this;

			args = arguments[0]; 
            $this = $(setting.selector);
            

            // 하드코딩 영역(DOM)에 상품 정보 바인딩하기
            // /kr/ko_kr 경로 테스트 서버마다 다를 수 있음
            $this.find('[data-personalize]').each(function (i, ele) {
                var _program = $this.closest('.data-component-program-area')
                var _personalize = $(ele).data('personalize')
                
                // 상품 가격 
                $('[data-product-price-' + (i + 1) + ']')
                .text(_program.find('[data-id="' + (i + 1) + '"]').text());
                
                // 상품 타이틀 
                $('[data-product-title-' + (i + 1) + ']')
                .text(_personalize.name);
                
                // 상품 서브 타이틀 
                $('[data-product-subtitle-' + (i + 1) + ']')
                .text(_personalize.subtitle);
                
                // 상품 URL 
                $('[data-product-url-' + (i + 1) + ']')
                .attr('href', '/kr/ko_kr' + _personalize.url);

                // 상품 대표 이미지 
                $('[data-product-img-' + (i + 1) + ']')
                .attr('src', '/kr/ko_kr' + _personalize.img);
            })


            endPoint = Core.getComponents('component_endpoint');

			return this;
        }
        
        Core.Observer.applyObserver(Closure);
		return new Closure();
    }
        
	Core.Components['component_personalize'] = {
        constructor: Personalize,
        reInit: true,
		attrName: 'data-component-personalize'
	}
})(Core);