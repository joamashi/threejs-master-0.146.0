(function(Core){
	'use strict';

	Core.register('module_order_address_change', function(sandbox){
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

				//배송 메세지.. hidden 에 값 넝어주기.
				$this.find('[data-component-select]').on('change', function(e){
					if($this.find('#selectPersonalMessage option:selected').text() == '직접입력'){
						 $this.find('#div_personalMessageText').removeClass('uk-hidden');   // 직접 입력 배송 메시지 감추기
					}else if($this.find('#selectPersonalMessage option:selected').val()  != ''){
						 $this.find('#div_personalMessageText').addClass('uk-hidden');   // 직접 입력 배송 메세지 오픈
					}
 				});

				//배송지 관리, 기존 주소에서 검색 없이 그냥 수정 후 저장을 누를 경우
				//검색을 통해서 클릭 된것만 저장 될 수 있게 수정
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

					/*
					//휴대폰 번호 체크......
					var hp_defalult = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
					var hp_pattern  = /^((01[16789])[1-9][0-9]{6,7})|(010[1-9][0-9]{7})$/;
					var cd_pattern  = /^(1[568][0456789][01456789][0-9]{4})|((01[16789])[1-9][0-9]{6,7})|(010[1-9][0-9]{7})|(050[0-9]{8,9})|((02|0[3-9][0-9])[0-9]{3,4}[0-9]{4})|(0001[568][0456789][01456789][0-9]{4})$/;
					var pattern_chk1 = false;      // false 로 기본 셋팅
					var pattern_chk2 = false;

					var phoneNum = $this.find("input[id='address.phoneNum']").val();

					if(hp_defalult.test(phoneNum)){
						pattern_chk1 = true;
					};

					if(hp_pattern.test(phoneNum)){  //휴대폰 먼저 chk.
						pattern_chk2 = true;
					}else{
						if(cd_pattern.test(phoneNum)){   //휴대폰 패턴이 false 경우, 일반 전화 패턴 chk.
							pattern_chk2 = true;
						};
					};

					if(!pattern_chk1 || !pattern_chk2) {    //검증 pattern_chk1, pattern_chk2 모두 true 이어야만..정상 연락처로....)
						UIkit.modal.alert('배송지 연락처를 정확하게 입력해 주세요!');
						return false;
					}
                    */

					sandbox.validation.validate( $form );
					if(sandbox.validation.isValid( $form )){

						sandbox.setLoadingBarState(true);

						//주소를 검색 없이 직접 수정 후 저장 할 경우 문제 발생, 정확한 주소 입력이 안되는 현상 발생.
						//검색 없이 수정을 할 경우를 대비해서 로직 추가..
						var save_addr = $this.find('#addr_save_fild').val();
						$this.find("#address1").val(save_addr);

						//배송 메세지 저장
						if($this.find('#selectPersonalMessage option:selected').text() == '직접입력'){
							$this.find('#u_personalMessage').val( $this.find('input#personalMessageText').val());
						}else if($this.find('#selectPersonalMessage option:selected').val()  != ''){
							var r_msg = $this.find('#selectPersonalMessage option:selected').text();
							$this.find('#u_personalMessage').val(r_msg);
						}


						//입력된 정보 ajax 전송
						var obj        = $form.serialize();
						var per_url    = sandbox.utils.contextPath + "/account/orders/modify-address";
						var addr_model = UIkit.modal('#order_change_addresses', {modal:false});

						Core.Utils.ajax(per_url, 'POST', obj, function(data){
							var jsonData = Core.Utils.strToJson(data.responseText, true) || {};
							if(jsonData.result==true){
								UIkit.modal.alert(jsonData.message).on('hide.uk.modal', function() {
									sandbox.setLoadingBarState(true);
									location.reload();
							});

							//실패
							}else{
								//	UIkit.notify(args.removeMsg, {timeout:3000,pos:'top-center',status:'warning'});
								addr_model.hide();
								UIkit.modal.alert(jsonData.message).on('hide.uk.modal', function() {
									sandbox.setLoadingBarState(false);
									// location.href = 'repairable?dateType=1';
								});
							}
						});
					}
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-order-address-change]',
					attrName:'data-module-order-address-change',
					moduleName:'module_order_address_change',
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