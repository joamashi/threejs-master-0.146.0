(function(Core){
	var md = null;
	var sendRF = null;
	var userId = 'nike1';

	function init(){
		if(EN) {
			md = _GLOBAL.MARKETING_DATA();
			sendRF = new EN();
		
			var productPrimaryImage = '';
			var productCategory = '';
			var productRelatedCodes = '';

			//상품대표이미지 url
			if(typeof md.productInfo !== 'undefined'){
				$(md.productInfo.imgUrl).each( function(index, data){
					if(data.key == 'primary' )
						productPrimaryImage = data.value;
				});
			}

			//카테고리
			
			if(typeof md.categoryInfo !== 'undefined'){
				productCategory = md.categoryInfo.name;
			}

			//연관, 추천상품 목록
			
			if(typeof md.productRelatedProducts !== 'undefined'){			
				productRelatedCodes = md.productRelatedProducts.join(',')
			}

			//품절여부 
			var isSoldOut = false;
			if($('#isSoldout').length > 0){ 
				isSoldOut = $('#isSoldout').val();
			}

			sendRF.setSSL(true); //ssl 파라미터는 공통으로 사용
			sendRF.setData('userid', userId);
			sendRF.sendRf();

			if(typeof md.pageType !== 'undefined'){
				switch( md.pageType ){
					//상품상세
					case "product": 
						/* 
						userid	String		모비온 User ID				필수					
						sc		String		본상품광고 Site_Code		필수
						pcode	String		상품코드					필수
						pnm		String		상품명						필수
						img		String		이미지 전체 URL				필수
						price	String 		"0"	제품가격				필수
						dcPrice	String 		"0"	제품 할인가격			옵션
						soldOut	String 		"0"	제품 품절여부 ("1" - 품절, "2" - 품절 아님)		   옵션
						mdPcode	String 		(쉼표로 구분된 여러 개의 상품 코드)	MD 추천 상품코드	옵션
						cate1	String		카테고리명					필수
						*/
						sendRF.setData('userid', userId);					
						sendRF.setData('sc', '23d4cbc774e804cac457052a3e1a4114'); 								//Site_Code
						sendRF.setData('pcode', md.productInfo.model); 											// ex) "942237-003"
						sendRF.setData('price', md.productInfo.retailPrice ); 									// 소비자가 또는 판매가
						sendRF.setData('pnm', encodeURIComponent(encodeURIComponent(md.productInfo.name))); 	//상품명
						sendRF.setData('img', encodeURIComponent(productPrimaryImage));

						if(md.productInfo.retailPrice > md.productInfo.price) //할인 시 에만 전달
							sendRF.setData('dcPrice', md.productInfo.price); 

						var chkSoldOut = (isSoldOut == 'true') ? '1' : '2';
						sendRF.setData('soldOut', chkSoldOut); 	 										//옵션 1:품절,2:품절아님
						sendRF.setData('mdPcode', productRelatedCodes); 										//옵션  "추천상품코드1,추천상품코드2,…"
						sendRF.setData('cate1', encodeURIComponent(encodeURIComponent(productCategory))); 		//필수 "상품카테고리"

						sendRF.sendRfShop();
						addEvent(); //PDP외 페이지에서 이벤트 발생 시 에러나는 것으로 추정(추후 요청 있을 시 추가작업 필요할 수도...) 						
						return true;

					//주문완료
					case "confirmation" : 
						/*
						uid		String		모비온 User ID			필수
						ordcode	String		주문번호				옵션
						pcode	String		제품코드				옵션
						qty		String 		(숫자 형식)	"1"	수량	필수
						price	String 		(숫자 형식, 소수점 가능) "0" 총 주문 금액	필수
						pnm		String		제품명					옵션
						*/

						var itemList = md.itemList || null;
						var pcode = "";
						var qty = 0;
						var name = "";
			
						if( itemList != null && itemList.length > 0 ){
							pcode = itemList[0].id;
							name = itemList[0].name;
							$.each( itemList, function(){
								qty += Number($(this)[0].quantity);
							})
						}

						sendRF.setData('uid', userId);
						sendRF.setData('ordcode', md.orderNumber);
						sendRF.setData('pcode', pcode); // 주문 완료시 묶음 주문인 경우 첫번째 상품의 제품코드만
						sendRF.setData('qty', qty); //주문 완료시 묶음 주문인 경우 총 제품 수량(총주문한 상품의 갯수를 의미. 예) A상품 2개, B상품1개 ->  A+B 하여 총 수량은 3개)
						sendRF.setData('price', md.orderTotalAmount);  //주문 완료시 묶음 주문인 경우 구매한 총 가격(총 결제금액을 의미함)
						sendRF.setData('pnm', encodeURIComponent(encodeURIComponent(name))); //-> 첫번째 상품의 제품코드
										
						sendRF.sendConv();	
						return true;			
				}
			}
		}else{
			console.warn('Load Err : NOBON 공용라이이브러리를 찾을 수 없어 초기화에 실패하였습니다.');
			return false;
		}
	}
	function addEvent(){
		var endPoint = Core.getComponents('component_endpoint');

		// 장바구니 추가 시
		endPoint.addEvent('addToCart', function(param){
			if(sendRF){
				sendRF.sendCart();
			}
		})

		// 위시리스트 추가 시
		endPoint.addEvent('addToWishlist', function(param){
			if(sendRF){
				sendRF.sendWish();
			}			
		});
	}
	Core.mobon = {
		init : function(){
			init();
		}
	}

})(Core);