(function(Core){
	'use strict';

	Core.register('module_shipping_address_write', function(sandbox){
		var $this, args, endPoint;

		var Method = {
			moduleInit:function(){
				$this = $(this);
				args = arguments[0];
				endPoint = Core.getComponents('component_endpoint');

				var arrComponents = [];
				sandbox.getComponents('component_textfield', {context:$this}, function(){
					this.addEvent('focusout', function(){
						var value = $(this).val();
						if($(this).hasClass('fullName')){
							$this.find('#firstname').val(value);
							$this.find('#lastName').val(value);
						}
					});

					arrComponents.push(this);
				});
				sandbox.getComponents('component_searchfield', {context:$this, resultTemplate:'#address-find-list', isModify:args.isModify}, function(){
					this.addEvent('resultSelect', function(data){
						this.getInputComponent().setValue($(data).data('city') + ' ' + $(data).data('doro'));
						$this.find('#address1').val($(data).data('city') + ' ' + $(data).data('doro')); // 도로명 주소
						$this.find('#postcode').val($(data).data('zip-code5'));

						//상세주소 입력창으로 이동
						$this.find('#address2').focus();
					});

					arrComponents.push(this);
				});


				//배송지 관리, 기존 주소에서 검색 없이 그냥 수정 후 저장을 누를 경우
				//엉뚱한 주소가 저장되는 현상 발생, 검색을 통해서 클릭 된것만 저장 될 수 있게 수정
				//hidden addr_save_fild 들어감.
				$(document).on('click','.result-wrap .list', function(e){
					var index = $(this).index();
					var save_addr = $(".result-wrap li").eq(index).find("dd.addr").first().text();

						$this.find('#addr_save_fild').val(save_addr);
				});

				//배송지 이름, 이름 2자 이상 입력 할수 있게 수정.
				var $form = $this.find('.manage-account');
				sandbox.validation.init( $form );

					$this.find('button[type=submit]').off().on('click', function(e){
						e.preventDefault();

						sandbox.validation.validate( $form );
						if(sandbox.validation.isValid( $form )){
							var count = 0;
							$.each(arrComponents, function(i){
								if(!this.getValidateChk()){
									this.setErrorLabel();
								}else{
									count++;
								}
							});

							if(arrComponents.length === count){
								sandbox.setLoadingBarState(true);
								if( args.isModify == "true" ){
									endPoint.call('updateProfile', 'address book:edit shipping');
								}else{
									endPoint.call('updateProfile', 'address book:add shipping');
								}

								//주소를 검색 없이 직접 수정 후 저장 할 경우 문제 발생, 정확한 주소 입력이 안되는 현상 발생.
								//검색 없이 수정을 할 경우를 대비해서 로직 추가..
								var save_addr = $this.find('#addr_save_fild').val();
								$this.find("#address1").val(save_addr);

								$this.find('form').submit();
							}
						}
					});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-shipping-address-write]',
					attrName:'data-module-shipping-address-write',
					moduleName:'module_shipping_address_write',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				$this = null;
				args = null;
			}
		}
	});
})(Core);