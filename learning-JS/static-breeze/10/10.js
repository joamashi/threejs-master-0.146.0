(function(Core){
    Core.register('module_date_filter_thedraw', function(sandbox){
        var drawTypeValue = "";
        var Method = {

            $that:null,
            moduleInit:function(){
                var $this = $(this);
                Method.$that = $this;
                Method.$start = Method.$that.find('#start-date');
                Method.$end = Method.$that.find('#end-date');
                drawTypeValue = $this.find('[data-type-list] .active').attr('data-type');

                setTimeout(function(){
                    $this.find('.uk-accordion').css('height','auto');
                }, 100);

                $this.find('[data-type-list] a').on('click', function(){
                    drawTypeValue = $(this).attr('data-type');
                    var index = $this.find('[data-date-list] .active').index();
                    if(index < 0 ){
                        index = 2;
                        var value = 'M,-3'.split(',');
                    }else{
                        var value = $this.find('[data-date-list] .active').data('date').split(',');
                    }
                    Method.searchSubmit( moment().add(value[1], value[0]).format('YYYYMMDD'), moment().format('YYYYMMDD'), index);
                });

                $this.find('[data-date-list] a').on('click', function(){
                    var value = $(this).data('date').split(',');
                    Method.searchSubmit( moment().add(value[1], value[0]).format('YYYYMMDD'), moment().format('YYYYMMDD'), $(this).index());
                });

                $this.find('[data-search-btn]').on('click', function(){
                    if( Method.getValidateDateInput() ){

                        var today = new Date();   //오늘 날짜 가져오기
                        var dd = today.getDate();
                        var mm = today.getMonth()+1; //January is 0!
                        var yyyy = today.getFullYear();
                        if(dd < 10) {
                            dd='0'+dd
                        }
                        if(mm < 10) {
                            mm='0'+mm
                        }
                        str_today = yyyy+'-' + mm+'-'+dd;

                        var start    = Method.$start.val().toString();
                        var end      = Method.$end.val().toString();
                        var date_chk = Method.dateDiff(moment(start, 'YYYY.MM.DD').format('YYYY-MM-DD'), str_today);  //2년 체크..

                        if(!date_chk){
                            UIkit.modal.alert( '조회기간은 최대 2년 이내로 자료가 조회 가능합니다.' );
                            return;
                        }

                        Method.searchSubmit( moment(start, 'YYYY.MM.DD').format('YYYYMMDD'), moment(end, 'YYYY.MM.DD').format('YYYYMMDD'), 'detail');

                    }else{
                        UIkit.modal.alert( '기간을 선택해 주세요!' );
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
                    })
                })
            },

            dateDiff:function(_date1, _date2) {
                var diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
                var diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);

                diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
                diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());

                var d = true;
                var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
                diff = Math.ceil(diff / (1000 * 3600 * 24));

                if(diff > 730){
                    d = false;
                }
                return d;
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
                url = sandbox.utils.url.removeParamFromURL( url, 'drawType' );
                url = sandbox.utils.url.removeParamFromURL( url, 'dateType' );
                url = sandbox.utils.url.removeParamFromURL( url, 'page' );
                url = sandbox.utils.url.removeParamFromURL( url, 'stdDt' );
                url = sandbox.utils.url.removeParamFromURL( url, 'endDt' );

                // 전체 검색
                if(_.isUndefined( start )){
                    url = sandbox.utils.url.removeParamFromURL( url, 'stdDt' );
                    url = sandbox.utils.url.removeParamFromURL( url, 'endDt' );
                }else{
                    var opt = {
                        stdDt : start,
                        endDt : end,
                        dateType : type,
                        drawType : drawTypeValue
                    }
                    url = sandbox.utils.url.appendParamsToUrl( url, opt );
                }
                window.location.href = url;
            },
            reset:function(){
                Method.$start.val('').trigger('focusout');
                Method.$end.val('').trigger('focusout');
            }
        }
        return {
            init:function(){
                sandbox.uiInit({
                    selector:'[data-module-date-filter-thedraw]',
                    attrName:'data-module-date-filter-thedraw',
                    moduleName:'module_date_filter-thedraw',
                    handler:{context:this, method:Method.moduleInit}
                });
            }
        }
    });
})(Core);