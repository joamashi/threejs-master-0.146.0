(function(Core){
	var InputTxtField = function(){
		'use strict';

		var $this, $input, $label, $errorField, $deleteBtn, isValidate = false, args, pattern;
		var objPattern = {
			name:'[^a-zA-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]',
			pw:'[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]',
			email:'^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$',
			phone:'^[0-9]{2,3}[0-9]{3,4}[0-9]{4}$',
			number:'^[0-9]*$' /* ^[0-9] */
		}

		var setting = {
			selector:'[data-component-textfield]',
			input:'input',
			label:'label',
			errorField:'.error-message',
			attrName:'data-component-textfield',
			deleteBtn:'.delete'
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
				$errorField = $this.find(setting.errorField);
				$deleteBtn = $this.find(setting.deleteBtn);
				args = arguments[0]||{};
				pattern = (args.type) ? new RegExp(objPattern[args.type], 'g') : false;

				if(args.disabled){
					$input.attr('disabled', 'disabled');
				}

				$input.on({
					'focusin':function(e){
						$this.addClass('focus');
						_self.fireEvent('focusin', this);
					},
					'focusout':function(e){
						var val = $input.val();
						$this.removeClass('focus');
						//$errorField.text('');

						if(val !== ''){
							isValidate = true;
							$this.addClass('value');
						}else{
							isValidate = false;
							$this.removeClass('value');
						}

						if(pattern){
							if(pattern.test(val)){
								$errorField.text('');
							}else if(!pattern.test(val)){
								$errorField.text(args.errMsg||'잘못된 형식 입니다.');
								isValidate = false;
							}
						}

						_self.fireEvent('focusout', this);
					},
					'keyup':function(e){
						if(e.keyCode === 13){
							_self.fireEvent('enter', this);
						}else{
							_self.fireEvent('keyup', this);
						}
					},
					'keydown':function(e){
						$this.addClass('value');

						//jquery 2.2.4 버전업 으로 인해, e.srcElement.type 작동 불가
						// e.originalEvent.srcElement.type  or  event.srcElement.type  둘다 기존 버전 현제 버전 사용 가능

						if(e.keyCode === 13 && e.originalEvent.srcElement.type != 'textarea'){
							return false;
						}
					}
				});

				$input.bind("paste", function(e){
					var _self = this;
					setTimeout(function(){
						var val = $(_self).val();

						if(val !== ''){
							isValidate = true;
							$this.addClass('value');
						}else{
							isValidate = false;
							$this.removeClass('value');
						}
					});
				});


				$label.on('click', function(e){
					e.preventDefault();
					$input.focus();
				});

				$deleteBtn.on('click', function(e){
					e.preventDefault();
					$input.val('');
					$this.removeClass('value');
					isValidate = false;
				});

				this.setValueLabel();

				return this;
			},
			getValue:function(){
				return $input.val();
			},
			focus:function(){
				$input.focus();
			},
			getThis:function(){
				return $input;
			},
			setValue:function(val){
				if(val !== ''){
					isValidate = true;
					$input.val(val);
					$this.addClass('value');
				}else{
					isValidate = false;
					$input.val(val);
					$this.removeClass('value');
				}
			},
			getValidateChk:function(errorMsgType){
				if(args.required){
					if(!isValidate){
						if(errorMsgType === 'errorLabel') this.setError(args.validateMsg);
						else UIkit.notify(args.validateMsg, {timeout:3000,pos:'top-center',status:'danger'});
					}else{
						if(errorMsgType === 'errorLabel') this.setError('');
					}
					return isValidate;
				}else{
					return true;
				}
			},
			setError:function(message){
				$errorField.text((message || message == '') ? message : args.errMsg);
			},
			setErrorLabel:function(message){
				$label.text(message||args.errMsg).addClass('err');
			},
			setValueLabel:function(){
				// 초기 값이 있으면 label 숨김
				if($input.val() !== ''){
					$this.addClass('value');
					isValidate = true;
				}
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_textfield'] = {
		constructor:InputTxtField,
		reInit:true,
		attrName:'data-component-textfield',
	}
})(Core);