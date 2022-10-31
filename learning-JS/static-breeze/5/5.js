(function(Core){
	'use strict';

	Core.register('module_date_filter', function(sandbox){
		var Method = {
			$that:null,
			moduleInit:function(){
				var $this = $(this);
				Method.$that = $this;
				Method.$start = Method.$that.find('#start-date');
				Method.$end = Method.$that.find('#end-date');

				//css로 처리가 안되어 강제아코디언 height auto 추가;
				//꼭 지워야한다.
				setTimeout(function(){
					$this.find('.uk-accordion').css('height','auto');
				}, 100);

				$this.find('[data-date-list] a').on('click', function(){
					var value = $(this).attr('data-date');
					var currentQueryParams = sandbox.utils.getQueryParams(location.href);
					var arrCurrentQuery = [];
					for(var key in currentQueryParams){
						if(key !== 'fgType' && key !== 'ableCod' && key !== 'fulfillType'){
							arrCurrentQuery.push(key+'='+currentQueryParams[key]);
						}
					}

					switch(value){
						case '' :
							window.location.href = location.pathname;
							break;
						case 'ship' :
							window.location.href = location.pathname +'?'+ 'fgType=PHYSICAL_SHIP&fulfillType=type1';
							break;
						case 'pickup' :
							window.location.href = location.pathname +'?'+ 'fgType=PHYSICAL_PICKUP&fulfillType=type2';
							break;
						case 'bopis' :
							window.location.href = location.pathname +'?'+ 'ableCod=exclude&fulfillType=type1';
							break;
						case 'ropis' :
							window.location.href = location.pathname +'?'+ 'ableCod=only&fulfillType=type2';
							break;
					}
				});

				$this.find('[data-search-btn]').on('click', function(){
					if( Method.getValidateDateInput() ){
						var start = Method.$start.val().toString();
						var end = Method.$end.val().toString();

						//alert( start );
						//alert( moment(start, 'YYYYMMDD') );
						//alert( moment(start, 'YYYY.MM.DD').format('YYYYMMDD'));
						Method.searchSubmit( moment(start, 'YYYY.MM.DD').format('YYYYMMDD'), moment(end, 'YYYY.MM.DD').format('YYYYMMDD'), 'detail' );
					}else{
						UIkit.modal.alert( '기간을 선택해 주세요' );
					}
				});

				// 초기화
				$this.find('[data-reset-btn]').on('click', Method.reset);

				// uikit datepicker module 적용
				$this.find('input[class="date"]').each( function(){
					if( !moment($(this).val(), 'YYYY.MM.DD').isValid() ){
						$(this).val('');
					}
					if( $.trim( $(this).val() ) != ''){
						$(this).val( moment($(this).val(), 'YYYYMMDD').format('YYYY.MM.DD'));
					}
					var datepicker = UIkit.datepicker($(this), {
						maxDate : true,
						format : 'YYYY.MM.DD'
					});

					datepicker.on( 'hide.uk.datepicker', function(){
						$(this).trigger('focusout');
						Method.updateDateInput();
					});
				});

				//data-module-date-filter
			},

			// 앞보다 뒤쪽 날짜가 더 뒤면 두값을 서로 변경
			updateDateInput:function(){
				var start = String(Method.$start.val());
				var end = String(Method.$end.val());

				if( $.trim( start ) == '' || $.trim( end ) == ''  ){
					return;
				}

				// 같다면
				//var isSame = moment(Method.$start.val()).isSame(Method.$end.val());
				// 작다면
				//var isBefore = moment(Method.$start.val()).isBefore(Method.$end.val());
				// 크다면

				var isAfter = moment(start, 'YYYY.MM.DD').isAfter(moment(end, 'YYYY.MM.DD'));

				if( isAfter ){
					var temp = Method.$end.val();
					Method.$end.val( Method.$start.val() );
					Method.$start.val( temp );
				}
			},
			getValidateDateInput:function(){
				var start = String(Method.$start.val());
				var end = String(Method.$end.val());

				if( moment( start, 'YYYY.MM.DD' ).isValid() && moment( end, 'YYYY.MM.DD' ).isValid() ){
					return true;
				}
				return false;
			},
			searchSubmit:function( start, end, type ){
				var url = sandbox.utils.url.getCurrentUrl();
				url = sandbox.utils.url.removeParamFromURL( url, 'dateType' );

				// 전체 검색
				if(_.isUndefined( start )){
					url = sandbox.utils.url.removeParamFromURL( url, 'stdDate' );
					url = sandbox.utils.url.removeParamFromURL( url, 'endDate' );
				}else{
					var opt = {
						stdDate : start,
						endDate : end,
						dateType : type
					}

					url = sandbox.utils.url.appendParamsToUrl( url, opt )
				}

				window.location.href = url;

			},
			reset:function(){
				//Method.$start.val('').trigger('focusout');
				//Method.$end.val('').trigger('focusout');
				window.location.href = location.pathname;
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-date-filter]',
					attrName:'data-module-date-filter',
					moduleName:'module_date_filter',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);