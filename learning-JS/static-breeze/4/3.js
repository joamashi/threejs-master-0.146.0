(function(Core){
	var customModal = function(){
		'use strict';

		var $this, args, endPoint;
		var setting = {
			selector:'[data-component-custommodal]',
			activeClass:'active'
		}
		var customModal = $('[data-product-customuse]');
		setTimeout(function() {
		  customModal.find('#patch').addClass('active');
		}, 500);

		/* Adobe Script click-name nopatch 로 변경 */
		$('[data-product-customuse]').find('.input-radio').each(function(i){
			var customuseVal = $(this).find('[data-value]').data('value');
			if(customuseVal === '000000'){
				$(this).find('[data-value]').prev('label').attr('data-click-name', 'nopatch');
			}
		});

		var widthMatch = matchMedia("all and (max-width: 992px)");
		if (Core.Utils.mobileChk || widthMatch.matches) {
			var index = customModal.find('#patch>.customSelection>.input-radio').index();
			customModal.find('#patch>.customSelection').css('width', 156*index);
			$('body').addClass('scrollOff').on('scroll touchmove mousewheel', function(e){
				 e.preventDefault();
			});
		}
		var customViewswiper = new Swiper('#customView-swiper-container', {
			observer: true,
			observeParents: true,
			slidesPerView : 1,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			navigation: {
        nextEl: '.brz-swiper-next',
        prevEl: '.brz-swiper-prev',
      },
		});


		var customVal = '';
		var imgArray = $('label[name="customCodeModal"]');
		imgArray.each(function(index) {
			customVal = $(this).find('img').attr('customVal');
			$(this).find('.customName').text(customVal);
		});

		var Closure = function(){}
		Closure.prototype = {
			setting:function(){
				return this;
			},
			init:function(){
				$this = $(setting.selector);
				$this.removeClass('uk-modal-close');

				/* pop modal */
				$this.click(function(e){
					e.preventDefault();
					//custom 값 없는 경우 메세지 처리
					var customKey;
					var customArray = $('input[name="customArray"]');
					for(var i=0; i<customArray.size(); i++){
						var customCode = customArray[i]['value'];
						if(i===2){
							customKey = customCode;
						}
					}
					//custom명 전달
					var customVal = '';
					var imgArray = $('label[name="customCodeModal"]');
					for(var i=0; i<imgArray.size(); i++){
						if( imgArray.eq(i).hasClass('selected') ){
							customVal = imgArray.eq(i).find('img').attr('customVal');
						}
					}
					//팝업창 선택완료 시 처리
					$('body').removeClass('scrollOff').off('scroll touchmove mousewheel');
					var cdnUrl = $('[data-cdnurl]').data('cdnurl');
					var customUrl = cdnUrl + '/cmsstatic/'+customVal+'.png';
					var customCheckArray = $('#customCheck').find('.input-radio');
					var checkAdd = 'N';
					for(var i=0; i<customCheckArray.size(); i++){
					    var curDataValue = customCheckArray.eq(i);
						var dataValue = curDataValue.find('input').attr('data-value');
						//선택추가
						if(checkAdd === 'N'){
							var length = customModal.find('#patch>.customSelection>.input-radio.checked').length;
							if(length > 0){
								if(customKey === dataValue || dataValue === undefined || dataValue === ''){
									$('#customCheck').find('.input-radio').removeClass('checked').find('label').removeClass('selected');
									curDataValue.parents('.size-grid-type').find('.customOption').show();
									curDataValue.show();
									curDataValue.find('label span img').attr('src', customUrl);
									curDataValue.find('input').attr('data-value', customKey);
									curDataValue.find('.customName').text(customVal);
									curDataValue.find('img').attr('customVal',customVal);
									curDataValue.find('img').attr('customKey',customKey);
									curDataValue.addClass('checked');
									curDataValue.find('label').addClass('selected');
									checkAdd = 'Y';
	               }
							}
						}
					}
					$this.addClass('uk-modal-close');
				});
				return this;
			}
		}
		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_custommodal'] = {
		constructor:customModal,
		reInit:true,
		attrName:'data-component-custommodal'
	}
})(Core);