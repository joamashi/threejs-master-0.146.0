(function(Core){
	Core.register('module_certification', function(sandbox){
		var args;
		var Method = {
			moduleInit:function(){
				var $this = $(this);
				//console.log('this:' , $(this));
				//console.log('args:' , arguments);
				var certificationYnModal = UIkit.modal('#certification-yn-modal', {center:true, bgclose:false, keyboard:false});
				certificationYnModal.show();
				args = arguments[0];

				//이전페이지로 이동
				/*$this.find('#btn-go-back').on('click', function(){
					window.history.back();
					return false;
				});*/

				var redirectUrl = args.redirectUrl;
				
				
				//인증화면으로 이동
				$this.find('#btn-go-certification').on('click', function(e){
					e.preventDefault();
					//console.log('go certification');
					/*
					$('#certification_frame').attr('src', sandbox.utils.contextPath + '/personalAuthentication/form');

					UIkit.modal("#certification-modal", {center:true, bgclose:false, keyboard:false} ).show();
					//certificationYnModal.hide();

					//Method.sendSiren24('hideCertificationLayer', '', 'certifymeorder');

					$('#btn-show-certification-yn-modal').off('click').on('click', function(){
						$('#certification_frame').contents().find("body").html('');
						certificationYnModal.show();
					})

*/	
					// 본인인증 처리시 강제 페이지 지정, 드로우에서 구현되었던 것을 유지하느라 기존에 있던 쿠키 이름이 드로우임
					if (_.isEmpty(redirectUrl) == false) {
						$.cookie("thedrawCertified", 'thedraw', { expires: 1, path: '/' });
						$.cookie("thedrawRedirectUrl", redirectUrl, { expires: 1, path: '/' });
					}
					window.open(sandbox.utils.contextPath +"/personalAuthentication/form","crPop","width=430, height=560, resizable=1, scrollbars=no, status=0, titlebar=0, toolbar=0, left=300, top=200");
				});

			},
			/**
			 * 서신평 인증
			 * @param successCallback : 성공콜백
			 * @param errorCallback : 에러콜백
			 * @param storeNo : 스토어번호
			 * sendSiren24(hideCertificationLayer, null, "certifymeorder");
			 * sendSiren24(aa1, aa2, "certifymemember");
			 */
			// sendSiren24:function(successCallback, errorCallback, certifymeMethod){
			// 	$("#retUrlSiren24").val( $("#retUrlSiren24").val() + "?serviceCode="+certifymeMethod+"&successCallback="+successCallback+"&errorCallback="+errorCallback);
			// 	$("#formGetServiceCode").attr("action","https://secure.nike.co.kr/member/getIpinReqInfoAjax.lecs?serviceCode="+certifymeMethod);
			// 	IframeSubmitter.submit($("#formGetServiceCode")[0], "setServiceCodeSiren24", $("#frameCert").attr("name"));
			// },
			//휴대폰 인증 siren 팝업 호출
			setServiceCodeSiren24:function(result){
				if (result.success) {
					$("#reqInfoSiren24").val(result.reqInfo);
					openPopupSiren24();
				} else {
					alert(result.message);
					return;
				}
			},
			//휴대폰 인증 siren 팝업
			openPopupSiren24:function(){
				var CBA_window_Siren24;
				CBA_window_Siren24 = window.open("", "IPINWindowSiren24", "width=430, height=560, resizable=1, scrollbars=no, status=0, titlebar=0, toolbar=0, left=300, top=200");
				if(CBA_window_Siren24 == null){
					alert(" ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는 \n    화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다. \n\n※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.");
				}
				$("#formCertificationSiren24").attr("target", "IPINWindowSiren24");
				document.getElementById("formCertificationSiren24").submit();
			},

			getIsAuthenticate:function(){
				return (args.certified === 'true') ? true : false;
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-certification]',
					attrName:'data-module-certification',
					moduleName:'module_certification',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			getIsAuthenticate:function(){
				return Method.getIsAuthenticate();
			}
		}
	});
})(Core);