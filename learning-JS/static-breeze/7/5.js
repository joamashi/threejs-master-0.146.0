(function(Core){
	Core.register('module_kakao', function(sandbox){
		var $this, args;
		var Method = {
			moduleInit:function(){
				$this = $(this);
				args = arguments[0];

				if(args.appid === 'null') console.log('kakao appid is defined');

				Kakao.init(args.appid);
				Kakao.Link.createDefaultButton({
					container:args.btnContainer,
					objectType:'feed',
					content:{
						title:$('title').text(),
						imageUrl:location.origin + args.feedImg,
						link:{
							mobileWebUrl:location.href,
							webUrl:location.href
						}
					},
					buttons:[
						{
							title:'웹으로 보기',
							link: {
								mobileWebUrl:location.href,
								webUrl:location.href
							}
						}
					]
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-kakao]',
					attrName:'data-module-kakao',
					moduleName:'module_kakao',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				console.log('product destory');
			}
		}
	});
})(Core);