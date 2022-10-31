(function(Core){
	var CartItmeLen = function(){
		'use strict';

		var $this, args, itemCountComponent=null;
		var setting = {
			selector:'[data-component-cartitemlen]'
		}

		function mouseOver(e){
			if( this.isEmpty == false ){
				this.isOver = true;
			}
		}

		function mouseOut(e){
			this.isOver = false;
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
				
				itemCountComponent = new Vue({
					el:$this[0],
					data:{
						'isEmpty':(args.itemCount*1 > 0) ? false : true,
						'itemCount':args.itemCount*1,
						'isOver': false,
					},
					watch:{
						itemCount:function(){
							this.isEmpty = (this.itemCount > 0) ? false : true
						},
					},
					computed:{
						reverseIsEmpty:function(){
							return (this.isEmpty) ? false : true;
						}
					},
					methods:{
						mouseOver: mouseOver,
						mouseOut: mouseOut
					}
				});
				return this;
			},
			update:function(length, content){
				this.setItemLength(Number(length));
				if( itemCountComponent.$refs.summaryBody != null){
					itemCountComponent.$refs.summaryBody.innerHTML = content;
				}
			},
			getItemLength:function(){
				return itemCountComponent.itemCount;
			},
			setItemLength:function(itemLength){
				itemCountComponent.itemCount = itemLength;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_cartitemlen'] = {
		constructor:CartItmeLen,
		attrName:'data-component-cartitemlen'
	}
})(Core);