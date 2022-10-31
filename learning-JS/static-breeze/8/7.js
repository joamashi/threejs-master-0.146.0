(function(Core){
	Core.register('module_promotion', function(sandbox){
		var endPoint;
		var Method = {
			$that:null,
			$form:null,
			$errorMessage:null,

			moduleInit:function(){
				/*
					@replaceTarget : 결과값이 들어갈 dom
					@errorMessageTarget : error message 가 들어갈 dom
				*/
				$.extend(Method, arguments[0]);

				var $this = $(this);
				Method.$that = $this;
				Method.$form = $this.find("form.promo-form");
				Method.$errorMessage = $this.find(Method.errorMessageTarget);
				endPoint = Core.getComponents('component_endpoint');

				if( Method.$form.length < 1 ){
					return;
				}

				$(this).find("button[type='submit']").on("click", function(e){
					e.preventDefault();
					Method.submitCode();
				});

				$(this).find(".promo-list .btn-delete").on("click", function(e){
					e.preventDefault();
					Method.removeCode( $(this).attr("href") );
				});

				//장바구니, 결제하기 페이지 에서 적용 쿠폰 있을경우,
				//쿠폰 선택시 자동 마킹..기능 추가.
				$this.find("[data-offer-set]").on("click", function(e){
					var code = $(this).data('offer-set');
					Method.$errorMessage.addClass('uk-hidden');
					$("#promoCode").val(code).trigger('keydown');
				});

			},
			removeCode:function(url){
				sandbox.setLoadingBarState(true);
				BLC.ajax({
					url: url,
					type: "GET"
				}, function(data) {
					if (data.error && data.error == "illegalCartOperation") {
						UIkit.modal.alert(data.exception);
						sandbox.setLoadingBarState(false);
					} else {
						window.location.reload();
					}
				});
			},
			submitCode:function(){
				var $form = Method.$form;

				//프로모 코드가  null 일경우 오류 발생.
				if($form.find("#promoCode").val()==""){
					UIkit.modal.alert("프로모션 코드를 입력해 주세요.");
					return;
				};

				sandbox.setLoadingBarState(true);
				BLC.ajax({url: $form.attr('action'),
						type: "POST",
						data: $form.serialize()
					}, function(data, extraData) {

						var endPointData = $.extend(extraData, {
							promoCode : sandbox.utils.url.getQueryStringParams( $form.serialize() ).promoCode
						});

						if (data.error && data.error == 'illegalCartOperation') {
							sandbox.setLoadingBarState(false);
							UIkit.modal.alert(data.exception);
							endPointData.exception = 'illegalCartOperation';

						} else {
							if(!extraData.promoAdded) {
								sandbox.setLoadingBarState(false);
								//welcome2nike 로 끝나는 쿠폰의 경우 에러메세지 치환
								if(Core.utils.string.endsWith(Core.utils.string.toLower(extraData.promoCode), 'welcome2nike') && (extraData.exceptionKey=='error.promo.useless')){
									extraData.exception="장바구니 전체에 5만원 이상 구매 시 적용됩니다"
								}
								Method.$errorMessage.find(".text").html(extraData.exception)
								Method.$errorMessage.removeClass("uk-hidden");

							} else {
								if( _.isElement( Method.replaceTarget) ){
									sandbox.setLoadingBarState(false);
									$(Method.replaceTarget).html( data );
								}else{
									window.location.reload();
								}
							}
						}

						endPoint.call('applyPromoCode', endPointData);
					}
				);
				return false;
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-promotion]',
					attrName:'data-module-promotion',
					moduleName:'module_promotion',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);