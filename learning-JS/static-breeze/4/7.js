(function(Core){
	var addOnProduct = function(){
		'use strict';

		var $this, $addonListWrap, $msg, args, selectComponent = null, isRequired=false, forceDependent=false, isValidate=false, isFireEvent = true;
		var objChildItem={}; //single 만 됨
		var addOnListComponent = null;
		var addOnSelectComponent = null;
		var currentAddonIndex = 0;
		var setting = {
			selector:'[data-component-addon-product-option]',
			resultWrap:'.addon-wrap'
		}

		var addChildItem = function(key, skuData, requestChildItem){
			/*
				원상품 : 애드온 상품
					x_FORCED
					NONE
					1 : 1	EQUIVALENT			quantityComponent 추가 (수량체크는 원상품의 주문 수량만큼 추가가능) 인데 일단 수량 컴포넌트 삭제
					1 : x	PROPORTION			quantityComponent 추가 (relativeQuantity 값 만큼 추가가능)
					x : 1	PROPORTION_REV
			*/

			if(args['data-component-addon-product-option'].addOnListType === 'single'){
				objChildItem = {};
				addOnListComponent['items'] = [];
			}

			if(!objChildItem.hasOwnProperty(key)){
				skuData.isSubmit = args['data-component-addon-product-option'].isSubmit;
				skuData.privateId = key;
				objChildItem[key] = requestChildItem;
				addOnListComponent['items'].push(skuData);
				currentAddonIndex = addOnListComponent['items'].length - 1;
			}

			isValidate = true;
			if($msg.length > 0){
				$msg.text('');
			}
		}

		var addMessage = function(){
			if($msg.length > 0){
				$msg.text('상품을 선택해 주세요');
			}else{
				UIkit.notify('상품을 선택해 주세요', {timeout:3000,pos:'top-center',status:''});
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
				args = arguments[0];

				//sku 옵션생성
				$this = $(setting.selector);
				$addonListWrap = $this.find(setting.resultWrap);
				$msg = $this.siblings().filter('.tit').find('.msg');

				var $select = $this.find(setting.selector);
				var optionData = args['data-product-options'];
				var skuData = args['data-sku-data'];
				var skuOpt = [];
				var addOnProductType = args['data-component-addon-product-option'].addOnProductType;
				var relativeType = args['data-component-addon-product-option'].addOnRelativeType;
				var relativeQuantity = args['data-component-addon-product-option'].addOnRelativeQuantity;
				forceDependent = (args['data-component-addon-product-option'].forceDependent === 'true') ? true : false;
				isRequired = (args['data-component-addon-product-option'].isRequired === 'true') ? true : false;

				for(var i=0; i<skuData.length; i++){
					if(skuData[i].inventoryType !== 'UNAVAILABLE'){
						if(skuData[i].quantity === 'null' || skuData[i].quantity > 0 || skuData[i].inventoryType === 'ALWAYS_AVAILABLE'){
						    (function(){
						        var obj = {};
								obj['privateId'] = skuData[i].skuId;
								obj['name'] = args['data-component-addon-product-option'].name;
								obj['retailPrice'] = Core.Utils.price(args['data-component-addon-product-option'].retailPrice);
						        obj['salePrice'] = Core.Utils.price(args['data-component-addon-product-option'].salePrice);
								obj['isQuantity'] = (relativeType === 'PROPORTION' || relativeType === 'NONE' || relativeType === 'null') ? true : false;
	    						obj['quantity'] = (relativeQuantity > skuData[i].quantity || relativeQuantity === 'null' || relativeQuantity === '') ?
													(skuData[i].inventoryType === 'ALWAYS_AVAILABLE' ? 100 : skuData[i].quantity) : relativeQuantity;
	    						obj['selectedOptions'] = (function(index){
	    						    var arr = [];
	    						    skuData[index].selectedOptions.forEach(function(a, i){
										var obj = {};
	    						        obj[optionData[i].attributeName] = optionData[i]['values'][a];
										arr.push(obj);
	    						    });
									obj['options'] = JSON.stringify(arr);
	    							return arr;
	    						})(i);
								obj['opt'] = (function(index){
	    						    var arr = [];
	    						    skuData[index].selectedOptions.forEach(function(a, i){
										arr.push(optionData[i]['values'][a]);
	    						    });
	    							return arr;
	    						})(i).join(' / ');
	    						skuOpt.push(obj);
						    })();
						}
					}
				}

				addOnSelectComponent = new Vue({
					el:$this.find('.addon-select')[0],
					data:{
						'skuData':skuOpt
					},
					created:function(){
						var _vm = this;
						this.$nextTick( function(){
							selectComponent = Core.getComponents('component_select', {context:$this}, function(){
								//this.rePaintingSelect();
								this.addEvent('change', function(val, $selected, index){
									var requestChildItem = {};
									var privateId = $selected.attr('data-privateid');
									requestChildItem.productId = args['data-component-addon-product-option'].addonId;
									requestChildItem.quantity = 1;

									for(var i=0; i<_vm.skuData[index-1].selectedOptions.length; i++){
										for(var key in _vm.skuData[index-1].selectedOptions[i]){
											requestChildItem['itemAttributes['+ key +']'] = _vm.skuData[index-1].selectedOptions[i][key];
										}
									}

									addChildItem(privateId, _vm.skuData[index-1], requestChildItem);
									if(isFireEvent){
										_self.fireEvent('addToAddOnItem', this, [privateId, $selected]);
									}else{
										isFireEvent = true;
									}
								});
							});
						});
					},
					methods:{
						rtnItemInfo:function(itemName, opt){
							return (opt !== '') ? (itemName + ' - ' + opt) : itemName;
						}
					}
				});

				addOnListComponent = new Vue({
					el:$this.find('.addon-list-wrap')[0],
					data:{
						'items':[]
					},
					watch:{
						items:function(items){
							var _vm = this;
							this.$nextTick( function(){
								for(var i=0, size=items.length; i<size; i++){
									if(items[i].isQuantity && currentAddonIndex === i){
										Core.getComponents('component_quantity', {context:$(_vm.$refs['addonItem'][currentAddonIndex])}, function(){
											this.addEvent('change', function(qty){
												objChildItem[_vm.$refs['addonItem'][currentAddonIndex].getAttribute('data-privateid')].quantity = qty;
											});
										});
									}
								}
							});
						}
					},
					methods:{
						quantitySetting:function(quantity){
							return '{maxQuantity:'+ quantity +', msg:개 까지 구매가능 합니다., quantityStateMsg:상품의 수량이 없습니다.}';
						},
						itemDelete:function(index){
							this.items.splice(index, 1);
						}
					}
				});

				/* delete btn addEvent */
				$addonListWrap.on('click', '.btn-delete', function(e){
					e.preventDefault();

					var $parent = $(this).closest('.addon-state');
					var key = $parent.attr('data-privateId');
					$parent.remove();

					if(objChildItem.hasOwnProperty(key)){
						delete objChildItem[key];
						selectComponent.reInit();
					}

					if(Core.Utils.objLengtn() <= 0){
						isValidate = false;
					}

					_self.fireEvent('itemDelete', this, [key]);
				});

				/* isSubmit === true */
				$addonListWrap.on('click', '.btn-submit', function(e){
					e.preventDefault();
					_self.fireEvent('submit', this, [_self.getChildAddToCartItems()]);
				});

				return this;
			},
			setTrigger:function(privateId){
				isFireEvent = false;
				if(selectComponent) selectComponent.trigger(privateId, privateId);
			},
			getChildAddToCartItems:function(){
				var arrChildItem = [];
				for(var key in objChildItem){
					arrChildItem.push(objChildItem[key]);
				}

				return arrChildItem;
			},
			getValidateChk:function(){
				if((!isRequired || isRequired === 'null' ) && (!forceDependent || forceDependent === 'null')){
					isValidate = true;
				}else{
					if(!isValidate){
						addMessage();
					}
				}
				return isValidate;
			},
			getAddonId:function(){
				return args['data-component-addon-product-option'].addonId;
			},
			removeItems:function(){
				$addonListWrap.find('.btn-delete').trigger('click');
			},
			getAddOnOrderId:function(){
				return args['data-component-addon-product-option'].addOnOrderId;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_addon_product_option'] = {
		constructor:addOnProduct,
		attrName:['data-component-addon-product-option', 'data-product-options', 'data-sku-data']
	}
})(Core);