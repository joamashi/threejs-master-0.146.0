(function(Core){
	var WishListBtn = function(){
		'use strict';

		var $this, args, endPoint;
		var setting = {
			selector:'[data-component-mobileaddtohome]',
			activeClass:'active'
		}

		var faviconFlag = true; // 시작화면 파비콘 노출여부(3초후 클로즈)
		var cookiesDelFlag = false; // 쿠키 삭제여부
		var IS_APP = navigator.userAgent.indexOf('/NKPLUS') != -1; // 인앱상태 여부
		var displayFavorite = false; 
		var closeTimeoutVar; //클리어에 사용될 변수

		// console.log('document.domain:', document.domain);
		//각종 함수 s
		// 쿠키중 파비콘 관련 쿠키의 시간이 다된것이 있다면 삭제한다.
		function fn_faviconCookieService(){
			if(cookiesDelFlag === "true"){
				deleteCookie("snkrsfavicon30day");
				deleteCookie("snkrsfavicon3sec");
			}
			if(faviconFlag === true){
				setTimeout(function(){fn_favicon3secCloseService();}, 3000);
			}
		}
		// 이 펑션을 사용할 경우 30일의 재사용 대기시간을 설정한다.
		function fn_faviconCloseService(){
			setCookieTimeover( "snkrsfavicon30day", 2592000000, 2592000000 ); // 2592000000
			favicon_layer_close();
		}

		// 페이지 종료시 사라지는 쿠키
		function fn_favicon3secCloseService(){		
			setCookieTimeover( "snkrsfavicon3sec", 0, 0 );
			favicon_layer_close();
		}
		//파비콘 팝업 닫기
		function favicon_layer_close(){
			// document.getElementById(favicon_layer).style.display = "none";
			$('#favicon_layer').hide();
		}
		/**
		* 쿠키 설정
		* @param cookieName 쿠키명
		* @param cookieExpireDate 쿠키값(유효날짜)
		* @param expireDay 쿠키 유효날짜
		*/
		function setCookieTimeover( cookieName, cookieExpireDate, expireDate )
		{
			var today = new Date();
			var milliSec = today.getTime() + cookieExpireDate;
			today.setTime(today.getTime() + parseInt(expireDate));
			if(expireDate === 0){
				document.cookie = cookieName + "=" + escape( milliSec ) + "; path=/;";
			}else{
				document.cookie = cookieName + "=" + escape( milliSec ) + "; path=/; expires=" + today.toGMTString() + ";";
			}
		}
		// 쿠키 호출
		function getCookie( cookieName ){
			var search = cookieName + "=";
			var cookie = document.cookie;
			if( cookie.length > 0 ){
				startIndex = cookie.indexOf( cookieName );
				if( startIndex != -1 ){
					startIndex += cookieName.length;
					endIndex = cookie.indexOf( ";", startIndex );
					if( endIndex == -1) endIndex = cookie.length;
					return unescape( cookie.substring( startIndex + 1, endIndex ) );
				} else {
					return false;
				}
			} else { 
				return false;
			}
		}
		// 쿠키 삭제
		function deleteCookie( cookieName ){
			var expireDate = new Date();
			expireDate.setDate( expireDate.getDate() - 1 );
			document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
		}

		// 홈화면 바로가기 추가 레이어
		function fn_homeDisplayAdd(){
			smartskin_HomeButtonAdd('SNKRS','');/* \n */

			try{
				var userAgent = navigator.userAgent.toLowerCase(); // 접속 핸드폰 정보 
				if(userAgent.match('android')) { 
					fbq('track', 'addTohome', {content_name: 'SNKRS'});  
				}						
			}catch(e){}		
		}
		// 홈화면 바로가기 추가 텍스트
		function fn_homeDisplayAddText(){
			smartskin_HomeButtonAdd('SNKRS','');/* \n */
	
			try{
				var userAgent = navigator.userAgent.toLowerCase(); // 접속 핸드폰 정보 
				if(userAgent.match('android')) { 
					fbq('track', 'addTohome', {content_name: 'SNKRS'});  
				}						
			}catch(e){}			
		}
		function smartskin_HomeButtonAdd(title,code){
			if(phoneTypeChk() !== false){
				var sm_HomeButtonTitle = title;
				var sm_LogAnalysisCode = code;
				var sm_HomeButtonTitle = encodeURI(sm_HomeButtonTitle);
				var sm_HomePageUri = 'https://' + document.domain + '/launch';
				// var sm_WebRootPathUri = "https://"+document.domain;
				var userAgent = navigator.userAgent.toLowerCase(); // 접속 핸드폰 정보 
				var iconurl = $('link[rel="shortcut icon"]').attr("href");
				if(userAgent.match('iphone')) { 
					iconurl = $('link[rel="apple-touch-icon-precomposed"]').attr("href");
				} else if(userAgent.match('ipad')) { 
					iconurl = $('link[rel="apple-touch-icon-precomposed"]').attr("href");
				} else if(userAgent.match('ipod')) { 
					iconurl = $('link[rel="apple-touch-icon-precomposed"]').attr("href");
				}
				var sm_naver_customUrlScheme= "intent://addshortcut?url="+sm_HomePageUri+"%3F"+sm_LogAnalysisCode+"&icon="+iconurl+"&title="+
				sm_HomeButtonTitle+"&oq="+sm_HomeButtonTitle+"&serviceCode=nstore&version=7#Intent;scheme=naversearchapp;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.search;end";
				var sm_UserAgent = navigator.userAgent.toLowerCase();
				var sm_BlockDevice1 = sm_UserAgent.indexOf("iphone");
				var sm_BlockDevice2 = sm_UserAgent.indexOf("ipad");
				var sm_BlockDevice = sm_BlockDevice1 + sm_BlockDevice2;
				if(sm_BlockDevice == -2){
					location.href = sm_naver_customUrlScheme;				
				}else{					
					fn_favoriteShow();
				}	
			
				if(faviconFlag === true){
					setTimeout(function(){fn_favicon3secCloseService();}, 3000);
				}
			}
		}
		function phoneTypeChk(){
			var sAgent = navigator.userAgent,
			sWindowType = "win16|win32|win64|mac";
			try {
				if (sWindowType.indexOf(navigator.platform.toLowerCase()) === -1) {
					if (sAgent.match(/iPhone|iPad/i) !== null) {
						fn_favoriteShow();
						return false;
					} else if (sAgent.indexOf('Android') == -1) {
						return false;
					}
				} else {
					return true;
					// alert("모바일 기기에서만 지원되는 기능입니다.");
					// return false;
				}
			} catch(e) {}
				return true;
		}

		// 아이폰 홈화면 추가레이어 표기
		function fn_favoriteShow(){			
			if(displayFavorite === false){
				// document.getElementById('favorite_box').style.display="block";
				$("#favorite_box").show();
				displayFavorite = true;
				// 3초뒤 사라짐
				closeTimeoutVar = setTimeout(function(){fn_favoriteHide();}, 3000);
			}
		}

		// 아이폰 홈화면 추가레이어 숨김
		function fn_favoriteHide(){
			// document.getElementById('favorite_box').style.display="none";
			$("#favorite_box").hide();
			displayFavorite = false;
			clearTimeout(closeTimeoutVar);
		}

		//각종 함수 e

		var Closure = function(){}
		Closure.prototype = {
			setting:function(){
				var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
			},
			init:function(){
				var _self = this;
				$this = $(setting.selector);
				
				//---------------------------------------//

				var userAgent = navigator.userAgent.toLowerCase(); // 접속 핸드폰 정보 
				// 모바일 홈페이지 바로가기 링크 생성 Icon-72.png Icon@2x.png
				if(userAgent.match('iphone')) { 
					$('link[rel="apple-touch-icon-precomposed"]').attr("href",'/cmsstatic/structured-content/1151/Icon@2x.png');
				} else if(userAgent.match('ipad')) { 
					$('link[rel="apple-touch-icon-precomposed"]').attr("sizes",'72x72');
					$('link[rel="apple-touch-icon-precomposed"]').attr("href",'/cmsstatic/structured-content/1151/Icon@2x.png');
				} else if(userAgent.match('ipod')) { 
					$('link[rel="apple-touch-icon-precomposed"]').attr("href",'/cmsstatic/structured-content/1151/Icon@2x.png');
				} else if(userAgent.match('android')) { 
					$('link[rel="shortcut icon"]').attr("href",'/cmsstatic/structured-content/1151/Icon-72.png');
				}

				$this.on('click', function(){
					fn_homeDisplayAddText();
				});
				
				//안드로이드 SNKRS 런칭캘린더를 <br/>홈 화면에 추가해보세요! 누름
				$('#add-favicon-to-home').on('click', function(){	
					fn_homeDisplayAdd();
				});

				//안드로이드 SNKRS 런칭캘린더를 <br/>홈 화면에 추가해보세요 의 닫기 아이콘
				$('#android-favicon-close').on('click', function(){
					fn_faviconCloseService();
				});
				//아이폰 SNKRS 런칭캘린더를 <br/>홈 화면에 추가해보세요 의 닫기 아이콘
				$('#apple-favorite-close').on('click', function(){
					fn_favoriteHide();
				});
				//------------------------------------//

				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_mobileaddtohome'] = {
		constructor:WishListBtn,
		reInit:true,
		attrName:'data-component-mobileaddtohome'
	}
})(Core);