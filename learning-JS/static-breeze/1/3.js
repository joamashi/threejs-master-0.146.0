(function(Core){
	var Quantity = function(){
		'use strict';

		var $this, $input, $plusBtn, $minusBtn, $msg, currentQty = 1, maxLen = 1, args;
		var pattern = /[^0-9]/g;
		var setting = {
			selector:'[data-component-quantity]',
			input:'.label',
			plusBtn:'.plus',
			minusBtn:'.minus',
			attrName:'data-component-quantity',
			msg:'.msg'
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
				$input = $this.find(setting.input);
				$plusBtn = $this.find(setting.plusBtn);
				$minusBtn =  $this.find(setting.minusBtn);
				$msg = $this.find(setting.msg);
				maxLen = (args.maxQuantity != 'null') ? args.maxQuantity : 100; // 최대수량 100
				currentQty = $input.val();


				$plusBtn.on('click', function(e){
					e.preventDefault();

					currentQty++;

					$input.val(currentQty);
					$(this).closest('.btn-qty').find('.minus').addClass('currentQty');
					$input.trigger('focusout');
				});

				$minusBtn.on('click', function(e){
					e.preventDefault();

					currentQty--;

					if(currentQty <= 1) {
						currentQty = 1;
						$(this).removeClass('currentQty');
					}
					$input.val(currentQty);
					$input.trigger('focusout');
				});

				$input.on({
					'keyup':function(e){
						var val = $input.val();
						if(pattern.test(val)){
							$input.val(val.replace(pattern, ''));
						}
					},
					'focusout':function(){
						currentQty = $(this).val();
						if(currentQty <= 1) currentQty = 1;

						if(parseInt(currentQty) > parseInt(maxLen)){
							$this.addClass('opt-msg-guide');
							$msg.text(maxLen + args.msg);
							currentQty = maxLen;
						}else{
							$this.removeClass('opt-msg-guide');
							$msg.text('');
						}

						$(this).val(currentQty);
						_self.fireEvent('change', this, [currentQty]);
					}
				});

				return this;
			},
			getQuantity:function(){
				return currentQty;
			},
			setQuantity:function(quantity){
				$input.val(quantity);
				currentQty = quantity;
			},
			setMaxQuantity:function(quantity){
				//console.log(quantity);
				if(args.maxQuantity == 'null' && quantity != null){
					maxLen = quantity;
				}else if(args.maxQuantity != 'null'){
					if(quantity != null){
						if(quantity < args.maxQuantity){
							maxLen = quantity;
						}else{
							maxLen = args.maxQuantity;
						}
					}else{
						maxLen = args.maxQuantity;
					}
				}else if(quantity == null){
					maxLen = 100;
				}

				if(quantity == 0){
					$msg.text(args.quantityStateMsg);
				}else{
					$msg.text('');
				}
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_quantity'] = {
		constructor:Quantity,
		attrName:'data-component-quantity'
	}
})(Core);