(function(Core){
	var allSkuDataItem;
	Core.register('module_launchcategory', function(sandbox){
		var $that, category;
		// var arrViewLineClass=['uk-width-medium-1-3', 'uk-width-large-1-2', 'uk-width-large-1-3', 'uk-width-large-1-4', 'uk-width-large-1-5'];


		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var $cate = $(".launch-category");
				var $item = $(".launch-list-item.upcomingItem");
				var $cate_header = $(".launch-lnb");

				if(arguments[0] && undefined != arguments[0].category){
					category = arguments[0].category;
				}

				//@pck 2020-10-23 Lazy 개선
				document.addEventListener('readystatechange', function(event){
					if(document.readyState == 'complete'){

						var elementListTotal = document.querySelectorAll('.launch-list-item.pb2-sm').length; //thymeleaf 템플릿 상에서 PC와 MO은 항상 동일한 개수를 가지도록 한다는 전제
						if (elementListTotal < 1){ //list item들이 없을 시 no product 메세지 노출
							if(document.querySelector('.not-found-container') !== null)
								document.querySelector('.not-found-container').classList.remove('hidden');
						}else{
							if(category ==="upcoming"){

								// @pck 2021-06-24 모바일 날짜 헤더 제거 로직
								// 과정을 감추기 위해 Lazy 이전에 실행되어야 함

								var elementListParent = document.querySelector('.item-list-wrap'),
									arrListItemsMO = document.querySelectorAll('.launch-list-item.d-md-h'),
									arrayListitemsMO = [];

								for (var i = 0; i < arrListItemsMO.length; ++i) { arrayListitemsMO.push(arrListItemsMO[i]); }

								arrayListitemsMO.sort(function(currentDate, nextDate) {
									var currentDateObj = new Date(currentDate.dataset.activeDate);
									var nextDateObj = new Date(nextDate.dataset.activeDate);
									if( currentDateObj.getFullYear() === nextDateObj.getFullYear() &&
										currentDateObj.getMonth() === nextDateObj.getMonth() &&
										currentDateObj.getDate() === nextDateObj.getDate()){
										var dateHeaderEl = currentDate.querySelector('.upcoming.bg-lightestgrey');
										if(dateHeaderEl !== null){
											currentDate.removeChild(dateHeaderEl);
										}
									}
								});

								for(var i = 0; i < arrayListitemsMO.length; ++i){ elementListParent.appendChild(arrayListitemsMO[i]); }
							}
						}

						$('.launch-category .img-component').Lazy({
							visibleOnly: true,
							scrollDirection: 'vertical',
							afterLoad: function() {
								$('.launch-category .launch-list-item').addClass('complete');
							},
						});
					}
				});

				//upcoming일때는 헤더 우측 뷰 변경 아이콘 숨기기
				if(category === 'upcoming'){
					$this.find('.toggle-box').hide();
					// TheDraw일때 Adobe 태깅 추가
					$cate.find('[data-thedraw]').parents('[data-component-launchitem]>a').attr('data-click-area', 'snkrs').attr('data-click-name', 'upcoming: apply draw');
				}
				// console.log('category:', category);

				// TheDraw일때 Adobe 태깅 추가
				if(category === 'feed'){
					$cate.find('[data-thedraw]').parents('[data-component-launchitem]>a').attr('data-click-area', 'snkrs').attr('data-click-name', 'feed: apply draw');
				}

				/* @pck 2020-12-18 js/ui/_ui_snkrs_script.js 로 기능 이전
				var Listform = {
				    grid : function(setCookie){
								$(".item-list-wrap", $cate).removeClass("gallery").addClass("grid");
				        //$(".launch-list-item", $cate).removeClass("gallery").addClass("grid");
						$(".toggle-box span", $cate_header).removeClass("ns-grid").addClass("ns-feed");
						if(setCookie){$.cookie("launch_view_mode", "grid" , {path : "/"});}

				    },
				    gallery : function(setCookie){
								$(".item-list-wrap", $cate).removeClass("grid").addClass("gallery");
				        //$(".launch-list-item", $cate).removeClass("grid").addClass("gallery");
				        $(".toggle-box span", $cate_header).removeClass("ns-feed").addClass("ns-grid");
				        if(setCookie){$.cookie("launch_view_mode", "gallery" , {path : "/"});}
					}
				};
				 */
				// Launch 리스트 NOTIFY ME 버튼 노출
				$cate.find('.item-notify-me').on('click', function (e) {
					var url = $(this).attr('url');

					//#restock-notification 중복 modal 노출 현상으로 깜빡임 방지차 최초 1회만 ajax호출
					if($("#restock-notification").length == 0){
						Core.Utils.ajax(url, 'GET', {}, function (data) {

							var notifyPop = $(data.responseText).find('#restock-notification');
							$('body').append(notifyPop)
							Core.moduleEventInjection(notifyPop[0].outerHTML);
							/*
                            var obj = {
                                'productId': $item.find('[name="productId"]').val()
                            }

                            Core.Utils.ajax(Core.Utils.contextPath + '/productSkuInventory', 'GET', obj, function(data){
                                var responseData = data.responseText;
                                allSkuDataItem = Core.Utils.strToJson(responseData).skuPricing;
                                // console.log(allSkuDataItem)
                                // console.log(Method)
                                // _self.fireEvent('skuLoadComplete', _self, [allSkuData, 'COMINGSOON']);
                            }, false, true);
                            */
							var modal = UIkit.modal("#restock-notification");
							if(!modal.isActive()){
								modal.show();
							}
						});
					}else{
						var modal = UIkit.modal("#restock-notification");
						if(!modal.isActive()){
							modal.show();
						}
					}
				});

			},
			DateParse:function(dateStr){
				var a=dateStr.split(" ");
				var d=a[0].split("-");
				var t=a[1].split(":");
				return new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-launchcategory]',
					attrName:'data-module-launchcategory',
					moduleName:'module_launchcategory',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			getTotalSkuData:function () {
				return allSkuDataItem; // BK
			},
			getTotalSkuNotify:function () {
				return 'COMINGSOON'; // BK
			}
		}
	});
})(Core);