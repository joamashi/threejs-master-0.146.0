(function(Core){
	Core.register('module_review', function(sandbox){
		var $deferred, $this, modal, args, arrQueryString = [], currentProductId, isSignIn;
		var Method = {
			moduleInit:function(){
				args = arguments[0];
				$this = $(this);
				isSignIn = (args.isSignIn === 'true') ? true : false;

				//필터조건 초기화 ( 최신순, 도움순 )
				arrQueryString[2] = sandbox.utils.getQueryParams($('.sort-tabs').find('.sort-item').filter('.active').attr('href'), 'array').join('&');

				//modal init
				// modal = UIkit.modal('#common-modal', {center:true});
				modal = UIkit.modal('#common-modal-large', {center:true});
				modal.off('hide.uk.modal.review').on({
					'hide.uk.modal.review':function(){
						$this.find('.contents').empty();
						if(isSignIn != sandbox.getModule('module_header').getIsSignIn()){
							if(currentProductId) Method.reviewProcessorController(currentProductId);
						}
					}
				});

				endPoint = Core.getComponents('component_endpoint');

				var param = {};
				param.link_name= "Click Links";
				param.click_area = "pdp";
				param.click_name = "review_view more";
				param.page_event = {
					link_click : true
				}

				$this.find('.shorten-toggle').on('click', function(e){
					if($(this).text()=='더보기'){
				  		endPoint.call('adobe_script', param);
			  		};
				});

				// product detail 상품 리뷰 쓰기
				$this.find('.review-write-btn').off('click').on('click', function(e){
					e.preventDefault();

					var target = $(this).attr('href');
					var productId = $(this).attr('data-productid');

					if(!productId){
						UIkit.notify('productID 가 없습니다.', {timeout:3000,pos:'top-center',status:'warning'});
						return;
					}

					Method.reviewTask(target, productId);
				});

				//review filter
				$this.find('a.review-filter').on('click', function(e){
					e.preventDefault();
					var query = sandbox.utils.getQueryParams($(this).attr('href'), 'array').join('&');
					var productId = $(this).attr('data-productid');

					if($(this).hasClass('star')){
						arrQueryString[0] = query;
					}else if($(this).hasClass('hash')){
						arrQueryString[1] = query;
					}else if($(this).hasClass('other')){
						arrQueryString[2] = query;
					}

					Method.reviewProcessorController(productId);
				});

				$this.find('.review-filter-delete').on('click', function (e) {
					e.preventDefault();

					var query = sandbox.utils.getQueryParams($(this).attr('href'), 'array').join('&');
					var productId = $(this).attr('data-productid');

					arrQueryString = [];
					arrQueryString[2] = query;
					Method.reviewProcessorController(productId);
				});

				$this.find('.btn-more-review').on('click', function(e){
					e.preventDefault();
					var productId = $(this).attr('data-productid');

					// 처음 팝업이 열릴때는 리스트를 불러온다.
					var isFirstLoad = UIkit.modal('#detail-review-all').dialog.find('#review-list').find('li').length == 0;

					if (isFirstLoad) {
						Method.reviewProcessorController(productId, function(){
							UIkit.modal('#detail-review-all').show();
						}, 100);
					}else{
						UIkit.modal('#detail-review-all').show();
					}
				})

				Method.eventInitialize(this);

				/* browse history back */
				if(sandbox.utils.mobileChk) {
					$(window).on('popstate', function(e) {
						var data = e.originalEvent.state;
						if(modal && modal.active){
							modal.hide();
						}
					});
				}
			},
			eventInitialize:function(target_el){
				//review feedback
				var feedBack = sandbox.getComponents('component_like', { context: $(target_el).find('.read-list') }, function () {
					this.addEvent('likeFeedBack', function (data) {
						var feedBackTotal = 0;
						if (data.hasOwnProperty('HELPFUL')) {
							feedBackTotal = parseInt(data.HELPFUL);
						}
						if (data.hasOwnProperty('NOTHELPFUL')) {
							feedBackTotal = parseInt(data.NOTHELPFUL);
						}

						var currentFeedBackTotal = parseInt($(this).find('.num').text()); //현재 카운트

						if( currentFeedBackTotal >= feedBackTotal ){ // 2020-06-03 @pck 서버에서 간혹 추천 개수가 현재와 동일하게 오는 경우를 대비해서 서버 값이 미증가 시 강제로 증가
							currentFeedBackTotal++;
                        }else{
                            currentFeedBackTotal = feedBackTotal;
                        }
						$(this).find('.num').text( String(currentFeedBackTotal) );
					});
				});

				$(target_el).find('.read-list, #mypage_review_list').off('click')
					// 상품 리뷰 수정
					.on('click', '.review-modify', function (e) {
						e.preventDefault();
						e.preventDefault();
						var target = $(this).attr('href');
						var url = $(this).attr('data-link');
						var productId = $(this).attr('data-productid');
						var defer = $.Deferred();
						var successMsg = $(this).attr('data-successmsg');
						//review 모달 css 추가
						$(target).addClass('review-write');

						sandbox.utils.promise({
							url: url,
							type: 'GET',
							data: { 'redirectUrl': location.pathname }
						}).then(function (data) {
							$(target).find('.contents').empty().append(data);
							sandbox.moduleEventInjection(data, defer);
							modal.show();
							return defer.promise();
						}).then(function (data) {
							//arrQueryString = [];
							UIkit.notify(successMsg, { timeout: 3000, pos: 'top-center', status: 'success' });
							Method.reviewProcessorController(productId);
						}).fail(function (msg) {
							defer = null;
							UIkit.notify(msg, { timeout: 3000, pos: 'top-center', status: 'danger' });
						});

					})
					.on('click', '.review-remove, .mypage-review-remove', function (e) {
						e.preventDefault();
						var _self = this;
						var url = $(this).attr('href');
						var productId = $(this).attr('data-productid');
						var reviewId = $(this).attr('data-reviewId');
						var successMsg = $(this).attr('data-successmsg');

						//마이페이지 리뷰 삭제인지 pdp 인지 분기처리  버튼 클래스명으로..
						var mypagereview = $(this).hasClass('mypage-review-remove');  //true면  마이페이지

						UIkit.modal.confirm("리뷰 삭제 시 50마일이 차감됩니다.</br>삭제할까요?", function () {
							sandbox.utils.ajax(url, 'GET', {}, function (data) {
								var data = sandbox.rtnJson(data.responseText);
								if (data.result) {
									UIkit.notify(successMsg, { timeout: 3000, pos: 'top-center', status: 'success' });

									location.reload();

									/*
									if (mypagereview) { //마이페이지 에서는 리로드 한다.
										location.reload();
									} else {
										Method.reviewProcessorController(productId);
									}
									*/

								} else {
									UIkit.notify(data.errorMessage, { timeout: 3000, pos: 'top-center', status: 'danger' });
								}
							});
						});
					})
			},
			reviewTask:function(target, productId){
				var defer = $.Deferred();
				currentProductId = productId;

				sandbox.getModule('module_header').setModalHide(true).setLogin(function(data){
					//console.log('review : ', data);
					var isSignIn = data.isSignIn;
					sandbox.utils.promise({
						url:sandbox.utils.contextPath + '/review/reviewWriteCheck',
						type:'GET',
						data:{'productId':productId}
					}).then(function(data){
						//data.expect 기대평
						//data.review 구매평
						if(data.expect || data.review){
							/* review history */
							if(sandbox.utils.mobileChk) history.pushState({page:'review'}, "review", location.href);
							isSignIn = isSignIn;
							return sandbox.utils.promise({
								url:sandbox.utils.contextPath + '/review/write',
								type:'GET',
								data:{'productId':productId, 'redirectUrl':location.pathname, 'isPurchased':data.review}
							});
						}else{
							defer.reject('리뷰를 작성할 수 없습니다.');
						}
					}).then(function(data){
						$(target).addClass('review-write');
						$(target).find('.contents').empty().append(data);
						sandbox.moduleEventInjection(data, defer);
						modal.show();
						return defer.promise();
					}).then(function(data){
						Method.reviewProcessorController(productId);
						modal.hide();
					}).fail(function(msg){
						defer = null;
						UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'danger'});
						if(modal.isActive()) modal.hide();
					});
				});
			},
			reviewProcessorController:function(productId, callback, delay){
				// 리뷰를 작성한 후 or 리뷰 정렬을 할 때 새로 로드하여 화면 갱신 처리 하는 함수
				var arrData = [];
				var obj = {
					/*'mode':'template',
					'templatePath':'/modules/productListReview',
					'resultVar':'review',*/
					'productId':productId
				}

				for(var key in obj){
					arrData.push(key+'='+obj[key]);
				}

				///processor/execute/review      /review/list, /account/reviewlist
				//console.log(arrQueryString.join('&'));

				//템플릿 캐시로 인해 추가된 로딩바 상태
				sandbox.setLoadingBarState(true);

				_.delay(function(){
					sandbox.utils.ajax(args.api, 'GET', arrData.join('&') + arrQueryString.join('&') + '&mode=template&resultVar=reviewSummaryDto', function(data){
	                    // 탭 선택시 페이지 초기화
	                    sessionStorage.setItem('categoryCurrentPage', 1);

	                    //li 부분만 서버에서 받은 템플릿으로 교체 한다.
						var ulTag = $(args.target).find('#review-list');

						ulTag.empty();
						//PDP의 리뷰서머리 부분을 업데이트 한다.(3개만 표시)
						var ulTagSummary = $('#review-summary');
						ulTagSummary.empty();
	                    $(data.responseText).find('li').each(function(index){
	                    	var li = $(this);
							if(ulTag){
								ulTag.append(li.clone());
							}
							if(ulTagSummary && index < 3){
								ulTagSummary.append(li.clone());
							}
						});

						// 페이징 영역 새로 그리기
						$(args.target).find('#review-paging').empty().append($(data.responseText).find('#review-paging').html());

	                    //다른 텝에서 '더 보기'를 눌러 전체 리뷰를 로드한 경우 버튼이 없으므로 다시 설정
	                    if($this.find('button#load-more').css("display") == "none"){
							$('button#load-more').show();
						}

						sandbox.moduleEventInjection(data.responseText);
						Method.eventInitialize($this);

						if (typeof callback === 'function'){
							callback();
						}
					}, false, false);
				},
				delay || 2500);

			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-review]',
					attrName:'data-module-review',
					moduleName:'module_review',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				$deferred = null;
				$this = null;
				args = null;
				modal = null;

				//console.log('destroy reveiw module');
			},
			setDeferred:function(defer){
				$deferred = defer;
			},
			history:function(){

			}
		}
	});
})(Core);