(function(Core){
	Core.register('module_pagination', function(sandbox){
		var $this, args, currentPage, totalPageNum, totalPageCount, lineSize, pageSize, isHistoryBack = false, endPoint, scrollController;

		/*
			data-module-pagination="{
				type:scroll,
				totalCount:896,
				currentPage:1,
				pageSize:40,
				target:.item-list-wrap,
				api:/kr/ko_kr/w/men/fw,
				scrollWrapper:window,
				scrollContainer:document,
				lineSize:4}"
		*/
		var setSessionPaging = function(){
			sessionStorage.setItem('categoryPagingType', args.type);
			sessionStorage.setItem('categoryCurrentPage', currentPage + 1);
		}

		// 상품리스트 최소 높이 지정
		var setContentsHeight = function(){
			var $contentsBody = $('.contents-body');
			var filterHeight = $('.contents-side').height();
			$contentsBody.css('min-height', filterHeight);
		}

		// 사이드메뉴 sticky (pc일 경우만)
		$(window).on('resize', function() {
			var wH = $(window).width();
			if (wH > 1023) {
				setContentsHeight();
			}
		});

		var Method = {
			moduleInit:function(){
				var sessionCurrentPage = sessionStorage.getItem('categoryCurrentPage');
				var sessionLineSize = sessionStorage.getItem('categoryLineSize');
				endPoint = Core.getComponents('component_endpoint');

				$this = $(this);
				args = arguments[0];
				currentPage = (sessionCurrentPage) ? sessionCurrentPage : args.currentPage;
				pageSize = Number(args.pageSize);
				totalPageNum = Math.ceil(args.totalCount / pageSize);
				lineSize = (sessionLineSize !== null) ? sessionLineSize : args.lineSize;

				switch(args.type){
					case 'more' :
						Method.typeMore();
						break;
					case 'scroll' :
						Method.typeScroll();
						break;
				}
			},
			getPaging:function(){
				return (args.totalCount > pageSize * currentPage && totalPageNum > currentPage) ? currentPage++ : null;
			},
			typeMore:function(){
				if(currentPage >= totalPageNum){
					// $this.find('button, a').remove();
					$this.find('button, a').hide();
					return;
				}

				$this.find('button, a').off('click').on('click', function(e){
					e.preventDefault();

					var _self = this;
					if(Method.getPaging()){
						var sort = ($('a#review-sort-tab.review-filter.active').text() === '도움순' ? 'helpfulCount' :'auditable.dateCreated');
						var obj = {
							'mode': args.mode,
							'templatePath':args.templatePath,
							'resultVar': args.resultVar,
							'productId': args.productId,
							'pageSize':pageSize,
							'page':currentPage,
							'lineSize':lineSize,
							'_sort':sort,
							'_type_sort':'desc',
							'cache':new Date().getTime()
						}

						sandbox.utils.ajax(args.api, 'GET', obj, function(data){
							if (args.api == Core.Utils.contextPath + '/processor/execute/review'){
								$(data.responseText).find('li').each(function(index){
									$('ul#review-list').append(this);
								});
							} else {
								sandbox.moduleEventInjection($(data.responseText).find(args.target)[0].innerHTML);
							}

							Method.setEndPoint( data );
							if(currentPage >= totalPageNum){
								$(_self).off('click');
								$(_self).hide();
								// $(_self).remove();
							}
							setSessionPaging();
						});

						// sandbox.utils.ajax(args.api, 'GET', {'page':currentPage, 'pageSize':pageSize, 'lineSize':lineSize}, function(data){
						// 	$(args.target).append($(data.responseText).find(args.target)[0].innerHTML);
						// 	sandbox.moduleEventInjection($(data.responseText).find(args.target)[0].innerHTML);
						// 	Method.setEndPoint( data );
						// 	if(currentPage >= totalPageNum){
						// 		$(_self).off('click');
						// 		$(_self).remove();
						// 	}
						// 	setSessionPaging();
						// });
					}
				});
			},
			typeScroll:function(){
				if(currentPage >= totalPageNum) return;

				var _self = this;
				var isFirst = true;
				var isLoaded = true;
				var prevScrollTop = 0;
				var contentsHeightPer = 0;

				scrollController = sandbox.scrollController(window, document, function(percent){
					contentsHeightPer = this.getScrollTop($(args.target).offset().top + $(args.target).height());

					if(percent > contentsHeightPer && isLoaded && !isHistoryBack && this.getScrollPer() < percent && !isFirst){
						isLoaded = false;
						if(Method.getPaging()){
							sandbox.utils.ajax(args.api, 'GET', {'page':currentPage, 'pageSize':pageSize, 'lineSize':lineSize}, function(data){

								//@pck 2020-10-26 SNKRS GRID WALL - 스크롤 페이징 후 레이지 콘트롤 미호출로 재 호출
								if(data.responseText.indexOf('launch-category') !== -1){

									var appendInnerHTML = $(data.responseText).find(args.target)[0].innerHTML;

									var listType = 'feed';
									if( typeof localStorage !== 'undefined' || localStorage !== null) {
										listType = ( localStorage.getItem('listType') ) ? localStorage.getItem('listType') : 'feed';
									}

									switch (listType) { //feed일 경우에는 기본 thyleaf 템플릿에서 내려주는 class 속성이 feed이므로 변경할 필요가 없음
										case 'grid' :
											appendInnerHTML = appendInnerHTML.replace(/pb2-sm va-sm-t ncss-col-sm-12 ncss-col-md-6 ncss-col-lg-4 pb4-md prl0-sm prl2-md ncss-col-sm-6 ncss-col-lg-3 pb4-md prl2-md pl1-md pr0-md/gi, 'pb2-sm va-sm-t ncss-col-sm-6 ncss-col-md-3 ncss-col-xl-2 prl1-sm grid-type');
											break;
									}

									$(args.target).append(appendInnerHTML);
									Method.removeMobileDateHeader();
									sandbox.moduleEventInjection($(data.responseText).find(args.target)[0].innerHTML);

									$('.launch-category .img-component').Lazy({
										visibleOnly: true,
										scrollDirection: 'vertical',
										afterLoad: function() {
											$('.launch-category .launch-list-item').addClass('complete');
										},
									});
								}else{
									$(args.target).append($(data.responseText).find(args.target)[0].innerHTML);
									sandbox.moduleEventInjection($(data.responseText).find(args.target)[0].innerHTML);
								}

								// 상품 어펜드 후 필터 스티키 다시 계산
								//20190820일 스니커즈 스크롤 페이징시 2페이 이후 오류 발생이 되어 실행 안되게 수정.
								if(Core.getModule('module_category')){
									sandbox.getModule('module_category').newHeaderSticky();
								}
								Method.setEndPoint( data );
								if(currentPage >= totalPageNum){
									scrollController.destroy();
								}else{
									isLoaded = true;
									setSessionPaging();
								}
							});
						}
					}

					//새로고침, 히스토리백을 했을경우 돔오브젝트가 생성되지 못한 상황에서 스크롤의 위치가 최 하단으로 이동 하기 때문에
					//처음 로드 시점에서는 무조건 scroll 이벤트를 막는다.
					isFirst = false;
					setContentsHeight();

				}, 'pagination');
			},
			setEndPoint:function( data ){
				var $products = $(data.responseText).find('.categoryMarketingScript #products div');
				var itemList = [];
				$products.each(function(index, data){
					itemList.push({
						id : $(data).data("id")
					});
				})
				// 로드한 정보를 기존 정보에 추가해야 할지? 우선은 이벤트쪽으로만 정보 전달
				endPoint.call('loadMoreProducts', {page : currentPage, pageSize: pageSize, lineSize: lineSize, itemList: itemList  })
			},
			removeMobileDateHeader:function (){
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

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-pagination]',
					attrName:'data-module-pagination',
					moduleName:'module_pagination',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			setLineSize:function(size){
				lineSize = size;
				sessionStorage.setItem('categoryLineSize', lineSize);
			},
			getPagingType:function(){
				return args.type;
			},
			getTotalCount:function () {
				return args.totalCount; // BK
			},
			destroy:function(){
				if(args.type === 'scroll' && scrollController) scrollController.destroy();
				sessionStorage.setItem('categoryCurrentPage', 1);
			}
		}
	});
})(Core);