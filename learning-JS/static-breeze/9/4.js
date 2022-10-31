(function(Core){
	$(document).ready(function(){
		// <![CDATA[

		var md = _GLOBAL.MARKETING_DATA();
		var autoOpenModalId = Core.Utils.getQueryParams(Core.Utils.url.getCurrentUrl()).am;
		var isAutoModalOpen = autoOpenModalId != null;
		if (_.isEqual(md.pageType, 'home') && isAutoModalOpen) {
			switch (autoOpenModalId) {
				case 'fp':
					if (!_GLOBAL.CUSTOMER.ISSIGNIN){
						$('[data-btn-forgot-password]').trigger('click');
					}else{
						UIkit.modal.alert('이미 로그인 되어 있습니다.');
					}
					break;

				default:
					break;
			}
		}
		
		window.addEventListener('pageshow', function (event) {
			if (event.persisted) {
				Core.Loading.hide();
			}
		});
		$(":checkbox").attr("autocomplete", "off");
		$(":radio").attr("autocomplete", "off");

		var channelFunnels = $('input[name="channelFunnels"]').val(); // admin에 등록된 채널정보
		// 등록된 유입채널 정보가 있을 때
		if (!_.isEmpty(channelFunnels)){
			channelFunnels = channelFunnels.split(',');
			var rUrl = document.referrer;
			var cUrl = Core.Utils.url.getCurrentUrl();
			var rUri = Core.Utils.url.getUri(rUrl); 
			var cUri = Core.Utils.url.getUri(cUrl);

			if (_.isEmpty(rUrl)) {
				rUri.host = '';
			}

			var cQueryParams = [];

			$.each(Core.Utils.getQueryParams(cUrl), function (data) {
				cQueryParams.push(data);
			})
			/*
			console.log(channelFunnels);
			console.log(cQueryParams);
			console.log(rUri);
			console.log(cUri);
			*/
			// param에 유입채널 정보가 있고 referrer 가 현재 사이트가 아니면
			if (!_.isEqual(rUri.host, cUri.host) && _.intersection(channelFunnels, cQueryParams).length > 0) {
				sessionStorage.setItem('AFFILIATE_INFLOW_URL', cUri.url);
				sessionStorage.setItem('AFFILIATE_INFLOW_PARAM', cUri.query.slice(1, 250));
			}
		}
		
		/*
		$.removeCookie('MAIN_LINK');
		$('[data-click-logo]').on('click', function(e){
			e.preventDefault();
			$.cookie('MAIN_LINK', true);
			location.href = $(this).attr('href');
		})
		*/
		
		if (typeof (history.pushState) == 'function'){
			if (Core.Utils.url.getUri(Core.Utils.url.getCurrentUrl()).path == '/kr/ko_kr/'){
				history.pushState({}, '', '/kr/ko_kr/');
			}
		}
		//]]>
	})
})(Core);