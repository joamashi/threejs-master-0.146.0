(function(Core){
	Core.register('module_guest_order_search', function(sandbox){
		var Method = {
			$that:null,
			$form:null,
			$stepContainer:null,
			$errorAlert:null,
			$searchKey:null,
			moduleInit:function(){

				// listSize = 검색 결과 한번에 보여질 리스트 수
				var args = Array.prototype.slice.call(arguments).pop();
				$.extend(Method, args);

				var $this = $(this);
				Method.$that = $this;
				Method.$form = $this.find("form");

				Method.$stepContainer = $this.find(".step-container");
				Method.$errorAlert = Method.$that.find('[data-error-alert]');
				Method.$search = $this.find('.search-container');

				Core.getComponents('component_textfield', {context:$this}, function(){
					this.addEvent('enter', function(){
						Method.searchSubmit();
					});
				});

				$this.find('button[type="submit"]').on('click', function(e){
					e.preventDefault();
					Method.searchSubmit();
				} );


				// 로그인 버튼
				$this.on('click', '[data-login-btn]',  Method.customerLogin );

				// 인증하기 버튼
				$this.on('click', '[data-certify-btn]', Method.guestCertify );

				$this.on('click', '[data-back-btn]', function(){
					Method.viewStep(1);
				});

				sandbox.validation.init( Method.$form );
			},

			updateSelectOrder:function(e){
				e.preventDefault();
				// 자신 버튼 숨기기
				$(this).parent().hide();
				// 자신 컨텐츠 켜기
				$(this).closest('li').find('[data-certify-content]').slideDown('300');
				// 다른 버튼 보이기
				$(this).closest('li').siblings().find('[data-order-select-btn]').parent().show();
				// 다른 컨텐츠 숨기기
				$(this).closest('li').siblings().find('[data-certify-content]').hide();
			},
			searchSubmit:function(){
				sandbox.validation.validate( Method.$form );

				if( sandbox.validation.isValid( Method.$form )){
					Method.hideAlert();
					sandbox.utils.ajax(Method.$form.attr("action"), 'POST', Method.$form.serialize(), function(data){
						Method.createGuestOrderList(JSON.parse( data.responseText ));
					});
				}
			},
			viewStep:function(num){
				Method.$stepContainer.addClass('uk-hidden');
				Method.$that.find('.step-' + num ).find('input[name="identifier"]').val('');
				Method.$that.find('.step-' + num ).removeClass('uk-hidden');
			},
			showAlert:function(msg){
				UIkit.modal.alert(msg);
				//UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'danger'});
				/*
				Method.$errorAlert.text(msg);
				Method.$errorAlert.removeClass('uk-hidden');
				*/
			},
			hideAlert:function(){
				Method.$errorAlert.addClass('uk-hidden');
			},
			createGuestOrderList:function(data){
				var result = data['result'];
				var $listContainer = Method.$that.find('.list-container');
				var list = data['ro'];
				var html = '';

				//console.log(data);

				if( result == true ){
					if( list.length == 0 ){
						Method.showAlert('검색결과가 없습니다. 다른 정보를 이용해 다시 검색해 주십시오.');
					}else{
						//orderNumber, phoneNumber, emailAddress, 주문자명(name), 뭐가 들어 올지 모름
						//주문자명의 경우 list에 매칭 값이 넘어 오지 않음.
						//넘어 오는 값 정보는
						//customerId, isGuestCustomer, guestOrderDTOs
						//guestOrderDTOS: orderNumber, submitDate, emailAddress, phoneNumber
						Method.$searchKey = Method.$that.find('input[name="identifier"]').val();
						var orderNumberPattern = /[0-9]{12,30}$/;  //입력값이 orderNum인 경우 orderNum이 일치 하면 목록에 추가
						var orderNumberSearch = false;
						if(orderNumberPattern.test(Method.$searchKey)){
							orderNumberSearch = true;
						}

						console.log(list);

						$.each( list, function( index, li ){
							var addList = false;
							for(var i=0; i<li.guestOrderDTOs.length; i++){
								if(orderNumberSearch){
									if(Method.$searchKey === li.guestOrderDTOs[i].orderNumber){
										li.guestOrderDTO = li.guestOrderDTOs[i];
										li.guestOrderDTO.orderItemName = li.guestOrderDTOs[i].orderItemNames[0];
										li.isItems = (li.guestOrderDTOs.length > 1);
										li.itemLength = li.guestOrderDTOs.length-1;
										li.totalAmount = sandbox.rtnPrice(li.guestOrderDTOs[i].totalAmount.amount);
										li.isPhoneNum = (li.guestOrderDTOs[i].phoneNumber) ? true : false;
									}
								}
							}

							// li.guestOrderDTO = li.guestOrderDTOs[0];
							// li.guestOrderDTO.orderItemName = li.guestOrderDTOs[0].orderItemNames[0];
							// li.isItems = (li.guestOrderDTOs.length > 1);
							// li.itemLength = li.guestOrderDTOs.length-1;
							// li.totalAmount = sandbox.rtnPrice(li.guestOrderDTO.totalAmount.amount);
							// li.isPhoneNum = (li.guestOrderDTOs[0].phoneNumber) ? true : false;
						});

						html = Handlebars.compile($("#guest-order-list").html())(list);

						$listContainer.html( html );
						sandbox.moduleEventInjection( html );


						// 검색된 리스트중 선택시
						Method.$that.on('click', '[data-order-select-btn]',  Method.updateSelectOrder );
						Method.viewStep(2);
					}
				}else{
					Method.showAlert(data['errorMsg']);
				}
			},
			customerLogin:function(){
				var orderNumber = $(this).closest('li').find('input[name="orderNumber"]').val();

				// 회원 주문
				var modal = UIkit.modal('#common-modal');
				var promise = null;
				promise = sandbox.utils.promise({
					url:sandbox.utils.contextPath + '/dynamicformpage',
					type:'GET',
					data:{'name':'login', 'dataType':'model'}
				}).then(function(data){
					var defer = $.Deferred();
					var appendTxt = $(data).find('.content-area').html();
					$('#common-modal').find('.contents').empty().append(appendTxt);
					sandbox.moduleEventInjection(appendTxt, defer);
					modal.show();
					return defer.promise();
				}).then(function(){
					//window.document.location.href = "/account/orders/" + orderNumber
					window.document.location.href = "/account/orders/";
				}).fail(function(msg){
					UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'danger'});
					modal.hide();
				});
			},

			// 비회원 인증 처리
			guestCertify:function(){
				var type = $(this).attr('data-type');
				var orderNumber = $(this).closest('li').find('input[name="orderNumber"]').val();
				var customerId = $(this).closest('li').find('input[name="customerId"]').val();
				var email = $(this).closest('li').find('input[name="email"]').val();
				var phoneNum = $(this).closest('li').find('input[name="phonenum"]').val();
				var url = sandbox.utils.contextPath + "/guest/orders/requestAuthUrl?customer=" + customerId;

				//var type = $(this).closest('li').find('input[name^="certify.type"]:checked').val();
				// 현재는 무조건 email로 처리
				//customerId=1111111&targeter=이메일 or 폰&messageType=EMAIL or SMS

				if( type === 'email'){
					url += '&targeter=' + email + '&messageType=EMAIL';
				}else if( type === 'kakao'){
					url += '&targeter=' + phoneNum + '&messageType=KAKAO';
				}

				sandbox.utils.ajax(url, 'GET', {}, function(data){
					var responseData = sandbox.rtnJson(data.responseText);
					if(responseData.result == true){
						Method.$search.hide();
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
					selector:'[data-module-guest-order-search]',
					attrName:'data-module-guest-order-search',
					moduleName:'module_guest_order_search',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);