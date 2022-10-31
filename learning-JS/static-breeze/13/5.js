(function(Core){
	Core.register('module_custom_event', function (sandbox) {
		var $this, $eventForm, addressModal, $imageUploadFields;
		var Method = {
			moduleInit: function () {
				$this = $(this);
				$eventForm = $this.find("#eventForm");
				addressModal = UIkit.modal("#popup-daum-postcode", { modal: false });
				$imageUploadFields = $this.find('[data-image-upload]');

				// 각 타입에 따른 추가 설정
				$this.find('[data-type]').each(function () {
					var type = $(this).data('type');
					var $input = $(this).find("input");
					if (type == 'number') {
						var maxLength = $input.attr('maxlength') || '';
						if (maxLength != '') {
							$input.attr('data-parsley-range', Method.getRange(maxLength));
						}
						// 커스텀 패턴이 없으면 ios 에서 숫자 키패드가 노출되도록 속성 추가
						if ($input.attr('data-parsley-pattern') == null) {
							$input.attr('pattern', '[0-9]*');
						}
					}
				});

				// 업로드 버튼 클릭시 현재 자신의 속한 modal 닫기
				$this.find('[data-upload-btn]').on('click', Method.closeModalByClosest);
				$this.find('[data-address-open-btn]').on('click', Method.openAddressModal);
				$this.find('#eventSubmit').on('click', Method.submit);

				if ($imageUploadFields.length > 0) {
					Method.initImageUploadFields();
				}
			},
			initImageUploadFields: function(){
				$.each($imageUploadFields, function (index, data) {
					var $thumbnailWrap = $(this).find('[data-wrap-file-thumb]');
					var $errorMsg = $eventForm.find('[data-info-error-message]');
					$thumbnailWrap.on('click', '[data-btn-remove-img]', function (e) {
						e.preventDefault();
						$(this).parent().remove();
						fileLoad.minusCurrentIndex();
					})
					var fileLoad = Core.getComponents('component_file', { context: $('body') }, function () {
						var _self = this;
						this.addEvent('error', function (msg) {
							UIkit.notify(msg, { timeout: 3000, pos: 'top-center', status: 'warning' });
						});

						this.addEvent('upload', function (fileName, fileUrl, realFileName) {
							var ext = String(fileUrl).split('.').pop();
							var type = '';
							if (_.includes(['gif', 'png', 'jpg', 'jpeg'], ext)) {
								type = 'image';
							}else{
								type = 'document';
							}
							$errorMsg.hide();
							var thumb = '<span class="preview-up-img" data-real-file-name="'+realFileName+'" data-file-url="'+ fileUrl.replace('/cmsstatic/eventAssetFile', '') +'">'
							thumb+='<a href="javascript:;" class="file-remove_btn" data-btn-remove-img=""></a>';
							if (type == 'image') {
								thumb+='<img src="' + Core.Utils.contextPath+fileUrl + '?thumbnail" alt="' + realFileName + '" />';
							}else if( type == 'document'){
								thumb+= '<i class="g72-swoosh-plus document-icon"></i><div class="document-file-name">'+ realFileName+'</div>';
							}
							thumb+='</span>';
							$thumbnailWrap.append(thumb);
							this.plusCurrentIndex();
						});
					});
				})
			},
			closeModalByClosest: function(e){
				if ($(this).closest('.uk-modal').length > 0) {
					UIkit.modal($(this).closest('.uk-modal')).hide();
				}
			},
			openAddressModal: function(e){
				e.preventDefault();
				var $self = $(this);
				var daumPostCode = document.getElementById('daum-postcode-container');
				daum.postcode.load(function () {
					addressModal.show();
					new daum.Postcode({
						oncomplete: function (data) {
							var zipcode = data.zonecode;
							var address = data.address;

							// 도로명 선택시 노출되는 정보 변경 - 현재는 사용하지 않음
							/*
							if( data.userSelectedType == 'J' ){
								zipcode = data.postcode;
								address = data.jibunAddress;
							}
							*/

							var $searchContainer = $self.closest('[data-address-search-container]');
							$searchContainer.find('label').remove();
							$searchContainer.find('[data-address-line1]').val('(' + zipcode + ')' + address);
							$searchContainer.find('[data-address-line2]').focus();
							$searchContainer.find('[data-is-search]').data('is-search', true);

							//alert( zipcode + ' : ' + doro );
							/*
							$this.find('#addressline1').val(doro);
							$this.find('#addressline2').focus();
	
							$zipCodeInput.val( zipcode );
							$zipCodeDisplay.text( zipcode );
							$zipCodeDisplay.parent().removeClass("uk-hidden");
							Method.isSelectAddress = true;
	
							//postcode 모달창을 닫아주고 addressline2로 포커스이동
							addressModal.hide();
							$this.find('#addressline2').focus();
							*/

							addressModal.hide();
						},
						// 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
						onresize: function (size) {
							//element_wrap.style.height = $(window).height() - 46 + 'px'; //size.height+'px';
						},
						width: '100%',
						hideMapBtn: true,
						hideEngBtn: true
					}).embed(daumPostCode);
				});
			},
			getRange:function(length, type){
				var min = '0';
				var max = '9';
				for (var i = 1; i < length; i++) {
					//min += '0';
					max += '9';
				}
				if (type == 'max') {
					return max;
				} else if (type == 'min') {
					return min;
				}
				return '[' + min + ',' + max + ']';
			},
			getValidtionAgree: function(){
				var $agreeForm = $("#agreeForm");
				var isAgree = true;
				if ($agreeForm != null) {
					var queryParams = Core.Utils.getQueryParams($agreeForm.serialize());
					var values = _.values(queryParams);
					console.log('queryParams: ', _.values(queryParams))
					$agreeForm.find('[data-component-radio]').each(function (i, radio) {
						// 필수 항목이면
						if ($(this).data('required') != false) {
							if (values[i] == 'false') {
								isAgree = false;
								return false;
							}
						}
					})
					/* 
					var queryParams = Core.Utils.getQueryParams($form.serialize());
					if( _.without( _.values( queryParams ), 'true' ).length > 0 ){
						return false;
					}
					*/
				}
				return isAgree;
			},
			submit:function(e){
				e.preventDefault();
				Core.validation.init( $eventForm );
				Core.validation.validate( $eventForm );
				if(Core.validation.isValid( $eventForm )){
					
					// 검색을 통해 등록했는지 확인
					$this.find('[data-address-search-container]').each(function(){
						var data = Core.Utils.strToJson($(this).data('address-search-container'), true);
						var isRequire = data.isRequire == 'true' ? true : false;
						var isSearch = $(this).find('[data-is-search]').data('is-search');
						
						if( isRequire == true && isSearch == false ){
							UIkit.modal.alert('검색을 통해 주소를 입력하세요.');
							return false;
						}

						$(this).find('input[name="'+ data.name +'"]').val( $(this).find('[data-address-line1]').val() + ' ' + $(this).find('[data-address-line2]').val())
					})

					// 약관 내용 확인
					if( !Method.getValidtionAgree() ){
						UIkit.modal.alert('필수 약관에 모두 동의해 주세요.');
						return false
					}

					// 이미지 등록 필드 여부확인
					var $imageUploadFields = $eventForm.find('[data-image-upload]');
					var isError = false;
					if ($imageUploadFields.length > 0) {
						var fileLoad = Core.getComponents('component_file', { context: $eventForm });
						$.each($imageUploadFields, function (index, data) {
							var option = Core.Utils.strToJson($(this).data('image-upload'));
							var fileComponent = _.isArray(fileLoad) ? fileLoad[index] : fileLoad;
							// 필수 여부 확인하여 메시지 노출
							if (option.require == true) {
								var currentUploadImageCount = fileComponent.currentIndex();
								var $errorMsg = $eventForm.find('[data-info-error-message]');
								if (currentUploadImageCount == 0) {
									// 메시지 노출
									$errorMsg.show();
									isError = true;
									return false;
								}
							}
							if (isError == false) {
								var inputHiddenTemplate = '<input type="hidden" name="fileList[{{id}}].url" value={{url}} />';
								var $thumbnailWrap = $(this).find('[data-wrap-file-thumb]');
								$thumbnailWrap.children().each(function () {
									var url = $(this).data('file-url');
									var fileName = Core.utils.string.trimAll($(this).data('real-file-name'));
									if (_.isEmpty(url)) {
										isError = true;
										UIkit.modal.alert('이미지 정보가 올바르지 않습니다.<br/>다시 등록해주세요.').on('hide.uk.modal', function () {
											fileComponent.setCurrentIndex(0);
											$thumbnailWrap.empty();
										});
										return false;
									}
									$(this).append(Core.Utils.replaceTemplate(inputHiddenTemplate, function (pattern) {
										switch (pattern) {
											case 'id':
												return index;
												break;
											case 'url':
												return fileName + '__' + url;
												break;
										}
									}));
								})
							}
						})
						if (isError == true) {
							return;
						}
					}

					var queryParams = Core.Utils.getQueryParams($eventForm.serialize());
					var url = decodeURIComponent(queryParams.commentUrl);
					var sData = "";

					// 코멘트를 작성하기 위한 정보
					var data = {
						customerId : queryParams.customerId,
						storageId : queryParams.storageId,
						csrfToken : queryParams.csrfToken
					}

					//delete queryParams.customerId;
					delete queryParams.storageId;
					delete queryParams.csrfToken;
					delete queryParams.commentUrl;

					// 작성한 정보 취합
					$.each( queryParams, function(key, value){
						sData += decodeURIComponent(value).split('+').join(' ');
						sData += '||';
					});
					
					// 약관 동의 정보 추가
					var $agreeForm = $("#agreeForm");
					var agreeValues = _.values(Core.Utils.getQueryParams($agreeForm.serialize()));
					var selectiveValues = [];
					$agreeForm.find('[data-component-radio]').each(function (i, radio) {
						// 필수 항목이 아니라면 선택정보를 저장
						if ($(this).data('required') == false) {
							selectiveValues.push(agreeValues[i] == 'true' ? 't' : 'f');
						}
					});
					sData += String(selectiveValues);
					data.comment = sData;
					// console.log('sData: ', sData);
					$(this).addClass('disabled').attr('disabled', "disabled");
					Core.Loading.show();
					$.ajax({
						type : "POST",
						url : url,
						data : $.param(data),
						success:function(data){
							if( data.result == false ){
								var msg = data.errorMsg._gloabl.overrideErrorMessage;
								if( msg == "구매 예약 기간이 아닙니다."){
									msg = "이벤트 응모 기간이 아닙니다.";
								}
								UIkit.modal.alert(msg).on('hide.uk.modal', function() {
									location.reload();
								});
							}else{
								// 응모가 완료 된 후에는 화면을 갱신하고 화면에서 응모 결과를 노출한다.
								location.reload();
								/*
								UIkit.modal.alert(msg).on('hide.uk.modal', function() {
									//location.reload();
								});
								*/
							}
						},
						error:function(req){
							Core.Loading.hide();
							//UIkit.modal.alert( req );
							UIkit.modal.alert('서버 에러 입니다. 다시 시도해 주세요.').on('hide.uk.modal', function() {
								location.reload();
							});
						}
					})
				}
			}
		}
		return {
			init: function () {
				sandbox.uiInit({
					selector: '[data-module-custom-event]',
					attrName: 'data-module-custom-event',
					moduleName: 'module_custom_event',
					handler: { context: this, method: Method.moduleInit }
				});
			}
		}
	});
})(Core);