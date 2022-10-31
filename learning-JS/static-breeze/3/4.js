(function(Core){
	var InputCheckBox = function(){
		'use strict';

		var $this, $checkbox, $label, args, isValidate = false;
		var setting = {
			selector:'[data-component-checkbox]',
			checkbox:'input[type=checkbox]',
			label:'label',
			attrName:'data-component-checkbox'
		}

		var updateCheckbox = function($target){
			if($target.prop('checked')){
				isValidate = true;
				$target.parent().addClass('checked');
			}else{
				isValidate = false;
				$target.parent().removeClass('checked');
			}
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
				$label = $this.find(setting.label);
				$checkbox = $this.find(setting.checkbox);
				args = arguments[0]||{}

				$label.on('click', function(e){
					e.preventDefault();
					$(this).siblings().trigger('click');
				});

				$checkbox.on('change', function(){
					updateCheckbox( $(this) );
					_self.fireEvent('change', this, [$(this).is(":checked")]);
				});

				// 체크만 하고 이벤트를 실행 시키지 않아야 할 경우도 있어서 제거
				/*
				$.propHooks.checked = {
					set: function(elem, value, name) {
					var ret = (elem[ name ] = value);
						$(elem).trigger("change");
						return ret;
					}
				};
				*/

				// 스크립트로 체크 처리시 change 이벤트는 실행 하지 않고 모양만 변경 처리
				$.propHooks.checked = {
					set: function(elem, value, name) {
					var ret = (elem[ name ] = value);
						updateCheckbox( $(elem));
						return ret;
					}
				}

				$checkbox.trigger('change');
				return this;
			},

			getValidateChk:function(){
				if(args.required){
					if(!isValidate){
						//UIkit.modal.alert(args.errMsg);
						UIkit.notify(args.errMsg, {timeout:3000,pos:'top-center',status:'danger'});
					}
					return isValidate;
				}else{
					return true;
				}
			},
			getThis:function(){
				return $checkbox;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_checkbox'] = {
		constructor:InputCheckBox,
		attrName:'data-component-checkbox',
		reInit:true
	};
})(Core);