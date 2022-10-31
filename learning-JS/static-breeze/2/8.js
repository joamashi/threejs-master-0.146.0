(function(Core){

	var InputTxtArea = function(){
		'use strict';

		var $this, $input, $label, validateIS = false, opt, minLength;
		var setting = {
			selector:'[data-component-textarea]',
			input:'textarea',
			label:'label',
			attrName:'data-component-textarea'
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
				$input = $this.find(setting.input);
				$label = $this.find(setting.label);

				opt = arguments[0]||{};
				minLength = (opt.minLength) ? opt.minLength * 1 : 0;

				if(opt.disabled){
					$input.attr('disabled', 'disabled');
				}

				// 초기 값이 있으면 label 숨김
				if($input.val() !== ''){
					$this.addClass('value');
					//validateIS = true;
				}

				$input.on({
					'focusin':function(e){
						$this.addClass('focus');
						_self.fireEvent('focusin', this);
					},
					'focusout':function(e){
						var val = $input.val();
						$this.removeClass('focus');

						if(val !== ''){
							//validateIS = true;
							$this.addClass('value');
						}else{
							//validateIS = false;
							$this.removeClass('value');
						}

						_self.fireEvent('focusout', this);
					},
					'keyup':function(e){
						$this.addClass('value');
						_self.fireEvent('keyup', this, [$(this).val()]);
					},
					'keydown':function(e){
						$this.addClass('value');
						_self.fireEvent('keydown', this, [$(this).val()]);
					},
					'change':function(e){
						var val = $input.val();

						_self.fireEvent('change', this, [$(this).val()]);
					}
				});

				return this;
			},
			getValue:function(){
				return $input.val();
			},
			setValue:function(val){
				$input.val(val);
			},
			getThis:function(){
				return $input;
			},
			getValidateChk:function(){
				if(opt.required){
					this.setErrorLabel();

					if($input.val() !== '' && $input.val().length > minLength){
						validateIS = true;
					}else{
						validateIS = false;
					}

					return validateIS;
				}else{
					return true;
				}
			},
			setErrorLabel:function(message){
				$label.text(message||opt.errMsg).addClass('err');
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_textarea'] = {
		constructor:InputTxtArea,
		reInit:true,
		attrName:'data-component-textarea'
	}
})(Core);
