(function(Core){
	var SearchField = function(){
		'use strict';

		var $this, $btn, $input, $resultWrap, opt, searchTxt = '', searchTxt_1='', _self, validateIS = false, isAction = true;
		var setting = {
			selector:'[data-component-searchfield]',
			resultWrap:'.result-wrap',
			btn:'.btn_search',
			input:'.input-textfield',
			attrName:'data-component-searchfield',
			resultTemplate:''
		}
		var rotationWords = new Array(), rollingTimer, rotationIndex = 0, setFirstWord, setStartRolling;

		var resultFunc = function(data){
			var json = (typeof data === Object) ? data : Core.Utils.strToJson(data.responseText || data, true);
			if(json.results.length > 0){
				addTemplate(json.results);
			}else{
				if(opt.complete !== 'auto'){
					UIkit.modal.alert('검색결과가 없습니다.', { labels: { 'Ok': '확인'}});
				}
			}

			isAction = true;
		}

		var addTemplate = function(data){
			if(setting.resultTemplate === ''){
				UIkit.notify('template is not defined', {timeout:3000,pos:'top-center',status:'warning'});
				return;
			}

			var template = Handlebars.compile($(setting.resultTemplate).html())(data);
			$resultWrap.empty().append(template);
		}

		var action = function(){
			endRollingSearchWord();

			//스페이스만 입력후 검색 할 경우, 최근 검색어에 표기되어 오류발생을
			searchTxt_1 = searchTxt.replace(/ /gi,"");

			if(searchTxt_1 !== ''){
				_self.fireEvent('beforeSubmit', this, [searchTxt]);

				if(opt.hasOwnProperty('api')){
					Core.Utils.ajax(opt.api, 'GET', {'q':searchTxt,'v':'3.0.0-com.nike'}, resultFunc);
				}else if(opt.hasOwnProperty('submit')){
					_self.fireEvent('submit', this, [$(opt.submit), searchTxt]);
					$(opt.submit).submit();
				}else if(opt.hasOwnProperty('onEvent')){
					_self.fireEvent('searchKeyword', this, [$(opt.onEvent), searchTxt]);
					isAction = true;
				}
			}else{
				//UIkit.modal.alert(opt.errMsg);
				_self.fireEvent('searchEmpty', this, [$(opt.onEvent)]);
				$input.setErrorLabel(opt.errMsg);
			}
		}

		 /* 검색어 롤링 */
		//인기검색어 롤링
		function rollingSearchWord(){
			if(rotationIndex == rotationWords.length){
				rotationIndex = 0;
			}
			var word = rotationWords[rotationIndex++];
			$('#search').val(word);
			searchTxt = word;
			// console.log('%d. %s', rotationIndex, word);
		}
		//5초마다 검색어 롤링 하도록 타이머를 걸어 준다.
		function startRollingSearchWordTimer(){
			// console.log('start rolling timer');
			if(rotationWords.length > 0){
				endRollingSearchWord();
				rollingTimer = setInterval(rollingSearchWord, 30000);
			}
		}
		//인기검색어 롤링 시작
		function startRollingSearchWord(){
			// console.log('start rolling word');
			//바로 표시 하는 경우, 검색어 입력 후 검색 시도시, 검색어가 사라지고 인기검색어로 검색이됨
			//2초 후에 첫 검색어가 표시되도록 한다.
			setFirstWord = setTimeout(rollingSearchWord, 2000);
			setStartRolling = setTimeout(startRollingSearchWordTimer, 5000);
		}
		//인기검색어 롤링 종료
        function endRollingSearchWord(){
			// console.log('end rolling');
			clearInterval(rollingTimer);
			rollingTimer = undefined;

			clearTimeout(setFirstWord);
			clearTimeout(setStartRolling);
		}

		//return prototype
		var Closure = function(){};
		Closure.prototype = {
			setting:function(){
				var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
			},
			init:function(){
				_self = this;
				opt = arguments[0];
				$this = $(setting.selector);
				$resultWrap = $this.find(setting.resultWrap);
				$btn = $this.find(setting.btn);

				// 필드값 판별 여부
				if (!$this.find('input').val() == '') {
					validateIS = true
				}

				$input = Core.getComponents('component_textfield', {
					context:$this,
					selector:'.input-textfield'
				}, function () {

					this.addEvent('focusin', function(e){
						// console.log('focusin');
						//etc-search-wrap active
						$resultWrap.addClass('active');
						//포커스 상태에서 롤링 멈추고, 입력된 내용을 비운다.
						endRollingSearchWord();
						searchTxt = "";
						$('#search').val(searchTxt);
					});

					this.addEvent('focusout', function(e){
						// console.log('out');
						searchTxt = $(this).val();
						//검색어 롤링 재시작
						startRollingSearchWord();

						$("#jq_icon-delete_thin").removeClass('icon-delete_thin');
						//$("input.jq_search").val('');
					});

					// 검색 x 아이콘
	 				this.addEvent('keyup', function(e){
	             		if( $(this).length>0){
							validateIS = false;
	                		$("#jq_icon-delete_thin").addClass('icon-delete_thin');
	 					}
	 				});

					this.addEvent('enter', function(e){
						searchTxt 	= $(this).val();
						searchTxt_1 = searchTxt.replace(/ /gi,"");

						if(isAction && searchTxt_1 !== ''){
							isAction = false;
							action();

							//EMB
							var widthMatch = matchMedia("all and (max-width: 767px)");
							if (Core.Utils.mobileChk || widthMatch.matches) {
								var mobileChk = 2;
							} else {
								var mobileChk = 1;
							}
							cre('send','Search',{search_string : searchTxt, event_number : mobileChk});
						}

					});
					if(opt.hasOwnProperty('autoComplete')){
						this.addEvent('keyup', function(e){
							// 비동기 호출 resultFunc callback 함수 넘김
							Core.Utils.ajax(opt.autoComplete, 'POST', {'q':$(this).val()}, resultFunc);
						});
					}
				});

				$btn.on('click', function(e){
					e.preventDefault();
					action();

					//EMB
					if(!searchTxt == ''){
						cre('send','Search',{search_string:searchTxt, event_number : 1});
					}
				});

				// result list click event
				$resultWrap.on('click', '.list a', function(e){
					e.preventDefault();

					validateIS = true;
					//$input.setValue($(this).text());
					_self.fireEvent('resultSelect', _self, [this]);

					/*if(!opt.hasOwnProperty('api')){
						$btn.trigger('click');
					}*/

					$resultWrap.removeClass('active');
				});

				//검색어 롤링 시작
				startRollingSearchWord();
				return this;
			},
			getValidateChk:function(){
				if(opt.required === 'false' || setting.isModify === 'true'){
					return true;
				}else if(opt.required === 'true'){
					return validateIS;
				}
			},
			setErrorLabel:function(message){
				$input.setErrorLabel(message||opt.errMsg);
			},
			getInputComponent:function(){
				return $input;
			},
			getResultWrap:function(){
				return $resultWrap;
			},
			setResultAppend:function(appendContainer, template, data){
				if(appendContainer === 'this'){
					$resultWrap.append(Handlebars.compile($(template).html())(data));
				}else{
					$(appendContainer).append(Handlebars.compile($(template).html())(data));
				}

			},
			setResultPrepend:function(appendContainer, template, data){
				if(appendContainer === 'this'){
					$resultWrap.prepend(Handlebars.compile($(template).html())(data));
				}else{
					$(appendContainer).prepend(Handlebars.compile($(template).html())(data));
				}

			},
      externalAction:function(){
				//매장 찾기 체크 박스 검색 이벤트
				//action 함수에서   searchTxt 값이  null 일경우 오류 발생.(	searchTxt_1 = searchTxt.replace(/ /gi,"");)
				searchTxt = "";
				action();
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_searchfield'] = {
		constructor:SearchField,
		attrName:'data-component-searchfield'
	};
})(Core);