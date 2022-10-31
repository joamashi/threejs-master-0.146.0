(function(Core){
	// 전역으로 사용될 기본 변수명
	var md = null;
	var queryString = "";
	dl = {};

	function init(){
		md = _GLOBAL.MARKETING_DATA();
		// context
		md.pathName = md.pathName.replace(_GLOBAL.SITE.CONTEXT_PATH, "");
		queryString = Core.Utils.url.getQueryStringParams( Core.Utils.url.getCurrentUrl());

		//소셜로그인 태깅,  로그인 창에서 클릭시  social_type 쿠키 생성.
		//social_login_type : "LOGIN_TYPE",   //comlogin, social_facebook, social_kakao

		if (_GLOBAL.CUSTOMER.SOCIAL_PROVIDER_ID != '' && _GLOBAL.CUSTOMER.ISSIGNIN == true) { // 세션의 provider id 가 있고 로그인 되어있으면 소셜 연동 가입 후 바로 로그인된 상황으로 간주
			_GLOBAL.CUSTOMER.LOGIN_TYPE = _GLOBAL.CUSTOMER.SOCIAL_PROVIDER_ID;
		} else if ($.cookie('social_type') != undefined && _GLOBAL.CUSTOMER.ISSIGNIN == true) { // 쿠키 값이 있고, 로그인 true 일경우 소셜 로그인으로 간주
			_GLOBAL.CUSTOMER.LOGIN_TYPE = $.cookie('social_type');
		}else if ($.cookie('social_type') == undefined && _GLOBAL.CUSTOMER.ISSIGNIN == true) { //쿠키 값이 없고, 로그인 일경우  자동 로그인 으로 간주.
			_GLOBAL.CUSTOMER.LOGIN_TYPE = "comlogin";
			_GLOBAL.CUSTOMER.AUTOLOGIN = true;
		} else {
			_GLOBAL.CUSTOMER.LOGIN_TYPE = "";
			$.removeCookie('social_type');   // 쿠키 삭제.
		};
	
		// 기본 정보 이외의 추가 정보를 처리해야 하는 타입들
		switch( md.pageType ){
			case "category" :
				$.extend( dl, getCategoryData());
			break;

			case "search" :
				$.extend( dl, getSearchData());
			break;

			case "product" :
				$.extend( dl, getProductData());
			break;

			case "cart" :
				$.extend( dl, getCartData());
			break;

			case "checkout" :
				$.extend( dl, getCheckoutData());
			break;

			case "confirmation" :
				$.extend( dl, getOrderConfirmationData());
			break;

			case "register":
				$.extend( dl, getRegisterStartData());
			break;

			case "registerSuccess":
				if( _GLOBAL.CUSTOMER.ISSIGNIN ){
					$.extend( dl, getRegisterComplateData());
				}
			break;

			case "content":
				//회원탈퇴
				if( md.pathName=="/account/withdrawal" ){
					$.extend( dl, getwithdrawalData());
				}

				//소셜로그인
				// 회원가입을 통해서 넘어오면 중복 호출되기 때문에 제거
				/*
				if( md.pathName=="/social/signup" ){
					$.extend( dl, getRegisterStartData());
				}
				*/

				//로그인, 비밀번호 초기화, 비밀번호 변경
				if( md.pathName=="/login" || md.pathName=="/login/resetPassword" || md.pathName=="/login/forgotPassword"){
					var data = {};
					data.page_type = "login";

					$.extend( dl, data);
				}
				//회원등급
				if( md.pathName=="/account/grade"){
					var data = {};
					data.page_type = "member";

					$.extend( dl, data);
				}

			break;

		}

		$.extend( dl, getPageData());

		//console.log( dl );
		window._dl = dl;

		$(document).ready( function(){
			$("body").on("click", "[data-click-name]", function(e){
				if ($(this).data("click-enable") == false) {
					return;
				}
				// toggle-on attribute 가 있으면 off 일 때, 즉 닫혀있어서 열리는 상황에 전송한다.
				if (!_.isUndefined($(this).attr('data-click-toggle-on'))) {
					if ($(this).data('click-toggle-on') == 'on'){
						$(this).data('click-toggle-on', 'off');
						return;
					}else{
						$(this).data('click-toggle-on', 'on');
					}
				}
				// toggle-off attribute 가 있으면 on 일 때, 즉 열려있어서 닫히는 상황에 전송한다.
				if (!_.isUndefined($(this).attr('data-click-toggle-off'))) {
					if ($(this).data('click-toggle-off') == 'off') {
						$(this).data('click-toggle-off', 'on');
						return;
					} else {
						$(this).data('click-toggle-off', 'off');
					}
				}
				//e.preventDefault();
				//var target = $(this).attr("target") || '_self';
				//var href = $(this).attr("href");
				var name = $(this).data("click-name");
				var area = $(this).data("click-area");
				var endPoint = Core.getComponents('component_endpoint');
				//console.log(target);
				//console.log(href);
				//console.log(endPoint);
				
				endPoint.call('clickEvent', {area : area, name : name});
			})
		})
	}

	function getorderCancel(){
		data = {};
		data.page_name = "Order Submit Canceled";
		data.page_type = "Order";
		data.link_name = "Order submit canceled";
		data.page_event = {
			order_canceled : true
		}
		$.removeCookie('orderCancel');
		$.removeCookie('orderCancel', { path: '/' });

		//프로모션 코드 쿠키
		$.removeCookie('promoCode', { path: '/kr/ko_kr/confirmation' });
		return data;
	}

	function getPageData(){
		var data = {};
		data.site_app_name = "nikestorekr"; // 고정
		data.page_division = "Commerce";
		data.country 	   = "kr";
		data.language 	   = "ko-KR";
		data.page_name     = getPageName();

		data.site_section    = getSectionL1Data(); // gender : man, women, boy, girls
		data.site_section_l2 = getSectionL2Data();
		data.page_type    	 = getPageTypeData(); //goods, grid wall/ grid wall:PWH  prop17

		data.login_status = _GLOBAL.CUSTOMER.ISSIGNIN ? "logged in" : "not logged in";    //logged in,  not logged in
		data.login_type   = _GLOBAL.CUSTOMER.LOGIN_TYPE;    //소셜로그인 타입 _dl 추가   //comlogin, social_facebook, social_kakao
		data.autologin    = _GLOBAL.CUSTOMER.AUTOLOGIN ? true : _GLOBAL.CUSTOMER.ISSIGNIN ? false : "";    //자동 로그인  _dl 추가

		// AB 테스트 초기 값 none/
		var customerTesterId = 'none';
		if (_GLOBAL.CUSTOMER.USE_PERSONALIZE){
			var cookieValue = $.cookie('abTestingUserGroup');
			var isNoUserGroup = (cookieValue == 'undefined') || (cookieValue == '');
			if(!isNoUserGroup){
				customerTesterId = cookieValue;
			}
		}
		data.customer_tester = customerTesterId;

		//20180709 | member_serial 추가
		if(_GLOBAL.CUSTOMER.ISSIGNIN){
			data.member_serial  = _GLOBAL.CUSTOMER.ID ;
		}

		if( data.page_type == "sport landing"){
			data.page_division = "brand";
			data.sport_category	= data.page_name[ data.page_name.length-1];
		}

		if( data.page_type == "brand landing"){
			data.page_division = "brand";
		}

		//뒤로가기로 인한 결제 취소시 orderCancel 추가
		//모바일 뒤로가기일 경우 태깅은 안하기로 함 주석 처리(20190327)

		if( md.pathName == "/checkout"){
			if ($.cookie('orderCancel') === 'check'){
				$.extend( data, getorderCancel());
				callTrackEvent( data );
			} else{
				$.extend( data, getCheckoutData());
			}
		}

		//결제 취소시 orderCancel 추가
		if( md.pathName == "/cart"){
			if ($.cookie('orderCancel') === 'check'){
				$.extend( data, getorderCancel());
				callTrackEvent( data );
			}
		}

		if( md.pathName == "/launch"){
			$.extend( data, getCategoryData());
		}

		// 로그인 후 첫 페이지 이면
		/*
		var isFirstLogin = true;
		if( isFirstLogin == "true" ){
			data.page_event = {
				login : true
			}
		}
		*/
		return data;
	}
	function getPageName(){
		// checkout 에서 키프트 카드, 적립금 등을 사용해서 url 이 바뀌더라도 checkout으로 처리
		if( md.pathName.indexOf("/giftcard/credit") == 0 || md.pathName.indexOf("/giftcard/apply") == 0 || md.pathName.indexOf("/giftcard/removeCredit") == 0 ){
			md.pathName = "/checkout";
		}

		if( md.pathName == "/"){
			   md.pathName = "/homepage";

				//스니커즈일 경우../kr/launch/
				if(Core.Utils.contextPath=="/kr/launch"){
					md.pathName = "/launch";
				};
		}

		//체크아웃, 주문완료, pdp 페이지  일반닷컴  or 스니커즈   page_name 분기처리
		if(md.pathName=="/checkout" ||  md.pageType=="confirmation" || md.pageType=="product"){
			md.pathName = (Core.Utils.contextPath=="/kr/launch") ? '/launch'+md.pathName : md.pathName;
		}

		//첫번째 / 제거
		var url = md.pathName.replace("/", "");
		return url.split("/");
	}

	function getPageTypeData(){
		// 이미 type 이 잡혀있다면 다시 설정하지 않음
		if( dl.page_type != null ){
			return;
		}
		//TODO
		// else if 로 전체 변경하자

		// goods
		// grid wall -> categoryData 에서 처리

		// homepage
		if( md.pathName == '/homepage' ){
			return "homepage";
		}
		// snkrs
		/*
		if( md.pathName == '/launch' || queryString.c == 'snkrs'){
			return "snkrs";
		}
		*/
		// search -> searchData에서 처리
		// sports landing


		if( getRegexTestResult( /\/l(.*.)\/(running|training|basketball|football|skateboarding|golf|yoga|tennis|gym-training)$/g, md.pathName ) ){
			return "sport landing";
		}

		// brand landing
		if( getRegexTestResult( /\/l\/(nikelab|jordan|nba|sportswear|acg)$/g, md.pathName ) ){
			return "brand landing";
		}

		// gender landing
		if( md.pathName == "/l/men" || md.pathName == "/l/women" || md.pathName == "/l/boys" || md.pathName == "/l/girls" ){
			return "gender landing";
		}

		// my page
		if( md.pathName == '/mypage' ){
			return "member";
		}

		// cart -> cartData에서 처리
		// order -> checkout 에서 처리
		// cscenter -> 이부분은 확인 해야함 zendesk에서 던져줘야 하는 정보가 될수있음
		// the draw

		if( md.pathName == "/account/wishlist"){
			return "mylocker";
		}

		// memeber
		if( md.pathName.indexOf("/account") == 0 || md.pathName == "/resetPasswordSuccess" || md.pathName == "/updateAccountSuccess"){
			return "member";
		}

		// etc
		return "etc";

	}

	function getSectionL1Data(url){
		var patten = "",
			pathName = url;

		if(pathName == '' || pathName == null){
			pathName = md.pathName;
		}

		if( pathName.indexOf("/l/men") != -1 || pathName.indexOf("/w/men")  != -1 || pathName.indexOf("/t/men")  != -1 ){
			return "men";
		}
		if( pathName.indexOf("/l/women") != -1 || pathName.indexOf("/w/women") != -1 || pathName.indexOf("/t/women")  != -1 ){
			return "women";
		}
		if( pathName.indexOf("/l/boys") != -1  || pathName.indexOf("/w/boys") != -1 || pathName.indexOf("/t/boys")  != -1 ){
			return "boys";
		}
		if( pathName.indexOf("/l/girls") != -1  || pathName.indexOf("/w/girls") != -1 || pathName.indexOf("/t/girls")  != -1 ){
			return "girls";
		}

		/*
		if( getRegexTestResult( /^\/category\/men/g, md.pathName )) {
			return "men";
		}

		if( getRegexTestResult( /^\/category\/women/g, md.pathName )) {
			return "women";
		}

		if( getRegexTestResult( /^\/category\/boys/g, md.pathName )) {
			return "boys";
		}

		if( getRegexTestResult( /^\/category\/girls/g, md.pathName )) {
			return "girls";
		}
		*/
		return "";
	}

	function getSectionL2Data(url){
		var pathName = url;
		if(pathName == '' || pathName == null){
			pathName = md.pathName;
		}

		// TODO
		// /w/men/ap||fw||eq
		// /w/men/fw/lifestyle

		// fw/ap/eq/xc 를 삭제해야하고
		// tennis|golf|skateboarding-shoes|football|basketball|gym-training|running
		// hoodies-crews|jackets-vests|pants-tights|tops-tshirts|shorts|nike-pro-compression|bags|socks|accessories-equipment
		// |set|baselayer|sports-bras|skirts-dresses

		// 체크되는 이름과 전달 해야하는 이름이 달라 명칭 따로 정의
		var l2 = "";
		var l2List = [
						{key:"sportswear", value:""},
						{key:"running", value:""},
						{key:"football", value:""},
						{key:"basketball", value:""},
						{key:"athletic-training", value:""},
						{key:"womens-training", value:""},
						{key:"jordan", value:""},
						{key:"golf", value:""},
						{key:"skateboarding", value:""},
						{key:"young-athlete", value:""},
						{key:"tennis", value:""},
						{key:"nikelab", value:""},
						{key:"snkrs", value:""},
						{key:"nba", value:""},
						{key:"acg", value:""},
						{key:"nsw", value:"sportswear"},
						{key:"at/", value:"athletic training"},
						{key:"men-training", value:"athletic training"},
						{key:"men/fw/gym-training", value:"athletic training"},
						{key:"l/men/gym-training", value:"athletic training"},
						{key:"wt/", value:"womens training"},
						{key:"women-training", value:"womens training"},
						{key:"women/fw/gym-training", value:"womens training"},
						{key:"l/women/gym-training", value:"womens training"},
						{key:"action-sports", value:"skateboarding"},
					];
				/*
					,"nikelab"
					,"jordan"
					,"nba"
					,"fan-gear"
					,"tennis"
					,"golf"
					,"skateboarding-shoes"
					,"football"
					,"basketball"
					,"gym-training"
					,"running"
					,"hoodies-crews"
					,"jackets-vests"
					,"pants-tights"
					,"tops-tshirts"
					,"shorts"
					,"nike-pro-compression"
					,"bags"
					,"socks"
					,"accessories-equipment"
					,"set"
					,"baselayer"
					,"sports-bras"
					,"skirts-dresses"
				*/

		/*
		var subCategory = md.pathName.split("/");
		if( subCategory.length >= 5 ){
			// 첫번째 / 때문에 length가 1이 더 잡히기 때문에 4로 리턴
			return subCategory[4];
		}
		*/

		$.each( l2List, function( index, data ){
			//console.log( data );
			if( pathName.indexOf( "/"+data.key ) > -1 ){
				l2 = (data.value == "") ? data.key : data.value;
				return false;
			}
		})
		return l2;
	}

	// 카테고리 정보
	function getCategoryData(){
		var data = {};
		data.page_type = "grid wall";



		if( md.categoryInfo != null ){
			var categoryInfo = md.categoryInfo;

			if( categoryInfo.hasHeaderContent == true ){
				data.page_type += ":PWH";
			}

			// todo
			// 필터 적용하는 부분에서 url에 lf 값이 있으면 제거해줘야 함
			// 검색 필터를 사용자가 선택해서 넘어온경우가 아닌 링크로 만들어놓은 url에 필터가 걸려있으면 facet을 처리하지 않는다.

			/*
			if( categoryInfo.facet != null ){
				if( String(categoryInfo.lf).toUpperCase() != "Y" ){
					// todo
					// 필터 정보 부분 아직 어떤식으로 줄지 정해지지 않았음
					//JSON.stringify(categoryInfo.facet);
					data.search_facet = "{" + categoryInfo.facet.replace(/=/gi, ":").replace(/&/gi, ",") + "}";
					// facet를 사용한 경우
					data.page_event = {
						endeca_filter_applied :true
					}
				}
			}
			*/
		}
		return data;
	}

	// 상품정보
	function getProductData(){
		var data = {};
		data.page_type = "goods";
		md = _GLOBAL.MARKETING_DATA();
		//customProductInfo = nike에서만 사용하는 정보들
		if( md.productInfo != null && md.customProductInfo != null ){

			var totalRastingAvg = md.productInfo.reviewInfo !== undefined ? md.productInfo.reviewInfo.totalRatingAvg : 0;
			var totalRatingCount = md.productInfo.reviewInfo !== undefined ? md.productInfo.reviewInfo.totalRatingCount : 0;

			//세일여부 판단 구분 변수 필요, 기본값은 할인안함 2020-04-08 13:40:21 pck 
			var product_discount_check = false;

			data.products = [
				{
					product_id : md.productInfo.model,
					product_category : md.customProductInfo.productCategory, 	// 현재 BU값을 productCategory 값으로 셋팅되어있음 // products, prop1, eVar12, prop20
					product_name : md.productInfo.name, 			// products, prop1, eVar12, prop20
					product_unit_price : md.productInfo.retailPrice,

					// 세일 가격 정보 정의 필요함
					product_inventory_status : "in stock" , // 재고 상태
					avg_product_rating : (totalRastingAvg==0) ? "" : Number(totalRastingAvg / 100 * 5).toFixed(1), // 평균 review 평점
					// 평균 review 평점 Number(md.productInfo.reviewInfo.totalRatingAvg / 100 * 5).toFixed(1)
					number_of_product_review : totalRatingCount, // review 갯수
					product_finding_method : "browse", // 상품 페이지 방문 경로
					//onsite search(검색으로 바로 이동), browse(일반 plp에서), internal promotion(내부 프로모션 링크), external camopaign( cp코드 있으면 ), referring nike site(?), cross-sell(다른상품에서)
				}
			];

			// price 에는 최종 가격이 들어가기 때문에 정상가인 retailPrice 보다 작으면 세일중
			if( md.productInfo.price < md.productInfo.retailPrice ){
				data.products[0].product_discount_price = md.productInfo.price;

				product_discount_check = true; 
				// TODO
				// 카테고리 URL 결정되면 처리
				if( queryString.cr != null ){
					data.products[0].price_status = "clearance";
				}else{
					data.products[0].price_status = "reduced";
				}
			}

      		//ctm 로피스,보피스 구분 변수 추가.
			if(  $("[data-component-product-option]").find(".btn-storereserve").length>0  ){
				 var ropis_bopis = true;
			}else{
				 var ropis_bopis = false;
			}
			if($("[data-add-item]").find(".order-custom").length>0){
				var patch = true;
			}else{
				var patch = false;
			}
			data.page_event = {
				product_view : true, // product detail views
				ropis_bopis_function_loaded : ropis_bopis,
				patch_function_loaded : patch,
			}

			if( queryString.fm != null ){
				// sr, bw, pm, ec, cs

				var findingMethod = "";
				switch( queryString.fm ){
					case "sr":
						// 검색을 통해서 접근시
						findingMethod = "onsite search";
					break;
					case "pm":
						// 랜딩 페이지 혹은 pwh 이미지 클릭해서 왔을시
						findingMethod = "internal promotion";
					break;
					case "ec":
						// 어도비 마케팅 채널, 구글 마케팅 채널에서 왔을시
						findingMethod = "External campaign";
					break;
					case "cs":
						// 추천상품을 통해서 들어왔을시
						findingMethod = "cross-sell";
					break;
				}
				data.products[0].product_finding_method = findingMethod;

				// TODO
				//추천상품 링크를 통해 PDP 페이지를 들어온 경우
				if( findingMethod == "cross-sell" ){
					data.page_event.cross_sell_click_through = true // 추천상품 링크를 통해 PDP 페이지를 들어온 경우

					// pm 값으로 model명 받고 있음
					// prodducturl?fm=cs&md=201204-123;
					//data.products[0].cross_sell_source = queryString.md; // 추천 링크를 통한 PDP 페이지 방문 경로                       evar14=pdp:AA1128-200
				}
			}

			// 품절된 상품의 가격
			if( md.productInfo.isSoldOut ){
				data.products[0].product_inventory_status = "out of stock";
				data.page_event.value_out_of_stock_item = md.productInfo.price;
			}

			// 출시예정상품
			if( md.productInfo.isUpcoming ){
				data.products[0].product_inventory_status = "upcoming";
			}

			//가격인하제품 페이지 로드 시 하기 _dl에 추가 2020-04-08 11:50:43 pck
			//할인 적용여부 전달 
			//dl 접근 가능한지 체크 필요 2020-04-08 18:15:26
			dl.sale_price_availability = (product_discount_check) ? 'Y' : 'N';  //sale_price_availability : "SALE_PRICE_AVAILABILITY", // Y or N
			//1on1 적용여부 전달 
			if(typeof md.productInfo.is1on1 !== 'undefined')
				dl.is1_on_1_availability = (md.productInfo.is1on1.toString() == 'true') ? 'Y' : 'N';  // 1_on_1_availability : "1_ON_1_AVAILABILITY", // Y or N
			//멤버만 구매가능 여부 전달 	
			if(typeof md.productInfo.isMemberOnly !== 'undefined')
				dl.member_availability = (md.productInfo.isMemberOnly.toString() == 'true') ? 'Y' : 'N';  // member_availability : "MEMBER_AVAILABILITY", // Y or N
			
			data = personalize_chk(data); //개인화 태깅 체크,

		}
		return data;
	}


	//추천상품, 개인화 상품 태깅,
	function personalize_chk(data){
		if( $("[data-module-personalize]").length > 0 || $("[data-module-crosssale]").length > 0 ){ //개인화, 추천상품 존재시 처리

			var productmodel = []; 
			var targetEl = null;

			if($("[data-module-personalize]").length > 0){
				targetEl = $("[data-module-personalize]");
			}else if($("[data-module-crosssale]").length > 0){
				targetEl = $("[data-module-crosssale]");
			}

			if($('div[data-cart-relatedproduct]').length > 0){ //카트 연관 상품 노출 상태인 경우 예외 처리
				targetEl = document.createElement('div'); //카트 일 경우 초기화 후 다시 세팅 			
				$('div[data-cart-relatedproduct]').each( function(){ //Cart의 경우 related product영역이 2개가 있어서 실제 노출 된 객체를 확인해야 함.
					if($(this).css('display') == 'block')
						$(this).clone().appendTo(targetEl);
				});
			}
			if(targetEl !== null){
				$(targetEl).find("input[name='productmodel']").each(function(){ //상품모델 코드 추출 @ 2020-04-14 pck
					var $thisVal = $(this).val().toString();
					//if($.inArray($thisVal, productmodel) === -1) 중복처리는 안해도 디웍에서 직접 자르고 처리한다고 합니다. @ 2020-04-14 pck
						productmodel.push($thisVal);
				});
			}
			
			//작업1) 추천or 연관 상품 존재하는 페이지 로드 시, 하기 _dl추가
			//impression_products_id : "IMPRESSION_PRODUCTS_ID", // "BV34444-63,BV34444-35,BV34444-33,BV34444-34,BV34444-33"
			data.impression_products_id  = productmodel.join(',').toString();

			//개인화, 추천 상품이 있으면, dl에 추가
			//data.page_event.impressions_function_loaded = true;

			//연관 or 추천 상품과 같은, Impression의 타입을 수집 합니다.
			if($("[data-module-personalize]").length > 0 ){
				  data.impression_type = "products; recommended" ;
			}

			if($("[data-module-crosssale]").length > 0 ){
				 data.impression_type = "products; related";
			}
		}

		return data;
	}



	// 카트 정보
	function getCartData(){
		var data = {};
		data.page_type = "cart";

		data.page_event = {
			cart_view : true, // 장바구니 보기 (장바구니 페이지 열기)
		}

		data = personalize_chk(data); //개인화 태깅 체크,
		return data;
	}

	// 주문서 정보
	function getCheckoutData(){
		//더드로우 본인인증 분기 처리 위한 쿠키값 초기화..
		//드로우 페이지 에서, 응모 안하고 페이지 이동할 경우  Cookie 값이 살아 있음.
		// thedrawCertified  값이 있을경우 본인인증 후  thedrawRedirectUrl(더드로우 페이지로 redirect)
		// 없을 경우 checkout  페이지로 이동 됨..
		$.removeCookie('thedrawCertified', { path: '/' });
		$.removeCookie('thedrawRedirectUrl', { path: '/' });

		var data = {};
		data.page_type = "order";

		return data;
	}

	// 주문완료 정보
	function getOrderConfirmationData(){
		var data = {};

		data.page_type = "order";

		/* 구매확정시 필요 속성 영역 */
		data.purchase_id    = md.orderNumber; // 구매 (확정) 번호
		//data.member_serial  = _GLOBAL.CUSTOMER.ID;
		data.ctm_order_type =  md.ctm_order_type.toLowerCase()=="mixed" ? "cloud_mixed" : md.ctm_order_type.toLowerCase();   // 소문자로 변환..
		var customPatch = $('#customConfirmation');
		var customValue = $('[data-customvalue]').data('customvalue');
		var customKey = $('[data-customkey]').data('customkey');
		if(customPatch.length > 0 && customKey !== '000000'){
			data.custom_patch_ordered  = customValue + '_' + customKey;
		}

		//프로모션 코드 쿠키
		if ($.cookie('promoCode') != ""){
			data.checkout_promo_code = $.cookie('promoCode');
			$.removeCookie('promoCode', { path: '/kr/ko_kr/confirmation' });
		}

		// 뒤로가기로 인한 결제 취소시 체크
		$.removeCookie('orderCancel');
		$.removeCookie('orderCancel', { path: '/' });

		var paymentType = "";

		if( md.paymentList != null ){
			$.each( md.paymentList, function( index, data ){
				if( data.type == "GIFT_CARD" ){
					paymentType = getPaymentMethodByType(data.type) + ( md.paymentList.length > 1 ? ":" : "")  + paymentType;
				}
				paymentType = paymentType + getPaymentMethodByType(data.type);
			});

			if( md.paymentList.length ){

			}
		}
		data.payment_method = paymentType, // 결제 수단

		data.products = [];
		if($('[data-sameday-price]').length !== 0){
			data.shipping_type = 'sameday shipping'; // 당일배송
		} else{
			data.shipping_type = 'standard shipping'; // 일반배송
		}

		if( md.itemList != null ){
			data.products = makeProducts( md.itemList );
		}

		data.page_event = {
			purchase : true,  // 구매 확정
			shipping_amount : md.orderShippingTotalAmount, // (Number) 배송비
			discount_amount : 0
		}

		if( md.orderDiscount != null ){
			data.page_event.discount_amount = md.orderDiscount;
		}


		//결제한 카드 세부내욕 태깅.
		//개발 배포대기중....190312일 추후 반영

		if(md.payment_method_detail!="기타"){
			data.payment_method_detail = "credit card: "+md.payment_method_detail;
		}

		data = personalize_chk(data); //개인화 태깅 체크,

		return data;
	}




	function getPaymentMethodByType( type ){
		switch( type ){
			case "GIFT_CARD" :
				return "giftcertificate";
				break;

			case "CREDIT_CARD" :
				return "credit card";
				break;

			case "WIRE":
				return "wire";
				break;

			case "BANK_ACCOUNT":
				return "bank transfer";
				break;

			case "MOBILE":
				return "cellphone pay";
				break;

			case "KAKAO_POINT":
				return "KAKAO";
				break;

			case "PAYCO": // 2019-08-12
				return "PAYCO";
				break;

			case "NAVER_PAY": // 2020-09-08
				return "NAVER_PAY";
				break;
		}
	}
	// 검색 정보
	function getSearchData(){

		//  .kr/ko_kr/search?q=    <<<< 이런식으로 어디선가 검색어 없이 랜딩 되어 들어올 경우 스크립트 오류 발생
		//  때문에 분기처리 추가해줬음.
		if($("input[id='chk_search']").length > 0)	{
				var data = {};
				data.page_type = "search";
				var isResultFound = (md.searchInfo.totalCount > 0);

				data.onsite_search_phrase = md.searchInfo.keyword,
				data.onsite_search_result_page_type = ( isResultFound ? "onsite search results" : "no result found"),

				data.page_event = {}

				if( isResultFound ){
					data.page_event.onsite_search = true;
				}else{
					data.page_event.null_search = true;
				}

				data = personalize_chk(data); //개인화 태깅 체크,

				return data;
		};
	}

	// 가입 시작 정보
	function getRegisterStartData(){
		var data = {};
		data.page_type = "register";
		data.page_event = {
			registration_start : true, // 사용자 등록 시작
		}
		return data;
	}

	// 가입 완료 정보
	function getRegisterComplateData(){
		var data = {};
		data.page_type = "register";
		data.page_event = {
			registration_complete : true, // 사용자 등록 완료
			email_signup_success : md.receiveEmail || false, // 이메일 수신 동의를 사용자 등록시에 한 경우
			sms_signup_success : md.smsAgree || false, // SMS 수신 동의를 사용자 등록시에 한 경우
			//sms_signup_success : (md.smsAgree == 'on')?true:false || false
		}

		if( _GLOBAL.CUSTOMER.ID != null ){
			data.member_serial = _GLOBAL.CUSTOMER.ID;
		}
		if ( _GLOBAL.CUSTOMER.SOCIAL_PROVIDER_ID != '') {
			data.page_event[_GLOBAL.CUSTOMER.SOCIAL_PROVIDER_ID + '_registration_in_progress'] = true;
		}

		return data;
	}

	//회원 탈퇴
	function getwithdrawalData(){
		var data = {};
		data.page_type = "withdraw";
		return data;
	}


	function makeProducts( itemList ){
		var products = [];
		$.each( itemList, function( index, productData ){
			var product = {

				//ctm태깅추가..
				product_category : productData.category,
				product_discount_price : productData.product_discount_price,

				//주문완료 ctm태깅 변수 추가
				ctm_product_type :    productData.ctm_product_type!= undefined ? productData.ctm_product_type : "",   //ropis, bopis, cloud, com_owned
				shopping_place :      productData.shopping_place!= undefined ? productData.shopping_place : "",   //판매처
				inventory_owner :     productData.inventory_owner!= undefined ? productData.inventory_owner : "" ,  //재고처
				revenue_recognition : productData.revenue_recognition!= undefined ? productData.revenue_recognition : "",  //매출처

				product_id : productData.model,
				//TODO
				// bu 정보를 가져 올수 없음, classfication 정보에 있으니 id로만 처리하자고 요청
				product_name : productData.name, 			// products, prop1, eVar12, prop20
				product_quantity : productData.quantity,
				product_unit_price : productData.retailPrice,
			}

			if( productData.price < productData.retailPrice ){
				product.product_discount_price = productData.price;
			}
			products.push( product );
		})
		return products;
	}

	function getRegexTestResult( patten, str ){
		return patten.test( str );
	}

	function callTrackEvent( data ){
		if( _.isFunction( window._trackEvent )){
			_trackEvent( $.extend( {},  dl, data ) );
		}

		//Adobe Data 확인용 Break Point
		//debug( $.extend( {},  dl, data ) );
		
		//Adobe Data 확인용 test log
		//console.log( data );
	}

	function trackEvent( data ){
		//Adobe Data 확인용 Break Point
		debug( data );
	}

	function addEvent(){
		var endPoint = Core.getComponents('component_endpoint');
		var data = {};
		endPoint.addEvent('clickEvent', function( param ){
			debug( "clickEvent" );

			data = {};
			data.link_name = "Click Links";
			data.click_name = param.name;

			// 슬리이더에서 배너 등록해서 사용시 처리
			if( param.area == "slider"){
				data.click_area = String(data.click_name).split("_")[0];
			}else{
				data.click_area = param.area;
			}
			data.page_event = {
				link_click : true
			}
			callTrackEvent( data );
		});


		//ropis_submit_final
		//로피스 예약완료 버튼 태깅 추가
		endPoint.addEvent('ropis_submit_final', function( param ){
			data = {};
			data.checkout_type   = _GLOBAL.CUSTOMER.ISSIGNIN ? "registered" : "guest";    //logged in,  not logged in
			data.member_serial   = _GLOBAL.CUSTOMER.ID;
			data.ctm_order_type  = "ropis";
			data.payment_method  = "None: CTM ROPIS"; //20190516일 로피스 페이먼트 종류 변수 추가.

			data.products = [];

			if( md.itemList != null ){
				data.products = makeProducts( md.itemList );
			}

			//_checkoutpayment.js  공통 페이지라  수정이 불가피 할듯..
			//ctm_product_type은 주문완료에 값이 정해지는 거라 로피스는 주문단계에서 그냥 bopis로 고정해버림.
			//data.products[0].ctm_product_type = "ropis"

			data.products[0].ctm_product_type           = "ropis";

			//ctm 로피스 필수 널 값 필수..
			data.products[0].price_status               = "";
			data.products[0].avg_product_rating         = "";
			data.products[0].number_of_product_review   = "";
			data.products[0].product_inventory_status   = "";

			data.page_event = {
				  purchase : true, // 구매 확정
					shipping_amount : "", // (Number) 배송비
					discount_amount : "",  // 주문단위 할인금액
			}

	      callTrackEvent( data );
		});


		// 장바구니 추가시
		endPoint.addEvent('addToCart', function( param ){
			data = {};
			data.link_name = "Add to Cart";
			data.cart_serial = param.cartId;
			//var price = (param.retailPrice.amount > param.price.amount ? param.price.amount : param.retailPrice.amount );
			data.page_event = {
				add_to_cart : true,
				//value_added_to_cart : (( md.productInfo != null ? md.productInfo.price : 0 ) * param.quantityAdded),
				//miniPDP md 값이 안넘어옴.
				value_added_to_cart : (( param.price.amount != null ? param.price.amount : 0 ) * param.quantityAdded),
				units_added_to_cart : param.quantityAdded,
			}

			//미니pdp 일 경우 _dl products 가 삭제되서, 다시구성
			if(UIkit.modal('#common-modal').active==true){   //미니pdp 팝업이 open 된거면 ....

					var target = $("#quickview-wrap");

						data.products = [
							{
								product_category : $(target).find('#ctm_teg').data('bu'), 	// products, prop1, eVar12, prop20
								product_name : $(target).find('#ctm_teg').data('name'), 			// products, prop1, eVar12, prop20
								product_id : $(target).find('#ctm_teg').data('id'), // (2018-01-03 추가)
								product_quantity : $(target).find('#ctm_teg').data('quantity'),
								product_unit_price : $(target).find('#ctm_teg').data('unit_price'),
								product_discount_price: $(target).find('#ctm_teg').data('discount_price'),
								product_inventory_status : "in stock", // 재고 상태
								avg_product_rating : ($(target).find('#ctm_teg').data('product_rating') =='0.0') ? '' : Number($(target).find('#ctm_teg').data('product_rating') / 100 * 5).toFixed(1), // 평균 review 평점
								number_of_product_review : $(target).find('#ctm_teg').data('product_review'), // review 갯수
								product_finding_method : "browse", // 상품 페이지 방문 경로

							}
						];
			}


			callTrackEvent( data );
		})

		// 바로구매
		endPoint.addEvent('buyNow', function( param ){
			data = {};
			data.link_name = "Checkout:Buy Now";
			//data.checkout_serial = md.cartId; // 상품에서  클릭시에는 정보가 없음
			data.checkout_type   = _GLOBAL.CUSTOMER.ISSIGNIN ? "registered" : "guest";    //logged in,  not logged in
      		data.member_serial   = _GLOBAL.CUSTOMER.ID;
			data.ctm_order_type  = "com_owned";

			data.products = [];
			if( md.productInfo != null){

				data.products = [
					{
						product_id : md.productInfo.model,
						product_name : md.productInfo.name, 			// products, prop1, eVar12, prop20
						product_unit_price : md.productInfo.retailPrice,
						product_quantity : param.quantityAdded,
						product_discount_price : md.productInfo.price
					}
				];

				if( md.productInfo.price < md.productInfo.retailPrice ){
					data.products[0].product_discount_price = md.productInfo.price;
				}

				data.page_event = {
					checkout : true,
					value_at_checkout : (( md.productInfo != null ? md.productInfo.price : 0 ) * param.quantityAdded),
					units_at_checkout : param.quantityAdded
				}


			//=========================================================
			//위시리스트 미니pdp 에서 바로구매 클릭시 md 값이 없어서 else문 추가함.
			//=========================================================

			} else {

				data.products = [
					{
						product_id : $("#ctm_teg").data('id'),
						product_name : $("#ctm_teg").data('name'), 			// products, prop1, eVar12, prop20
						product_unit_price : $("#ctm_teg").data('unit_price'),
						product_quantity : $(".btn-qty input[name=quantity]").val(),   //수량
						product_discount_price : $("#ctm_teg").data('discount_price')
					}
				];

				data.page_event = {
					checkout : true,
					value_at_checkout : ( $("#ctm_teg").data('discount_price') * $(".btn-qty input[name=quantity]").val()),
					units_at_checkout : $(".btn-qty input[name=quantity]").val()
				}
			}


			callTrackEvent( data );
		});


		// 더 드로우 바로구매 태깅 추가
		endPoint.addEvent('the_draw', function( param ){
				data = {};
				data.link_name 		 = "Checkout: the draw";
				data.click_name	 	 = "the draw: winner_buy now";
				data.click_area 	 = param.click_area;
				data.checkout_type   = _GLOBAL.CUSTOMER.ISSIGNIN ? "registered" : "guest";
				data.member_serial   = _GLOBAL.CUSTOMER.ID;
				data.ctm_order_type  = "com_owned";

				data.products = param.products;

				data.page_event = {
					checkout : true,
					value_at_checkout : data.products[0].product_discount_price,
					units_at_checkout : Number(1)
				}

			callTrackEvent( data );
		});


		// 위시리스트 추가시
		endPoint.addEvent('addToWishlist', function( param ){
			data = {};
			data.link_name = "Add To Mylocker";
			data.page_event = {
				add_to_my_locker : true,
				value_added_to_my_locker : 1,
				units_added_to_my_locker : 1//( md.productInfo != null ? md.productInfo.price : 0 ) // 위시 리스트에 옵션을 저장히지 않기 때문에 의미 없는 정보..  고정값으로 1
			}
			callTrackEvent( data );
		});

		// review 작성 성공시
		endPoint.addEvent('writeReview', function( param ){
			data = {};
			data.link_name = "Product Review Submitted";

			//TODO
			// 리뷰 작성이후 상품정보가 없다.
			data.product = [
				{
					product_id : param.model,
					product_name : param.name
				}
			]

			data.page_event = {
				product_review_submitted : true
			}
			callTrackEvent( data );
		});

		endPoint.addEvent('pdpImageClick', function(){
			data = {};
			data.link_name = "PDP Interactions";
			data.pdp_interactions = "image selected";

			data.page_event = {
				pdp_interaction : true
			}
			callTrackEvent( data );
		})

		//사이즈 가이드 클릭시
		endPoint.addEvent('pdpSizeGuideClick', function(){
			data = {};
			data.link_name = "PDP Interactions";
			data.pdp_interactions = "Size Guide Open";

			data.page_event = {
				pdp_interaction : true
			}
			callTrackEvent( data );
		})

		//카테고리 필터on/off(와이드뷰) 클릭시
		endPoint.addEvent('wideToggleClick', function(param){
			data = {};
			data.click_area = "PW";
			data.click_name = "filters: " + param;

			data.page_event = {
				link_click : true
			}
			callTrackEvent( data );
		})

		//카테고리 제품 클릭 시
		endPoint.addEvent('pwProductClick', function(param){
			data = {};

			data.grid_wall_rank = param.grid_wall_rank,  //좌상단부터 우측으로 +1씩 증가.
			data.products = {
				product_id : param.product_id, //PRODUCT_ID
			}
			data.page_event = {
				grid_wall_prd_click : true,
			}
			callTrackEvent( data );
		})

		// 최종 결제 버튼 클릭시
		endPoint.addEvent('orderSubmit', function( param ){

		//ctm 클릭 이벤트 추가
		 if(param.physicaltype=="PHYSICAL_PICKUP"){
				data = {};
				data.link_name   = "Click Links";
				data.click_name  = "BOPIS_submit";
				data.click_area  = "inventory";

				data.page_event = {
					link_click : true
				}
				callTrackEvent( data );
			};

      		//ctm order-type 추가(= ropis, bopis, com_owned(cloud와 com_owned 주문))

			var physicaltype ="";

			switch(param.physicaltype){

					case "PHYSICAL_PICKUP" :
						physicaltype = "bopis";
						break;

					case "PHYSICAL_SHIP" :
						physicaltype = "com_owned";
						break;

					case "PHYSICAL_ROPIS" :
						physicaltype = "ropis";
						break;
		  	}

      		//결제버튼 태깅 진행
			md = _GLOBAL.MARKETING_DATA();
			data = {};
			data.link_name = "Order Submit";
			data.payment_method = "";
			data.login_status   = _GLOBAL.CUSTOMER.ISSIGNIN ? "logged in" : "not logged in";
			data.member_serial  = _GLOBAL.CUSTOMER.ID;
			data.ctm_order_type = physicaltype;

			//로피스 일경우 payment_method: "None: CTM ROPIS"
			if(physicaltype=="ropis"){

				// 로피스 일때 클릭 이벤트와 ordersubmit 2개가 동시 태깅이 안되서 , ordersubmit 에 변수를 추가함
				data.click_area = "inventory";
				data.click_name = "ROPIS_submit_go to next";
				data.payment_method = "None: CTM ROPIS";
			}

			data.products = [];

			// 뒤로가기로 인한 결제 취소시 체크
			// var widthMatch = matchMedia("all and (max-width: 767px)");
			// if (Core.Utils.mobileChk || widthMatch.matches) {
			// 	$.cookie("orderCancel", 'check', {expires: 1, path : '/'});
			// }

			//로피스 주문이 아닐경우,,,
			if(physicaltype!="ropis"){
				$.cookie("orderCancel", 'check', {expires: 1, path : '/'});
			}


			// 프로모션 코드 쿠기담기
			if( $(".promo-list").find(".applied").length > 0 ){
					var promoCode = "";

					$.each( $(".promo-list").find(".applied"), function(index, data ){
					promoCode  += $(data).data("promo-name") + ",";
					})

					promoCode = promoCode.substr(0, promoCode.length -1);

					$.cookie("promoCode", promoCode, {expires: 1, path : '/kr/ko_kr/confirmation'});

					data.checkout_promo_code = promoCode;
			}

			if( md.itemList != null ){
				data.products = makeProducts( md.itemList );
			}

			// 결제 수단 정보가 있을시
			if( param.paymentType != null ){
				data.payment_method = getPaymentMethodByType(param.paymentType);
			}

				if( md.marketingData.checkoutInfo.giftCardList != null ){
					data.payment_method = getPaymentMethodByType('GIFT_CARD') + ( param.paymentType != null ? ":" : "") + data.payment_method;
				}

				// 적립금 사용시
				/*
				if( md.checkoutInfo.customerCredit != null ){
					data.payment_method = getPaymentMethodByType('GIFT_CARD') + ( param.paymentType != null ? ":" : "") + data.payment_method;
				}
				*/


			data.page_event = {
				order_submitted : true
			}
			callTrackEvent( data );
		})

		// 사용자가 결제 중 취소한 경우
		endPoint.addEvent('orderCancel', function( param ){
			$.removeCookie('orderCancel');
			$.removeCookie('orderCancel', { path: '/' });
			data = {};
			data.page_name = "Order Submit Canceled";
			data.ctm_order_type = "";
			if( md.itemList != null ){
				data.products = makeProducts( md.itemList );
			}
			data.page_event = {
				order_canceled : true
			}
			callTrackEvent( data );
		});

		// 회원가입창 오픈
		endPoint.addEvent('openRegister', function(){
			data = {};
			data.page_event = {
				registration_start : true
			}
			callTrackEvent( data );
		})

		// 회원 가입 완료
		endPoint.addEvent('registerComplete', function( param ){
			//console.log( param );
			data = {};
			data.page_event = {
				registration_complete : true
			}

			if( param.isReceiveEmail == true ){
				data.page_event.email_signup_success = true;
			}

			if( param.isCheckedReceiveSms == true ){
				data.page_event.sms_signup_success = true;
			}
			callTrackEvent( data );
		})

		// 매장 검색시
		endPoint.addEvent('searchStore', function( param ){
			data = {};
			data.link_name = "Store Locator"
			data.page_event = {
				store_locator : true
			}
			callTrackEvent( data );
		});

		// 장바구니 상품 삭제시
		endPoint.addEvent('removeFromCart', function( param ){
		//console.log( param)
			data = {};
			data.link_name = "Remove from Cart";
			data.products = [
				{
					product_id : param.model,
					product_name : param.name
				}
			]
			data.page_event = {
				remove_from_cart : true
			}
			callTrackEvent( data );
		});

		// 장바구니에서 결제하기 클릭시
		endPoint.addEvent('checkoutSubmit', function( param ){
			md = _GLOBAL.MARKETING_DATA();

			data = {};
			//data.link_name = "Checkout:Buy Now"; Cart
			data.link_name = "Checkout:Cart";
			//CTM태깅 추가작업..
			data.member_serial   = _GLOBAL.CUSTOMER.ID;
			data.checkout_serial = md.checkout_serial;
			data.ctm_order_type  = "com_owned";

			//data.checkout_serial = md.cartId;
			data.checkout_type = _GLOBAL.CUSTOMER.ISSIGNIN ? "registered" : "guest";    //logged in,  not logged in

			if( md.promoList != null ){
				//data.checkout_promo_code = String($.map(md.promoList, function(item){ return ( item.auto == true ) ? item.name + ':auto applying' : item.name } ));
				// :auto applying  삭제 요청
				data.checkout_promo_code = String($.map(md.promoList, function(item){ return  item.name } ));
			}

			data.products = [];

			if( md.itemList != null ){
				data.products = makeProducts( md.itemList );
				data.page_event = {
					checkout : true,
					value_at_checkout : md.cartTotalAmount,
					units_at_checkout : md.totalItemCount
				}
			}

			if( param && param.itemList != null ){
				data.products = makeProducts( param.itemList );
				data.page_event = {
					checkout : true
				}

				var totalItemCount = 0;
				var totalAmount = 0;

				$.each( param.itemList, function( index, productData ){
					totalAmount += (( productData.price < productData.retailPrice ? productData.price : productData.retailPrice ) * productData.quantity );
					totalItemCount += productData.quantity;
				})
				data.page_event.value_at_checkout = totalAmount;
				data.page_event.units_at_checkout = totalItemCount;
			}

			callTrackEvent( data );
		});

		// sort 선택시
		endPoint.addEvent('changeSelect', function( param ){
			if( param.name == "sort"){
				data = {};
				data.link_name = "Product Sort Options";

				// TODO
				// 넘어오는 param.value 를 변경해야함
				// 현재 sort에 적용된 옵션 이상함
				// productDisplayOrder asc : 추천순  newest : 최신순  price low-high  : 낮은 가격순     price high-low  : 높은 가격순

				// 이부부은 충돌날꺼니까 넘겨서 작업하자
				var option = "";
				switch( param.value ){
					case "default", "activeStartDate desc":
						option = "newest";
					break;
					case "productDisplayOrder asc":
						option = "recommend";
					break;
					case "price desc":
						option = "price high-low";
					break;
					case "price asc":
						option = "price low-high";
					break;
				}

				data.product_sort_options = option;
				data.page_event = {
					product_sort : true
				}
				callTrackEvent( data );
			}
		});

		// 필터 선택시
		endPoint.addEvent('applyFilter', function( param ){
			data = {};
			data.link_name = "Product Search Facet";
			data.product_facet_option = param.key + ":"+ param.value;
			data.page_event = {
				endeca_filter_applied : true
			}
			callTrackEvent( data );
		});

		// 회원탈퇴시
		endPoint.addEvent('delete_account', function( param ){
			callTrackEvent( param );
		});
		// 상품 옵션 선택시
		endPoint.addEvent('pdpOptionClick', function( param ){
			data = {};
			if( String( param.type ).toLowerCase().indexOf("size") > -1 ){
				data.link_name = "Size Run Selection";

				//240:n|245:n|250:y|255:y|260:y|265:y|270:y|275:y|280:n|285:n|290:n|295:n|300:n|305:n|310:n|320:n
				var productOption = {}//['values'];

				// 전체 상품의 옵션 중에서 사이즈옵션 정보 가져오기
				$.each( param['data-product-options'],  function( index, optionData ){
					if( optionData.type == 'SIZE'){
						$.each( optionData['allowedValues'], function( idx, item ){
							productOption[ item.id ] = item.friendlyName;
						})

						data.size_run_selection = productOption[ optionData['selectedValue'] ];
						return false;
					}
				})

				// 가져온 정보에서 품절 여부 체크
				var sizeAvailabilityList = [];
				$.each( param['data-sku-data'], function(index, skuData){

				// 상품쪽 수정후 적용해야함
				//$.each( param['skuData'], function(index, skuData){
					var size = productOption[skuData.SIZE];
					var isAva = (skuData.quantity > 0 ? 'y' : 'n');
					sizeAvailabilityList.push( size + ':' + isAva );
				})
				data.size_run_availability = String(sizeAvailabilityList).split(',').join('|');
				data.page_event = {
					size_run_select : true
				}
			}

			callTrackEvent( data );
		});


   		//mini_wishlist
		endPoint.addEvent('mini_wishlist', function( param ){
			var patten = "";

			/*
			* 2021-04-23 @pck getSectionL1Data과 중복 처리 부 getSectionL1Data, getSectionL2Data함수에 param값 추가로 기능 확장
			*
			if( param.product_url.indexOf("/l/men") != -1 || param.product_url.indexOf("/w/men")  != -1 || param.product_url.indexOf("/t/men") != -1 ){
				param.site_section = "men";
			}
			if( param.product_url.indexOf("/l/women") != -1 || param.product_url.indexOf("/w/women") != -1 || param.product_url.indexOf("/t/women")  != -1 ){
				param.site_section = "women";
			}
			if( param.product_url.indexOf("/l/boys") != -1  || param.product_url.indexOf("/w/boys") != -1 || param.product_url.indexOf("/t/boys") != -1 ){
				param.site_section = "boys";
			}
			if( param.product_url.indexOf("/l/girls") != -1  || param.product_url.indexOf("/w/girls") != -1 || param.product_url.indexOf("/t/girls")  != -1 ){
				param.site_section = "girls";
			}
			 */

					data = param;
					//md.pathName = param.product_url;    //site_section_l2 겂 넣기 위해서, => 상품 url 로 변경..

					var url  = param.product_url.replace("/kr/ko_kr/", "");  // 페이지 네임
					data.link_name 		= "mini_pdp";
					data.page_type      = "mini pdp";
					data.page_name      =  url.split("/");
					data.page_name.unshift('mini');     // 앞에 mini  신규로 추가요청

					data.site_app_name  = "nikestorekr";   // 고정
					data.page_division  = "Commerce";  // 고정

					data.member_serial  =  _GLOBAL.CUSTOMER.ID ;
					data.login_status   =  _GLOBAL.CUSTOMER.ISSIGNIN ? "logged in" : "not logged in";
					data.site_section = getSectionL1Data(param.product_url);
					data.site_section_l2 = getSectionL2Data(param.product_url);

					data.page_event = {
						mini_pdp : true
					//	product_view : true, // product detail views
					//	value_out_of_stock_item : "VALUE_OUT_OF_STOCK_ITEM" // VALUE_OUT_OF_STOCK_ITEM (Number) PDP out-of-stock의 경우
					}

    				callTrackEvent( data );

		})


		// 상품 컬러 선택시
		endPoint.addEvent('pdpColorClick', function( param ){
			data = {};
			data.link_name = "PDP Interactions";
			data.pdp_interactions = "colorway changed";

			data.page_event = {
				pdp_interaction : true
			}
			callTrackEvent( data );
		});

		// 회원정보 수정
		endPoint.addEvent('updateProfile', function( param ){
			data = {};
			data.link_name = "Profile Update";
			data.profile_update_type = param;
			data.page_event = {
				profile_update : true
			}
			callTrackEvent( data );
		});


		// 로그인 성공
		endPoint.addEvent('loginSuccess', function( param ){
			data = {};
		//	data.social_login_type = "카카오톡"
			data.page_event = {
				login : true
			}
			callTrackEvent( data );
		});

		// promo 적용시
		endPoint.addEvent('applyPromoCode', function( param ){
			/*
			if( param.promoAdded == true ){
				data = {};
				data.checkout_promo_code = param.promoCode;
				data.page_event = {
					checkout_promo_code : true
				}
				callTrackEvent( data );
			}
			*/

		});

		// cross 클릭시
		endPoint.addEvent('crossSaleClick', function( param ){
			data = {};
			data.link_name = "PDP Interactions";
			data.pdp_interactions = "crossell selected";


			//개인화, 연관상품 태깅 추가 20191212

			//연관 or 추천 상품과 같은, Impression의 타입을 수집 합니다.products; recommended
			if($("[data-module-personalize]").length > 0 ){
				  data.impression_clicks_type = "products; recommended" ;
			}

			if($("[data-module-crosssale]").length > 0 ){
				 data.impression_clicks_type = "products; related";
			}

			data.products =[
			 	{
					product_category : param.productcategory,
					product_id : param.product_id,
				}
			];

			data.page_event = {
				pdp_interaction : true,
				impression_clikcs : true, // 신규 변수
			}
			callTrackEvent( data );
		})

		// 픽업 사이즈.
		endPoint.addEvent('pickupsizeClick', function( param ){
			callTrackEvent( param );
		});


		endPoint.addEvent('adobe_script', function( param ){
			callTrackEvent( param );
		});

		// 커스텀 패치 클릭
		endPoint.addEvent('patchClick', function( param ){
			data = {};
			data.link_name = "pdp_interaction";
			data.pdp_interactions = "patch selection opened";
			data.page_event = {
				pdp_interaction : true
			}
			callTrackEvent( data );
		});

		// 커스텀 패치 선택 메인
		endPoint.addEvent('customCodeMain', function( param ){
			data = {};
			data.link_name = "pdp_interaction";
			data.pdp_interactions = "patch selected";
			data.page_event = {
				pdp_interaction : true,
			}
			callTrackEvent( data );
		});

		// PDP Interaction 발생 용 *추후에 이벤트를 통합하여 관리하는 편이 좋을 듯 합니다. 2020-04-09 17:13:08 @pck
		endPoint.addEvent('pdpInteraction', function( param ){
			var data = {};
			try{
				data.link_name = "pdp_interaction";
				data.pdp_interactions = param.pdp_interactions;
				data.page_event = {
					pdp_interaction : param.page_event.pdp_interaction
				}
				callTrackEvent( data );
			}catch(e){
				console.log('track event error : ' +  data.link_name + '(' + e + ')');
			}
		});

		//SNKRS STORY swipe.js Event 2020-06-10 @pck 
		//인터렉션 타입별 
		//6초 뒤 자동 스와이프 시 SNKRS_mobile_swipe_type : "6secs swipe"
		//일반 스와이프 시 SNKRS_mobile_swipe_type : "swipe"
		endPoint.addEvent('snkrsMobileSwipeIndex', function( param ){
			var data = {};
			try{
				data.link_name = "SNKRS mobile index";
				data.SNKRS_mobile_index_number = param.SNKRS_mobile_index_number;
				data.SNKRS_mobile_swipe_type = param.SNKRS_mobile_swipe_type;
				data.page_event = {
					SNKRS_mobile_index : true
				}
				callTrackEvent( data );
			}catch(e){
				console.log('track event error : ' +  data.link_name + '(' + e + ')');
			}
		});

		//@pck 2020-11-05
		//SNKRS FEED / IN STOCK GALLERY, GRID MODE TOGGLE BUTTON EVENT
		endPoint.addEvent('snkrsThumbnailToggleClick', function(param){
			if( param !== null && typeof param == "object") {
				var data = {};

				data.click_area = param.click_area;
				data.click_name = param.click_name;
				data.link_name = "Click Links";

				data.page_event = {
					link_click: true
				}
				callTrackEvent(data);
			}
		});

		//@pck 2021-04-23
		//SNKRS COLLECTION, MINI PDP OPENED EVENT WITH PRODUCT DATA
		endPoint.addEvent('snkrsMiniPDPOpened', function(param){
			if( param !== null && typeof param == "object") {
				var data = {};

				data.link_name = "snkrs_mini_pdp";
				data.page_name =  param.product_url.split("/");
				data.page_name.splice(1,0,'mini');

				data.page_type = "snkrs mini pdp";
				data.site_section    = getSectionL1Data(param.product_url); // gender : man, women, boy, girls
				data.site_section_l2 = getSectionL2Data(param.product_url);

				data.product = [{
					product_category : param.product.product_category,
					product_name : param.product.product_name,
					product_id : param.product.product_id,
					product_quantity : param.product.product_quantity,
					product_unit_price : param.product.product_unit_price,
					product_discount_price : param.product.product_discount_price,
					product_inventory_status : param.product.product_inventory_status,
					//avg_product_rating : param.product.avg_product_rating,
					price_status : '',// param.product.price_status, **MINI PDP 접근경로는 무조건 SNKRS COL CDP임
					//number_of_product_review : param.product.number_of_product_review,
					product_finding_method : param.product.product_finding_method
				}];

				data.page_event = {
					mini_pdp: true
				}
				callTrackEvent(data);
			}
		});
	}

	function debug( data, alert ){
		//console.log( data );
		if( alert == true ){
			alert( data );
		}
	}
	Core.aa = {
		// 함수를 구분짓는것이 큰 의미는 없지만 추후 형태의 변화가 있을것을 대비해서 구분
		init : function(){
			init();
			addEvent();
		}
	}

})(Core);