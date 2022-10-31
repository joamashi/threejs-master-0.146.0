(function(Core){
	Core.register('module_order_customer', function(sandbox){
		var args = null;
		var Method = {
			moduleInit:function(){
				var $this = $(this);
				args = arguments[0] || {};

				Method.$that = $this;
				Method.$submitBtn = $this.find('button[type="submit"]');
				Method.$submitBtn.on("click", Method.checkout );

				sandbox.validation.init( $this.find('#order_info') );

				if( $this.find('input[name="isAlreadyRegistered"]').length > 0){
					UIkit.modal.confirm('이미 회원 가입된 아이디 입니다. 로그인 하시겠습니까?', function(){
						window.location.replace(sandbox.utils.contextPath + '/login?successUrl=/checkout');
					}, function(){},
					{
						labels: {'Ok': '로그인', 'Cancel': '비회원 주문'}
					});

				}

				//@pck 2021-03-09 ISMS 조치사항 추가, 비회원 개인정보 동의 체크 추가
				if( $this.find('input[name="isNonMemberCheckAgree"]').length > 0 ){
					$this.find('input[name="isNonMemberCheckAgree"]').on('click', function(){
						var isChecked = $(this).is(':checked');
						if(isChecked){
							$("#btn-next").removeClass('disabled');
						}else{
							$("#btn-next").addClass('disabled');
						}
					});
				}
			},

			checkout:function(e){
				e.preventDefault();

				if (Method.$that.find('[name="isNonMemberCheckAgree"]').length > 0) {
					var isNonMemberCheckAgree = Method.$that.find('[name="isNonMemberCheckAgree"]').is(':checked');
					if( !isNonMemberCheckAgree ){
						UIkit.modal.alert("비회원 개인정보 수집 및 이용에 동의해주세요");
						return;
					}else{
						Method.$that.find('#order_info').submit();
					}
				}
			}
		}


		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-order-customer]',
					attrName:'data-module-order-customer',
					moduleName:'module_order_customer',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			getOrderCustomerInfo:function(){
				return {
					name:args.name,
					phoneNum:args.phoneNum,
					emailAddress:args.emailAddress
				}
			}
		}
	});
})(Core);