(function(Core){
	Core.register('module_personalize_switcher', function(sandbox){
		var $this;
		var Method = {

			moduleInit:function(){
				var $this = $(this);

				
				var list = [];

				$this.find('> div').each(function (i, ele) {

					// 개인화 다이나믹 탭메뉴 중 상품이 없는 메뉴는 삭제
					if ($(ele).find('.compoment-dynamic article').hasClass('items-null')) {

						console.log($(ele))

						$(ele)
							.css('display','none')
							.closest('.tab-container-swper')
							.prev('.tab-title-container-swper')
							.find('.uk-display-inline-block li')
							.eq(i)
							.css('display','none')
					}
					
					list.push($(ele).find('.compoment-dynamic article').hasClass('items-null'));
				})

				// 개인화 탭메뉴 중 상품이 전체 없을 때 타이틀 삭제
				if ( _.uniqBy(list, true)[0] ) {

					console.log(_.uniqBy(list, true)[0])
					
				    $this
				        .prev('.tab-title-container-swper')
				        .remove();
				}
			}
		}
		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-personalize-switcher]',
					attrName:'data-module-personalize-switcher',
					moduleName:'module_personalize_switcher',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);