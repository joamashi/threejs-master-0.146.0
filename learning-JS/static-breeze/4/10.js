(function(Core){
	'use strict';

	Core.register('module_store', function(sandbox){
		var $this, $infoViewContainer, filterQuery = [], searchQueryString = '', endPoint, storeInfoComponent, mapComponent, isAjax = false, reqPage = 1;
		/*
			store-info-view 에 추가되는 dom object

			<h2 class="tit">명동</h2>
			<span class="address">서울 영등포구 여의도동</span>
			<span class="phonenum">070-0000-0000</span>
			<dl class="info">
				<dt class="key">운영시간</dt>
				<dd class="value">평일 10:00, 주말 11:00</dd>
				<dt class="key">매장정보</dt>
				<dd class="value">네이버 지도 API v3는 JavaScript 형태로 제공되는 NAVER 지도 플랫폼으로써</dd>
			</dl>
			<button class="close-btn"><i class="icon-delete_thin"></i></button>
		*/

		/**************************

			매장검색
			매장이름, 지역검색 : _find=지하철&_search=name&_condition=like
			필터 : _find={{매장타입}}&_search=storeType&_condition=or||and

			admin에서 재고위치/대리점의 추가속성에 storeType, icon은 각각, 검색필터와 마커의 아이콘의 클래스를 입력하는 속성이다.

			membership: 나이키 멤버십 및 티켓을 사용 할 수 있는 매장
			nrc: nike running club
			ntc: nike traingin club
			reservation: 매장 상품 예약 서비스 제공 하는 매장
			fulfill : ASSIST SERVICE 제공하는 매장

		***************************/

		var submitSearchMap = function(){
			//_find=서울&_search=name&_condition=like&_find=손목시계,지하철&_search=storeType&_condition=or

			var filterParams = location.pathname + '?';
			if(searchQueryString !== '') filterParams += searchQueryString + '&';
			if(filterQuery.length > 0){
				filterParams += '_find='+filterQuery.join(',')+'&_search=storeType&_condition=like';
			//	filterParams = filterParams.replace("fulfill", "");
			}

			// ASSIST SERVICE : commented on 2020-01-31
			/*
			if( $('input[id="all"]').is(":checked") == false && $('input[id="assist"]').is(":checked") == true ){
				filterParams += '&_find=true&_search=fulfill&_condition=equal';
				filterParams += '&_find=PHYSICAL_PICKUP,PHYSICAL_PICKUP_OR_SHIP&_search=type&_condition=equal';
			}
			*/

			// NFS 매장도 검색결과에 포함 2019-04-24
			if (filterParams.indexOf("ignoreSharing") < 0) {
				filterParams += "&ignoreSharing=true";
			}

			location.href = filterParams.replace(/[?|&]$/, '');
		}

		var requestMapPaging = function(){
			if(isAjax == false && reqPage){
				reqPage = ++reqPage;
				var queryParams = Core.Utils.getQueryParams(location.href, 'array');
				var url = (queryParams.length > 0) ? Core.Utils.contextPath + '/store?' + queryParams.join('&') : Core.Utils.contextPath + '/store';
				Core.Utils.ajax(url, 'GET',{'page':reqPage}, function(data){
					var storeList = sandbox.rtnJson($(data.responseText).find('[data-component-map]').attr('data-store-list')) || [];
					if($(data.responseText).find(".search-list").length === 0){
						reqPage = undefined;
					}else{
						$(data.responseText).find(".search-list").each(function(){
							$(".search-result").append($(this));
						});
						if(mapComponent) mapComponent.setStoreList(storeList).reInit();
					}

					setTimeout(function(e){
						isAjax = false;
					}, 100);
				},true);
			}
		}

		var Method = {
			moduleInit:function(){
				var args = arguments[0];
				$this = $(this);
				$infoViewContainer = $(this).find(args.infoview);

				endPoint = Core.getComponents('component_endpoint');

				var currentParams = sandbox.utils.getQueryParams(location.href);
				var arrCurrentFilters = [];
				var currentStoreIndex = 0;
				if(currentParams.hasOwnProperty('_find') && currentParams['_find'] instanceof Array){
					arrCurrentFilters = sandbox.utils.arrSameRemove(currentParams['_find'][1].split(','));
				}else{
					currentParams = null;
					arrCurrentFilters = null;
				}

				mapComponent = sandbox.getComponents('component_map', {context:$this}, function(){
					this.addEvent('openMarker', function(storeInfo, i){
						//var objStoreInfo = Method.getStoreList($(this).attr('data-store-id'));

						storeInfo.OpeningHours = storeInfo.additionalAttributes['영업시간'];

						Method.showInfoDetail(storeInfo);
						currentStoreIndex = i;
						if($('body').attr('data-device') !== 'pc') $this.find('.search-result').css('display','none');
					});

					this.addEvent('closeMarker', function(i){
						$infoViewContainer.stop().animate({'left':$infoViewContainer.outerWidth(true)}, 300, function(){
							$infoViewContainer.removeAttr('style');
							$this.find('.search-result').removeAttr('style');
						});
					});
				});

				var searchField = sandbox.getComponents('component_searchfield', {context:$this}, function(){
					/*this.addEvent('beforeSubmit', function(){
						var val = arguments[0];
						$('input[name=_find]').val(val);
					});*/
					this.addEvent('searchEmpty', function($form){
						searchQueryString = $form.serialize();
						endPoint.call("searchStore", { key : searchQueryString })
						submitSearchMap();
					});

					this.addEvent('searchKeyword', function($form, value){
						searchQueryString = $form.serialize();
						endPoint.call("searchStore", { key : searchQueryString })
						submitSearchMap();
					});
				});

				var searchCheckBox = sandbox.getComponents('component_checkbox', {context:$this}, function(i, dom){
					this.addEvent('change', function(val){
						var $this = $(this);
						var index = filterQuery.indexOf(val);
						var val = $this.val();
						if(val !== 'all'){
							if($this.parents('[data-component-checkbox]').hasClass('checked')){
								filterQuery.push(val);
							} else{
								filterQuery.splice(filterQuery.indexOf(val),1);
							}
						}
					});

					if(arrCurrentFilters !== null && arrCurrentFilters.indexOf(encodeURI(this.getThis().val())) > -1){
						this.getThis().prop('checked', true);
						this.getThis().trigger('change');
					}
				});

				storeInfoComponent = new Vue({
					el:'#store-info-vue',
					data:{
						"name":null,
						"address1":null,
						"address2":null,
						"phone":null,
						"openHours":null
					},
					methods:{
						close:function(){
							mapComponent.mapEvent(currentStoreIndex);
						}
					}
				});

				$(this).find('.filter-btn').click(function(e){
					e.preventDefault();

					/*if(filterQuery.length > 0){
						var filterQueryParams = sandbox.utils.getQueryParams($(this).closest('form').serialize());
						filterQueryString = '_find='+filterQuery.join(',');
						if(filterQueryParams._search) filterQueryString += '&_search='+filterQueryParams._search;
						if(filterQueryParams._condition) filterQueryString += '&_condition='+filterQueryParams._condition;
					}else{
						filterQueryString = '';
					}*/

					searchField.externalAction();
				});

				//매장목록 페이징처리
				$(".search-result").scroll(function(){
					if((this.scrollTop + this.clientHeight) >= this.scrollHeight){
						requestMapPaging();
						isAjax = true;
					}
				});

				$(this).find('.search-result').on('click', 'li .search-list-a', function(e){
					e.preventDefault();

					mapComponent.mapEvent($(this).parent().index());

					$this.find('.search-result').removeAttr('style');
					if($('body').attr('data-device') !== 'pc') {
						$this.find('.search-result').css('display', 'none');
					}

					//서비스필터 open 상태에서 매장 목록 클릭시 서비스필터 close함
					var target = '#service-filter-area';
					if($(target).is(":visible")){
						$(target).hide();
						$(target).addClass('close');
					}
				});

				//service filter area show and hide
				$(this).on('click', '#service-filter-btn', function(e){
					var target = '#service-filter-area';
					if($(target).is(":visible")){
						$(target).hide();
						$(target).addClass('close');
					} else {
						$(target).show();
						$(target).removeClass('close');
					}
				});

				Method.updateCheckAll();

				// 매장찾기 전체 체크시
				$(this).find('input.check-all-store[type="checkbox"]').on('change', Method.changeAllCheck);
				// 아이템 체크박스 선택시
				$(this).find('input.check-item-store[type="checkbox"]').on("change", Method.changeItemCheck);

				//args에 startToDetail이 true일때 해당 상점의 디테일에 이벤트trigger를 한다. 단, storeId로 단일 상점필터를 걸었을경우 동작한다.
				if(args.startToDetail === 'true' && $(this).find('.search-result > li').length === 1){
					$(this).find('.search-result > li').eq(0).find('a').trigger('click');
				}
			},
			// 매장찾기 전체 체크 처리
			changeAllCheck:function(e){
				e.preventDefault();
				var isCheck = $(this).prop('checked');
				$('input.check-item-store[type="checkbox"]').each( function(){
					if(isCheck == true && !$(this).prop('checked')){
						$(this).prop('checked', isCheck ).trigger('change');
					}
					if(isCheck == false && $(this).prop('checked')){
						$(this).prop('checked', isCheck ).trigger('change');
					}
				});
			},
			// 아이템 체크박스 선택시
			changeItemCheck:function(e){
				var isCheck = $(this).prop('checked');
				if( isCheck ){
					$(this).parent().addClass('checked');
				}else{
					$(this).parent().removeClass('checked');
				}
				Method.updateCheckAll();
			},
			// 아이템 체크박스 변경시 전체 선택 체크박스 상태처리
			updateCheckAll:function(){

				if($('input.check-item-store[type="checkbox"]').length == $('input.check-item-store[type="checkbox"]:checked').length ){
					$('input.check-all-store[type="checkbox"]').prop( 'checked', true);
				}else{
					$('input.check-all-store[type="checkbox"]').prop( 'checked', false);
				}
			},
			//Store 선택 시 상세 정보 만드는 스크립트 실행
			showInfoDetail:function(data){
				storeInfoComponent.name = data.name;
				storeInfoComponent.address1 = data.address1;
				storeInfoComponent.address2 = data.address2;
				storeInfoComponent.phone = data.phone;
				storeInfoComponent.openHours = data.additionalAttributes['영업시간'];
				$infoViewContainer.stop().animate({'left':0}, 300);
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-store]',
					attrName:'data-module-store',
					moduleName:'module_store',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);