(function(Core){
	Core.register('module_forgot_password', function(sandbox){
		var Method = {
			$that:null,
			$form:null,
			$stepContainer:null,
			$errorAlert:null,
			moduleInit:function(){

				// listSize = 검색 결과 한번에 보여질 리스트 수

				var args = Array.prototype.slice.call(arguments).pop();
				$.extend(Method, args);

				var $this = $(this);
				var $submitBtn = $this.find('button[type="submit"]');

				Method.$that = $this;
				Method.$form = $this.find("form");

				Method.$stepContainer = $this.find(".step-container");
				Method.$errorAlert = Method.$that.find('[data-error-alert]');

				// 검색버튼 클릭시
				Method.$form.submit(function(e){
					e.preventDefault();
					Method.hideAlert();
					Method.submit();
					return false;
				});

				// 검색된 리스트중 선택시
				// Method.$that.on('click', '[data-customer-select-btn]', Method.selectCutomer );

				$this.on('click', '[data-certify-btn]', Method.guestCertify );

				Method.$that.on('click', '[data-back-btn]', function(){
					Method.viewStep(1);
				});

			},

			updateSelectOrder:function(e){
				e.preventDefault();
				// 자신 버튼 숨기기
				$(this).parent().hide();
				// 자신 컨텐츠 켜기
				$(this).closest('li').find('[data-certify-content]').slideDown('300');
				// 다른 버튼 보이기
				$(this).closest('li').siblings().find('[data-customer-select-btn]').parent().show();
				// 다른 컨텐츠 숨기기
				$(this).closest('li').siblings().find('[data-certify-content]').hide();
			},

			submit:function(){
				sandbox.utils.ajax(Method.$form.attr("action"), 'POST', Method.$form.serialize(), function(data){
					Method.createCustomerList(JSON.parse( data.responseText ));
				});
			},
			viewStep:function(num){
				Method.$stepContainer.addClass('uk-hidden');
				Method.$that.find('.step-' + num ).find('input[name="identifier"]').val('');
				Method.$that.find('.step-' + num ).removeClass('uk-hidden');
			},
			showAlert:function(msg){
				UIkit.modal.alert(msg);
			},
			hideAlert:function(){
				Method.$errorAlert.addClass('uk-hidden');
			},
			createCustomerList:function(data){
				var result = data['result'];
				var $listContainer = Method.$that.find('.list-container');
				var list = data['ro'];
				var html = '';

				if( result == true ){
					if( list.length == 0 ){
						Method.showAlert('검색하신 내용을 찾을 수 없습니다. 다른 정보를 이용해 다시 검색해 주십시오.');
					}else{
						$.each( list, function( index, li ){
							li.useName = (li.fullName!=null && $.trim(li.fullName)!='');
							li.dateCreated = li.dateCreated.slice(0, 10).split("-").join(".");
						});

						html = Handlebars.compile($("#forgot-password-list").html())(list);

						$listContainer.html( html );
						//console.log( list );
						sandbox.moduleEventInjection( html );

						Method.$that.on('click', '[data-customer-select-btn]',  Method.updateSelectOrder );

						Method.viewStep(2);
					}
				}else{
					Method.showAlert('검색하신 내용을 찾을 수 없습니다. 다른 정보를 이용해 다시 검색해 주십시오.');
				}
				///customer/requestPasswordChangeUrl?successUrl=/recover&customer=
			},

			// 비회원 인증 처리
			guestCertify:function(){
				var type = $(this).attr('data-type');
				var customerId = $(this).closest('li').find('input[name="customerId"]').val();
				var email = $(this).closest('li').find('input[name="email"]').val();
				var phoneNum = $(this).closest('li').find('input[name="phonenum"]').val();
				var url = sandbox.utils.contextPath + "/login/requestPasswordChangeUrl?customer=" + customerId;

				if( type === 'email'){
					url += '&messageType=EMAIL';
				}else if( type === 'kakao'){
					url += '&messageType=KAKAO';
				}

				sandbox.utils.ajax(url, 'GET', {}, function(data){
					var responseData = sandbox.rtnJson(data.responseText);
					if(responseData.result == true){
						if(type === 'email'){
							Method.viewStep(3);
						}else if(type === 'kakao'){
							Method.viewStep(4);
						}
					}else{
						Method.showAlert(responseData['errorMsg']);
					}

				}, true );

				return;
			}

		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[ data-module-forgot-password ]',
					attrName:'data-module-forgot-password',
					moduleName:'module_forgot_password',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);