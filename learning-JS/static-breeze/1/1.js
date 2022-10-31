(function(Core){

	var ProductOptionSelected = function(){
		'use strict';

		// @pck 2020-10-30 		sticky A/B 테스트 결과 반영건으로 v2 반영
		// 						Sticky 관련 로직은 ui > _ui_product_sticky.js로 이동
		// @pck 2020-06-17 		sticky iPad 미작동 이슈로 PDP Option 콤포넌트를 반응형 구조로 변경 (s)

		/*
		var btnsActions = document.querySelectorAll('.sticky-section .order-wrap .btn-link:not(.wish-btn)');
		var btnTogglePopup = document.querySelector('.toggle_popupdown');

		$(window).on('resize scroll', function() {
			var deviceType = null;
			if (document.querySelector('.sticky-section') !== null) {
				deviceType = window.getComputedStyle(
					document.querySelector('.sticky-section'), ':before'
				).getPropertyValue('content');

				//iOS 모바일에서 css property value 가져올 때 "이 빠지는 현상이 있음.
				//모바일외 상태에서는 초기상태로 복귀
				if (deviceType == '"mobile"' || deviceType == 'mobile') {
					//스크롤 시 헤더 스티키로 화면이 흔들리면서 리사이즈 이벤트 발생
					if(btnTogglePopup !== null) {
						//PC, 타블릿에서 모바일로 화면이 변경되었을 때 초기화
						if(btnTogglePopup.classList.contains('active')) {
							btnTogglePopup.classList.remove('active');

							$('.pre-btn').each(function(index, preBtn){
								preBtn.removeAttribute('style');
							});
							$(btnsActions).each(function(index, btnAction){
								btnAction.removeAttribute('style');
							});
						}

						$(document).on('scroll', function () {
							if (btnTogglePopup.classList.contains('active')) {
								btnTogglePopup.classList.remove('active');

								$('.pre-btn').each(function (index, preBtn) {
									preBtn.removeAttribute('style');
								});
								$(btnsActions).each(function (index, btnAction) {
									btnAction.removeAttribute('style');
								});
							}
						});
					}
				}
			}
		});

		$('.pre-btn').each(function(index, btn){
			btn.addEventListener('click', function(event){
				if(!btnTogglePopup.classList.contains('active')){
					btnTogglePopup.classList.add('active');

					$('.pre-btn').each(function(index, preBtn){
						preBtn.setAttribute('style', 'display:none;');
					});
					$(btnsActions).each(function(index, btnAction){
						btnAction.setAttribute('style', 'display:block;');
					});
				}
			});
		});

		@pck 2020-10-30 A/B 테스트 결과 반영으로 v2부터는 토글을 사용하지 않음 (삭제예정)
		if(btnTogglePopup !== null){
			btnTogglePopup.addEventListener('click', function(event){
				this.classList.remove('active');
				$('.pre-btn').each(function(index, preBtn){
					preBtn.setAttribute('style', 'display:block;');
				});
				$(btnsActions).each(function(index, btnAction){
					btnAction.setAttribute('style', 'display:none;');
				});
			});
		}
		 */
		// @pck 2020-06-17 sticky iPad 미작동 이슈로 PDP Option 콤포넌트를 반응형 구조로 변경 (e)

		var receiveToEvent = function(checkedOpt){
			var key = Object.keys(checkedOpt)[0];
			var index = 0;
			var resetIS = false;
			var objOpt = {};
			var currentIndex = 0;

			//currentSku 초기화하여 사용해야 하지만 returnToSkuData에 currentSku값을 사용하는 문제점 해결시 사용해야함
			//if(key === firstOptName) currentSku = allSkuData;
			//선택된 옵션 인덱스

			for(var i=0; i<optionData.length; i++){
				if(optionData[i].type === key){
					currentIndex = i;
					break;
				}
			}

			optionData.map(function(data, i, o){
				if(data.type === key) data.selectedValue = (checkedOpt[key] !== '' && checkedOpt[key] !== null) ? checkedOpt[key] : null;

				//선택된 다음 옵션들 리셋
				if(i > currentIndex) disabled(data.type, i);
				if(data.selectedValue === null){
					if(checkedOpt[key] !== '' && checkedOpt[key] !== null && index === i){
						//data.type : 다음 옵션 아이디
						//data : 다음 옵션 리스트
						//returnToSkuData(key, checkedOpt[key]) : sku 리스트
						nextOpt(data.type, data, returnToSkuData(objOpt));
					}
				}else{
					index++;
					objOpt[data.type] = data.selectedValue;

					if(index === o.length){
						if(productOptionType === 'multi') multiAddOption(objOpt);
						if(productOptionType === 'single') singleAddOption(objOpt);
					}
				}
			});
		}

		var returnToSkuData = function(objSkuValue){
			var arrData = [];
			var len = Object.keys(objSkuValue).length;
			var counter = 0;

			//currentSku값에서만 옵션을 체크하여 값을 전달 해야 하지만
			//currentSku값의 초기화 문제때문에 allSkuData의 배열을 이용해야한다.
			$(allSkuData).each(function(index, data){
				counter = 0;
				for(var key in objSkuValue){
					if(data[key] == objSkuValue[key]){
						counter++;
						if(counter === len){
							arrData.push(data);
						}
					}
				}
			});

			return arrData;
		}

		var nextOpt = function(componentID, opt, sku){
			currentSku = sku;
			optionDom[componentID].receiveToData(opt, sku);
		}

		var disabled = function(componentID, index){
			optionData[index].selectedValue = null;
			optionDom[componentID].disabled();
		}

		var noAddOption = function(){
			var obj = {};
			obj['qty'] = $('input[name=quantity]').eq(0).val();
			currentOptList = {};
			currentOptList['noOption'] = obj;
		}

		var singleAddOption = function(objOpt){
			var obj = {};
			var listKey = '';
			var sku = null;
			var counter = 0;

			sku = returnToSkuData(objOpt)[0];

			//옵션타입이 selectbox일때 value가 없는 즉, 선택하세요.. 이 선택될 경우 sku가 없으므로 리턴시킨다.
			if(!sku) return;

			obj['price'] = sku.price;
			obj['qty'] = $this.find('.qty').val();
			obj['maxQty'] = sku.quantity;
			obj['retailPrice'] = sku.retailPrice;
			obj['salePrice'] = sku.salePrice;
			obj['inventoryType'] = sku.inventoryType;
			obj['options'] = {};
			obj['upc'] = sku.upc;
			obj['id'] = sku.skuId;
			obj['locationQuantity'] = sku.locationQuantity;

			for(var optionKey in option){
				listKey += option[optionKey].values[option[optionKey].selectedValue];
				obj['options'][optionKey] = option[optionKey].values[option[optionKey].selectedValue];

				counter++;
			}

			currentOptList = {};
			currentOptList[listKey] = obj;

			if($submitBtn.hasClass('disabled') && submit){
				$submitBtn.removeClass('disabled');
			}

			if(obj.salePrice){
				var salePrice = parseInt(obj.salePrice.replace(/[￦,가-힣]/g, ''));
				var retailPrice = parseInt(obj.retailPrice.replace(/[￦,가-힣]/g, ''));
				var productInfo = _GLOBAL.MARKETING_DATA().productInfo;

				if( productInfo ){
					productInfo.price = salePrice;
					productInfo.retailPrice = retailPrice;
				}

				if(salePrice < retailPrice){
					$salePrice.find('strong').text(obj.salePrice).data("price", salePrice);
					$retailPrice.text(obj.retailPrice);
					$('.marketing-msg').show();
				}else{
					$salePrice.find('strong').text(obj.retailPrice).data("price", obj.retailPrice);
					$retailPrice.text('');
					$('.marketing-msg').hide();
				}
			}else{
				$salePrice.find('strong').text(obj.retailPrice).data("price", obj.retailPrice);
				$retailPrice.text('');
			}
			$upcCode.data('upc', obj.upc);
			$upcCode.text(obj.upc);

			/*
				fireEvent 가 등록되기전에 호출하여 처음 이벤트는 발생하지 않는다 그래서 setTimeout으로 자체 딜레이를 주어 해결하였다.
				조금 위험한 방법아지만 해결방법을 찾기 전까지 사용해야 할꺼 같다.
			*/
			setTimeout(function(){
				__self.fireEvent('skuComplete', __self, [obj]);
			});
		}

		var multiAddOption = function(objOpt){
			//console.log('multiAddOption');
		}


		var promiseInit = function(_self){
//			allSkuData = objOptType['data-sku-data']; //Core.Utils.strToJson($this.attr('data-sku-data'));
			//bundleDefaultSkuData = Core.Utils.strToJson($this.attr('data-bundleDefaultSkuData-data'));

			//allSkuData = $this.find("[data-sku-data]").data("sku-data");
			//$this.find("[data-sku-data]").remove();
			//옵션 데이터 나누기 예) COLOR:{}, SIZE:{} ...

			for(var k in optionData){
				option[optionData[k].type] = optionData[k];

				for(var i=0; i<allSkuData.length; i++){
					allSkuData[i][optionData[k].type] = allSkuData[i].selectedOptions[k];
				}
			}

			$optionWrap.find('[data-brz-components-type]').each(function(i){

				optionDom[$(this).attr('data-brz-components-type')] = Core.getComponents(componentType, {context:$this, selector:this}, function(){
					this.addEvent('change', function(attributeValue, valueId, id, friendlyName){
						var obj = {};
						var _that = this;
						var $that = $(_that);
						var attributeName = $that.attr('data-attributename');
						var friendlyName = $that.attr('data-friendly-name');

						obj[$(_that).attr('name')] = valueId;
						receiveToEvent(obj);

						$optionWrap.find('input[type=hidden]').each(function(i){
							if($(this).attr('name') === 'itemAttributes['+attributeName+']'){
								$(this).val(escape(attributeValue));
								//$(this).val(attributeValue);
							}
						});

						//시스템변수 low.inventory.indicator.quantity 설정한 값 보다 작을 경우, 품절 관련 안내문구 노출
						var ckSize = $(this).val();
						$(allSkuData).each(function (index,item) {
							if(item.SIZE==ckSize){
								var item_quantity = item.quantity; // 재고
								var maxea_chk 	 = $this.find('[data-maxea-chk]').attr('data-maxea-chk');   //구매제한 수량
								var soldoutlimit = $this.find('[data-soldoutlimit-chk]').attr('data-soldoutlimit-chk'); //품절임박 수량

								if(soldoutlimit != 'null'){ //품절임박 수량 입력시
									if (item_quantity < soldoutlimit) {// 메세지 노출
										$("#indicatoea").css('display','inline-block');
									}else{
										$("#indicatoea").css('display','none');
									}
								}
								return false;
							}
						});

						endPoint.call("pdpOptionClick", $.extend( objOptType, { type : attributeName, value : attributeValue, skuData : allSkuData }));

						/*
							fireEvent 가 등록되기전에 호출하여 처음 이벤트는 발생하지 않는다 그래서 setTimeout으로 자체 딜레이를 주어 해결하였다.
							조금 위험한 방법아지만 해결방법을 찾기 전까지 사용해야 할꺼 같다.
						*/
						setTimeout(function(){
							if(isFireEvent){
								_self.fireEvent('changeFirstOpt', _that, [firstOptName, $(_that).attr('name'), productId, attributeValue, valueId, id, friendlyName]);
								if( attributeName.toLowerCase() == 'color' ){
									endPoint.call( 'pdpColorClick', { color : attributeValue })
								}
							}
							isFireEvent = true;
							$that.closest('div').prev().find('.over-txt').text(friendlyName);
						});
					});
				});

				optionData[i]['name'] = $(this).attr('data-attribute-name');
			});

			//sku load skuComplete
			_self.fireEvent('skuLoadComplete', _self, [allSkuData]);

			/*
				optionDom : radio, selectbox 컴포넌트
				optionData : 상품의 총 옵션 ( COLOR, SIZE .... )
				allSkuData : 상품 옵션으로 생성된 총 SkuData
				처음 옵션 init 로드 후 allSkuData를 가지고 해당 quantity를 체크하여 옵션의 상태를 처리한다.
				firstOptName은 현 컴포넌트 arguments의 objOptType['data-component-product-option'].first의 값을 가지고 와서 처리 한다. 해당 값은 템플릿에서 newProductOption에서 첫번째, 즉
				iterator.first 옵션의 type이며, COLOR, SIZE 만 테스트가 되어 있는 상태라 다른 옵션타입을 사용 할 경우 테스트를 해야 한다.
				단, 단품이 아닐때 실행한다.
			*/

			if(optionData && $optionWrap.find('[data-brz-components-type]').length > 0) optionDom[firstOptName].receiveToData(optionData[0], allSkuData);


			/* 	
			Adobe 태깅 용 재고 String 생성 부 (s) 2020-04-02 15:11:41 pck 
			데이터 생성 후 input:hidden에 임시 저장
			ex)
			SIZE_RUN_AVAILABILITY = 240:n|245:n|250:y|255:y|260:y|265:y|270:y|275:y|280:n|285:n|290:n|295:n|300:n|305:n|310:n|320:n
			*/
			var productOption = {} // 사이즈 맵핑용 
			var sizeAvailabilityList = [];

			// 1. 전체 상품의 옵션 중에서 사이즈옵션 정보 가져오기
			$.each( objOptType['data-product-options'],  function( index, optionData ){
				if( optionData.type == 'SIZE'){
					$.each( optionData['allowedValues'], function( idx, item ){
						productOption[ item.id ] = item.friendlyName;
					})
				}
			})

			// 2. 가져온 정보에서 품절 여부 체크
			$.each( objOptType['data-sku-data'], function(index, skuData){
				var size = productOption[skuData.SIZE];
				var isAva = (skuData.quantity > 0 ? 'y' : 'n');
				sizeAvailabilityList.push( size + ':' + isAva );
			})

			// 3. input:hidden 에 임시 저장
			$('input[name="size-run-availability"]').val(String(sizeAvailabilityList).split(',').join('|'));
			/* Adobe 태깅 용 재고 String 생성 부 (e) 2020-04-02 15:11:41 pck */

			//재고확인 후 사이즈 선택버튼 활성화 타이밍 debug추가 2020-04-02 14:32:42 pck
			//console.log( String(sizeAvailabilityList).split(',').join('|') );


			//first option select trigger
			$optionWrap.find('.input-radio.checked > label').each(function(i){
				$(this).trigger('click');
			});

			//입고알림 문자받기 show or hide
			if(document.getElementById("set-restock-alarm") && allSkuData){
				for(var index = 0; allSkuData.length > index; index++){
					if(0==allSkuData[index].quantity){
						//enable 입고알림문자받기
						$('#set-restock-alarm').show();
						break;
					}
				}
			}
		}


		var __self,
			$this,
			$submitBtn,
			$titleWrap,
			$salePrice,
			$retailPrice,
			$upcCode,
			$optionWrap,
			optionData = [],
			allSkuData = {},
			bundleDefaultSkuData = {},
			skuData = {},
			option = {},
			optionDom = {},
			qtyComponent = null,
			currentOptList = {},
			currentSku = [],
			currentSkuArray = [],
			productId = 0,
			submit = false,
			firstOptName = 'COLOR',
			productOptionType = 'step',
			selectOptAppendType = false,
			secondIS = false,
			objOptType,
			isFireEvent = true,
			componentType,
			endPoint,
			restrictData;

		var setting = {
			selector:'[data-component-product-option]',
			optionWrap:'.option-wrap',
			submitBtn:'[data-cartbtn]',
			radio:'[data-component-radio]',
			select:'[data-component-select]',
			quantity:'[data-component-quantity]',
			titlewrap:'.title-wrap',
			salePrice:'.price',
			retailPrice:'.price-sale',
			upcCode:'.upc-code'
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
				__self = _self;

				$this = $(setting.selector);
				$optionWrap = $this.find(setting.optionWrap);
				$submitBtn = $this.find(setting.submitBtn);
				$titleWrap = $this.find(setting.titlewrap);
				$salePrice = $this.find(setting.salePrice);
				$retailPrice = $this.find(setting.retailPrice);
				$upcCode = $this.find(setting.upcCode);
				endPoint = Core.getComponents('component_endpoint');

				objOptType = arguments[0];
				firstOptName = objOptType['data-component-product-option'].first;
				productOptionType = objOptType['data-component-product-option'].productType;
				selectOptAppendType = objOptType['data-component-product-option'].selectOptAppendType;
				componentType = objOptType['data-component-product-option'].componentType || 'component_radio';

				productId = $this.attr('data-product-id') || false;
				optionData = objOptType['data-product-options'];
				restrictData = (objOptType['data-product-restrict']) ? Core.Utils.strToJson(objOptType['data-product-restrict'].skuMatcheResults.replace(/=/g,':'), true) : {};

				/* CUSTOM _customproduct.js 기능 이동 */
				//var customYN = Core.getModule('module_custom_product').isProductOptionCustomProduct();

				var obj = {
					'productId':productId
					//'useMaxQuantity':true //구매제한수량 사용여부
					//'fulfillmentType':'PHYSICAL_PICKUP' | PHYSICAL_SHIP
					//,'customYN' : customYN --> productSkuInventory의 product 정보에서 판단
				}

				if($('[data-thedrawend]').length === 1){
					var selectSize = $this.find('#selectSize');
					selectSize.on('change', '', function(e){
						var selected = selectSize.find("option:selected").data('skuid');
						$this.find('.hidden-option').val(selected);
						$this.find('.opt-tit>.msg').removeClass('msg-on').text('');
					});
				}else{
					var $btnGroup = $this.find('[data-add-item]');
					if(productId){
						Core.Utils.ajax(Core.Utils.contextPath + '/productSkuInventory', 'GET', obj, function(data){
							var responseData = Core.Utils.strToJson(data.responseText);
							allSkuData = responseData.skuPricing || {};
							objOptType['data-sku-data'] = allSkuData;

							for(var key in restrictData){
								if(restrictData[key] === 'LOGIN_REQUIRED'){
									console.log(key, restrictData[key]);
									//$optionWrap.find('.msg').eq(0).text('로그인 후 구매가능한 상품이 있습니다.');
								}
								for(var i=0; i<objOptType['data-sku-data'].length; i++){
									if(objOptType['data-sku-data'][i].skuId == key){
										objOptType['data-sku-data'][i]['restrictState'] = restrictData[key];
										break;
									}
								}
							}
							var $btnWishlist = $this.find('.wish-btn');
							//변경되는 구조에서는 삭제되어야하는 구문 vue를 이용한 템플릿 렌더링으로 접근해야함,

							var isSoldout = $('#isSoldout').val();

							// 프로세서로 불러온 soldout 값과 여기서 불러온 usable 값이 같으면 싱크가 맞지 않는 것으로 화면을 한번 갱신해준다.
							// 한번 접근 후에는 모든 사용자에게 반영 되기 때문에 해당 구문을 타는건 극소수의 사용자 일 것
							/*
							if(String(isSoldout) == String(responseData.usable)){
								Core.Loading.show();
								location.reload();
								return;
							}
							*/
							if (!responseData.usable && $btnGroup.length > 0){
								//var template = '<div class="product-soldout"><div class="product-comming"><span class="comming">상품이 품절되었습니다.</span></div></div>';
								//$btnGroup.html(template);
								//head  페이스북  OpenGraph 메타테그 (품절 여부) 값 설정.
								$("#f_availability").attr('content','재고 없음');
							}else{
								$btnWishlist.removeClass('uk-hidden');
							}
							$btnGroup.removeClass('uk-hidden');
							promiseInit(_self);
						}, false, true);
					}else{
						$btnGroup.removeClass('uk-hidden');
					}
				}

				return this;
			},
			setTrigger:function(optionName, value, valueId){
				isFireEvent = false;
				optionDom[optionName].trigger(value, valueId);
			},
			getValidateChk:function(msg){
				var arrIsValidateChk = [];
				var isValidate = false;
				for(var key in optionDom){
					isValidate = optionDom[key].getValidateChk();
					arrIsValidateChk.push(isValidate);
					if(isValidate){
						optionDom[key].getThis().prev().find('.msg').removeClass('msg-on').text('');
						optionDom[key].getThis().prev().parent().parent().find('.size-grid-type').removeClass('size_opt_check');
						optionDom[key].getThis().prev().parent().find('.btn-option').removeClass('caution-txt-color');
						optionDom[key].getThis().prev().parent().find('.product-option_radio').removeClass('option_check');
						//20180412추가 (사이즈선택 미선택 오류 메세지)
					}else{
						optionDom[key].getThis().prev().find('.msg').addClass('msg-on').text(msg);
						optionDom[key].getThis().prev().parent().parent().find('.size-grid-type').addClass('size_opt_check');
						optionDom[key].getThis().prev().parent().find('.btn-option').addClass('caution-txt-color');
						optionDom[key].getThis().prev().parent().find('.product-option_radio').addClass('option_check');
					}
				}

				return (arrIsValidateChk.indexOf(false) === -1) ? true : false;
			},
			getProductId:function(){
				return productId;
			},
			getDefaultSkuData:function(){
				// 단품일경우 (옵션이 없는경우) defaultSku 가 담겨서 넘어온다.
				// bundleDefaultSkuData 의 length 가 > 1 일때 번들 상품으로 bundleDefaultSkuData 넘김
				return (bundleDefaultSkuData.length > 0) ? bundleDefaultSkuData : allSkuData;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_product_option'] = {
		constructor:ProductOptionSelected,
		attrName:['data-component-product-option', 'data-product-options', 'data-product-restrict']
	}
})(Core);