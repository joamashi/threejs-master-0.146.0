(function(Core){
	var Like = function(){
		'use strict';

		var $this, $btn;
		var setting = {
			selector:'[data-component-like]',
			btn:'.like'
		}

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
				$btn = $this.find(setting.btn);

				$btn.each(function(i){
					var $this = $(this);
					var url = $this.attr('href');

					$this.off('click').on('click',function(e){
						e.preventDefault();

						var target = this;
						Core.Utils.ajax(url, 'GET', {}, function(data){
							var args = Core.Utils.strToJson(data.responseText, true);

							if(args.result){
								_self.fireEvent('likeFeedBack', target, [args]);
							}else{
								UIkit.notify(args.errorMessage, {timeout:3000,pos:'top-center',status:'warning'});
							}
						});
					});
				});

				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_like'] = {
		constructor:Like,
		attrName:'data-component-like'
	}
})(Core);