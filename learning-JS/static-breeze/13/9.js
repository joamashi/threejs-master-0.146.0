(function(Core){
	Core.register('module_instagram_feed', function(sandbox){
		var $this, args;
		var Method = {
			moduleInit:function(){
				$this = $(this);
				args = arguments[0];

				var url = 'https://api.instagram.com/v1/users/self/media/recent';  // 가입한 user의 feedData;
				var obj = {client_id:args.clientkey, access_token:args.token, count:args.count}
				var template = $(args.template).html();

				sandbox.utils.jsonp(url, obj, 'callback', function(data){
					var feedData = data.data;

					if(data.meta.hasOwnProperty('error_message')){
						UIkit.notify(data.meta.error_message, {timeout:3000,pos:'top-center',status:'error'});
						return
					}

					/* 인스타그램에서 보내주는 이미지 크기가 달라 thumbnail_high 를 따로 가공해서 넣어준다. */
					for(var i=0; i<feedData.length; i++){
						feedData[i]['images']['thumbnail_high'] = {
							width:320,
							height:320,
							url:feedData[i]['images']['thumbnail']['url'].replace('s150x150', 's320x320')
						}
					}

					var source = $(args.template).html();
					var template = Handlebars.compile(source);
					var bindingHtml = template({instagram:feedData});



					$this.append(bindingHtml);
					sandbox.moduleEventInjection(bindingHtml);
				}, true);
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-instagram-feed]',
					attrName:'data-module-instagram-feed',
					moduleName:'module_instagram_feed',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				console.log('product destory');
			}
		}
	});
})(Core);