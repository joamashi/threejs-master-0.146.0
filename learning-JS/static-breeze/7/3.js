(function(Core){
	Core.register('module_instagram_embed', function(sandbox){
		var $this, args, model;
		var getFeedLoad = function(id){
			//var url = 'https://api.instagram.com/oembed/?url=http://instagr.am/p/BXW-qBZlRW1 ( feed ID ) /'  // embad
			//URL A short link, like http://instagr.am/p/fA9uwTtkSN/.
			//queryParam - MAXWIDTH, HIDECAPTION, OMITSCRIPT, CALLBACK

			sandbox.utils.jsonp('https://api.instagram.com/oembed/', {url:'http://instagr.am/p/' + id}, 'callback', function(data){
				$('#common-modal').find('.contents').empty().append(data.html);
				modal.show();

				if(window.instgrm){
					window.instgrm.Embeds.process();
				}
			});
		}

		var Method = {
			moduleInit:function(){
				$this = $(this);
				args = arguments[0];

				var arrInstagramEmbed = args.feedIds.split("|");
				var template = Handlebars.compile($(args.template).html());

				//modal init
				modal = UIkit.modal('#common-modal', {center:true});
				modal.off('.uk.modal.instagram').on({
					'hide.uk.modal.instagram':function(){
						console.log('instagram modal hide');
						$('#common-modal').find('.contents').empty();
						//delete window.instgrm;
					}
				});

				for(var i=0; i<arrInstagramEmbed.length; i++){
					var bindingHtml = template({feedId:sandbox.utils.trim(arrInstagramEmbed[i])});
					$this.append(bindingHtml);
				}

				//instagram feed Event
				$this.find('a').each(function(){
					$(this).click(function(e){
						e.preventDefault();

						getFeedLoad($(this).attr('href'));
					});
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-instagram-embed]',
					attrName:'data-module-instagram-embed',
					moduleName:'module_instagram_embed',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			destroy:function(){
				console.log('product destory');
			}
		}
	});
})(Core);