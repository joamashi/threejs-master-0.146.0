(function(Core){
	Core.register('module_dynamicform', function(sandbox){
		var $deferred = null, endPoint;
		var Method = {
			$that:null,
			$form:null,
			moduleInit:function(){
				$.extend(Method, arguments[0]);

				var $this = $(this);
				Method.$that = $this;
				endPoint = Core.getComponents('component_endpoint');

				Method.$form = $this.find("form");
				var $submitBtn = $this.find('button[type="submit"]');

				sandbox.getComponents('component_textfield', {context:$this}, function(){
					this.addEvent('enter', function(e){
						$submitBtn.trigger('click');
					});
				});

				$('[data-uk-datepicker]').each(function () {
					var format = $(this).data().ukDatepicker.format || 'YYYY.MM.DD';
					UIkit.datepicker(this, { "format": format }).on('hide.uk.datepicker', function () {
						// placeholder를 숨기기 위한 이벤트 실행
						if ($(this).val() != '') {
							$(this).keydown();
							// 날짜 선택창이 닫치면 필드 정합성 테스트 진행
							$(this).parsley().validate();
						}
					})
				});

				//  소괄호 입력시 비밀번호가 인코딩 되서 저장되는 문제 발생... (회원가입)
				$this.find('input[id="password"]').on('keyup', function(e){
					if ($(this).val().indexOf('(') != -1  || $(this).val().indexOf(')') != -1 || $(this).val().indexOf('<') != -1 || $(this).val().indexOf('>') != -1) {
						$(this).closest('div').addClass('error');
						$(this).next().html('<span class="parsley-pattern_1">비밀번호에 ( ) < >는 사용할 수 없습니다.</span>');
					}else {
						$this.find('.parsley-pattern_1').html('');
					}
				});

				//  소괄호 입력시 비밀번호가 인코딩 되서 저장되는 문제 발생... (비밀번호 변경)
				$this.find('input[id="newPassword"]').on('keyup', function(e){

					e.preventDefault();
					//sandbox.validation.validate( Method.$form );
					//console.log(sandbox.validation.isValid( Method.$form ) );

					if ($this.find('#newPassword').length > 0) {
						if ($(this).val().indexOf('(') != -1  || $(this).val().indexOf(')') != -1 || $(this).val().indexOf('<') != -1 || $(this).val().indexOf('>') != -1) {
							$(this).closest('div').addClass('error');
							$(this).next().html('<span class="parsley-pattern_1">비밀번호에 ( ) < >는 사용할 수 없습니다.</span>');
						} else {
							$this.find('.parsley-pattern_1').html('');
						}
					}
				});

				// 개인정보 국외제공 동의 체크를 할때만 광고성 정보 수신동의 체크박스 활성화
				// 사용안하기로 함
				
				/* 
				var $transferAgree = $(this).find('input[id="globalMember_transferAgree"]');
				var $receiveAdInfoAgree = $('#globalMember_receiveAdInfoAgree');

				if ($receiveAdInfoAgree.length > 0) {
					var $receiveEmail = $('#receiveEmail');
					var $smsAgree = $('#smsAgree');
					// 광고성 정보 수신동의 하면 이메일과 SMS 수신 동의 처리
					$receiveAdInfoAgree.on('change', function () {
						$receiveEmail.prop('checked', $(this).prop('checked'));
						$smsAgree.prop('checked', $(this).prop('checked'));
					});
					//  회원 정보 수정에서 둘중 하나만 true 라면 광고성 정보 수신동의 체크
					if ($receiveEmail.prop('checked') == true || $smsAgree.prop('checked') == true) {
						// 두옵션 다 체크 시키기 위해 이벤트 실행
						$receiveAdInfoAgree.prop('checked', true).trigger('change');
					}
				}
				if ($transferAgree.length > 0) {
					$transferAgree.on('change', function () {
						if ($(this).prop('checked') == true) {
							$receiveAdInfoAgree.attr('disabled', false)
							$receiveAdInfoAgree.closest('.input-checkbox').removeClass('disabled');
						} else {
							$receiveAdInfoAgree.prop('checked', false);
							$receiveAdInfoAgree.attr('disabled', true);
							$receiveAdInfoAgree.closest('.input-checkbox').addClass('disabled');
							// 체크 처리한 두 옵션체크를 다시 풀기 위해 이벤트 호출
							$receiveAdInfoAgree.trigger('change');
						}
					}).trigger('change');
					// 처음에 광고성 정보 수신 동의 체크박스를 비활성화 시키기 위해 이벤트 호출
				}
				*/
				// 선택적 개인정보 관련 추가
				// 숨겨져 있을 때 값이 전송되지 않도록 disabled 처리
				$this.find('.option-agree').each(function () {
					$(this).find('input').attr('disabled', true);
				});
				$this.find('input[name="isOptionAgree"]').on('click', function(e){
					$this.find('.option-agree').each(function(){
						if ($(this).hasClass('uk-hidden')) {
							$(this).find('input').attr('disabled', false);
						}else{
							$(this).find('input').attr('disabled', true);
						}
						$(this).toggleClass('uk-hidden');
					})
				})

				$submitBtn.on("click", function(e){
					e.preventDefault();
					sandbox.validation.validate( Method.$form );
					if( sandbox.validation.isValid( Method.$form )){

						//Input Custom Regex , 정규식 표현이 사용안됨,
						//Custom  할 경우, 영문.숫자.특수문자 8~16 안내 멘트 동시 나오게 안됨.
						// 소괄호 입력시 인코딩 되서 저장됨..

						if ($this.find('#password').length > 0) {
		 					if ($this.find('#password').val().indexOf('(') != -1  || $this.find('#password').val().indexOf(')') != -1 || $this.find('#password').val().indexOf('<') != -1 || $this.find('#password').val().indexOf('>') != -1) {
								$this.find('#password').focus();
		 						$this.find('#password').closest('div').addClass('error');
		 						$this.find('#password').next().html('<span class="parsley-pattern_1">비밀번호에 ( ) < >는 사용할 수 없습니다.</span>');
		 						return;
		 					}
		 				}

						if ($this.find('#newPassword').length > 0) {
							if ($this.find('#newPassword').val().indexOf('(') != -1  || $this.find('#newPassword').val().indexOf(')') != -1 || $this.find('#newPassword').val().indexOf('<') != -1 || $this.find('#newPassword').val().indexOf('>') != -1) {
								$this.find('#newPassword').closest('div').addClass('error');
								$this.find('#newPassword').next().html('<span class="parsley-pattern_1">비밀번호에 ( ) < >는 사용할 수 없습니다.</span>');
								return;
							}
						}

						if ($this.find('#checkTerms').length > 0) {
							if(!$this.find('#checkTerms').hasClass('checked')){
								UIkit.modal.alert('이용약관에 동의 해주세요.');
								return;
							}
						}
						if ($this.find('#checkPrivacy').length > 0) {
							if(!$this.find('#checkPrivacy').hasClass('checked')){
								UIkit.modal.alert('개인정보 수집 및 이용에 동의해주세요.');
								return;
							}
						}

						var msg = $(this).data('confirm-msg');
						var endPointType = $(this).data('endpoint-type');
						var endPointValue = $(this).data('endpoint-value');
						if( msg != null){
							UIkit.modal.confirm(msg, function(){
								if( endPointType != null ){
									endPoint.call( endPointType, endPointValue );
								}
								Method.submit();
							}, function(){},
							{
								labels: {'Ok': '확인', 'Cancel': '취소'}
							});
						}else{
							if( endPointType != null ){
								endPoint.call( endPointType, endPointValue );
							}

							//소셜 로그인 및 자동 로그인 체크를 위해서 로그인 버튼 클릭시 쿠키를 생성 한다.
							//$.cookie('social_type', name);
							//_adobeAnalyzerScript.js  처리..
							$.cookie('social_type', 'comlogin');  //2019-01.10

							Method.submit();
						}
					}
				});

				sandbox.validation.init( Method.$form );
			},
			SHA256:function(s){

				var chrsz   = 8;
				var hexcase = 0;

				function safe_add (x, y) {
					var lsw = (x & 0xFFFF) + (y & 0xFFFF);
					var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
					return (msw << 16) | (lsw & 0xFFFF);
				}

				function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
				function R (X, n) { return ( X >>> n ); }
				function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
				function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
				function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
				function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
				function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
				function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

				function core_sha256 (m, l) {
					var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
					var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
					var W = new Array(64);
					var a, b, c, d, e, f, g, h, i, j;
					var T1, T2;

					m[l >> 5] |= 0x80 << (24 - l % 32);
					m[((l + 64 >> 9) << 4) + 15] = l;

					for ( var i = 0; i<m.length; i+=16 ) {
						a = HASH[0];
						b = HASH[1];
						c = HASH[2];
						d = HASH[3];
						e = HASH[4];
						f = HASH[5];
						g = HASH[6];
						h = HASH[7];

						for ( var j = 0; j<64; j++) {
							if (j < 16){W[j] = m[j + i];} else {W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);}

							T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
							T2 = safe_add(Sigma0256(a), Maj(a, b, c));

							h = g;
							g = f;
							f = e;
							e = safe_add(d, T1);
							d = c;
							c = b;
							b = a;
							a = safe_add(T1, T2);
						}

						HASH[0] = safe_add(a, HASH[0]);
						HASH[1] = safe_add(b, HASH[1]);
						HASH[2] = safe_add(c, HASH[2]);
						HASH[3] = safe_add(d, HASH[3]);
						HASH[4] = safe_add(e, HASH[4]);
						HASH[5] = safe_add(f, HASH[5]);
						HASH[6] = safe_add(g, HASH[6]);
						HASH[7] = safe_add(h, HASH[7]);
					}
					return HASH;
				}

				function str2binb (str) {
					var bin = Array();
					var mask = (1 << chrsz) - 1;
					for(var i = 0; i < str.length * chrsz; i += chrsz) {
						bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
					}
					return bin;
				}

				function Utf8Encode(string) {
					string = string.replace(/\r\n/g,"\n");
					var utftext = "";

					for (var n = 0; n < string.length; n++) {

						var c = string.charCodeAt(n);

						if (c < 128) {
							utftext += String.fromCharCode(c);
						}
						else if((c > 127) && (c < 2048)) {
							utftext += String.fromCharCode((c >> 6) | 192);
							utftext += String.fromCharCode((c & 63) | 128);
						}
						else {
							utftext += String.fromCharCode((c >> 12) | 224);
							utftext += String.fromCharCode(((c >> 6) & 63) | 128);
							utftext += String.fromCharCode((c & 63) | 128);
						}

					}

					return utftext;
				}

				function binb2hex (binarray) {
					var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
					var str = "";
					for(var i = 0; i < binarray.length * 4; i++) {
						str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
						hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
					}
					return str;
				}

				s = Utf8Encode(s);
				return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

			},
			submit:function(){
				//Method.$form.submit();

				if( _GLOBAL.PASSWORD_LEGACY_SHA_ENCODER ){
					sandbox.validation.destroy( Method.$form );
					Method.$form.find('input[type="password"]').each( function(){
						$(this).val( Method.SHA256( $(this).val() ));
					});
				}

				if( Method.isAjax === 'true'){
					sandbox.utils.ajax(Method.$form.attr('action'), 'POST', Method.$form.serialize(), function(data){
						var responseData = sandbox.rtnJson(data.responseText, true)['ResponseObject'];
						if(responseData){
							if($deferred){
								if(!responseData.isError || responseData.isError === 'false'){
									$deferred.resolve(responseData);
								}else{
								    if(responseData instanceof Object && responseData.failureType == 'withoutpassword') {
								        $deferred.reject(responseData);
								    } else if(responseData.errorType == 'auth.failure.isSleptException') {
								        window.location.href= Core.Utils.contextPath + responseData.failureUrl;
								    } else {
								      //  $deferred.reject(responseData.errorMap || Method.errMsg);
										// 로그인 실패시 모달 빼고,  메세지 출력.
										//@pck 2020-07-03 회원가입 페이지와 같이 jq_uk-alert-danger객체가 두개이상 있는 케이스가 있음
									    if($("div#jq_uk-alert-danger").length > 0){
											Method.$form.closest('div').find('#jq_uk-alert-danger').show();
											Method.$form.find("input#j_username").val('');
											Method.$form.find("input#j_password").val('');
											Method.$form.find("div.input-textfield").removeClass('value');
                                       }
								    }
								}
							}
						}
					}, true);
				}else{
					Method.$form.submit();
				}
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-dynamicform]',
					attrName:'data-module-dynamicform',
					moduleName:'module_dynamicform',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				$deferred = null;
				console.log('destroy dynamicForm module');
			},
			setDeferred:function(defer){
				$deferred = defer;
			}
		}
	});
})(Core);