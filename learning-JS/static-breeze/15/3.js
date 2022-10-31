(function(Core){
	Core.register('module_order_pickup', function(sandbox){
		var args;
		var Method = {
			moduleInit:function(){
				var $this = $(this);
				args = arguments[0];

				//주문자 인풋 컴포넌트
				var inputComponent = sandbox.getComponents('component_textfield', {context:$this});

				//주문자와 동일
				var checkoutComponent = sandbox.getComponents('component_checkbox', {context:$this}, function(i){
					this.addEvent('change', function(isChecked){
						if(isChecked){
							var customerInfo = sandbox.getModule('module_order_customer').getOrderCustomerInfo();
							$this.find('#fullname').val(customerInfo.name).focusout();
							$this.find('#phonenumber').val(customerInfo.phoneNum).focusout();
						}else{
							$this.find('#fullname').val('').focusout();
							$this.find('#phonenumber').val('').focusout();
						}
					});
				});

				var $form = $('#pickup_info');
				sandbox.validation.init( $form );

				$this.find('[data-order-pickup-submit-btn]').click(function(e){

					e.preventDefault();

					sandbox.validation.validate( $form );

						if(sandbox.validation.isValid( $form )){

								if(!inputComponent[0].getValidateChk('errorLabel') || !inputComponent[1].getValidateChk('errorLabel')){

								} else{

										//CTM태깅...추가...
										var str = $this.find("[data-isjustreservation]").data('isjustreservation');

										// if($.type(str)=="boolean"){
										if(str==true || str=="true"){
											c_name = "ROPIS_submit_go to next";   // 로피스 일때에는 , orderSubmit 함수에 click 네임 변수 추가..
										}else if(str==false || str=="false"){
											c_name = "BOPIS_submit_go to next";
											//ctm 태깅 추가
											endPoint.call('clickEvent', {'area' : 'inventory', 'name' : c_name });   //클릭 이벤트
										}

										//로피스만  orderSubmit 태깅 진행
										if(str==true || str=="true"){
											endPoint.call("orderSubmit", { 'paymentType' : null , 'physicaltype' : 'PHYSICAL_ROPIS'});  //ctm ropis _dl 추가.
										}

										$("#pickup_info").submit();
								}
						}
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-order-pickup]',
					attrName:'data-module-order-pickup',
					moduleName:'module_order_pickup',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);