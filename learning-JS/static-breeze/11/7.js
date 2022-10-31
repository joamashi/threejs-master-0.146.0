(function(Core){
	'use strict';

	Core.register('module_inquiry', function(sandbox){
		var $appendListWrap = null;
		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var args = arguments[0];

				var $appendListWrap = $this.find('[data-scrollarea]');
				var $scrollArea = $this.find(args['data-module-inquiry'].target);
				var $textField = $this.find('[data-component-textfield]');

				var currentPage = args['data-module-inquiry'].currentPage;
				var listPerPage = args['data-module-inquiry'].pageSize;
				var totalCount = args['data-module-inquiry'].totalCount;
				var totalPageCount = Math.ceil(totalCount / (listPerPage * currentPage));
				var ajaxIS = true;
				var subInquiryJson = args['data-sub-inquiry'];
				var arrSelectBox = [];
				var modal = UIkit.modal('#common-modal');
				var isOrderInquery = false;
				var objOrderData = {};

				var textComponent = sandbox.getComponents('component_textfield', {context:$this}, function(){
					this.addEvent('focusout', function(){
						var value = $(this).val();
						$this.find('#title').val(value);
						$this.find('#detail').val(value);
						objOrderData.value = value;

						if(isOrderInquery){
							$this.find('#detail').val(Handlebars.compile($('#inquery-order-list').html())(objOrderData));
						}
					});
				});

				var selectComponent = sandbox.getComponents('component_select', {context:$this}, function(i){
					var INDEX = i;
					arrSelectBox.push(this);
					this.addEvent('change', function(val){

						if(INDEX === 0){
							isOrderInquery = false;

							for(var key in subInquiryJson){
								if(key === val){
									var obj = {};
									obj.name = 'subInquiryType';
									obj.option = subInquiryJson[key];
									arrSelectBox[1].replaceSelectBox(Handlebars.compile($(args['data-module-inquiry'].template).html())(obj));
									break;
								}
							}


							/* 세금계산서문의 배송문의, 상품문의, A/S, 반품 취소 문의 일떼 자신이 주문한 상품 (orderItemList) 리스트를 불러온다. */
							if(val === 'BILL' || val === 'DELIVERY' || val === 'PRODUCT' || val === 'AS' || val === 'RETRUNCANCEL'){

								UIkit.modal.confirm("상품을 선택하시면 빠른 문의가 가능합니다.<br/>상품을 선택하시겠어요?", function(){
									var obj = {
										'mode':'template',
										'resultVar':'orderList',
										'proceedOrderList':''
									}

									switch(val){
										case 'PRODUCT' :
											obj.templatePath = '/account/partials/productItemListInquiry';
											obj.needWishList = 'Y';
											break;
										default :
											obj.templatePath = '/account/partials/orderItemListInquiry';
											obj.needOrderList = 'Y';
											break;
									}

									sandbox.utils.ajax('/processor/execute/customer_info', 'GET', obj, function(data){
										$('#common-modal').find('.contents').empty().append(data.responseText);
										modal.show();
									});
								});
							}
						}

					});
				});

				var scrollArea = sandbox.scrollController('[data-scrollarea]', $scrollArea[0], function(percent){
					if(totalPageCount > currentPage){
						if(ajaxIS && percent == 0){
							ajaxIS = false;
							currentPage++;

							var obj = {
								'page':currentPage,
								'mode':'template',
								'templatePath':'/account/partials/inquiryList',
								'resultVar':'inquiryDto'
							}

							sandbox.utils.ajax('/processor/execute/inquiry', 'GET', obj, function(data){
								ajaxIS = true;
								var $listFirst = $scrollArea.children().eq(0);
								$listFirst.after(data.responseText);
								scrollArea.setScrollTop($listFirst.offset().top);
							});
						}
					}else{
						/*console.log('문의하신 글 목록이 없습니다.');
						console.log('totalCount : '+totalCount+', listPerPage : '+listPerPage);*/
						scrollArea.destroy();
					}
				}, 'inquiry').setScrollTop($scrollArea.height());

				$this.find('.submit-btn').click(function(e){
					if(!selectComponent[0].getValidateChk() || !selectComponent[1].getValidateChk() || !textComponent.getValidateChk()) {
						e.preventDefault();
					}
				});

				/* common-modal orderList btn */
				$('#common-modal').find('.contents').on('click', 'a', function(e){
					var $this = $(this);
					isOrderInquery = true;
					objOrderData = {};

					if($this.attr('data-order-type') === 'products'){
						objOrderData.isInquery = false;
						objOrderData.name = $this.attr('data-order-name');
					}else if($this.attr('data-order-type') === 'orders'){
						objOrderData.isInquery = true;
					}

					objOrderData.orderId = $(this).attr('data-order-id');
					textComponent.focus();
					modal.hide();
				});

				$('#common-modal').find('.contents').on('mouseenter', 'a', function(e){
					$(this).addClass('active').siblings().removeClass('active');
				});


				/* 모바일 일때 푸터 없는 페이지 처리 */
				$('footer').addClass('no-footer');
				$(window).resize(function(){
					if($(window).width() <= 753 && !$('html').hasClass('uk-modal-page')){
						$('html').addClass('uk-modal-page');
						$appendListWrap.css('height', $(window).height() - ($('header').height() + 196));
					}else if($(window).width() > 753 && $('html').hasClass('uk-modal-page')){
						$('html').removeClass('uk-modal-page');
						$appendListWrap.removeAttr('style');
					}
				});
				$(window).trigger('resize');
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-inquiry]',
					attrName:['data-module-inquiry', 'data-sub-inquiry'],
					moduleName:'module_inquiry',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);