(function(Core){
	var FilterCategory = function(){
		'use strict';
		var setting = {
			selector:'[data-component-filtercategory]',
			attrName:'data-component-filtercategory',
		}
		var opt, $this;
		var displayLiCnt=6;

		var Closure = function(){}
		Closure.prototype = {
			setting:function(){
				var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
			},
			init:function(){
				var _self = this;
				opt = arguments[0]||{};
				$this = $(setting.selector);
				//리스트 숨김 처리
				if($this.find('.contents-side #two-depth-shoes').length > 0){
					var listLen = 0, hideMore, currentIndex;
					$this.find('#two-depth-shoes a').each(function(index){
						//현재 선택한 메뉴가 몇번째 메뉴인지 확인
						if($(this).attr('href')===opt.url){
							currentIndex = index;
						}
						listLen++;
					});

					if(displayLiCnt > listLen){
						//전체 리스트 개수가 6이하 이면 '더보기' 숨김. 리스트 모두 표시
						$this.find('#more').hide();
					} else {
						if(displayLiCnt > currentIndex){
							//현재 선택한 메뉴의 인덱스가 6미만이면 '더보기'표시 하고 인덱스 6부터는 리스트 숨김
							$this.find('#more').show();
							$this.find('#two-depth-shoes a').each(function(index){
								if(index >= displayLiCnt){
									$(this).hide();
								}
							});
						} else if(currentIndex >= displayLiCnt){
							//현재 선택한 메뉴의 인덱스가 6이상이면 '더보기' 숨기고 리스트를 모두 표시함
							$this.find('#more').hide();
						}
					}
				}

				//아이폰 에서 필터를 오픈후, 페이지 이동후 백 할경우 필터가 오픈되는 현상
				//카테고리 페이지 진입시 팔터를 일단 감춘다.
				if(!Core.Utils.mobileChk==false){
					$(".contents-side").hide();
					//console.log("aaaaa");
				}

				//더보기 누르면 리스트 모두 표시
				$this.find('#more').on('click', function(){
					$this.find('#more').hide();
					$this.find('#two-depth-shoes a').each(function(index){
						$(this).show();
					});
				});
				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_filtercategory'] = {
		constructor:FilterCategory,
		attrName:'data-component-filtercategory',
		reInit:true
	}
})(Core);