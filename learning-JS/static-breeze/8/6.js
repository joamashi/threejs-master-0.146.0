(function(Core){
    var kakaoAPI = Kakao;
    
    function initKakaoApi(){
        try {
            if(typeof kakaoAPI.isInit == 'undefined'){ 
                kakaoAPI.init('5f1c8dd8381502537d0f6cb5a5553428'); // API Key 2020-06-16 수령
                kakaoAPI.isInit = true;
            }
        }
        catch (err) { console.log('kakaoApi init ERR : ' + err); }
    }

    //현재 주소를 카카오 메세지로 공유
    function link(targetUrl){

        if(typeof Kakao.link == 'undefined') //init이 안되면 Kakao.* 하부 메소드들이 정의되지 않음으로 체크
            initKakaoApi();
        try { 
            kakaoAPI.Link.sendScrap({ requestUrl: targetUrl }); // init check *init 안 된 상태에서는 에러 발생
        } catch (err) { console.log('kakaoApi LINK ERR : ' + err); }

    }

    Core.kakaoApi = {
		init : function(){
			initKakaoApi();
        },
        link : link
	}
})(Core);