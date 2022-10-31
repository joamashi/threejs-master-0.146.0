(function(Core){
	Core.register('module_reservation_product', function(sandbox){
		var $this, $btn, args, serviceMenData={}, reservationData={}, arrInventoryList, itemRequest, confirmData, selectedProduct, hasLocalNo, needMakeMap, areaMap = new Map();

		var loadStore = function(){
			if(!serviceMenData.hasOwnProperty('goodsCode')) return;
			if(serviceMenData.hasOwnProperty('localNo')) hasLocalNo = true;

			if(serviceMenData['goodsCode'] !== selectedProduct){
				selectedProduct = serviceMenData['goodsCode'];
				needMakeMap = true;
			} else{
				needMakeMap = false;
			}

			if(needMakeMap){
				//새로운 상품 재고 검색 시 맵 초기화
				//상품(사이즈) 별로 맵을 만든다
				// var keys = areaMap.keys();
				areaMap.forEach(function(item, key, mapObj){
					areaMap.set(key, 0);
				});
				// for(var index = 0; keys.length > index; index++ ){
				// 	areaMap.set(keys[index], 0);
				// }
			}
			//serviceMenData['mode'] = 'template';
			//serviceMenData['templatePath'] = '/page/partials/reservedInventory';
			//serviceMenData['cache'] = new Date().getTime();

			sandbox.utils.promise({
				//url:'/processor/execute/reserved_inventory',
				url:sandbox.utils.contextPath + '/reservedInventory',
				type:'GET',
				cache:false,
				data:serviceMenData
			}).then(function(data){
				// 은정 배포 후 적용 라인
				var inventoryList = data; //sandbox.utils.strToJson(data.replace(/&quot;/g, '"'));

				arrInventoryList = [];
				//API 호출시 마다 매장 수량 결과가 다시 오기 때문에 기존의 값을 지운다.
				inventoryList.forEach(function(a,i){
				    if(a.quantity > 0){
						arrInventoryList.push(a);
						if(needMakeMap){
							//새로운 사이즈로 검색한 경우에만 만들어 준다.
							//지역별 매장 개수 표시를 위해 직접 센다.
							if(areaMap.has(a.state)){
								var agencyCnt = areaMap.get(a.state);
								if(agencyCnt !== undefined || agencyCnt !== null){
									areaMap.set(a.state, ++agencyCnt);
								}
							}
						}
						// console.log('list:', arrInventoryList);
					}
				});

				//Hide size-chart when inventory list exist.
				$this.find('.size-select-txt').text($this.find('.reservation-product-size.checked').attr('typename'));
				if($this.find('#reservation-size-title-area').hasClass('uk-active')){
					$this.find('#reservation-size-title-area').click();
				}
				if(hasLocalNo || arrInventoryList.length > 0){
					$this.find('.location-search').empty().append(
						Handlebars.compile($("#store-list").html())({
							result:(arrInventoryList.length > 0)?true:false,
							list:arrInventoryList
						})
					);
				} else {
					// $this.find('.location-search').empty().append('<div style="padding:30px 0; text-align:center;"><p style="padding-top:35px;lign-height:18px;color:#838383">매장에 수량이 없는 상품입니다.</p></div>');
				    $this.find('.location-search').empty().append('<div class="less-items uk-text-center"><i class="ns-alert color-less"></i><br />매장에 수량이 없는 상품입니다.</div>');
				}

				//목록이 만들어 진 후에 '매장명''수량'에 대해 온클릭 이벤트를 걸어 소트 기능을 붙일 수 있음
				//매장명으로 정렬
				$this.find('.shipping-header .store-name').on('click', function(){
					Method.sortAgencyList('store');
				});
				//수량으로 정렬
				$this.find('.shipping-header .prd-cnt').on('click', function(){
					Method.sortAgencyList('quantity');
				});
                //지역별 대리점 선택 창 닫기
				$this.find('.btn-location-code-close').on('click', function(){
					$this.find('.location-code-wrap').removeClass('active');
					$this.find('.dim').removeClass('active');
				});

				//대리점 목록을 업뎃한다.
				Method.updateAreaAgencyCnt();
			}).fail(function(msg){
				defer = null;
				UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'danger'});
			});
		}

		var Method = {
			moduleInit:function(){
				args = arguments[0];
				$this = $(this);
				$btn = $this.find('.reservation-btn');

				var currentDate = new Date();
				var reservationModal = UIkit.modal('#reservation-modal', {center:true});
				var disabledDays = [];
				var skuData = sandbox.getComponents('component_product_option', {context:$(document)}).getDefaultSkuData(); //sandbox.utils.strToJson($(this.getThis()).find("[data-sku]").attr("data-sku"));
				
				var radioComponent = sandbox.getComponents('component_radio', {context:$this}, function(i){
					var _self=this;
					var INDEX = i;

					this.addEvent('change', function(val){
						switch(INDEX){
							case 0 :
								for(var i=0; i<skuData.length; i++){
									for(var j=0; j<skuData[i].selectedOptions.length; j++){
										if($(this).attr('data-id') == skuData[i].selectedOptions[j]){
											serviceMenData['goodsCode'] = escape(skuData[i].externalId);
											loadStore();
											return;
										}
									}
								}
								break;
							case 1 :
								serviceMenData['localNo'] = val;
								$this.find('.location').text(val);
								$this.find('.dim').removeClass('active');
								$this.find('.location-code-wrap').removeClass('active');
								loadStore();
								break;
						}
					});
				});

				//지역 브랜치 맵 생성, 도시이름(한글)이 key가 되고 개수가 value
				$this.find('[data-area-info]').each(function(){
					areaMap.set($(this).attr('id'), 0);
				});

				$this.on('click', '.location-select', function(e){
					e.preventDefault();
					$this.find('.location-code-wrap').addClass('active');
					$this.find('.dim').addClass('active');
				});

				$this.on('click', '.reservation-apply', function(e){
					e.preventDefault();
					var $form = $(this).closest('form');
					var INDEX = $(this).closest('.shipping-list').index();

					confirmData = {};

					$this.find('input[name=fulfillmentLocationId]').val($(this).attr('data-locationid'));
					itemRequest = BLC.serializeObject($form);
					//사이즈 정보 추가
					itemRequest.size = $this.find('.reservation-product-size.checked').attr('typename');
					//가격에 콤마 + 원 추가
					itemRequest.retailprice = sandbox.rtnPrice(itemRequest.retailprice);
					itemRequest.saleprice = sandbox.rtnPrice(itemRequest.saleprice);
					itemRequest.price = sandbox.rtnPrice(itemRequest.price);

					/* 예약주문 확인 */
					//전화번호 정보 추가
					var phoneNumber = itemRequest['phone'], tempPhone, formatPhone;
					if(phoneNumber.length == 0){
						formatPhone = '정보없음';
					} else if(phoneNumber.length > 10){
						tempPhone = phoneNumber.match(/^(\d{3})(\d{4})(\d{4})$/);
						formatPhone = tempPhone[1] + '-' + tempPhone[2] + '-' + tempPhone[3];
					}
          var isSignIn = (args.isSignIn === 'true')? true:false;
					confirmData.customer = {name:_GLOBAL.CUSTOMER.FIRSTNAME, phone:formatPhone, isSignIn:isSignIn}
					confirmData.storeInfo = arrInventoryList[INDEX];
					confirmData.product = itemRequest;
					disabledDays = arrInventoryList[INDEX].fulfillmentLocationCloseDates;

					// $this.find('.datepicker').datepicker('refresh');
					// $this.find('.datepicker-wrap').addClass('active');
					// $this.find('.dim').addClass('active');
					// $this.find('input[name=fulfillmentLocationId]').val($(this).attr('data-locationid'));

          //현재시간 확인
					var d = new Date(new Date().getTime());
					var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
					confirmData['reservedDate'] = date_format_str;

					//확인화면으로 넘김
					var reservationConfirmTemplate = Handlebars.compile($("#store-confirm").html())(confirmData);
					$this.find('.reservation-confirm-wrap').empty().append(reservationConfirmTemplate);
					$this.find('.reservation-confirm-wrap').addClass('active');
					$this.find('input[name=reservedDate]').val(confirmData['reservedDate']);
					itemRequest['reservedDate'] = confirmData['reservedDate'];
				});

				$this.on('click', '.reservation-confirm-btn', function(e){
					e.preventDefault();
					var _self = this;
					sandbox.getModule('module_header').setModalHide(true).setLogin(function(){
						Method.requestReservation.call(_self);
					});
				});

				$this.on('click', '.cencel-btn', function(e){
					e.preventDefault();
					$this.find('.reservation-confirm-wrap').removeClass('active');
					$this.find('.datepicker').removeClass('active');
					$this.find('.dim').removeClass('active');
				});

				//datapicker
				$this.find('.datepicker').datepicker({
					dateFormat: "yy-mm-dd",
					minDate:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
					onSelect:function(date){
						confirmData['reservedDate'] = date;
						$this.find('.timepicker').focus();
					},
					beforeShowDay:function(date){
						var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
						return [ disabledDays.indexOf(string) == -1 ];
					}
				});

				//timepicker
				$this.find('.timepicker').focusout(function(e){
					var _self = $(this);
					setTimeout(function(){
						var time = _self.val();
						confirmData['reservedDate'] += ' ' + time + ':00';
					},200);
				});

				$this.find('.btn-time-submit').click(function(e){
					e.preventDefault();

					if(!confirmData['reservedDate']){
						UIkit.notify('방문 날짜와 시간을 선택해 주세요.', {timeout:3000,pos:'top-center',status:'warning'});
						return;
					}

					$this.find('.datepicker-wrap').removeClass('active');
					$this.find('.dim').removeClass('active');

					var reservationConfirmTemplate = Handlebars.compile($("#store-confirm").html())(confirmData);
					$this.find('.reservation-confirm-wrap').empty().append(reservationConfirmTemplate);
					$this.find('.reservation-confirm-wrap').addClass('active');
					$this.find('input[name=reservedDate]').val(confirmData['reservedDate']);
					itemRequest['reservedDate'] = confirmData['reservedDate'];
				});

				//dim click addEvent
				$this.find('.dim').off().on('click', function(e){
					$this.find('.reservation-confirm-wrap').removeClass('active');
					$this.find('.datepicker').removeClass('active');
					$this.find('.dim').removeClass('active');
					$this.find('.location-code-wrap').removeClass('active');
				});
			},
			updateAreaAgencyCnt:function(){
				$this.find('[data-area-info]').each(function(){
					$this.find('#area-branch-cnt-' + $(this).attr('value')).text(areaMap.get($(this).attr('id')));
				});
			},
			sortAgencyList:function(key){
				// console.log('key:', key);
				if(arrInventoryList.length > 0){
					if(key==='store'){
						arrInventoryList.sort(function(a,b){
							return a.name < b.name ? -1 : a.name > b.name ? 1:0;
						});
					} else {
						//quantity
						arrInventoryList.sort(function(a,b){
							return b['quantity'] - a['quantity'];
						});
					}

					$this.find('.location-search').empty().append(
						Handlebars.compile($("#store-list").html())({
							result:(arrInventoryList.length > 0)?true:false,
							list:arrInventoryList
						})
					);

					//대리점 목록을 업뎃한다.
					Method.updateAreaAgencyCnt();
				}
			},
			requestReservation:function(){
				var $form = $(this).closest('form');
				itemRequest = BLC.serializeObject($form);

				/* 예약주문 필수값 처리 */
				// if(!itemRequest.reservedDate || itemRequest.reservedDate === ''){
				// 	UIkit.notify('방문 날짜/시간를 선택해주세요', {timeout:3000,pos:'top-center',status:'danger'});
				// 	return false;
				// }

				sandbox.setLoadingBarState(true);
				BLC.ajax({
					url:$form.attr('action'),
					type:"POST",
					dataType:"json",
					data:itemRequest
				},function(data){
					if(data.error){
						sandbox.setLoadingBarState(false);
						UIkit.modal.alert(data.error);
					}else{
						/*var reservationComplateTemplate = Handlebars.compile($("#store-complate").html())();
						$('#reservation-modal').find('.contents').empty().append(reservationComplateTemplate);*/
						_.delay(function(){
							window.location.assign( sandbox.utils.contextPath + '/checkout' );
						}, 300);
					}
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-reservation-product]',
					attrName:'data-module-reservation-product',
					moduleName:'module_reservation_product',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);