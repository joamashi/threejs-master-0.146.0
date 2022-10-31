(function(Core){
	var InputRadio = function(){
		'use strict';
		var setting = {
			selector:'[data-component-radio]',
			attrName:'data-component-radio',
			container:'.input-radio',
			label:'label',
			radio:'input[type=radio]',
			unlock:false
		};

		var rtnOption = function(container, key, data){
			var ableRestrict = false;
			/*
			if (Core.Utils.url.getUri(Core.Utils.url.getCurrentUrl()).queryParams.accepted === 'true') {
				ableRestrict = true;
			}
			*/
			var restrictState = _.keyBy(data, 'restrictState');
			if (restrictState.LOGIN_REQUIRED != null || restrictState.PASSED != null || restrictState.RESTRICTED != null ){
				ableRestrict = true;
			}

			// 하나라도 걸려있으면 모두 재고가 있는것들은 모두 lock
			// 재고가 없는건 disable 

			data.forEach(function(data, i){
				if(data.inventoryType != 'UNAVAILABLE'){
					var state = '';
					if (data.restrictState === 'PASSED' ){
						state = 'PASSED';
					}else{
						if(data.inventoryType === 'ALWAYS_AVAILABLE' || null){
							state = 'PASSED';
						}else if(data.inventoryType === 'CHECK_QUANTITY'){
							if(opt && opt.uiType === 'pdp'){
								if(data.quantity === 0 && opt.quantityOption === 'restock'){
									// 수량이 없고 재입고 알림을 사용 할 수 있는 경우
									state = 'PASSED';
								} else if(opt.quantityOption !== 'restock' &&(data.quantity > 0 || data.quantity == null)){
									// 수량이 있고 재입고 알림이 아닌 경우
									state = 'AVAILABLE';
								}
							}
						}
						// 정상적으로 판매 될수 있는 상품 인데 구매제한이 걸리면 rock 아니면 pass
						if (state === 'AVAILABLE') {
							state = (ableRestrict === false) ? 'PASSED' : 'LOCK';
						}
					}

					if (state !== ''){
						enableItem(container, key, data, state);
					}
				}
			});
		}

		var enableItem = function(container, key, data, state){
			container.find(setting.radio).each(function(i){
				if($(this).val() == data[key]){
					if(state === 'PASSED'){
						$(this).removeAttr('disabled').parent().removeAttr('disabled').removeClass('disabled');
						if(opt && opt.uiType === 'pdp'){
							$(this).parent().find(setting.label).removeClass('sd-out');
						}
					}else if(state === 'LOCK'){
						$(this).siblings().empty().addClass('ns-ic-login2 member-lock');
					}
				}
			});
		}

		var $this, $label, $radio, $container, eventID, firstInit = false, opt, isValidate = false;

		var Closure = function(){}
		Closure.prototype = {
			setting:function(){
				//console.log(arguments);
				var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
			},
			init:function(){
				var _self = this;

				$this = $(setting.selector);
				$container = $this.find(setting.container);
				$label = $container.find(setting.label);
				$radio = $container.find(setting.radio);
				if(!opt) opt = arguments[0]||{};

				$label.off('click').on('click', function(e){
					e.preventDefault();
					//모바일 상품정렬 태깅 추가
					var st =$(this).attr('st');
					if(st != "undefined")	{
						if(st=="F") {
							var obj_val = "";

							switch( $(this).attr('for') ){
							case 'sort1':
								obj_val = "default";
										break;
								case 'sort2':
									obj_val = "price+desc";
									break;
								case 'sort3':
									obj_val = "price+asc";
										break;
							}

							var data ={};
							data.name  = "sort";
							data.value =  obj_val;
							endPoint.call('changeSelect', data);

						} else if(st=="S"){//매장 픽업 사이즈 옵션

							var data ={};
								data.name  = "Size Run Selection";
								data.page_event = {size_run_select : true}
								data.size_run_availability	="";
								data.size_run_selection =  $(this)[0].innerText;

							endPoint.call('pickupsizeClick', data);
						};
					}
		    		//-----------------------------------------------
					_self.fireEvent('click', this, [$(this).siblings()]);
					if(!$(this).parent().hasClass('disabled')){
						if($(this).siblings().prop('checked') && setting.unlock){
							$(this).siblings().prop('checked', false);
							$(this).parent().removeClass('checked');
							return;
						}

						$(this).siblings().trigger('click');
					}
					/* CUSTOM 삭제 */
				});

				/* CUSTOM 삭제 */


				$container.off('click').on('click', function(){
					//PDP SIZE (optionGridType)
					if(opt && opt.uiType === 'pdp'){
					    _self.fireEvent('click', this, [$(this).siblings()]);
						if(!$(this).attr('disabled')){
							$(this).parent().find(setting.label, setting.radio).each(function(){
								//기존에 선택된 사이즈 해지
								$(this).removeClass('selected');
								$(this).prop('checked', false);
							});
							$(this).find(setting.label).addClass('selected');
							$(this).find(setting.radio).prop('checked', true);
							$(this).find(setting.radio).trigger('change');
						}
					}
					/* CUSTOM 삭제 */
				})

				$radio.off('change').on('change', function(){
					if($(this).prop('checked')){
						isValidate = true;
						$(this).parent().addClass('checked').siblings().removeClass('checked');
						$(this).siblings().attr('checked');

						switch(opt.eventType || 'step'){
							case 'step':
								_self.fireEvent('change', this, [$(this).attr('data-value'), $(this).val(), $(this).attr('data-id'), $(this).attr('data-friendly-name')]);
								break;
							case 'normal':
								_self.fireEvent('change', this, [$(this).val()]);
								break;
						}
					}
				});

				// 기본 선택값 처리
				$radio.each(function(i){
					var $this = $(this);
					if($this.prop('checked')){
						setTimeout(function(){
							$this.trigger('change');
							_self.fireEvent('init', $this);
						});
					} else if($(this).parent().hasClass('checked')){
						//CART 배송 방법(주문배송비/기본배송비) 기본 체크 처리
						setTimeout(function(){
							$this.trigger('click');
							_self.fireEvent('init', $this);
						});
					}
				});

				return this;
			},
			receiveToData:function(option, skuData){
				isValidate = false;
				rtnOption($container, option.type, skuData);
			},
			reInit:function(){
				this.init();
				/*$container;
				$container.each(function(i){
					$(this).removeClass('checked').find('input[type=radio]').removeAttr('checked');
				});*/
			},
			disabled:function(){
				$container.each(function(i){
					$(this).removeClass('checked').addClass('disabled').find('input[type=radio]').removeAttr('checked').attr('disabled', 'disabled');
				});
			},
			trigger:function(value, valueId){
				$radio.each(function(){
					if($(this).val() == valueId){
						$(this).trigger('click');
						return false;
					}
				});
			},
			getValidateChk:function(){
				if(opt.required){
					return isValidate;
				}else{
					return true;
				}
			},
			getThis:function(){
				return $this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_radio'] = {
		constructor:InputRadio,
		attrName:'data-component-radio',
		reInit:true
	}
})(Core);