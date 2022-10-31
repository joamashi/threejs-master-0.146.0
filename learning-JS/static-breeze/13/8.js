(function(Core){
	Core.register('module_restock', function(sandbox){

		// 입고 알림 신청 슬라이더
		$('.mtopslider').bxSlider({captions: true});

		// UIkit.modal('#restock-notification').show();
		UIkit.modal.dialog.template = '<div class="uk-modal module_restock"><div class="uk-modal-dialog"></div></div>';

		// UIkit confirm clone "confirm_title"
		UIkit.modal.confirm_title = function (content, onconfirm, oncancel) {
			var options = arguments.length > 1 && arguments[arguments.length-1] ? arguments[arguments.length-1] : {};

			onconfirm = UIkit.$.isFunction(onconfirm) ? onconfirm : function(){};
			oncancel  = UIkit.$.isFunction(oncancel) ? oncancel : function(){};
			options   = UIkit.$.extend(true, {bgclose:false, keyboard:false, modal:false, labels:UIkit.modal.labels}, UIkit.$.isFunction(options) ? {}:options);

			var result = '<h1>' + String(content.mainMsg) + '</h1>' + '<p>' + String(content.subMsg) + '</p>';

			var modal = UIkit.modal.dialog(([
				'<div class="uk-margin uk-modal-content">' + result + '</div>',
				'<div class="uk-modal-footer uk-text-center"><button class="uk-button js-modal-confirm-cancel">' + options.labels.Cancel + '</button> <button class="uk-button uk-button-primary js-modal-confirm">'+options.labels.Ok+'</button></div>'
			]).join(""), options);

			modal.element.find(".js-modal-confirm, .js-modal-confirm-cancel").on("click", function(){
				UIkit.$(this).is('.js-modal-confirm') ? onconfirm() : oncancel();
				modal.hide();
			});

			modal.on('show.uk.modal', function(){
				setTimeout(function(){
					modal.element.find('.js-modal-confirm').focus();
				}, 50);
			});

			return modal.show();
		};

		// UIkit alert clone "alert_title"
		UIkit.modal.alert_title = function (content, options) {

			options = UIkit.$.extend(true, {bgclose:false, keyboard:false, modal:false, labels:'확인'}, options);

			if (typeof content === 'object') {
				var result = '<h1>' + String(content.mainMsg) + '</h1>' + '<p>' + String(content.subMsg) + '</p>';
			} else {
				var result = '<h1>' + String(content) + '</h1>';
			}

			var modal = UIkit.modal.dialog(([
				'<div class="uk-margin uk-modal-content">' + result + '</div>',
				'<div class="uk-modal-footer uk-text-center"><button class="uk-button uk-button-primary uk-modal-close">' + options.labels + '</button></div>'
			]).join(""), options);

			modal.on('show.uk.modal', function(){
				setTimeout(function(){
					modal.element.find('button:first').focus();
				}, 50);
			});

			return modal.show();
		};

		var $this = $(this);
		var endPoint, allSkuData, args, formatPhone, NotifyName;
		var Method = {
			moduleInit:function(){
				//SKU 정보에서 재고수량을 확인 하여 입고 알림 가능한 사이즈만 활성화
				//skuData는 productOptionComponent 에서 리턴 받는다,
				//단 출시예정상품(args.isForcedDisplay === 'true')일 경우에는 모든 사이즈를 선택가능하도록 활성화 한다.

				args = arguments[0];
				endPoint = sandbox.getComponents('component_endpoint');

				if(args.isForcedDisplay === 'false'){
					if(sandbox.getComponents('component_product_option', {context:$(document)}) !== undefined){
						sandbox.getComponents('component_product_option', {context:$(document)}, function () {
							this.addEvent('skuLoadComplete', function(data){
								allSkuData = data;
								Method.checkQuantity();

								//입고알림 문자받기 show or hide
								if($("#set-restock-alarm").length > 0 && allSkuData){
									for(var index = 0; allSkuData.length > index; index++){
										if(allSkuData[index].quantity == 0){
											//enable 입고알림문자받기
											$('#set-restock-alarm').show();
											break;
										}
									}
								}

								// ONE SIZE 초기값 설정
								var oneSize = $('#size-grid li');
								if (oneSize.hasClass('ONE')) {
									oneSize.find('a').addClass('selected');
									$('#size-value').text(oneSize.text()).attr('data-sku-id', allSkuData[0].skuId);
								}
							});
						});
					}else{
						//출시된상품이며, 카테고리 리스트 페이지에서 입고알림신청을 받을때 사용된다.
						Core.Utils.ajax(Core.Utils.contextPath + '/productSkuInventory', 'GET', {productId:args.productId}, function(data){
							var responseData = data.responseText;
							allSkuData = Core.Utils.strToJson(responseData).skuPricing || {};
							Method.checkQuantity();
						}, false, true);
					}
				}else{
					//출시예정상품
					var formData = sandbox.utils.getQueryParams($(this).find('#stockAlertForm').serialize());
					sandbox.utils.ajax(sandbox.utils.contextPath + '/restock/beforeLaunch', 'POST', {
						requestUri:args.productUri.replace(sandbox.utils.contextPath, ''),
						csrfToken:formData.csrfToken
					}, function(data){
						allSkuData = sandbox.utils.strToJson(data.responseText);
						Method.checkQuantity();

						if($("#set-restock-alarm").length > 0){
							$('#set-restock-alarm').show();
						}
					}, false, true);
				}

				sandbox.getComponents('component_categoryitem', {context:$(document)}, function () {
					// _self.fireEvent('skuLoadComplete', _self, [allSkuData]);
					this.addEvent('skuLoadComplete', function (data, Notify) {
						allSkuData = data;
						NotifyName = Notify;
						// console.log('allSkuData====>', allSkuData);
						// console.log('Notify====>', NotifyName);
						//Method.checkQuantity();
					});
				});

				sandbox.getComponents('component_launchitem', {context:$(document)}, function () {
					// _self.fireEvent('skuLoadComplete', _self, [allSkuData]);
					this.addEvent('skuLoadComplete', function (data, Notify) {
						allSkuData = data;
						NotifyName = Notify;
						// console.log('allSkuData====>', allSkuData);
						// console.log('Notify====>', NotifyName);
						//Method.checkQuantity();
					});
				});

				sandbox.getComponents('component_gallery', {context:$(document)}, function () {
					this.addEvent('skuLoadComplete', function (Notify) {
						NotifyName = Notify;
						// console.log('Notify====>', NotifyName);
						//Method.checkQuantity();
					});
				});

				//사이즈 선택시 css 변경
				$(this).find('#size-grid li').on('click', function(e){
					if(!$(this).attr('disabled')){
						$(this).parent().find('li a').each(function(){
							//기존에 선택된 사이즈 해지
							$(this).removeClass('selected');
						});
						$(this).find('a').addClass('selected');
						//사이즈 영역에 선택한 사이즈 값 표시
						document.getElementById('size-value').innerHTML= $(this).text();

						//sku id 저장
						var sizeId = $(this).attr('value');
						var forBreak = false;
						for (var idx=0;idx < allSkuData.length;idx++) {
							for(var jdx=0; jdx < allSkuData[idx].selectedOptions.length; jdx++){
								if (allSkuData[idx]['selectedOptions'][jdx] == sizeId) {
									$('#size-value').attr('data-sku-id', allSkuData[idx].skuId);
									forBreak = true;
									break;
								}
							}
							if(forBreak){
								break;
							}
						}

						//사이즈 선택 후 사이즈 선택영역을 숨긴다
						Method.sizeTableOpen();

						//Adobe 태깅 부 추가 2020-04-02 pck (s)
						var param = {};
						var size = $(this).text().trim();
						var sizeRunAvailability = $('input[name="size-run-availability"]').val();

						param.link_name = 'Size Run Selections';
						param.size_run_selection = (size !== '') ? size : '';
						param.size_run_availability = (sizeRunAvailability !== '') ? sizeRunAvailability : '';
						param.page_event = {size_run_select : true}
						endPoint.call('adobe_script', param);
						//Adobe 태깅 부 추가 2020-04-02 pck (e)
					}
				});

				//사이즈 표시 영역 선택
				$(this).find('#size-value-area').on('click', function(){
					//사이즈가 선택된 경우에만 사이즈 리스트를 닫는다.
					if($('#size-value').attr('data-sku-id')){
						Method.sizeTableOpen();
					} else {
						UIkit.modal.alert_title("상품의 사이즈를 선택하셔야 입고 알림 문자를 받으실 수 있습니다.");
					}
					//console.log(allSkuData[$(this).index()].skuId)
				});

				//개인정보 취급 방침 팝업 열기
				$(this).find('#privacyPolicyLink').on('click', function(e){
					$('#layerPrivacyPolicy').show();
				});

				//개인정보 취급 방침 팝업 닫기
				$('[id^="closePolicy"]').each(function(){
					$(this).click(function(){
						$('#layerPrivacyPolicy').hide();
					});
				});

				//입고알림 서비스 신청 하기
				$(this).find('#request-restock-alarm').on('click', function(e){
					//사이즈 선택 확인
					if(!$('#size-value').attr('data-sku-id')){
						UIkit.modal.alert_title("사이즈를 선택하세요.");
						return;
					}
					//휴대전화 번호 입력 확인 targetValue
					var phoneNum = document.getElementById("targetValue").value;

					if(10 > phoneNum.length){
						UIkit.modal.alert_title('휴대폰번호를 정확하게 입력 하셔야<br/>입고 알림 서비스를 이용 하실 수 있습니다.');
						return;
					} else {
						var pattern =  new RegExp('^[0-9]*$', 'g');
						if(!pattern.test(phoneNum)){
							UIkit.modal.alert_title('휴대폰번호를 정확하게 입력 하셔야<br/>입고 알림 서비스를 이용 하실 수 있습니다.');
							return;
						}
					}
					//체크박스 확인
					if(!$('#check-privacy-policy-agree').hasClass('checked')){
						UIkit.modal.alert_title('개인정보 취급방침 이용에 동의 하셔야<br/>입고 알림 서비스를 이용 하실 수 있습니다.');
						return;
					}

					// phone number format
					var tempPhone;
					if(phoneNum.length > 10){
						tempPhone = phoneNum.match(/^(\d{3})(\d{4})(\d{4})$/);
					} else {
						tempPhone = phoneNum.match(/^(\d{3})(\d{3})(\d{4})$/);
					}
					formatPhone = tempPhone[1] + '-' + tempPhone[2] + '-' + tempPhone[3];

					var notify = {
						mainMsg : '입고 알림 신청을 하시겠습니까?',
						subMsg : '고객님께서 수신 동의하신<br/><strong>' + formatPhone + '</strong>(으)로<br/> 알림톡이 발송됩니다.'
					};

					UIkit.modal.confirm_title(notify, function(){
						endPoint.call('clickEvent', {'area' : 'notify me', 'name' : 'confirm' })
						Method.add();
					}, function(){
						endPoint.call('clickEvent', {'area' : 'notify me', 'name' : 'cancel' })
					}, function(){},
					{
						labels: {'Ok': '신청', 'Cancel': ' 취소'}
					});
				});
			},

			//jquery 2.2.4 버전업,  if(allSkuData[idx].selectedOptions.indexOf(optId) > -1){  오류 발생
			// if(allSkuData[idx].selectedOptions[0]==optId){			
			checkQuantity:function(){
				if(allSkuData){
					$('#size-grid').find("li").each(function(index){
						var optId = $(this).attr('value');
						if(allSkuData.length > index){
							for(var idx=0; idx<allSkuData.length; idx++) {
								if(allSkuData[idx].selectedOptions[0]==optId){
									if(allSkuData[idx].quantity <= 0 || args.isForcedDisplay === 'true'){
										//입고알림에서는 재고가 없는 상품을 활성화
										$(this).removeAttr('disabled');
										$(this).find("a").removeClass('sd-out');
									}
								}
							}
						}
					});
				}
	   		},
			add:function(){
				var customerId = $('#request-restock-alarm').attr('data-customer-id');
				var obj = {
					'id' : customerId?customerId:'', //계정
					'skuId' : $('#size-value').attr('data-sku-id'),
					'messageType' : 'KAKAO', //SMS/EMAIL
					'target' : document.getElementById("targetValue").value, // SMS인 경우 번호, EMAIL인 경우 이메일
					'notify': args.isForcedDisplay ? 'COMINGSOON' : ''
				}
				// console.log('obj:', obj);
				sandbox.utils.ajax(sandbox.utils.contextPath + '/restock/add', 'GET',obj, function(data) {
					var data = $.parseJSON( data.responseText );
					if( data.result ){ // result:true
						var notification = UIkit.modal('#restock-notification', {modal:false});
						notification.hide();
						//$('.uk-modal-close').click();
						// $(".sms-complete").show();
						var sucessMsg = {
							mainMsg : '입고 알림 신청이 완료되었습니다.',
							subMsg : '<span>알림 받을 휴대폰 번호<strong>' + formatPhone + '</strong></span>입고 즉시, 알림톡이 발송됩니다.'
						};
						UIkit.modal.alert_title(sucessMsg)
						// UIkit.notify(sucessMsg, {timeout:3000,pos:'top-center', status:'success'});
					}else{
						UIkit.modal.alert_title(data.errorMsg);
						// UIkit.notify(data.errorMsg, {timeout:3000,pos:'top-center',status:'danger'});
					}
				},true);
			},
			sizeTableOpen:function(){
				if($('#size-value-area').hasClass('open')){
					$('#size-value-area').removeClass('open');
					$('#size-list-area').slideUp();
				} else {
					$('#size-value-area').addClass('open');
					$('#size-list-area').show('bind');
				}
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-restock]',
					attrName:'data-module-restock',
					moduleName:'module_restock',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});

})(Core);