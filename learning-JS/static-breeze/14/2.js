(function(Core){
	Core.register('module_reviewpage', function(sandbox){
		var $this, modal, args;
		var Method = {

			moduleInit:function(){
				var $this = $(this);
					modal = UIkit.modal('#common-modal-large');

				//나의 상품 리뷰 쓰기  슬라이딩 셋팅
				var md = new MobileDetect(window.navigator.userAgent);

				if (md.mobile()) {  // 모바일 일경우....
				    var crossSaleswiper = new Swiper('#crossSale-swiper-container', {
				        slidesPerView: 'auto',
						slidesPerView: 1,
				        slidesPerGroup: 1,
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
				    var crossSaleswiper = new Swiper('#crossSale-swiper-container', {
				        slidesPerView: 4,
				        slidesPerGroup: 4,
				        pagination: {
				            el: '.swiper-pagination',
				            clickable: true,
				        },
				    });
				}


				//리뷰 작성
               	$this.find("button[id='data-write-btn']").on('click', function(e){
					var index = 0;  //평점 기본 셋팅...
					var target = $(this).attr('data-target');
					var productId = $(this).attr('data-productid');
					var orderItemId = $(this).attr('data-orderitemid')

					Method.reviewTask(target, productId, orderItemId, index);  //리류작성 모달

                });



			},
			//리류작성 모달..
			reviewTask:function(target, productId, orderItemId, startCount){
				var defer = $.Deferred();

				sandbox.utils.promise({
					url:sandbox.utils.contextPath + '/review/reviewWriteCheck',
					type:'GET',
					data:{'productId':productId, 'orderItemId':orderItemId}
				}).then(function(data){
					//data.expect 기대평
					//data.review 구매평
					if(data.expect || data.review){
						return sandbox.utils.promise({
							url:sandbox.utils.contextPath + '/review/write',
							type:'GET',
							data:{'productId':productId, 'redirectUrl':location.pathname, 'startCount':startCount, 'isPurchased':data.review, 'orderItemId':orderItemId}
						});
					}else{
						$.Deferred().reject('리뷰를 작성할 수 없습니다.');
					}

				}).then(function(data){
					modal.show();

					$(target).addClass('review-write');
					$(target).find('.contents').empty().append(data);
					sandbox.moduleEventInjection(data, defer);

					return defer.promise();
				}).then(function(data){
					Method.reviewProcessorController();
					modal.hide();
				}).fail(function(msg){
					//console.log('write fail');
					defer = null;
					UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'danger'});
				});
			}
		}
		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-reviewpage]',
					attrName:'data-module-reviewpage',
					moduleName:'module_reviewpage',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);