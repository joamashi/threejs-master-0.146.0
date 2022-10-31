(function(Core){
	Core.register('module_swiperslide', function(sandbox){
		var $this, pc_slid_itemlist_cnt, mo_slid_itemlist_cnt;
		var Method = {

			moduleInit:function(){
				var $this = $(this);

				var md = new MobileDetect(window.navigator.userAgent);

				//슬라이딩 item 리스트 갯수를 가져온다.
				var pc_slid_itemlist_cnt = Number($this.find('[data-PC-slidlistcnt]').attr('data-PC-slidlistcnt'));
				var mo_slid_itemlist_cnt = Number($this.find('[data-MO-slidlistcnt]').attr('data-MO-slidlistcnt'));

				if (md.mobile()) {  // 모바일 일경우....
				    var crossSaleswiper = new Swiper('#Related-swiper-container', {
				        slidesPerView: 'auto',
						slidesPerView: mo_slid_itemlist_cnt,
				        slidesPerGroup: mo_slid_itemlist_cnt,
				        pagination: {
				            el: '.swiper-pagination',
				            //clickable: true,
						  	type: 'progressbar',
				        },
								navigation: {
								nextEl: '.swiper-button-next',
								prevEl: '.swiper-button-prev',
							    },
				    });
				} else {
				    var crossSaleswiper = new Swiper('#Related-swiper-container', {
				        slidesPerView: pc_slid_itemlist_cnt,
				        slidesPerGroup: pc_slid_itemlist_cnt,
				        pagination: {
				            el: '.swiper-pagination',
				            clickable: true,
				        },
				    });
				}




			}
		}
		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-swiperslide]',
					attrName:'data-module-swiperslide',
					moduleName:'module_swiperslide',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);