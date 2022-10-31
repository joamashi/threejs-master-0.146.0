function CustomProductChoice() {
	var customType;
	var externalMainJobCode;
	var externalSubJobCode;
	var customName;
	var price;
	var externalId;
	
	// FB JSY
	var playerFriendlyName;
	var playerName;
	var playerNumber;
	var playerId;
	var showFrontNumber;
	var customLetter;
	
	// PATCH
	var patchFriendlyName;
	var patchImageName;
	var patchXrefId;
	var patchTargetId;
	
}

function CustomProductChoiceData() {
	var key = "";
	var customChoiceOption = new Array(); // 선택한 옵션 정보
	var customChoiceSaveImage = new Array(); // 이미지 정보
	var customChoiceData = ""; // PDP에 선택한 Text 정보
	var customBuyVal=""; // 확매시 확인 정보
}

(function(Core){
	Core.register('module_custom_product', function(sandbox){
		var $this, endPoint;
		var customProduct = null;
		var CustomProductChoiceDataList = new Array(); // 선택한 목록 정보
		var customProductViewSwiper;
		var customImageIndex = 0;
		var shopImageDomain = ""; //cdn shop image domain

		var Method = {
				moduleInit:function(){
					$this = $(this);
					var customProductPdp = $("#custom-modal").attr('data-product-customUse');
					shopImageDomain = $("#custom-modal").attr('data-custom-image-domain');
					if (customProductPdp === 'true') Method.moduleInitPdp(); // PDP 페이지인 경우
					return;
				},
				moduleInitPdp:function(e) {
					// CustomProduct 정보 세팅
					Method.previewSwiperSliderInit();
					//@pck 모바일에서 화면 사이즈 변경에 대응이 안되서 resize 이벤트에 트리거를 추가했습니다.
					$(window).on("resize orientation", function () {
						customProductViewSwiper.update();
					});

					customProduct = Core.Utils.strToJson($("#custom-modal").attr('data-custom-product-dto'));
					
					var customModal = UIkit.modal('#custom-modal', {modal:false}); /* CUSTOM 추가 */
					// 패치 선택버튼
					$('.custom-btn').click(function(e){ 
						var issignin = $(this).data('issignin');
						if(issignin === true){
							e.preventDefault();

							//customProductViewSwiper.update();

							//모달 뷰 내 패치 리스트 용 커스톰 스크롤바 init
							var smoothScrollBar = window.Scrollbar;
							if(typeof smoothScrollBar === "function"){
								smoothScrollBar.initAll({
									alwaysShowTracks: true,
								});
							}

							$('[data-module-custom-product]').removeClass('uk-modal-close');
							customModal.show();
						} else{
							// 로그인 되어 있지 않은 경우 처리
							UIkit.modal.dialog.template = '<div class="uk-modal"><div class="uk-modal-dialog"></div></div>';
							UIkit.modal.confirm('커스텀 서비스 선택을 하기 위해서는 로그인 혹은 나이키 멤버 가입이 필요합니다.', function(){
								Core.Loading.show();
								e.preventDefault();
								Core.getModule('module_header').setModalHide(true).setLogin(function(data){
									location.reload();
								});
							});
							return;
						}
					});

					//PDP Custom 전체 삭제
					$(".custom-product-clear > a.link-text").click(function(){
						console.log("전체 삭제 click", CustomProductChoiceDataList);
						customImageIndex = 0;
						CustomProductChoiceDataList = [];
						$("#idx-selected-option-list").empty();
						$("#idx-custom-product-preview-list").empty();
						$("#idx-custom-product-preview-modal-view").empty();
						$("#idx-custom-product-preview-container").hide();
					});

					//직접 입력 등번호 숫자만 입력 가능하도록 처리
					$('#fbjsy_custom_number').bind('keyup blur', function () {
						$(this).val($(this).val().replace(/[^0-9]/g, ''));
					});

					// 확인 버튼에 대한 처리
					$('[data-module-custom-product]').click(function(e){
						$('[data-module-custom-product]').addClass('uk-modal-close');
						var customChoiceOption = Method.getChoiceData(); // 선택된 옵션에 대한 정보 세팅
						if(customChoiceOption.length > 0) {
							Method.renderingImage(customChoiceOption); // 옵션에 대한 이미지 랜더링
							Method.showPrice(customChoiceOption);
							Method.saveCustomImage(customChoiceOption); // 이미지에 대한 저장 처리
						}else {
							Method.clearAllCurrentChoice();
						}
						customProductViewSwiper.slideTo(0, 0, false);
					});
					// 취소 버튼에 대한 처리
					$('#custom-product-cancel').click(function(e){
						$(this).addClass('uk-modal-close');
						Method.clearAllCurrentChoice();
						customProductViewSwiper.slideTo(0, 0, false);
					});

					// FB JSY 선택시 --> 커스텀 레터링 초기화
					// 커스텀 레터링 입력시 --> 대표선수 선택값 초기화
					if (customProduct.isFbJsyMaskingService && customProduct.customFbjsyMasking.isCustomLetter) {
						$("#fbjsy_custom_player").on("change keyup paste",function() {
							if ($("#fbjsy_custom_player").val() != '') {
								$("#fbjsy_player").val('');
							}
						});
						$("#fbjsy_custom_number").on("change keyup paste",function() {
							if ($("#fbjsy_custom_number").val() != '') {
								$("#fbjsy_player").val('');
							}
						});
						$("#fbjsy_player").on("change",function() {
							if ($("#fbjsy_player").val() != '') {
								$("#fbjsy_custom_payer").val('');
								$("#fbjsy_custom_number").val('');
							}
						});
					}
					// 선택한 데이터 초기화
					$('[custom-product-clear-all]').click(function (e) {
						var customType = $(".custom-product-step.show").data("custom-type");
						if(customType == "fbjsy") {
							$("#fbjsy_player").val('');
							$("#fbjsy_front_number").prop("checked", false);
							$("#fbjsy_custom_player").val('');
							$("#fbjsy_custom_number").val('');
							$('[data-max-length-check]').trigger("input");
							$("#selectPlayer").trigger("click");
						}else if(customType == 'patch') {
							var patchXrefId = $(".custom-product-step.show").data("patch-xref-id");
							$("input:radio[name='patch-radio-"+patchXrefId+"']").prop("checked",false);
						}

						var customChoiceOption = Method.getChoiceData(); // 선택된 옵션에 대한 정보 세팅
						Method.renderingImage(customChoiceOption); // 옵션에 대한 이미지 랜더링
						Method.showPrice(customChoiceOption); // 옵션에 대한 가격 표시

					});
					// 선택 항목 적용
					// 선택 항목 적용 타이밍 onchange로 변경
					$('[custom-product-apply]').on('click keyup blur change input', function(e){
						var targetElement = $(e.target);
						if(targetElement.is("select")){
							if(e.type !== "change"){ return; }
						}
						var customChoiceOption = Method.getChoiceData(); // 선택된 옵션에 대한 정보 세팅
						Method.renderingImage(customChoiceOption); // 옵션에 대한 이미지 랜더링
						Method.showPrice(customChoiceOption); // 옵션에 대한 가격 표시
					});

					// 기타 초기화
					// 이미지 Swiper 처리
					var widthMatch = matchMedia("all and (max-width: 992px)");
					if (Core.Utils.mobileChk || widthMatch.matches) {
						var index = customModal.find('#patch>.customSelection>.input-radio').index();
						customModal.find('#patch>.customSelection').css('width', 156*index);
						/* @pck - 모바일 화면 시 PDP화면에서도 스크롤이 안되는 현상 발생
						$('body').addClass('scrollOff').on('scroll touchmove mousewheel', function(e){
							 e.preventDefault();
						});
						*/
					}

					// Zoomin 초기화
					// 줌 이미지 close
					$('#custom-product-zoom a.zoom-close').on('click', function(){
						$("#custom-product-zoom").hide();
					});

					//product images - zoom-in event 추가
					$('img[data-custom-product-image]').on('click', function(){
						var str_img = $(this).attr('src');
						$('#custom-product-zoom').find('#zoom-img').attr('src', str_img);
						$('#custom-product-zoom').show();
					});

					$('label[name="customCodeModal"]').click(function(event){ 
						// var $thisEle = $(event.target).find('img'); $thisEle.attr('patch-name')
						alert("customCodeModal click");
						//alert($thisEle.attr('patch-name'));
					});

					//이전 다음 버튼 이벤트 정의
					$('.btn-step').on('click', function(e){
						$btnStep = $(this);
						stepLength = $('.custom-product-step').length;
						$('.custom-product-step').each( function(index){
							$customProductStepDiv = $(this);
							if($customProductStepDiv.hasClass('show')){

								//다음
								if($btnStep.hasClass('next')){
									if(index <= $customProductStepDiv.length) {
										$customProductStepDiv.removeClass('show');
										$('.custom-product-step').eq(index + 1).addClass('show');
									}
									if(index == 0) {
										$('.btn-step.prev').addClass('show');
									}
									if((index + 1) >= (stepLength -1)) {
										$('.btn-step.next').addClass('last');
									}
									return false;
								}
								//이전
								if($btnStep.hasClass('prev')){
									$('.btn-step.next').removeClass('last');
									if(index > 0) {
										$customProductStepDiv.removeClass('show');
										$('.custom-product-step').eq(index - 1).addClass('show');
									}
									if(index == 1) {
										$('.btn-step.prev').removeClass('show');
									}
									return false;
								}

							}
						});
					});

					//토글 버튼 이벤트 정의
					$('.toggle_popupdown .icon').on('click', function(e) {
						$('.col.right').toggleClass('hide');
					});

					//input Validation check
					$('[data-max-length-check]').on('input', function(event){
						var el = this;
						var el_ID = $(el).attr('id');
						//직접 입력 대문자만 입력 가능하도록 처리
						if(el_ID == 'fbjsy_custom_player') {
							var tempText = $(this).val().replace(/[^A-Za-z ]/g, '');
							//tempText = tempText.toUpperCase();
							$(this).val(tempText);
						}
						if(el.value.length > el.maxLength){
							el.value = el.value.slice(0, el.maxLength);
						}

						if( (el_ID !== null) && ($("label[for='"+el_ID+"']").length > 0) ){
							$("label[for='"+el_ID+"']").text(el.value.length.toString() + '/' + el.maxLength.toString());
						}
					});
				},
				// 미리보기 이미지 세팅
				settingPreviewImageAndTextData:function(checkedKey) {
					$("#idx-custom-product-preview-modal-view").empty();
					var customImageHtml = "";
					var customChoiceDataHtml ="";
					for (idx=0; idx < CustomProductChoiceDataList.length; idx++) {
						var customData = CustomProductChoiceDataList[idx];
						if (customData.key == checkedKey) {
							customChoiceDataHtml = customData.customChoiceData;
							for (sidx=0; sidx < customData.customChoiceSaveImage.length;sidx++) {
								var customImage = customData.customChoiceSaveImage[sidx];
								customImageHtml += "<li class=\"swiper-slide\" style=\"background-image:url('"+shopImageDomain +customImage+"?gallery')\">";
								customImageHtml += "<span class=\"aria-text\">미리보기 이미지 1</span>";
								customImageHtml += "</li>";
							}
							break;
						}
					}
					$("#idx-custom-product-preview-modal-view").html(customImageHtml);
					$("#idx-selected-option-list").empty();
					$("#idx-selected-option-list").html(customChoiceDataHtml);
				},
				// 패치 모달의 선택된 내용 Clear All
				clearAllCurrentChoice:function() {
					if (customProduct != null && customProduct.customPatches.length > 0) {
						customProduct.customPatches.forEach(function(element, index, array){
							//$("input:radio[name='custom_path_"+element.id+"']").removeAttr("checked");
							$("input:radio[name='patch-radio-"+element.xrefId+"']").prop("checked",false);
						    //console.log(`${array}의 ${index}번째 요소 : ${element.id}`);
						});
					}
					$("#fbjsy_player").val('');
					$("#fbjsy_front_number").prop("checked", false);
					// @pck 퍼블리싱 용 화면 구동 시 해당 조건으로 작동이 안되어 임시로 주석
					//if (customProduct.isFbJsyMaskingService && customProduct.customFbjsyMasking.isCustomLetter) {
					$("#fbjsy_custom_player").val('');
					$("#fbjsy_custom_number").val('');

					$(".custom-product-step").removeClass("show");
					$(".custom-product-step").first().addClass("show");

					$(".btn-step").removeClass("show last")
					$(".btn-step.next").addClass("show");

					$('[data-max-length-check]').trigger("input");

					$("#selectPlayer").trigger("click");
					//}
					var customChoiceOption = Method.getChoiceData(); // 선택된 옵션에 대한 정보 세팅
					Method.renderingImage(customChoiceOption); // 옵션에 대한 이미지 랜더링
					Method.showPrice(customChoiceOption); // 옵션에 대한 가격 표시	
				},
				// 고객이 선택한 Custom Product의 옵션정보를 객체에 세팅함.
				getChoiceData:function() {
					// FB JSY에 대한 처리
					var subCustomChoiceOption = new Array();
					
					var playerId = $("#fbjsy_player").val();
					var player = null;
					var customProductChoice = new CustomProductChoice();

					if(customProduct.customFbjsyMasking != null) {
						var selectCustomType = $("input:radio[name='selectCustomType']:checked").val();
						customProductChoice.customType = 'FBJSY';
						customProductChoice.externalMainJobCode = customProduct.customFbjsyMasking.mainJobCode;
						customProductChoice.externalSubJobCode = customProduct.customFbjsyMasking.subJobCode;
						customProductChoice.customName = customProduct.customFbjsyMasking.friendlyName;
						customProductChoice.price = Number(customProduct.customFbjsyMasking.price);

						if (selectCustomType == 'choice') {
							for (idx = 0; idx < customProduct.customFbjsyMasking.players.length; idx++) {
								var data = customProduct.customFbjsyMasking.players[idx];
								if (data.id == playerId) {
									player = data;
									break;
								}
							}
							if (player != null) {
								customProductChoice.playerFriendlyName = player.name;
								customProductChoice.playerName = player.playerName;
								customProductChoice.playerNumber = player.playerNumber;
								customProductChoice.playerId = player.id;
								customProductChoice.externalId = player.externalId;
								customProductChoice.showFrontNumber = true;
								customProductChoice.customLetter = false;
								subCustomChoiceOption.push(customProductChoice);
							}
						} else if (customProduct.customFbjsyMasking.isCustomLetter && selectCustomType == 'letter') {
							var playerName = $("#fbjsy_custom_player").val();
							var playerNumber = $("#fbjsy_custom_number").val();
							var frontNumber = $("#fbjsy_front_number").is(":checked");
							console.log(frontNumber);
							if (playerName != '' && playerNumber != '') {
								customProductChoice.playerFriendlyName = "CUSTOM_LETTER";
								customProductChoice.playerName = playerName.toUpperCase();
								customProductChoice.playerNumber = playerNumber;
								customProductChoice.playerId = 0;
								customProductChoice.showFrontNumber = (frontNumber == "true" || frontNumber == true) ? true : false;
								customProductChoice.customLetter = true;
								customProductChoice.externalId = 'CUSTOM_LETTER';
								subCustomChoiceOption.push(customProductChoice);
							}
						}
					}
					// PATCH에 대한 처리 - label 클릭 작동 불가로 name에서 id로 DOM select 기준 변경
					for (idx=0; idx < customProduct.customPatches.length; idx++) {
						var data = customProduct.customPatches[idx];
						var patchTargetId = $("input:radio[name='patch-radio-"+data.xrefId+"']:checked").val();
						var patchTarget = null;
						if (patchTargetId > 0) {
							var customProductChoice = new CustomProductChoice();
							customProductChoice.customType = 'PATCH';
							customProductChoice.externalMainJobCode = data.mainJobCode;
							customProductChoice.externalSubJobCode = data.subJobCode;
							// patch Target
							for (sidx=0; sidx < data.patches.length; sidx++) {
								sdata = data.patches[sidx];
								if (patchTargetId == sdata.id) {
									patchTarget = sdata;
									break;
								}
							}
							customProductChoice.customName = data.friendlyName;
							customProductChoice.patchFriendlyName = patchTarget.friendlyName;
							customProductChoice.patchImageName = patchTarget.imageName;
							customProductChoice.patchXrefId = data.xrefId;
							customProductChoice.patchTargetId = data.id;
							customProductChoice.externalId = patchTarget.externalId;
							customProductChoice.price = Number(data.price);
							subCustomChoiceOption.push(customProductChoice);
						}
					}
					return subCustomChoiceOption;
				},
				// 선택된 옵션에 대한 이미지 랜더링을 호출함
				renderingImage:function(choiceOption) {
					parameter = Method.makeParameter(choiceOption);
					var imgElements = $('img[data-custom-product-image]');
					for (idx=0;idx < imgElements.length;idx++) {
						imgElement = imgElements[idx];
						var orgImage = "";
						if(parameter != "") {
							orgImage = $(imgElement).attr("data-product-image");
						}else{
							orgImage = $(imgElement).attr("data-cdn-product-image");
						}
						$(imgElement).attr("src",orgImage+parameter);
					}
				},
				// 이미지 서버에 요청할 parameter 생성
				makeParameter:function(choiceOption) {
					var parameter = "";
					var parameterCount = -1;
					for(idx=0; idx < choiceOption.length;idx++) {
						data = choiceOption[idx];
						parameterCount++;
						if (idx == 0) parameter += "?"; 
						else parameter += "&";
						if (data.customType === 'FBJSY') {
							parameter = "?detailes["+parameterCount+"].type=FBJSY&detailes["+parameterCount+"].subType=BKNAME&detailes["+parameterCount+"].object="+data.playerName;
							parameterCount++;
							parameter += "&detailes["+parameterCount+"].type=FBJSY&detailes["+parameterCount+"].subType=BKNUM&detailes["+parameterCount+"].object="+data.playerNumber;
							parameterCount++;
							if (data.showFrontNumber == true) parameter += "&detailes["+parameterCount+"].type=FBJSY&detailes["+parameterCount+"].subType=FTNUM&detailes["+parameterCount+"].object="+data.playerNumber;
						}
						else if (data.customType === 'PATCH') {
							parameter += "detailes["+parameterCount+"].type=PATCH&detailes["+parameterCount+"].subType="+data.patchTargetId+"&detailes["+parameterCount+"].object="+data.patchImageName;
						}
					}
					parameter = encodeURI(parameter);
					return parameter;
				},
				// custom product Modal에서 확인 버튼 클릭시 이미지 저장
				saveCustomImage:function(choiceOption) {
					parameter = Method.makeParameter(choiceOption);
					var customChoiceSaveImage = new Array();
					for (idx=0; idx < customProduct.saveImages.length; idx++) {
						var saveCallUrl = customProduct.saveImages[idx];
						$.ajax({
							url : saveCallUrl+parameter
							, type : "GET"
							, dataType : "json"
							, contentType : false
							, cache : false
							, processData : false
							, success : function(data, textStatus, jqXHR) {
								if (data.success) {
									customChoiceSaveImage.push(data.url);
									if (idx == customChoiceSaveImage.length) {
										Method.customProductSet(choiceOption,customChoiceSaveImage);
									}
								}
								else {
									alert("실패 하였습니다.");
								}
							}
							, error : function(xhr, err) {
								console.log(err);
							}
						});
					}
				},
				// 확정된 내용에 대해 PDP 페이지에 세팅
				customProductSet:function(choiceOption,customChoiceSaveImage) {
					var customData = new CustomProductChoiceData();
					customData.key = Date.parse(new Date())+"";
					customData.customChoiceOption = choiceOption;
					customData.customChoiceSaveImage = customChoiceSaveImage;
					customData.customChoiceData = null;
					customData.customBuyVal = null;
					
					// PDP에 노출할 문구 생성 
					var customChoiceDataHtml = "";
					{
						var customChoiceData = "";
						var customBuyVal = "";
						var customChoicePrice = "커스텀 비용 : ";
						var totalPrice = 0;
						for (sidx=0; sidx < customData.customChoiceOption.length;sidx++) {
							var localCustomChoiceOption = customData.customChoiceOption[sidx];
							if (sidx != 0) customBuyVal += " , ";
							if (localCustomChoiceOption.customType == 'FBJSY') {
								if (localCustomChoiceOption.customLetter) {
									customChoiceData += "<li>선수명(번호) : "+localCustomChoiceOption.playerName+"("+localCustomChoiceOption.playerNumber+")</li>";
									customBuyVal += "선수명(번호) : "+localCustomChoiceOption.playerName+"("+localCustomChoiceOption.playerNumber+")";
								}
								else {
									customChoiceData += "<li>선수명(번호) : "+localCustomChoiceOption.playerFriendlyName+"("+localCustomChoiceOption.playerNumber+")</li>";
									customBuyVal += "선수명(번호) : "+localCustomChoiceOption.playerFriendlyName+"("+localCustomChoiceOption.playerNumber+")";
								}
							}
							else if (localCustomChoiceOption.customType == 'PATCH') {
								customChoiceData += "<li>"+localCustomChoiceOption.customName+" : "+localCustomChoiceOption.patchFriendlyName+"</li>";
								customBuyVal += ""+localCustomChoiceOption.customName+" : "+localCustomChoiceOption.patchFriendlyName+"";
							}
							if (sidx != 0) customChoicePrice += " + ";
							customChoicePrice += new Intl.NumberFormat('ko-KR').format(localCustomChoiceOption.price) +"  ";
							totalPrice += localCustomChoiceOption.price;
						}
						customChoicePrice += " = " + new Intl.NumberFormat('ko-KR').format(totalPrice)
						customChoiceData += "<li>"+customChoicePrice+"</li>";
						customData.customChoiceData = customChoiceData;
						customData.customBuyVal = customBuyVal;
						customChoiceDataHtml = customChoiceData;
					}
					CustomProductChoiceDataList.push(customData);
					Method.settingPreviewImageAndTextData(customData.key);
					if (CustomProductChoiceDataList.length > 5) {
						CustomProductChoiceDataList.splice(0,1);
					}

					// 패치 선택 썸네일 이미지
					var customImageHtml = "";
					var maxCount = 5; //최대 보여줄 개수
					var $customProductPreviewList = $("ul#idx-custom-product-preview-list"); // 커스텀 패치 프리셋 미리보기 리스트 객체
					var $customProductPreviewListElement = $("ul#idx-custom-product-preview-list li");
					if( CustomProductChoiceDataList.length > 0 ){

						var listElementTotal = $($customProductPreviewListElement).length;
						var customDataTotal = (CustomProductChoiceDataList.length - 1);
						var customData = CustomProductChoiceDataList[customDataTotal];
						var customImage = customData.customChoiceSaveImage[0];
						var customImageIdx = customImageIndex++;
						if(listElementTotal > (maxCount - 1)){
							$("ul#idx-custom-product-preview-list li").eq(0).remove();
						}

						customImageHtml += "<li>";
						customImageHtml += "<input type=\"radio\" id=\"patch-selected-"+customImageIdx+"\" name=\"patch-selected-radio\" class=\"patch-selected-checkbox\" checked value='"+customData.key+"' />";
						customImageHtml += "<label for=\"patch-selected-"+customImageIdx+"\" style=\"background-image:url('" + shopImageDomain +customImage+"?thumbnail')\">";
						customImageHtml += "<span class=\"patch-label\">패치이름</span>";
						customImageHtml += "</label>";
						customImageHtml += "</li>";

						$($customProductPreviewListElement).each(function(index, element){
							$(element).find(".patch-selected-checkbox").attr('checked', false);
						});
						$($customProductPreviewList).append(customImageHtml);
						$("ul#idx-custom-product-preview-list li").last()
							.find("input:radio[name='patch-selected-radio']").on('click', function(element){
							var checkedKey = element.target.value;
							//console.log("checkedKey : " + checkedKey);
							Method.settingPreviewImageAndTextData(checkedKey);
						});

						$("#idx-custom-product-preview-container").show();
					}
					/* 라디오 버튼 바인딩 로직 변경
					$("input:radio[name='patch-selected-radio']").on('change',function(e){
						var checkedKey = e.target.value;
						console.log(e);
						Method.settingPreviewImageAndTextData(checkedKey);
						
					});
					 */
					Method.clearAllCurrentChoice();
				},
				// 가격 노출
				showPrice:function(choiceOption) {
					var parameter = "";
					//var totalPrice = customProduct.price;
					//parameter += "커스텀 금액 : "+ new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(customProduct.price) +"  ";
					var totalPrice = 0;
					parameter += "커스텀 금액 : ";
					for(idx=0; idx < choiceOption.length;idx++) {
						data = choiceOption[idx];
						if (idx > 0) parameter += " + ";
						parameter += data.customName +"("+ new Intl.NumberFormat('ko-KR').format(data.price) +")  ";
						totalPrice += data.price;
					}
					$("#custom_product_price").empty();
					if (totalPrice > 0) {
						parameter += "="+new Intl.NumberFormat('ko-KR').format(totalPrice);
						$("#custom_product_price").html(parameter);
					}
				},
				addItemRequest:function(itemRequest) {
					// PDP에서 바로구매시 처리 하는 로직(item request에 선택한 내용 세팅)
					if (CustomProductChoiceDataList.length > 0) {
						var checkedKey = $("input[name='patch-selected-radio']:checked").val();
						var customData;
						for (idx=0; idx < CustomProductChoiceDataList.length; idx++) {
							customData = CustomProductChoiceDataList[idx];
							if (customData.key == checkedKey) {
								break;
							}
						}
						
						itemRequest['itemAttributes[CUSTOM_YN]'] = 'Y';
						for(idx=0; idx < customData.customChoiceOption.length;idx++) {
							itemRequest['itemAttributes[CUSTOM_DATA_'+(idx+1)+']'] =  JSON.stringify(customData.customChoiceOption[idx]);
						}
						var saveImage = "";
						for(idx=0; idx < customData.customChoiceSaveImage.length;idx++) {
							if (idx > 0) saveImage += ",";
							saveImage +=customData.customChoiceSaveImage[idx];
						}
						itemRequest['itemAttributes[CUSTOM_IMAGES]'] =  saveImage;
						
					}
				},
				getCustomBuyVal:function() {
					var customVal = null;
					if (CustomProductChoiceDataList.length > 0) {
						var checkedKey = $("input[name='patch-selected-radio']:checked").val();
						var customData;
						for (idx=0; idx < CustomProductChoiceDataList.length; idx++) {
							customData = CustomProductChoiceDataList[idx];
							if (customData.key == checkedKey) {
								break;
							}
						}
						customVal = customData.customBuyVal;
					}
					return customVal;
				},
				previewSwiperSliderInit:function(){
					var endPoint = Core.getComponents('component_endpoint');
					
					customProductViewSwiper = new Swiper('.custom-product-view-swiper-container', {
						observer: true,
						observeParents: true,
						slidesPerView:'auto',
						updateOnWindowResize: true,
						navigation: {
							nextEl: '.swiper-next',
							prevEl: '.swiper-prev',
						},
						scrollbar: {
							el: '.swiper-scrollbar',
							hide: false,
						},
						on: {
							slideChangeTransitionEnd: function(event) {
								var param = {};
								param.click_area = "PDP",
								param.click_name = "patch_selection_image_slide",
								param.link_name = "Click Links"
								param.page_event = {
									link_click : true,
								}
								endPoint.call('adobe_script', param);
							}
						}
					});
				},
		}
		
		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-custom-product]',
					attrName:'data-module-custom-product',
					moduleName:'module_custom_product',
					handler:{context:this, method:Method.moduleInit}
				});
			},
            addItemRequest:function(itemRequest) {
            	return Method.addItemRequest(itemRequest);
            },
            getCustomBuyVal:function() {
            	return Method.getCustomBuyVal();
            }
		}
	});
	// custom product 외부에서 호출 하는 함수 모음
	Core.Utils.customProduct = {
			cartCustomProduct:function() {
				// 카트에서 구매시 처리 로직
				var cartCustomYN = $('#current-item-wrap').find('button[cartCustomYN=true]');
				if(cartCustomYN.length > 0){
					var prodName = cartCustomYN.eq(0).parents('.product-opt_cart').find('[data-name]').data('name');
					var lengthT = "";
					if(cartCustomYN.length > 1){
						var lengthM = cartCustomYN.length - 1;
						var lengthT = "외" + lengthM + "개";
					}
					UIkit.modal.alert("패치 선택 가능 상품은 장바구니 주문이 불가능합니다.<br/>["+ prodName +"]" + lengthT +"을 삭제 후 주문해주세요.");
					return true;
				}
				return false;
			},
			isCartCustomProduct:function(optchange) {
				// 카트에서 옵션 변경시에 custom 상품인지 확인
				return $(optchange).attr('cartCustomYN');
			},
			checkoutCustomProductChangeImage:function() {
				// checkout에서 custom 상품의 이미지 변경 작업
				var customYN = $('#customAttribute').find('.opt').attr('data-opt');
				if(customYN !== undefined){
					//썸네일 변경
					var mediaUrl = Core.Utils.contextPath + $('input[name=mediaUrl]').val();
					if(mediaUrl.indexOf('undefined') == -1){
						$('.image-wrap img').attr('src', mediaUrl+'?thumbnail');
					}
				}
			},
			isCheckoutPaymentCustomProduct:function() {
				// checkout payment에서 custom 상품 존재 여부
				return $('input[name=customAttributeYN]').val();
			},
			addItemRequest:function(itemRequest) {
				// 바로구매시 item request에 custom 선택된 내용 세팅
				var customProductPdp = $("#custom-modal").attr('data-product-customUse');
				if (customProductPdp === 'true') {
					Core.getModule('module_custom_product').addItemRequest(itemRequest);
				}
			},
			getCustomBuyVal:function() {
				// PDP에서 바로구매시 custom 선택 내용 화면에 노출 되는 내용 --> 확인을 받음
				var result = null;
				var customProductPdp = $("#custom-modal").attr('data-product-customUse');
				if (customProductPdp === 'true') {
					result = Core.getModule('module_custom_product').getCustomBuyVal();
				}
				return result;
			},
			// 사용하는 곳이 없음
			isProductOptionCustomProduct:function() {
				// productSkuInventory에서 customProduct에 따라 inventory 정보 다르게 처리(Controller 내에서 판단 하는것으로 변경 함) --> 사용안함
				// product option에서 custom여부를 parameter로 전달하는 부분
				var custom = $("div[data-product-customYN]").attr('data-product-customYN')
				var customUse = $('#custom-modal').attr('data-product-customUse');
				var customYN = false;
				if(custom === 'Y' && customUse){
					customYN = true;
				}
				return customYN;
			}
	};
})(Core);