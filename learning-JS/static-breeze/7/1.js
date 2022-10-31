(function(Core){
	Core.register('module_image_list', function(sandbox){
		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var $item = $this.find('[data-image-item]');
				var total = $item.length;

				$item.on('mouseenter', function(){
					$(this).find('.hover').show();
				});

				$item.on('mouseleave', function(){
					$(this).find('.hover').hide();
				});
				
				if( $this.find('.not').length > 0 ){
				    $item.addClass('uk-width-medium-1-' + total); 
				}
				$this.show();
			},
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-image-list]',
					attrName:'data-module-image-list',
					moduleName:'module_image_list',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);