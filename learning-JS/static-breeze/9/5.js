(function(Core){
	// var arrLatestKeywordList = []; // sessionStorage 으로 cookie 변경

	Core.register('module_search', function(sandbox){
		var $this, args, clickIS, endPoint, isSaveLatest;

		var setSearchKeyword = function (keyword) {
			//검색 클릭시 태깅 추가.
			var param = {};
				param.pre_onsite_search_phrase = keyword,
				param.page_event = {}
				param.page_event.pre_onsite_search = true;
				endPoint.call('adobe_script',param);
		}

		var Method = {
			moduleInit:function(){
				$this = $(this);
				args = arguments[0];
				clickIS = false;

				endPoint = Core.getComponents('component_endpoint');

				sandbox.getComponents('component_searchfield', {context:$this, resultTemplate:'#search-list', resultWrap:'.etc-search-wrap'}, function(){
					this.addEvent('resultSelect', function(data){

						var text = $(data).text();

						//nike는 인기검색어 앞에 순번이 있어 아이템 선택시 순번 제거 필요.
						// if(text.lastIndexOf('10', 0) === 0){
						// 	text = text.substring(4);
						// } else if(text.match(/^\d/)){
						// 	text = text.substring(3);
						// }

						var endPointData = {
							key : text,
							text : text
						}

						endPoint.call( 'searchSuggestionClick', endPointData );
						this.getInputComponent().setValue(text);
						setSearchKeyword(text);
						location.href = sandbox.utils.contextPath + '/search?q='+ text;
					});

					this.addEvent('beforeSubmit', function(data){
						setSearchKeyword(data);
					});


				});
				
				// sessionStorage 데이터 사용
				var autoSearchKeywordList = JSON.parse(sessionStorage.getItem('autoSearchKeyword'));
				function patchAutocomplete () {
					var oldFn = $.ui.autocomplete.prototype._renderItem;
					$.ui.autocomplete.prototype._renderItem = function (ul, item) {
						var re = new RegExp(this.term + "/*", "i");
						var t = item.label.replace(re, "<span class='highlight'>" + this.term + "</span>");

						var ts = item.value;
						// var pattern = new RegExp(item.label, 'g');
						// arrLatestKeywordList = sandbox.utils.rtnMatchComma(latestKeywordList.replace(pattern, ''));
						// arrLatestKeywordList.unshift(item.label);
						// if(arrLatestKeywordList.length >= args.keywordMaxLen){
						// 	arrLatestKeywordList = arrLatestKeywordList.slice(0, -1);
						// }
						// sessionStorage.setItem('latestSearchKeyword', arrLatestKeywordList.join(','));

						// return $("<li></li>").data("item.autocomplete", item).append("<a data-target=" + item.label + " href='/kr/ko_kr/search?q=" + item.label + "'><em>" + t + "</em></a>").appendTo(ul);



						return $("<li></li>").data("item.autocomplete", item).append("<a data-target='" + item.label + "' href='#'><em>" + t + "</em></a>").appendTo(ul);
					};
				}
				patchAutocomplete();

				$("#search").autocomplete({
					source: function (req, response) {
						var re = $.ui.autocomplete.escapeRegex(req.term);
						var matcher = new RegExp(re + "/*", "i");
						var a = $.grep(autoSearchKeywordList, function (item, index) {
							return matcher.test(item);
						});
						a = a.splice(0, 10);
						response(a);
						$('#ui-id-1').hide();
					},
					minLength:2,
					// autoFocus: true,
					change: function () {
						//console.log('change');
					},
					close: function () {
						//console.log('close');
						//$('.etc-search-wrap').addClass('active');
					},
					focus: function () {
						//console.log('focus');
					},
					open: function () {
						//console.log('open');

						$('#ui-id-gnb').on('click','a',function(event){
							var _target = $(this).data('target');
							setSearchKeyword(_target);
							location.href = sandbox.utils.contextPath + '/search?q='+ _target;
						});
					},
					response: function () {
						//console.log('response');
					},
					search: function () {
						
						setTimeout(function() {
							
							var gnbSearchResult = $('#ui-id-1').html();
							if($.trim($('#ui-id-1').html())!=''){
								$('.search_list').find('p').css("display","none");
								$('ui-id-gnb').empty();
								$('#ui-id-gnb').html($('#ui-id-1').html());
								//$('#ui-id-1').empty();
								
							}
							
						}, 100);

						//console.log('select');
					},
					select: function () {
						//console.log('select');
					}
				});

				$(document).on('click','.search-mask', function(){ //20180516추가
					$('.etc-search-wrap').removeClass('active');
					$("body").css('position','relative');
          			$('.search-mask').fadeOut();
				});

			}
		}



		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-search]',
					attrName:'data-module-search',
					moduleName:'module_search',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);