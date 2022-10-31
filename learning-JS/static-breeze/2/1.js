(function(Core){
	var WishListBtn = function(){
		'use strict';

		var $this, args, endPoint;
		var setting = {
			selector:'[data-component-wishlistbtn]',
			activeClass:'active'
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
				args = arguments[0];
				$this = $(setting.selector);
				endPoint = Core.getComponents('component_endpoint');

				/* wishlist */
				$this.click(function(e){
					e.preventDefault();

					var _self = $(this);
					var query = {
						productId:args.productId
					}

					Core.getModule('module_header').reDirect().setModalHide(true).setLogin(function(data){
						Core.Utils.ajax(args.api, 'GET', query, function(data){
							var jsonData = Core.Utils.strToJson(data.responseText, true) || {};
							if(jsonData.hasOwnProperty('error')){
								UIkit.notify(jsonData.error, {timeout:3000,pos:'top-center',status:'warning'});
							}else{
								if(jsonData.isWishListChk){
									_self.find('i').addClass('icon-wishlist_full');
+									_self.find('i').removeClass('icon-wishlist');
									UIkit.notify(args.addMsg, {timeout:3000,pos:'top-center',status:'success'});
									endPoint.call('addToWishlist', query);
								}else{
									_self.find('i').addClass('icon-wishlist');
+									_self.find('i').removeClass('icon-wishlist_full');
									endPoint.call('removeToWishlist', query);
									UIkit.notify(args.removeMsg, {timeout:3000,pos:'top-center',status:'warning'});
								}
								/*
								if( _.isFunction( marketingAddWishList )){
									marketingAddWishList();
								}
								*/
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

	Core.Components['component_wishlistbtn'] = {
		constructor:WishListBtn,
		reInit:true,
		attrName:'data-component-wishlistbtn'
	}
})(Core);