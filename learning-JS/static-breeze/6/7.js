(function(Core){
	Core.register('module_gnb', function(sandbox){

		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var $oneDepth = $('.onedepth-list');
				var args = arguments[0];

				if(args.type === 'type1'){
					var timeoutId = null

					$oneDepth.on({
						'mouseenter.lnb':function(){
							clearInterval( timeoutId );
							$(this).find('>').addClass('active');
							$(this).siblings().find('>').removeClass('active');
						},
						'mouseleave.lnb':function(){
							var $this = $(this);
							timeoutId = setTimeout( function(){
								$this.find('>').removeClass('active');
							}, 300);
						},
						'click.lnb':function(e){
							var href = $(this).attr("href");
							if( href == "#" || href == "javascript:;" ){
								e.preventDefault();
								$(this).find('>').addClass('active');
							}
						}
					});
				}else if(args.type === 'type2'){
					$oneDepth.on({
						'mouseenter.lnb':function(){
							$(this).find('>').addClass('active');
							$(this).find('.header-menu_twodepth').css({'display':'block'});
							$(this).find('.menu-banner-conts').css({'display':'block'});
						},
						'mouseleave.lnb':function(){
							$(this).find('>').removeClass('active');
							$(this).find('.header-menu_twodepth').removeAttr('style');
							$(this).find('.menu-banner-conts').removeAttr('style');
						},
						'click.lnb':function(e){
							var href = $(this).attr("href");
							if( href == "#" || href == "javascript:;" ){
								e.preventDefault();
								$(this).find('>').addClass('active');
							}
						}
					});
				}

				var $modile = $('#mobile-menu');
				$modile.find('.mobile-onedepth_list').on('click', '> a', function(e){
					if(!$(this).hasClass('link')){
						e.preventDefault();
						$(this).siblings().show().stop().animate({'left':0}, 300);
					}
				});

				$modile.find('.location').on('click', function(e){
					e.preventDefault();
					$(this).parent().stop().animate({'left':-270}, 300, function(){
						$(this).css('left', 270).hide();
					});
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-gnb]',
					attrName:'data-module-gnb',
					moduleName:'module_gnb',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);