(function(Core){
	var InputSelectBox = function(){
		'use strict';

		var $this, $select, $selectHead, $selectBody, $selectHeadTxt, $selectOption, opt, eventID, isValidate = false, currentSelectedIndex, isSelectedReset, endPoint, name;
		var selectDisabled = false;
		var setting = {
			selector:'[data-component-select]',
			select:'select',
			attrName:'data-component-select',
			template:"<a class='select-head'><span class='currentOpt'>{{currentLabel}}</span></a><ul class='select-body'>{{#each option}}<li class='list {{this.checked}} {{this.disabled}}'><a href='{{this.value}}' data-value='{{this.value}}'><span class='label'>{{this.label}}</span></a></li>{{/each}}</ul>"
		}

		var selectOpt = {
			'selectIcon':'',
			'currentLabel':'',
			'currentValue':'',
			'option':[]
		}

		var updateSelect = function($target){

			$($target).parent().addClass('checked').siblings().removeClass('checked');
			$($target).removeClass('checked');
			$selectHeadTxt.text($($target).find('.label').text());

			//$('select[name='+name+']').val($(this).attr('data-value'));
			//$('select[name='+name+']').trigger('change');

			$select.val($($target).attr('data-value'));
		}

		var rtnOption = function(key, data){
			data.forEach(function(data, i){
				if(data.inventoryType !== 'UNAVAILABLE'){
					//restrict check ( data.restrictState === 'PASSED' || data.restrictState === 'RESTRICTED' || data.restrictState === 'LOGIN_REQUIRED' )
					if(Object.keys(data).indexOf('restrictState') < 0 || data.restrictState === 'PASSED'){
						if(data.inventoryType === 'ALWAYS_AVAILABLE' || null){
							enableItem($select, key, data, 'PASSED');
						}else if(data.inventoryType === 'CHECK_QUANTITY'){
							if(data.quantity > 0 || data.quantity == null){
								enableItem($select, key, data, 'PASSED');
							}
						}
					}else{
						if(data.restrictState === 'LOGIN_REQUIRED'){
							enableItem($select, key, data, 'LOGIN_REQUIRED');
						}
					}
				}
			});
		}

		var enableItem = function(container, key, data, state){
			$select.find('option').each(function(j){
				if(j === 0 || $(this).val() == data[key]){
					if(state === 'PASSED'){
						$(this).removeAttr('disabled');
						if($selectOption) $selectOption.eq(j).parent().removeClass('disabled');
						if(j > 0) return false;
					}else if(state === 'LOGIN_REQUIRED'){
						//$(this).empty().addClass('icon_lock');
						if(j > 0) {
							$(this).closest('.select-box').find('.select-body > .list').eq(j).find('.label').empty().addClass('ns-ic-login2 member-lock');
						}
					}
				}
			});
		}

		var addSelect = function(){
			$selectHead = $this.find('.select-head');
			$selectBody = $this.find('.select-body');
			$selectHeadTxt = $selectHead.find('.currentOpt');
			$selectOption = $selectBody.find('a');

			$selectHead.on('click', function(e){
				e.preventDefault();
				if(!selectDisabled){
					if($this.hasClass('checked')){
						$this.removeClass('checked');
					}else{
						$this.addClass('checked');
					}
				}
			});

			$selectOption.on('click', function(e){
				e.preventDefault();

				//var name = $this.parent().parent().parent().find('select').attr('name');

				// && !$this.parent().hasClass('checked')
				if(!$(this).parent().hasClass('disabled') && !$(this).parent().hasClass('checked')){
					updateSelect( $(this) );
					$select.trigger('change');
					$selectHead.trigger('click');
				}
			});

			$this.on('mouseleave', function(e){
				$this.removeClass('checked');
			});
		}

		var appendOptionList = function(data){
			var template = Handlebars.compile(setting.template);
			var bindingHtml = template(data);
			$this.prepend(bindingHtml);
			addSelect();
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
				$select = $this.find(setting.select);
				endPoint = Core.getComponents('component_endpoint');
				opt = (opt) ? opt : arguments[0]||{};
				name = $select.attr('name');
				
				var widthMatch = matchMedia("(min-width: 961px) and (max-width: 1024px)");
				
				if (!Core.Utils.mobileChk || widthMatch.matches) {

					// 이전에 생성되어있던 dom 제거
					if( $($this).find('.select-head').length > 0){
						$($this).find('.select-head').remove();
						$($this).find('.select-body').remove();

						selectOpt = {
							'selectIcon':'',
							'currentLabel':'',
							'currentValue':'',
							'option':[]
						}
					}


					$this.addClass('pc');
					if( selectOpt.selectIcon ){
						selectOpt.selectIcon = opt.icon;
					}
					$select.find('option').each(function(i){
						var $this = $(this);
						if($(this).is(':selected')){
							selectOpt.currentLabel = this.text;
							selectOpt.currentValue = this.value;
						}

						selectOpt.option.push({
							'label':this.text,
							'value':this.value,
							'disabled':$(this).is(':disabled') ? 'disabled':'',
							'checked':$(this).filter(':selected').length > 0 ? 'checked':''
						});
					});

					appendOptionList(selectOpt);

					//selectbox 나오는 위치
					if(opt.position != null){

						switch(opt.position){
							case 'top' :
								$selectBody.css('top',-$selectBody.height());
								break;
							case 'bottom' :
								break;
						}
					}
				}

				//select init
				currentSelectedIndex = $select.find('option:selected').index();
				if(currentSelectedIndex > 0 && opt.changeType === 'step'){
					setTimeout(function(){
						$select.trigger('change');
					});
				}

				$select.off('update').on('update', function(e){
					e.preventDefault();
					if(!Core.Utils.mobileChk){
						var index = $select.find(":selected").index();
						updateSelect( $(this).closest(".select-box").find(".select-body li").eq(index).find("a") );
					}
				});

				$select.off('change').on('change', function(e){
					var that = this;
					var $selected = $(this).find('option:selected');
					var val = $selected.val();
					var index = $selected.index();

					if( val === '' || val === '선택해주세요' ){
						isValidate = false;
						return;
					}else{
						isValidate = true;
					}

					endPoint.call('changeSelect', { name : name, value : val });

					switch(opt.changeType){
						case 'normal' :
							_self.fireEvent('change', this, [val, $selected, index]);
							$(this).parsley().validate();
							break;
						case 'submit' :
							var url = "";
							if( $(this).val() === "" || $(this).val() === "default"){
								url = Core.Utils.url.removeParamFromURL( Core.Utils.url.getCurrentUrl(), $(this).attr('name') );
							}else{
								url = Core.Utils.url.updateParamFromURL( Core.Utils.url.getCurrentUrl(), $(this).attr('name'), $(this).val() );
							}

							window.location.assign( url );
							break;
						case 'step' :
							_self.fireEvent('change', that, [$(that).find('option:selected').attr('data-value'), $(that).find('option:selected').val(), $(that).attr('data-id'), $(that).find('option:selected').attr('data-friendly-name')]);
							break;

						case 'link' :
							var url = val;
							if( url != null && $.trim(url) != ''){
								window.location.assign( url );
							}
							break;
					}
				});

				return this;
			},
			receiveToData:function(option, skuData){
				isValidate = false;
				rtnOption(option.type, skuData);
			},
			reInit:function(){
				$select.val('');
				if(!Core.Utils.mobileChk){
					$selectHeadTxt.text($select.find('option').eq(0).val());
					$selectBody.scrollTop(0).find('.list').removeClass('checked').eq(0).addClass('checked');
				}
			},
			disabled:function(){
				//초기화
				$select.find('option').attr('disabled', 'disabled');
				if(currentSelectedIndex === 0 || isSelectedReset){
					$select.find('option').eq(0).prop('selected', true);
					if(!Core.Utils.mobileChk){
						$selectHeadTxt.text($select.find('option:selected').val());
						$selectBody.scrollTop(0).find('.list').addClass('disabled').removeClass('checked').eq(0).removeClass('disabled').addClass('checked');
					}
				}else{
					isSelectedReset = true;
				}
			},
			trigger:function(value, valueId){
				//console.log($this);
				//console.log(value, valueId);
				$select.val(valueId).attr('selected', 'selected');
				if($selectHead) $selectHead.find('.currentOpt').text(value);
				if($selectBody) $selectBody.children().eq($select.find('option:selected').index()).addClass('checked').siblings().removeClass('checked');
				$select.trigger('change');
			},
			destroy:function(){
				$selectHead.remove();
				$selectBody.remove();
			},
			getValidateChk:function(){
				if(opt.required === 'true'){
					if(!isValidate && opt.errMsg) UIkit.notify(opt.errMsg, {timeout:3000,pos:'top-center',status:'danger'});
					return isValidate;
				}else{
					return true;
				}
			},
			getThis:function(){
				return $this;
			},
			replaceSelectBox:function(selectbox){
				$this.find(setting.select).remove();
				$this.append(selectbox);
				this.init.call(this, opt);
			},
			rePaintingSelect:function(){
				this.init();
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_select'] = {
		constructor:InputSelectBox,
		reInit:true,
		attrName:'data-component-select'
	};
	
	// js 로드되면 셀렉트박스 노출
	window.onload = function(){
		var selectboxCheck = document.querySelectorAll('.select-box');
		if (selectboxCheck.length > 0){
			for (var i=0; i<selectboxCheck.length;i++) {
				selectboxCheck[i].classList.add('rendered');
			}
		}
	}
})(Core);