(function(Core){
	Core.register('module_filter', function(sandbox){
		'use strict';

		var $filter, args, currentMinPrice, currentMaxPrice, minPrice, maxPrice, limit, arrInputPrice = [], arrQuery = [], currentRangePrice = '', endPoint;
		var pricePattern = 'price=range[{{minPrice}}:{{maxPrice}}]';
		var resetWrap = $('.section-filter .pw-filter-sticky.ncss-filter'); // 필터 선택해제 div
		var countHistory = -1;

		//아이폰 에서 필터를 오픈후, 페이지 이동후 백 할경우 필터가 오픈되는 현상
		//카테고리 페이지 진입시 팔터를 일단 감춘다.
		if(!Core.Utils.mobileChk==false){
			$(".contents-side").hide();
			//console.log("bbbb");
		}

		var limitPrice = function(price){
			if(price < minPrice) return minPrice;
			else if(price > maxPrice) return maxPrice;
			else return price;
		}

		var replaceComma = function(str){
			return str.replace(/,|\.+[0-9]*/g, '');
		}

		var getPriceByPercent = function(price){
			return (price-minPrice) / (maxPrice-minPrice) * 100;
		}

		var getPercentByPrice = function(per){
			return Math.round(minPrice+(limit * per)/ 100);
		}


		var callEndPoint = function( option ){
			var temp = option.split("=");
			if( temp.length > 1){
				var opt = {
					key : temp[0],
					value : temp[1]
				}
				endPoint.call( 'applyFilter', opt );
			}
		}

		var filterStickyConfirm = function () {

			if (sandbox.getModule('module_pagination') !== null) {
				$('#filter-sticky-confirm span').text(sandbox.getModule('module_pagination').getTotalCount());
			}

			var menu_key = 0;
			var filtercategoryUrl = $('#category-swiper').data('url');
			var filtercategoryDepth = $('#category-swiper li.list-depth');

			$('#category-swiper li').each(function (index, val) {
				if ($(val).hasClass('cloth-dhp2')) {
					$('#category-swiper li.list-depth').each(function (index, val) {
						if (!$(val).next().hasClass('cloth-dhp2')) $(val).remove();
						else if ($(val).next().hasClass('cloth-dhp2')) $(val).find('a').text('전체');
					});
				} else if ($(val).hasClass('cloth-dhp3')) {
					$('#category-swiper li.list-depth').each(function (index, val) {
						if (!$(val).next().hasClass('cloth-dhp3')) $(val).remove();
						else if ($(val).next().hasClass('cloth-dhp3')) $(val).find('a').text('전체');
					});
				}
			});

			if($('body').attr('data-device') === 'mobile') {
				$('#category-swiper-container').show();
			}

			$('#category-swiper li').each(function (index, val) {
				var w = $(val).outerWidth();
				$(val).css('width', w + 20);
				if ($(this).hasClass('active')) menu_key = index;
			});

			var swiper = new Swiper('#category-swiper-container', {
				scrollbarHide: true,
				slidesPerView: 'auto',
				centeredSlides: false,
				initialSlide: menu_key,
				// initialSlide: 3,
				grabCursor: false
			});
		}
		filterStickyConfirm();


		$(window).resize(function (e) {
			var wH = $(window).width();
			if (wH <= 480) {
				// console.log('mobile');
				$('.f-subtitle-box').removeClass('.uk-accordion-title');
				$('#category-swiper-container').show();
			} else if (wH > 480 && wH <= 960) {
				// console.log('tablet');
				$('.f-subtitle-box').addClass('.uk-accordion-title');
				$('#category-swiper-container').hide();
			} else if (wH > 960) {
				// console.log('pc');
				$('#category-swiper-container').hide();
			}
		});


		function UpdateHeaders_top() {
			$(".wrapper").each(function() {
				var el = $('.item-list-wrap'),
					filter = $('.filter-wrap_category'),
					offset = el.offset(),
					scrollTop = $(window).scrollTop();

				if(!offset) return;

				(scrollTop > offset.top) ? filter.addClass('sticky') : filter.removeClass('sticky')
			});
		}
		$(window).scroll(UpdateHeaders_top).trigger("scroll");


		var local, local_pathname = location.pathname, params;
		if (location.pathname === "/kr/ko_kr/search") {
			local = location.pathname + location.search; // 검색
		} else {
			local = location.pathname; // 카테고리
		}

		var Method = {
			moduleInit : function () {
				args = arguments[0];
				$filter = $(this);
				endPoint = Core.getComponents('component_endpoint');

				//@pck 2020-08-11
				// filter 파라미터가 url에 추가됨에 따라 히스토리 쌓인 회수를 카운트 해서 이전으로 가기를 구현함(좋은 방법은 아니라서... 나중에 구조변경필요)
				window.onpopstate = function(event) {
					history.go(countHistory);
				}

				//$('input[type=checkbox]').prop('checked', false);

				//초기 query 분류
				//arrQuery = sandbox.utils.getQueryParams(location.href, 'array');
				var query = sandbox.utils.getQueryParams(location.href);
				for(var key in query){
					if(key !== 'page'){
						if(typeof query[key] === 'string'){
							arrQuery.push(key+'='+query[key]);
						}else if(typeof query[key] === 'object'){
							for(var i=0; i < query[key].length; i++){
								arrQuery.push(key+'='+query[key][i]);
							}
						}
					}
				}

				//filter price range
				var priceRange = sandbox.getComponents('component_range', {context:$filter}, function(){
					this.addEvent('change', function(per){
						if($(this).hasClass('min')){
							currentMinPrice = getPercentByPrice(per);
							arrInputPrice[0].setValue(sandbox.rtnPrice(currentMinPrice));
						}else if($(this).hasClass('max')){
							currentMaxPrice = getPercentByPrice(per);
							arrInputPrice[1].setValue(sandbox.rtnPrice(currentMaxPrice));
						}
					});

					this.addEvent('touchEnd', function(per){
						var val = sandbox.utils.replaceTemplate(pricePattern, function(pattern){
							switch(pattern){
								case 'minPrice' :
									return currentMinPrice;
									break;
								case 'maxPrice' :
									return currentMaxPrice;
									break;
							}
						});

						if(arrQuery.indexOf(currentRangePrice) > -1){
							arrQuery.splice(arrQuery.indexOf(currentRangePrice), 1);
						}

						callEndPoint( val );
						arrQuery.push(val);
						currentRangePrice = val;

						Method.appendCateItemList();
					});
				});

				var textfield = sandbox.getComponents('component_textfield', {context:$filter}, function(){
					this.addEvent('focusout', function(e){
						var type = $(this).attr('data-name');
						var per = getPriceByPercent(limitPrice(replaceComma($(this).val())));

						if(type === 'min'){
							priceRange.getSlide(0).setPercent(per);
						}else if(type === 'max'){
							priceRange.getSlide(1).setPercent(per);
						}
					});

					arrInputPrice.push(this);
				});

				if(priceRange){
					var objPrice = (priceRange) ? priceRange.getArgs() : {min:0, max:1};
					minPrice = (objPrice.min == 'null') ? 0:parseInt(objPrice.min);
					maxPrice = (objPrice.max == 'null') ? 1:parseInt(objPrice.max);
					limit = maxPrice - minPrice;
					currentMinPrice = replaceComma(arrInputPrice[0].getValue());
					currentMaxPrice = replaceComma(arrInputPrice[1].getValue());
					priceRange.getSlide(0).setPercent(getPriceByPercent(currentMinPrice));
					priceRange.getSlide(1).setPercent(getPriceByPercent(currentMaxPrice));

					currentRangePrice = sandbox.utils.replaceTemplate(pricePattern, function(pattern){
						switch(pattern){
							case 'minPrice' :
								return currentMinPrice;
								break;
							case 'maxPrice' :
								return currentMaxPrice;
								break;
						}
					});
				}

				// 필터 클릭 처리
				sandbox.getComponents('component_radio', {context:$filter, unlock:true}, function(i){
					var currentValue = '';

					//처음 라디오 박스에 체크 되었을때만 이벤트 발생
					this.addEvent('init', function(){
						var val = this.attr('name') +'='+ encodeURIComponent($(this).val());
						currentValue = val;
					});

					this.addEvent('change', function(input){

						var val = $(input).attr('name') +'='+ encodeURIComponent($(input).val());

						// console.log('sort', val)

						if($(this).parent().hasClass('checked')){
							arrQuery.splice(arrQuery.indexOf(val), 1);
						}else{
							if(currentValue !== '') arrQuery.splice(arrQuery.indexOf(currentValue), 1);
							var filterData = '';
							if( $(this).data('label') != null ){
								filterData = $(this).attr('name') + '=' + $(this).data('label');
							}else{
								filterData = val;
							}
							callEndPoint( filterData );
							arrQuery.push(val);
							currentValue = val;
							// console.log(arrQuery)
						}

						Method.appendCateItemList();
					});
				});

				sandbox.getComponents('component_checkbox', {context:$filter}, function(){
					this.addEvent('change', function(){
						var val = $(this).attr('name') +'='+ encodeURIComponent($(this).val());

						if(arrQuery.indexOf(val) !== -1){
							arrQuery.splice(arrQuery.indexOf(val), 1);
						}else{
							var filterData = '';
							if( $(this).data('label') != null ){
								filterData = $(this).attr('name') + '=' + $(this).data('label');
							}else{
								filterData = val;
							}
							callEndPoint( filterData );
							arrQuery.push(val);
							// console.log(arrQuery)
						}

						Method.appendCateItemList();
					});
				});

				//필터 동작
				$(document).on('click', '.filter-remove-btn', function(e){
					e.preventDefault();

					var query = encodeURI($(this).attr('href'));
					arrQuery.splice(arrQuery.indexOf(query), 1);

					query = arrQuery.join('&');
					query += sandbox.getModule('module_pagination') ? (sandbox.getModule('module_pagination').getPagingType() === 'number' ? '&page=1&' : '') : '';
					window.location.assign(location.pathname + '?' + query);
					countHistory--;
				});

				// 필터 초기화
				$(document).on('click', '#filter-sticky-reset', function(e){
					sandbox.utils.ajax(location.pathname, 'GET', {}, function (data) {
						var responseText = $(data.responseText).find(args['data-module-filter'].target)[0].innerHTML;
						$(args['data-module-filter'].target).empty().append(responseText);
						sandbox.moduleEventInjection(responseText);
						history.pushState(null, null, location.pathname);

						resetWrap.removeClass('active');
						$('.filter-category-wrap form input').prop('checked', false);

						filterStickyConfirm();
					});
				});

				// 필터 열기
				$(document).on('click', args['data-module-filter'].filterOpenBtn, function(e){
					e.preventDefault();

					//아이폰 에서 필터를 오픈후, 페이지 이동후 백 할경우 필터가 오픈되는 현상
					$(".contents-side").show();

					$filter.stop().animate({opacity:1, left:0}, 300, function () {
						$('.pw-filter-sticky').addClass('active');
					});

					$('.dim').addClass('active');
					$('html').addClass('uk-modal-page');
					// $('body').css('paddingRight', 15);

					filterStickyConfirm();
				});

				// $filter.stop().animate({opacity:1, left:0}, 300);
				// $('.dim').addClass('active');
				// $('html').addClass('uk-modal-page');
				// $('body').css('paddingRight', 15);
				// filterStickyConfirm();
				// $('.pw-filter-sticky').addClass('active');

				//모바일일 때 필터 우측 부 dim레이어 탭 시 필터 비활성화
				$('[data-brz-dim]').on('click', function(e){
					$('.content-area .pt_category').removeClass('wideArticleView');
					$filter.stop().animate({opacity:0, left:-300}, 300, function(){
						$(this).removeAttr('style');
						$('.pw-filter-sticky').removeClass('active');
					});
					$(this).removeClass('active');
					$('html').removeClass('uk-modal-page');
					$('body').removeAttr('style');
					endPoint.call('wideToggleClick', 'off');
				});


				//필터 더보기 버튼
				$filter.find('.more-btn').each(function(){
					var $this = $(this);
					var $target = $this.prev();
					var minHeight = $target.height();
					var maxHeight = $target.children().height();

					$(this).click(function(e){
						e.preventDefault();
						//$target.removeClass('more-container'); 20190416 기능변경으로 주석
						//$this.remove(); 20190416 기능변경으로 주석

						// 20190416 더보기 버튼 클릭시 텍스트및 아이콘 변경 추가
						$this.toggleClass( 'active' );

						if ( $(this).hasClass( 'active' ) ) {
							$target.removeClass( 'more-container' );
						} else {
							$target.addClass( 'more-container' );
						}
					});
				});

				// 닫기 버튼
			  $filter.find('.btn-close, #filter-sticky-confirm').on('click', function(){
					$filter.stop().animate({opacity:0, left:-300}, 300, function(){
						$(this).removeAttr('style');
						$('.pw-filter-sticky').removeClass('active');
					});

					$('.dim').removeClass('active');
					$('html').removeClass('uk-modal-page');
					$('body').removeAttr('style');
				});

				// 필터 클릭시 카운팅
				$filter.find( '.uk-accordion-content li label' ).on( 'click', countingSelectedFilters);
			},

			appendCateItemList:function(){
				//console.log(getPagingType);

				// var query = arrQuery.join('&');
				// query += sandbox.getModule('module_pagination') ? (sandbox.getModule('module_pagination').getPagingType() === 'number' ? '&page=1&' : '') : ''
				// window.location.assign(location.pathname + '?' + query);

				// $(args.form).serialize();
				// $(args.form).submit();
				// console.log($('[' + args['data-module-filter'].form + ']').serialize());
				// $('[' + args['data-module-filter'].form + ']').submit();

				var obj = $('.filter-category-wrap form').serialize();

				sandbox.utils.ajax(local, 'GET', obj, function (data) {
					var responseText = $(data.responseText).find(args['data-module-filter'].target)[0].outerHTML;
					$(args['data-module-filter'].target).empty().append(responseText);
					sandbox.moduleEventInjection(responseText);

					if (local_pathname === "/kr/ko_kr/search") {
						params = local + '&' + obj; // 검색
					} else {
						params = local + '?' + obj; // 카테고리
					}
					history.pushState(null, null, params);
					countHistory--;
					filterStickyConfirm();
				});
			}
		}

		/** 20190419 필터 카운트 추가
		* 1.필터별 카운트 표시
		* 2.전체 카운트 표시
		*/
		var countingSelectedFilters = function(){

			var $divWrap = $(this).parents( '.ncss-filter' );  // 현재 선택된 체크박스의 상위 엘리먼트
			var subTitle = $divWrap.find( '.tit-text' ).attr( 'data-click-name' );	// 필터별 서브타이틀
			var subCnt = $divWrap.find( 'li input:checkbox:checked' ).length;  // 필터별 선택된 갯수

			// 서브타이틀 옆에 숫자카운팅 표시
			if( subCnt > 0 ){
				$divWrap.find( '.tit-text' ).text( subTitle + '(' + subCnt + ')' );
			} else {
				$divWrap.find( '.tit-text' ).text( subTitle );
			}

			// 전체 카운트
			var totalCnt = $( '.section-filter' ).find( '.input-checkbox.checked' ).length;
			if( totalCnt > 0 ){
				$( '.f-btn-reset .num' ).text( '(' + totalCnt + ')' );
				resetWrap.addClass('active');
			} else {
				$( '.f-btn-reset .num' ).text( '' );
				resetWrap.removeClass('active');
			}
		}
		$( window ).on( 'load', function() {
			countingSelectedFilters();
			var bodyHeight = $('.contents-body');
			var sideHeight = $('.contents-side');
			if (sideHeight.height() > bodyHeight.height()) sideHeight.addClass('clearSticky');
			else sideHeight.removeClass('clearSticky');
		});

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-filter]',
					attrName:['data-module-filter'],
					moduleName:'module_filter',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});

})(Core);
