(function(Core){
	Core.register('module_product', function(sandbox){
		var currentFirstOptValue = '';
		var currentQuantity = 1;
		var itemAttributes = '';
		var miniOptionIS = false;
		var objProductOption = {};
		var minOffsetTop = 30;
		var maxOffsetTop = 0;
		var args = null;
		var $this;
		var imgCurrentIndex;
		var categoryId = '';
		var productId = '';
		var skuId = '';
		var isQuickView = false;
		var isQuantity = true;
		var productOption;
		var quantity;
		var endPoint;
		var privateId;
		var currentSkuData;
		var pickupModal;
		var itemRequest;

		var $optionWrap;
		var $galleryWrap;
		var $productDetailWrap;
		var optionWrapOffsetTop;
		var previousScrollTop = 0;
		var $descriptionWrap;
		var longDescription;

		var isSkuLoadComplete = false;

		var quantityCheck = function(inventoryType, maxQty){
			var obj = {isQuantity:false, maxQty:0};
			if(inventoryType !== 'UNAVAILABLE'){
				if(inventoryType === 'CHECK_QUANTITY'){
					obj.isQuantity = (maxQty > 0) ? true : false;
					obj.maxQty = maxQty;
				}else if(inventoryType === 'ALWAYS_AVAILABLE' || inventoryType === null){
					obj.isQuantity = true;
					obj.maxQty = null;
				}
			}else{
				obj.isQuantity = false;
				obj.maxQty = 0;
			}
			return obj;
		}

		var defaultSkuSetup = function(productOptComponents){
			var skuData, quantityState;
			if(!productOptComponents) return;
			if(quantity){
				if(Array.isArray(productOptComponents)){
					$.each(productOptComponents, function(i){
						skuData = this.getDefaultSkuData()[0];
						quantityState = quantityCheck(skuData.inventoryType, skuData.quantity);
						quantity[i].setMaxQuantity(quantityState.maxQty);
						isQuantity = quantityState.isQuantity;
					});
				}else{
					skuData = productOptComponents.getDefaultSkuData()[0];
					quantityState = quantityCheck(skuData.inventoryType, skuData.quantity);
					quantity.setMaxQuantity(quantityState.maxQty);
					isQuantity = quantityState.isQuantity;
				}
			}
		}

		var Method = {
			moduleInit:function(){
				$this = $(this);
				args = arguments[0];
				categoryId = sandbox.utils.getQueryParams(location.href).categoryid;
				productId = args.productId;
				privateId = args.privateId;
				endPoint = Core.getComponents('component_endpoint');

				// nike 입고 알림 팝업 띄우기
				var isReservation = sandbox.utils.getQueryParams(location.href).hasOwnProperty('restock');
				if(isReservation){
					setTimeout(function(){
						$('.stocked-wrap').find('a[href="#restock-notification"]').trigger('click');
					}, 300);
				}

				var $dim = $('[data-miniOptionDim]');
				var guideModal = UIkit.modal('#guide', {modal:false});
				var commonModal = UIkit.modal('#reservation-modal', {modal:false});
				var miniCartModule = sandbox.getModule('module_minicart');
				var gallery = sandbox.getComponents('component_gallery', {context:$this});
				var $infoHeightWrap = $('[data-info-height]');
				//var customModal = UIkit.modal('#custom-modal', {modal:false}); /* CUSTOM 삭제 */

				$productDetailWrap = $(".product-detail_wrap");
				$galleryWrap = $this.find('.product-gallery-wrap');
				$optionWrap = $this.find('.product-option-container');
				optionWrapOffsetTop = ($optionWrap.length > 0) ? $optionWrap.offset().top : 0;

				var addonProductGroup = {};
				var addonComponents = sandbox.getComponents('component_addon_product_option', {context:$(document)}, function(i){
					var INDEX = 0;
					var key = this.getAddonId();

					if(!addonProductGroup.hasOwnProperty(key)){
						addonProductGroup[key] = [];
						INDEX = 0;
					}else{
						INDEX++;
					}
					addonProductGroup[key].push(this);

					this.addEvent('addToAddOnItem', function(){
						var privateId = arguments[0];
						for(var i=0; i<addonProductGroup[key].length; i++){
							if(i != INDEX){
								addonProductGroup[key][i].setTrigger(privateId);
							}
						}
					});
				});

				quantity = sandbox.getComponents('component_quantity', {context:$(document)}, function(i){
					var INDEX = i;
					this.addEvent('change', function(qty){
						for(var i=0;i<quantity.length;i++){
							if(i !== INDEX){
								quantity[i].setQuantity(qty);
							}
						}
					});
				});


				var currentOptValueId = '';
				productOption = sandbox.getComponents('component_product_option', {context:$(document)}, function(i){ //product Option select components
					var CURRENT_INDEX = i;
					var INDEX = 0;
					var _self = this;
					var key = this.getProductId();


					if(!objProductOption.hasOwnProperty(key)){
						objProductOption[key] = [];
						INDEX = 0;
					}else{
						INDEX++;
					}

					objProductOption[key].push(this);

					this.addEvent('changeFirstOpt', function(firstOptName, optionName, productId, value, valueId, id){
						if(currentOptValueId != valueId){
							currentOptValueId = valueId;

							for(var i=0; i<objProductOption[productId].length; i++){
								if(i != INDEX){
									skuId = '';
									objProductOption[productId][i].setTrigger(optionName, value, valueId);
								}

								if(optionName !== 'COLOR'){
									objProductOption[productId][i].getValidateChk();
								}
							}

							if(optionName === 'COLOR'){
								gallery.setThumb(value);
							}
						}

					});

					this.addEvent('skuComplete', function(skuOpt){
						currentSkuData = skuOpt
						if(quantity){
							var quantityState = quantityCheck(skuOpt.inventoryType, skuOpt.maxQty);
							isQuantity = quantityState.isQuantity;
							skuId = skuOpt.id;

							if(args.isDefaultSku !== 'true'){
								if(Array.isArray(quantity)){
									//quantity[CURRENT_INDEX].setQuantity(1); //cart modify인 경우 수량 초기화 안함
									quantity[CURRENT_INDEX].setMaxQuantity(quantityState.maxQty);
								}else{
									//quantity.setQuantity(1); //cart modify인 경우 수량 초기화 안함
									quantity.setMaxQuantity(quantityState.maxQty);
								}
							}
						}
					});

					this.addEvent('skuLoadComplete', function(skuData){
						//nike 또는 상품의 재고를 비동기로 처리한경우 사용
						isSkuLoadComplete = true;

						/* isDefaultSku - true  ( option이 없는 경우 )  */
						if(args.isDefaultSku === 'true') defaultSkuSetup(productOption);
					});
				});

				/* 매장예약 */
				$('.reservation-btn').click(function(e){
					e.preventDefault();

					if(isSkuLoadComplete){
						Core.Utils.ajax(location.href, 'GET', {
							reservationview:true,
							size:$("input[name=SIZE]:checked").val()
						}, function (data) {
							var domObject = $(data.responseText).find('#reservation-wrap');
							$('#reservation-modal').find('.contents').empty().append(domObject[0].outerHTML);
							Core.moduleEventInjection(domObject[0].outerHTML);
							commonModal.show();
						});
					}
				});

				// 당일배송 자세히보기 버튼
				$this.find('[data-btn-samedaymodal]').click(function(e){
					e.preventDefault();
					Core.ui.modal.open('#detail-sameday', {modal: false, center:false});
					/*
					$('#detail-sameday').find('.uk-close').click(function(e){
						e.preventDefault();
						$('#detail-sameday').css({'display' : '', 'overflow-y' : ''}).removeClass('uk-open');
						$('html').removeClass('uk-modal-page');
					});
					return false;
					*/
				});

				/* CUSTOM 삭제 */

				/* cart Update */
				/* 스티키 모바일 디바이스 쿠키 테스트용 (Staging Only). */
				/*
					$('.flag-sameday').eq(0).html($.cookie('AMCV_F0935E09512D2C270A490D4D@AdobeOrg'))
					document.oncontextmenu=function(){return true;} // 우클릭 허용
					document.onselectstart=function(){return true;} // 드래그 허용
				/* --------------------------------------*/

				//@pck 2020-10-22 sticky v2 적용에 따라 사용하지 않음 (삭제예정)
				/*
				// ^ 팝업 아이콘 toggle
				function updown_turn(){
						$("#pdp_optionsize_updown").toggleClass('uk-active');
						$(".box_popupdown").toggleClass('uk-active');
				}

				// ^ 팝업 아이콘 클릭 이벤트
				$("#pdp_optionsize_updown").click(function(){
                 	$("#pdp_optionsize_sticky").toggle();
					updown_turn();
				});
				*/

				$('[data-add-item]').each(function(i){
					var INDEX = i;
					// wishlist는 동작하지 않도록 제외
					// .sticky_notifyme 모바일 스티키 입고알림 버튼..
					$(this).find('.btn-link:not(".wish-btn")').click(function(e){
						//@pck 2020-10-22 sticky v2 적용에 따라 사용하지 않음  (삭제예정)
						//sticky  장바구니, 바로구매, 패치 버튼 클릭시 상품 업션 sticky 팝업 기능.
						//스티키 #btn_sticky_notifyme 입고알림 버튼..
						/*
						if(	($("#pdp_optionsize_sticky").css('display')=='none') && (!Core.Utils.mobileChk==false)){
							if($(this)[0].hasAttribute("data-not-show-sticky")==false){
								$("#pdp_optionsize_sticky").toggle();
								updown_turn();
								return false;
							}
						}
						*/
						e.preventDefault();
						var _self = $(this);
						var addToCartPromise = Method.moduleValidate(INDEX);
						// THE DRAW Start
						var actionType = _self.attr('action-type');

						if(actionType === 'drawentry'){
							return;
						}else if(actionType === 'drawlogin'){
							Core.Loading.show();
							return;
						}else if(actionType === 'certified'){
							var certificationYnModal = UIkit.modal('#certification-yn-modal', {center:true, bgclose:false, keyboard:false});
							var redirectUrl = $(location).attr('href');
							$.cookie("thedrawCertified", 'thedraw', {expires: 1, path : '/'});
							$.cookie("thedrawRedirectUrl", redirectUrl, {expires: 1, path : '/'});
							certificationYnModal.show();
							return;
						}
						// THE DRAW End

						addToCartPromise.then(function(qty){
							var $form = _self.closest('form');
							itemRequest = BLC.serializeObject($form);
							itemRequest['productId'] = productId;
							itemRequest['quantity'] = qty;

							/* 애드온 상품 추가 */
							var $deferred = $.Deferred();
							var addonProductIndex = 0;
							if(addonComponents){
								for(var key in addonProductGroup){
									if(addonProductGroup[key][0].getValidateChk()){
										var childItems = addonProductGroup[key][0].getChildAddToCartItems();
									    for(var i=0; i<childItems.length; i++){
									        for(var key in childItems[i]){
												itemRequest['childAddToCartItems['+addonProductIndex+'].'+key] = childItems[i][key];
									        }
									    }
										addonProductIndex++;
									}else{
										$deferred.reject();
									}
								}

							}

							$deferred.resolve(itemRequest);
							return $deferred.promise();
						}).then(function(itemRequest){
							var $form = _self.closest('form');
							var actionType = _self.attr('action-type');
							var url = _self.attr('href');

							/*****************************************************************
								유입 channel sessionStorage
								 - channel : 유입된 매체 식별 이름
								 - pid : 상품 식별 code ( productId, style Code, UPC.... )

								사이트 진입시 URL에 channel, pid 가 있을때 매출을 체크 한다.
								channel 만 있을경우에는 모든 상품을 channel 매출로 인지하고
								channel과 pid 둘다 있을경우 해당 상품만 channel 매출로 인지한다.
							*****************************************************************/

							if(sandbox.sessionHistory.getHistory('channel')){
								if(sandbox.sessionHistory.getHistory('pid')){
									if(sandbox.sessionHistory.getHistory('pid') === privateId){
										itemRequest['itemAttributes[channel]'] = sandbox.sessionHistory.getHistory('channel');
									}
								}else{
									itemRequest['itemAttributes[channel]'] = sandbox.sessionHistory.getHistory('channel');
								}
							}

							/* CUSTOM _customproduct.js 기능 이동 */
							Core.Utils.customProduct.addItemRequest(itemRequest);

							Core.Loading.show();
							switch(actionType){
								case 'externalLink' :
									//외부링크
									window.location.href = url;
									break;
								case 'custombuy' :
									Core.Loading.hide();
									var customVal = Core.Utils.customProduct.getCustomBuyVal();
									if(customVal != null && customVal != 'undefined'){
										UIkit.modal.confirm('고객님께서 선택하신 커스텀 서비스는 "'+ customVal +'"입니다.', function(){
											Core.Loading.show();
											BLC.ajax({
												url:url,
												type:"POST",
												dataType:"json",
												data:itemRequest,
												error: function(data){
													Core.Loading.hide();
													UIkit.modal.alert('접속자가 많아 지연되고 있습니다. 다시 시도해주세요.');
													//BLC.defaultErrorHandler(data);
												}
											}, function(data, extraData){
												if(commonModal.active) commonModal.hide();
												if(data.error){
													Core.Loading.hide();
													UIkit.modal.alert(data.error);
													//UIkit.modal.alert('사이즈를 선택하세요.');
												}else {
													_.delay(function () {
														window.location.assign(sandbox.utils.contextPath + '/checkout');
													}, 500);
												}
											});
										}, function(){},
										{
											labels: {'Ok': '확인', 'Cancel': '취소'}
										});
									} else{
										UIkit.modal.confirm('고객님께서는 커스텀 서비스를 선택하지 않으셨습니다. 결제를 진행하시겠습니까?', function(){
											Core.Loading.show();
											BLC.ajax({
												url:url,
												type:"POST",
												dataType:"json",
												data:itemRequest,
												error: function(data){
													Core.Loading.hide();
													UIkit.modal.alert('접속자가 많아 지연되고 있습니다. 다시 시도해주세요.');
													//BLC.defaultErrorHandler(data);
												}
											}, function(data, extraData){
												if(commonModal.active) commonModal.hide();
												if(data.error){
													Core.Loading.hide();
													UIkit.modal.alert(data.error);
													//UIkit.modal.alert('사이즈를 선택하세요.');
												}else {
													_.delay(function () {
														window.location.assign(sandbox.utils.contextPath + '/checkout');
													}, 500);
												}
											});
										}, function(){},
										{
											labels: {'Ok': '확인', 'Cancel': '취소'}
										});
									}
									break;
								default :
									BLC.ajax({
										url:url,
										type:"POST",
										dataType:"json",
										data:itemRequest,
										error: function(data){
											Core.Loading.hide();
											UIkit.modal.alert('접속자가 많아 지연되고 있습니다. 다시 시도해주세요.');
											//BLC.defaultErrorHandler(data);
										}
									}, function(data, extraData){
										if(commonModal.active) commonModal.hide();
										if(data.error){
											Core.Loading.hide();
											UIkit.modal.alert(data.error);
											//UIkit.modal.alert('사이즈를 선택하세요.');
										}else{
											var cartData = $.extend( data, {productId : productId, quantity : itemRequest.quantity, skuId : skuId });
											if(actionType === 'add'){
												miniCartModule.update( function( callbackData ){
													if( callbackData != null ){
														cartData.cartId = callbackData.cartId

														$('#pdp_optionsize_updown').trigger('click');   //모바일 스티키 감추기.
													}
													endPoint.call('addToCart', cartData );


													//EMB productPrice 값 없을경우 예외처리 해야함
													var productCode = $optionWrap.find("[data-model]").data("model");
													var productPrice = $optionWrap.find("[data-price]").data("price");
													var productQuantity = $optionWrap.find("input[name=quantity]").val();
													var widthMatch = matchMedia("all and (max-width: 767px)");
													if (Core.Utils.mobileChk || widthMatch.matches) {
														var mobileChk = 2;
													} else {
														var mobileChk = 1;
													}
													cre('send','AddToCart',{
														id:productCode,
														price:parseInt(productPrice),
														quantity:parseInt(productQuantity),
														currency:'KW',
														event_number:mobileChk
													});
												});

											}else if(actionType === 'modify'){
												var url = Core.Utils.url.removeParamFromURL( Core.Utils.url.getCurrentUrl(), $(this).attr('name') );
												Core.Loading.show();
												endPoint.call( 'cartAddQuantity', cartData );
												_.delay(function(){
													window.location.assign( url );
												}, 500);
											}else if(actionType === 'redirect'){
												endPoint.call( 'buyNow', cartData );
												Core.Loading.show();
												if (_GLOBAL.DEVICE.IS_KAKAO_INAPP && !_GLOBAL.CUSTOMER.ISSIGNIN){
													sandbox.getModule('module_kakao_in_app').submit('/checkout');
												}else{
													_.delay(function(){
														window.location.assign( sandbox.utils.contextPath + '/checkout' );
													}, 500);
												}
											}else if(actionType === 'confirm'){
												Core.Loading.hide();
												// 개인화 작업 추가 confirm

												// 상단 장바구니 아이콘 수량 반영 외 미니카트는 안보이게 처리
												miniCartModule.update( function( callbackData ){
													return {'confirm': true};
												});

												// 개인화 추가. 장바구니 컴펌창 추가
												UIkit.modal.confirm('장바구니에 담겼습니다.', function(){
													_.delay(function(){
														window.location.assign( sandbox.utils.contextPath + '/cart' );
													}, 500);
												}, function(){
													UIkit.modal('#common-modal').hide()
												},
												{
													labels: { 'Ok': '장바구니 가기', 'Cancel': '계속 쇼핑하기' }
												});
											}
										}
									});
								break;
							}
						}).fail(function(msg){
							if(commonModal.active) commonModal.hide();
							if(msg !== '' && msg !== undefined){
								UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'warning'});
							}
						});
					});
				});


				//scrollController
				var scrollArea = sandbox.scrollController(window, document, function(percent){
					var maxOffsetTop = this.getScrollTop($('footer').offset().top);
					var maxHeight = this.setScrollPer(maxOffsetTop);

					if(percent < minOffsetTop && miniOptionIS){
						miniOptionIS = false;
						$('.mini-option-wrap').stop().animate({bottom:-81}, 200);
						$('.mini-option-wrap').find('.info-wrap_product_n').removeClass('active');
						$dim.removeClass('active');
					}else if(percent >= minOffsetTop && percent <= maxOffsetTop && !miniOptionIS){
						miniOptionIS = true;
						$('.mini-option-wrap').stop().animate({bottom:0}, 200);
					}else if(percent > maxOffsetTop && miniOptionIS){
						miniOptionIS = false;
						$('.mini-option-wrap').stop().animate({bottom:-81}, 200);
						$('.mini-option-wrap').find('.info-wrap_product_n').removeClass('active');
						$dim.removeClass('active');
					}
				}, 'miniOption');

				//PDP 상품 설명 영역 스크롤 : 갤러리 영역내 위치 고정
				var summaryScrollController = sandbox.scrollController(window, document, function(per, scrollTop){
					if(sandbox.reSize.getState() === 'pc'){
						if($galleryWrap.height() > $optionWrap.height() && $optionWrap.height() + optionWrapOffsetTop > $(window).height()){

							var galleryHeight = $galleryWrap.height();
							var detailHeight = $productDetailWrap.height();

							//스크롤이 옵션영역 하단에 걸리는 순간
							if( scrollTop > optionWrapOffsetTop + $optionWrap.height() - $(window).height() && scrollTop < optionWrapOffsetTop + galleryHeight - $(window).height() ){
								!$optionWrap.hasClass("fixed") && $optionWrap.removeClass('fixed absolute bottom top').removeAttr("style").addClass('fixed bottom');
							}
							//스크롤이 하단으로 내려갔을 때
							else if( scrollTop >= optionWrapOffsetTop + galleryHeight - $(window).height() ){
								!$optionWrap.hasClass("absolute") && $optionWrap.removeClass('fixed absolute bottom top').removeAttr("style").addClass('absolute').css("bottom", detailHeight - galleryHeight + "px");
							}
							//스크롤이 상단으로 올라갔을 때
							else if( scrollTop <= optionWrapOffsetTop + $optionWrap.height() - $(window).height() ){
								!$optionWrap.hasClass("top") && $optionWrap.removeClass('fixed absolute bottom top').removeAttr("style").addClass('absolute top');
							}
							else {
							    $optionWrap.removeClass('fixed absolute bottom top').removeAttr("style");
							}




						} else {
							//아코디언 정보를 펼친 경우 갤러리 길이 보다 상품옵션이 더 길어 질수 있다
							$optionWrap.removeClass('fixed absolute bottom top').removeAttr("style");
						}
					}
					//스크롤 업/다운 구분을 위해 이전 스크롤 위치 기억
					previousScrollTop = scrollTop;

				}, 'product');

				$('.minioptbtn').click(function(e){
					e.preventDefault();
					$('.mini-option-wrap').find('.info-wrap_product_n').addClass('active');
					$dim.addClass('active');
				});

				$('.mini-option-wrap').on('click', '.close-btn', function(e){
					//console.log('mini-option-wrap');
					e.preventDefault();
					$('.mini-option-wrap').find('.info-wrap_product_n').removeClass('active');
					$dim.removeClass('active');
				});


				//guide option modal
				$this.find('.option-guide').on('click', function(e){
					e.preventDefault();
					guideModal.show();
				});


				$('.uk-quickview-close').click(function(e){
					guideModal.hide();
					isQuickView = true;
				});

				guideModal.off('.uk.modal.product').on({
					'hide.uk.modal.product':function(){
						if(isQuickView){
							setTimeout(function(){
								$('html').addClass('uk-modal-page');
								$('body').css('paddingRight',15);
							});
						}
					}
				});

				var crossSale = $("#crossSale-swiper-container")
				if (crossSale.find(".swiper-wrapper>li").length < 1) {
					crossSale.parent(".category-slider").parent(".related-items").hide();
				}

				//PDP summary에서 상품 설명의 이미지 제거한 내용을 영역에 붙임.
				if($this.find('[data-long-description]').attr('data-long-description')){
					var html = $.parseHTML($this.find('[data-long-description]').attr('data-long-description'));
					$(html).find('div.imgArea').remove().find('script').remove();
				//	$this.find('#pdp-description-summary').empty().append(html);
				}

        		//상품 정보 영역의 높이 줄임처리 (상품정보, 유의사항)
				$infoHeightWrap.each(function(e){
					// e.preventDefault();
					var argmts = Core.Utils.strToJson($(this).attr('data-info-height'), true) || {};
					var pdpInfoSubjectHeight=78;
					var readMoreHeight=65;
					var infoType = argmts.infoType;
					var outerHeight = parseInt(argmts.outerHeight);
					var shortenHeight =  outerHeight-readMoreHeight;
					var contentsHeight = shortenHeight - pdpInfoSubjectHeight;
					var $descriptionWrap;
					if(infoType === 'attention-guide'){
						$descriptionWrap = $(this);
					} else if(infoType === 'product-detail'){
						$descriptionWrap = $(this).closest('.pop-detail-content');
					}

					if(argmts && ($descriptionWrap.outerHeight() > outerHeight || $descriptionWrap.outerHeight() === 0)){
						if(infoType === 'attention-guide'){
							$descriptionWrap.outerHeight(shortenHeight);
							$descriptionWrap.find('.guide-area').height(contentsHeight).css({'overflow':'hidden'});
							$descriptionWrap.find('#read-more').show();
						} else if(infoType === 'product-detail'){
							if($descriptionWrap.find('.conArea').length > 0){
								$descriptionWrap.find('.conArea').height(shortenHeight).width('100%').css({'overflow':'hidden'});
							}

							else if($descriptionWrap.find('.sectionR').length  > 0){
								//$descriptionWrap.find('.sectionR').height(shortenHeight).css({'overflow':'hidden'});
								//상품 설명 두번째 항목까지만 노출하고 이후 항목은 비노출처리 한다.
								//상품 설명 두번째 항목도 2줄까지만 보이도록 multi-line ellipsis 처리 한다.
								$descriptionWrap.find('.sectionR > ul:gt(2)').each(function(){
									$(this).hide();
									$(this).prev("h3") && $(this).prev("h3").hide();
								});
							}

						}
					}
				});

				//1 on 1 이미지 외 상품 설명 제거. 어드민 상품 속성에 porduct1on1이 true인 경우에만 PDP 화면 아래쪽에 표시됨.
				if($this.find('[data-1on1-description]').length > 0){
					var html = $.parseHTML($this.find('[data-long-description]').attr('data-long-description'));
					$(html).find('div.proInfo').remove().find('script').remove();
					$this.find('[data-1on1-description]').empty().append(html);
				}
			},
			moduleValidate:function(index){
				var INDEX = index;
				var deferred = $.Deferred();
				var validateChk = (args.isDefaultSku === 'true') ? true : false;
				var qty = 0;

				if(args.isDefaultSku === 'false'){
					validateChk = sandbox.utils.getValidateChk(productOption, '사이즈를 선택해 주세요.');
				}

				if(Array.isArray(quantity)){
					qty = quantity[INDEX].getQuantity();
				}else{
					qty = quantity.getQuantity();
				}

				if(validateChk && isQuantity && qty != 0){
					deferred.resolve(qty);
				}else if(!isQuantity || qty == 0){
					deferred.reject(args.errMsg);
				}else{
					deferred.reject();
				}

				return deferred.promise();
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-product]',
					attrName:'data-module-product',
					moduleName:'module_product',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				$this = null;
				args = [];
				productOption = null;
				quantity = null;
			},
			getItemRequest:function(){
				return itemRequest;
			},
			getSkuData:function(){
				return currentSkuData;
			}
		}
	});
})(Core);