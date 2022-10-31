(function(Core){
	'use strict';
	Core.register('module_account_writelist', function(sandbox){
		var $this, modal, args;
		var Method = {
			moduleInit:function(){
				//main이고 리뷰쓸 상품이 있을경우
				var mainReviewOpenIS = false;
				var currentStarCount = null;

				args = arguments[0];
				$this = $(this);
				modal = UIkit.modal('#common-modal-large');
				modal.on({
					'show.uk.modal':function(){
						//console.log("Modal is visible.");
					},

					'hide.uk.modal':function(){
						$this.find('.contents').empty();
						$(currentStarCount).removeClass('active').siblings().removeClass('active');
					}
				});

				$this.on('click', '.btn-delete', function(e){
					e.preventDefault();

					if(mainReviewOpenIS){
						$this.find('.review-summary-group').fadeOut();
						$this.find('.review-write-wrap').stop().animate({width:375, height:190}, 300, function(){
							mainReviewOpenIS = false;
							$this.find('.review-main-msg').fadeIn();
							$('html').removeClass('uk-modal-page');
						});
					}else{
						$(args.target).remove();
					}
				});
				$this.on('click', '.review-open', function(e){
					e.preventDefault();

					$this.find('.review-main-msg').fadeOut();
					$this.find('.review-write-wrap').stop().animate({width:400, height:500}, 300, function(){
						mainReviewOpenIS = true;
						$this.find('.review-summary-group').fadeIn();
						$('html').addClass('uk-modal-page');
					});
				});

				//account reviewWrite rating-star count
				$this.find('.rating-star').each(function(i){
					var $this = $(this);
					$this.find('a').click(function(e) {
						e.preventDefault();

						var index = $(this).index() + 1;
						var target = $(this).parent().attr('data-target');
						var productId = $(this).parent().attr('data-productid');
						var orderItemId = $(this).parent().attr('data-orderitemid')

						$(this).parent().children('a').removeClass('active');
						$(this).addClass('active').prevAll('a').addClass('active');

						currentStarCount = this;
						Method.reviewTask(target, productId, orderItemId, index);
					});
				});
			},
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
			},
			reviewProcessorController:function(){
				var arrData = [];
				var obj = {
					'mode':'template',
					'templatePath':'/modules/myReviewWriteList',
					'resultVar':'review',
					'reviewType':'writeList',
					'_sort':'id',
					'_type_sort':'desc',
					'reviewLocation':'account'
				}

				sandbox.utils.ajax(args.api, 'GET', obj, function(data){
					$(args.target).empty().append(data.responseText);
					sandbox.moduleEventInjection(data.responseText);
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-account-writelist]',
					attrName:'data-module-account-writelist',
					moduleName:'module_account_writelist',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);