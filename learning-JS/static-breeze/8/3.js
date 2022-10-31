(function(Core){ /* BOPIS & LOPIS PICKUP LOCATION LAYER */
    Core.register('module_pickup_location', function(sandbox){
	    var $this,
	        hasLocalNo,
			vueContainer,
	        pickupLocation = {
	            currentLocation: null,
	            storeList:[],
	            locationCodeWrap: false,
	            sortLt: false,
	            sortNa: false,
	            sortQt: false,
	        },
	        pickupConfirm = { isTaskConfirm: false, customer: null, storeInfo: null, itemRequest: null},
	        pickupQuantity = {
	            isTaskQuantity:false,
	            productPrice:0,
	            newValue:0,
	            min:0,
	            max:0,
	            size:0,
	            quantity:{
	                maxQuantity:1,
	                msg:'개 까지 구매가능 합니다.',
	                quantityStateMsg:'상품의 수량이 없습니다.'
	            }
	        },
	        totalPickupLocation = {},
	        args={},
			currentGeoLocation = {},
	        itemRequest,
	        areaMap = new Map();


		// 사용자 위치 정보 조회 (재고 보유 매장의 위치 정보를 얻어와 내주변 정렬하기 위한 기능)
		function findGeoLocation(isOnLoad){
			var vm = this;
			var positionOpt = {
				enableHighAccuracy:false, // 정확도 조건. false == 빠른 응답
				timeout:5000,
				maximumAge:50000
			};

			if(navigator.geolocation){ // 위치정보 사용
				if(vueContainer.GeoLocation){
					Core.Loading.show();
					var _delay = _.delay(function(){
						Core.Loading.hide();
					}, 7000);

					navigator.geolocation.getCurrentPosition(function(position){
						if(currentGeoLocation['latitude'] != position.coords.latitude || currentGeoLocation['longitude'] != position.coords.longitude) {
							currentGeoLocation['latitude']  = position.coords.latitude;  // API RESERVE
							currentGeoLocation['longitude'] = position.coords.longitude; // API RESERVE
						}

						naver.maps.Service.reverseGeocode({
							location:naver.maps.LatLng(currentGeoLocation['latitude'], currentGeoLocation['longitude']),
						}, function(status, response) {
							if(status !== naver.maps.Service.Status.OK){
								return UIkit.notify("내 위치 정보를 찾을 수 없습니다.", {timeout:3000, pos:'top-center',status:'warning'});
							}

							var result = response.result,
							items = result.items;

							var _address = items[2].address.split(' ');
							vueContainer.findLocation = _.drop(_address).join(' ');
							vueContainer.GeoLocation = false;
							vueContainer.currentSortDir = 'asc';
							vueContainer.currentSort = 'locationTarget';
						});

						Core.Loading.hide();
						clearTimeout(_delay);

						//pickupLocation.currentLocation = currentGeoLocation;
						//https://naveropenapi.apigw.ntruss.com/map/v1/geocode
						/*var geoLocation = currentGeoLocation['longitude'] +','+ currentGeoLocation['latitude'];
						sandbox.utils.jsonp('https://openapi.naver.com/v1/map/reversegeocode-js', {clientId:args.mapkey, query:geoLocation}, 'callback', function(data, status){
						if(data.hasOwnProperty('error')){
							UIkit.notify("내 위치 정보를 찾을 수 없습니다.", {timeout:3000, pos:'top-center',status:'warning'});
						}else{
							vueContainer.findLocation = _.drop(data['result']['items'][2].address.split(' ')).join(' ');
							//console.log('geolocationFindLocation => ', vm.findLocation)
							vueContainer.GeoLocation = false;
						}
						});*/
						if(isOnLoad===false){
							loadStoreIfRadioChange();
						}
					}, null, positionOpt);
				}
			}else{
				UIkit.notify("내 위치 정보를 찾을 수 없습니다.", {timeout:3000, pos:'top-center',status:'warning'});
				//showPositionError({"error":"ERROR - Geolocation is not supported by this agent"});
			}
		}

	    // 내 주변순 위도 : 경도
	    function calculateDistance(lat1, lon1, lat2, lon2){
	        var theta = lon1 - lon2;
	        var dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));

	        dist = Math.acos(dist);
	        dist = rad2deg(dist);

	        dist = dist * 60 * 1.1515;
	        dist = dist * 1.609344; // 킬로미터 단위적용

	        function deg2rad (deg) {
	            return (deg * Math.PI / 180.0);
	        }

	        function rad2deg (rad) {
	            return (rad * 180 / Math.PI);
	        }
	        return dist;
	    }

		//사이즈 선택 토글이벤트
		var sizeOptionToggle = function (size, friendlyName, skuID){
			$this.find('.size-select-txt').text(friendlyName);
			$this.find('#reservation-size-title-area').removeClass('uk-active').data('click-toggle-on', 'off');
	        $this.find('.uk-accordion-content').removeClass('uk-active');
	        $this.find('.accordion-wrapper').animate({'height':0}, 300, "linear", function () {});

			pickupQuantity.size = parseInt(size);
	        vueContainer.pickupLocation(size, skuID);

	        UIkit.accordion('.uk-accordion', {showfirst:false});
	        $this.find('#idLocationSearch').show();
	    }

	    // template
		Vue.component('pickup-location', {
			props: ['currentLocation', 'locationCodeWrap', 'storeall', 'storeList', 'dp', 'st', 'ls', 'sort', 'toggle', 'sortLt', 'sortNa', 'sortQt', 'findcal'],
			template:
				'<div>\
					<!--/* 지역코드선태 모달창 */-->\
					<div class="location-code-wrap" v-bind:class="{active:locationCodeWrap}">\
						<h2 class="tit"><span class="label">지역선택</span></h2>\
						<a class="uk-close btn-location-code-close" v-on:click="locationCodeClose"></a>\
						<div class="tit2">지역별 가장 가까운 나이키 매장을 찾으실 수 있습니다.</div>\
						<div class="code-wrap_radio">\
							<ul class="p-checkbox">\
								<li>\
									<input type="checkbox" id="storeAll" name="storelocal" v-model="storeall.active" v-on:click="toggle(false)"/>\
									<label for="storeAll" v-on:click="toggle(false)">전체</label>\
								</li>\
								<li v-for="(tag, index) in ls" v-if="tag.view === true">\
									<input type="checkbox" name="storelocal" v-model="tag.active" v-bind:id="\'storelocal\' + index" v-on:click="toggle(true)"/>\
									<label v-bind:for="\'storelocal\' + index" v-on:click="toggle(true)"><span class="label">{{ tag.name }}</span></label>\
								</li>\
							</ul>\
						</div>\
					</div>\
					<div class="dim" v-bind:class="{active:locationCodeWrap}"></div>\
					<div class="current-location-area">\
						<div class="txt">매장상황에 따라 상품수량 및 가격 차이가 있을 수 있습니다.</div>\
						<div class="location-item">\
							<span class="location-addr">\
								<span class="ns-pin-nike icon"></span>\
								<span class="current-location" v-text="findcal">위치정보 없음</span>\
							</span>\
							<a href="#none" class="location-select" v-on:click="locationSelect" data-click-area="inventory" data-click-name="my region">지역 선택</a>\
						</div>\
						<div class="location-item"><a href="https://nike-breeze.zendesk.com/hc/ko/articles/900002641086" target="_blank" data-click-area="Inventory" data-click-name="buy_reserve_info"><span class="location-addr" style="text-decoration:underline">구매하기 예약하기 차이점</span></a></div>\
						<a href="#" v-bind:class="{active:sortLt}"\
									v-on:click="sort(\'locationTarget\')" class="btn-location-self" data-click-area="inventory" data-click-name="nearest store">내 위치</a>\
					</div>\
					<div class="store-list">\
						<!--/* 상품예약 서비스 상점 리스트 */-->\
						<div class="shipping-header">\
							<span class="store-name" v-bind:class="{active:sortNa}" v-on:click="sort(\'name\')">매장명</span>\
							<span class="prd-cnt" v-bind:class="{active:sortQt}" v-on:click="sort(\'quantityNo\')">수량</span>\
						</div>\
						<div class="shipping-body">\
							<template v-if="dp.length">\
								<div v-for="store in dp" class="shipping-list" v-bind:data-locationid="store.id">\
									<div class="column column-addr">\
										<h2 class="tit"><a v-bind:href="\'/kr/ko_kr/store?storeId=\'+store.id" target="_blank" data-click-area="inventory" data-click-name="store info">{{store.name}}</a></h2>\
										<dl class="address-wrap">\
											<dt class="addr-type">도로명</dt>\
											<dd class="addr">({{store.zip}}) {{store.address1}} {{store.address2}}</dd>\
											<dt class="addr-type">연락처</dt>\
											<dd class="addr"><a v-bind:href="\'tel:\'+store.phone" data-click-area="inventory" data-click-name="store phone number">{{store.phone}}</a></dd>\
										</dl>\
									</div>\
									<div class="column column-reserve">\
										<span class="quantity">{{store.quantityNo}}</span>\
										<button v-if="store.pickupOrderType === \'BOTH\' || store.pickupOrderType === \'BOPIS\'"\
												v-on:click="runOrderTask"\
												v-bind:data-locationid="store.id"\
												v-bind:data-maxquantity="store.quantityNo"\
												data-pickup-type="bopis"\
												class="reservation-apply btn-link mini" data-click-area="inventory" data-click-name="BOPIS_choose store"\
												v-bind:data-store-name="store.name"\
												>구매하기</button>\
										<button v-if="store.pickupOrderType === \'BOTH\' || store.pickupOrderType === \'ROPIS\'"\
												v-on:click="runOrderTask"\
												v-bind:data-locationid="store.id"\
												v-bind:data-maxquantity="store.quantityNo"\
												data-pickup-type="lopis"\
												class="pickup-apply btn-link mini" data-click-area="inventory" data-click-name="ROPIS_choose store"\
												v-bind:data-store-name="store.name"\
												>예약하기</button>\
									</div>\
								</div>\
							</template>\
							<template v-else>\
								<div class="less-items uk-text-center">\
									<i class="icon-search color-less x2large"></i><br />\
									해당 지역의 매장정보가 없습니다.\
								</div>\
							</template>\
						</div>\
					</div>\
				</div>',
			methods:{
				currentLocation:function(e){
					e.preventDefault();
					/* 위치기반 서비스 개발 */
					this.$emit('currentLocation');
				},
				runOrderTask:function(e){
					e.preventDefault();
					var storeId = e.target.getAttribute('data-locationid');
					var pickupType = e.target.getAttribute('data-pickup-type');
					var maxQuantity = e.target.getAttribute('data-maxquantity');

				//ctm태깅추가 체크아웃 ..
				var order_type = e.target.getAttribute('data-click-name') // 보피스, 로피스 구분
				var store_name = e.target.getAttribute('data-store-name') // 스토어 이름
				var store_stock = e.target.getAttribute('data-maxquantity') // 사용자 최대 구매 가능 재고

				data = {};
				data.link_name = (order_type=="BOPIS_choose store" ? "Checkout:Bopis" : "Checkout:Ropis");
				data.checkout_serial = "";
				data.checkout_type = _GLOBAL.CUSTOMER.ISSIGNIN ? "registered" : "guest";
				data.member_serial = _GLOBAL.CUSTOMER.ID;
				data.ctm_order_type = (order_type=="BOPIS_choose store" ? "bopis" : "ropis");   // 주문형태 기입
				data.store_name = (store_name !== '' ? store_name : 'NO_STORE_NAME');
				data.store_stock = (store_stock !== '' ? store_stock : 'NO_STORE_STOCK');
				data.products = [{
					product_category: '',
					product_name: $this.find('input[name=name]').val(),
					product_id: $this.find('input[name=model]').val(),
					product_quantity: '1',
					product_unit_price: $this.find('#retailPrice').val(),
					product_discount_price: $this.find('#productPrice').val()
				}];

				data.page_event = {
						checkout : true,
						value_at_checkout : '',
						units_at_checkout : ''
					}
				
				//매장 픽업 서비스 선택 시 Adobe 태깅 
				endPoint.call('adobe_script', data );

					pickupQuantity.min = 1;
					pickupQuantity.newValue = 1;
					pickupQuantity.max = maxQuantity;

					for(var i = 0; i < this.dp.length; i++) {
						if(this.dp[i].id == storeId) {
							pickupConfirm.storeInfo = this.dp[i];
						}
					}

					pickupQuantity.productPrice = sandbox.rtnPrice($this.find('#productPriceDefault').val());
					this.$emit('ordertask', storeId, pickupType, maxQuantity);
				},
				locationCodeClose: function (e) {
					e.preventDefault();
					pickupLocation.locationCodeWrap = false;
					$this.find('#idLocationSearch').removeClass('active');
				},
				locationSelect: function (e) {
					e.preventDefault();
					pickupLocation.locationCodeWrap = true;
					$this.find('#idLocationSearch').addClass('active');
				}
			}
		});

	    Vue.component('pickup-quantity', {
			props:['isTaskQuantity', 'productPrice', 'quantity', 'newValue', 'max', 'min', 'itemRequest'],
			template:
				'<article id="order-count-select" class="order-count" v-bind:class="{active:isTaskQuantity}" v-bind:data-component-quantity="quantity">\
					<a class="uk-close order-count-select-close" v-on:click="cancel"></a>\
					<h2 class="title">수량 선택</h2>\
					<div class="body">\
						<div class="count">\
							<div class="count-box">\
								<input type="number" v-model="newValue" class="label" readonly />\
								<button type="button" id="count-plus" v-on:click="plusBtn" class="plus"><i class="icon-plus"></i><span>1개씩 추가</span></button>\
								<button type="button" id="count-minus" v-on:click="minusBtn" class="minus"><i class="icon-minus"></i><span>1개씩 삭제</span></button>\
							</div>\
							<div class="price-box">{{productPrice}}</div>\
						</div>\
						<p class="msg"></p>\
						<button type="button" class="qty-selected btn-link width-max large" v-on:click="selected">선택완료</button>\
					</div>\
				</article>',
			methods:{
				plusMinusFun:function(operator, num){
					var productPrice = $this.find('#productPrice').val();
					var productPriceDefault = $this.find('#productPriceDefault').val();
					var count = 0;

					if(operator == 'plus') {
						count = parseInt(productPrice) + parseInt(productPriceDefault);
					}else{
						count = parseInt(productPrice) - parseInt(productPriceDefault);
					}

					$this.find('#productPrice').val(count);
					$this.find('#retailPrice').val(count);
					$this.find('#quantity').val(num);

					pickupConfirm.itemRequest.quantity = num;
					pickupConfirm.itemRequest.retailprice = sandbox.rtnPrice(String($this.find('#productPrice').val()));

					this.productPrice = sandbox.rtnPrice(String($this.find('#productPrice').val()));
				},
				plusBtn:function(){
					if(this.max == undefined || (this.newValue < this.max)) {
						this.newValue = this.newValue + 1;
						this.plusMinusFun('plus', this.newValue);
					}
				},
				minusBtn:function(){
					if(this.newValue > this.min) {
						this.newValue = this.newValue - 1;
						this.productPrice = this.productPrice * 2;
						this.plusMinusFun('minus', this.newValue);
					}
				},
				selected:function(e){
					e.preventDefault();
					pickupConfirm.itemRequest.size = pickupQuantity.size;
					this.$emit('selected', 1);
				},
				cancel:function(){
					this.$emit('cancel', 'quantity');
				},
				created:function(){}
			}
		});


		//사용안함
		Vue.component('pickup-confirm', {
			props:['isTaskConfirm', 'customer', 'storeInfo', 'itemRequest'],
			template:
				'<div class="reservation-confirm-wrap" v-if="isTaskConfirm" v-bind:class="{active:isTaskConfirm}">\
					<div class="header">\
						<h2 class="tit">매장상품 {{itemRequest.titleName}} 확인</h2>\
						<span class="description">아래 정보를 확인하시고,{{itemRequest.titleName}} 신청버튼을 누르시면 <br/>매장상품 {{itemRequest.titleName}}이 완료됩니다.</span>\
					</div>\
					<div class="body">\
						<dl v-if="customer.isSignIn !== \'false\'" class="list-grid">\
							<dt class="caption">신청자 정보</dt>\
							<dd class="column">\
								<div class="contents customer">\
									<span><strong>이름: </strong>{{customer.firstName}}</span><br/>\
									<span><strong>휴대폰: </strong>{{customer.phoneNumber}}\
										<a class="btn-link line mini btn-info-edit" href="/kr/ko_kr/account" data-click-area="inventory" data-click-name="change personal info">회원정보 변경</a>\
									</span>\
								</div>\
							</dd>\
						</dl>\
						<dl v-if="storeInfo !== null" class="list-grid">\
							<dt class="caption">매장 정보</dt>\
							<dd class="column">\
								<div class="contents store">\
									<a class="link" v-bind:href="rtnStoreLink(storeInfo.id)" target="_blank">{{storeInfo.name}}</a>\
									<dl class="address-wrap">\
										<dt class="addr-type">도로명</dt>\
										<dd class="addr">({{storeInfo.zip}}) {{storeInfo.address1}} {{storeInfo.address2}}</dd>\
										<dt class="addr-type">연락처</dt>\
										<dd class="addr">{{storeInfo.phone}}</dd>\
									</dl>\
									<span v-if="storeInfo.additionalAttributes.length > 0"><strong>매장영업시간:</strong><br/></span>\
									<span class="description">매장 영업시간 외 {{itemRequest.titleName}}하신 경우, 다음 날 영업시간 내에 {{itemRequest.titleName}}확정 문자가 전송됩니다.</span>\
								</div>\
							</dd>\
						</dl>\
						<dl v-if="itemRequest !== null" class="list-grid">\
							<dt class="caption">{{itemRequest.titleName}} 상품</dt>\
							<dd class="column">\
								<div class="contents product">\
									<div class="product-image"><img v-bind:src="itemRequest.image" v-bind:alt="itemRequest.image" /></div>\
									<div class="product-info">\
										<a class="link" v-bind:href="itemRequest.url" target="_blank">{{itemRequest.name}}</a>\
										<span class="model">{{itemRequest.model}}</span>\
										<span class="option">색상 : {{itemRequest.option}}</span>\
										<span class="size">사이즈 : {{itemRequest.size}}</span>\
										<span class="quantity">수량 : {{itemRequest.quantity}}</span>\
										<span class="price">가격 : {{itemRequest.retailprice}}</span>\
									</div>\
								</div>\
							</dd>\
						</dl>\
					</div>\
					<p class="msg">\
						* {{itemRequest.titleName}} 신청이 완료되면 선택하신 매장으로부터 {{itemRequest.titleName}}확정 문자가 발송됩니다. 방문기간을 확인 하시고, 매장에 방문하셔서 {{itemRequest.titleName}}하신 상품을 결제하시면 구매가 완료됩니다.<br/>\
						* {{itemRequest.titleName}}취소는 {{itemRequest.titleName}}확정 문자수신 후 2시간 이내에 마이페이지 > 매장상품 {{itemRequest.titleName}} 서비스에서 가능합니다.\
					</p>\
					<div class="footer">\
						<a href="javascript:;" class="reservation-confirm-btn btn-link large" data-click-area="inventory" v-on:click="submit">{{itemRequest.titleName}}하기</a>\
						<a href="javascript:;" class="cencel-btn btn-link line large" data-click-area="inventory" v-on:click="cancel">취소</a>\
					</div>\
				</div>',
			methods:{
				submit:function(e){
					e.preventDefault;
					this.$emit('submit');
				},
				cancel:function(e){
					e.preventDefault;
					this.$emit('cancel', 'orderConfirm');
				},
				rtnStoreLink:function(id){
					return '/kr/ko_kr/store?storeId=' + id;
				}
			}
		});

	    var Method = {
	        updateAreaAgencyCnt:function(hasLocalNo, areaMap){
	            try {
	                var countVal, areaId;
	                if(hasLocalNo==false){//지역미선택
	                    $this.find('[data-area-info]').each(function(){
	                        areaId = $(this).attr('value');
	                        countVal = areaMap[areaId];
	                        if(typeof(countVal)==="undefined") {
	                            countVal = "0";
	                        }
	                        $this.find('#area-branch-cnt-' + areaId).text(countVal);
	                    });
	                }else{//지역선택시 해당 지역만 초기화
	                    var areaList = [];
	                    for(var areaId in areaMap){
	                        $this.find('#area-branch-cnt-' + areaId).text(areaMap[areaId]);
	                    }
	                }
	            }catch(e){
	                //alert("지역 초기화중 에러 : "+ e);
	            }
	        },
	        executeOrderCountFinish:function(){
	            sandbox.getModule('module_header').setLogin(function(){
	                var $form = $this.find('form');

	                // form value
	                var itemRequest = BLC.serializeObject($form);
	                // pickupConfirm.itemRequest = itemRequest;

	                sandbox.setLoadingBarState(true);

	                BLC.ajax({
	                    url:$form.attr("action"),
	                    type:"POST",
	                    dataType:"json",
	                    // data: pickupConfirm.itemRequest
	                    data: itemRequest
	                },function (data) {
	                    if(data.error){
	                        sandbox.setLoadingBarState(false);
	                        $this.find('.dim').removeClass('active');
	                        UIkit.modal.alert(data.error);
	                    }else{
	                        Core.Loading.show();
	                        // endPoint.call( 'buyNow', pickupConfirm.itemRequest);
	                        // endPoint.call( 'buyNow', itemRequest);
	                        _.delay(function(){
	                            window.location.assign(sandbox.utils.contextPath +'/checkout' );
	                        }, 500);
	                    }
	                }).fail(function(msg){
	                    if(commonModal.active) commonModal.hide();
	                    Core.Loading.hide();
	                    if(msg !== '' && msg !== undefined){
	                        UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'warning'});
	                    }
	                });
	            });
	        },

	        moduleInit:function(){
	            $this = $(this);
	            args = arguments[0];

	            // vue 컴포넌트 초기화
			    vueContainer = new Vue({
					el:'#idLocationSearch',
					data:{
						'location': pickupLocation,
						'confirm': pickupConfirm,
						'quantity': pickupQuantity,
						'quantityNo': 0,
						'skuIdNe': '',
						'sizeIdNe': '',
						'stateList': [],
						'storeType': [],
						'localSelect': [],
						'dataList': [],
						'inventory': [],
						'storeAll': {'active': true},
						'currentSort': 'quantity',
						'currentSortDir': 'asc',
						'findLocation': '위치정보 없음',
						'tag': false,
						'flag': false,
						'GeoLocation': true
					},

					created:function(){
						var vm = this;
						sandbox.utils.promise({
							url:sandbox.utils.contextPath +'/processor/execute/store',
							method:'GET',
							data:{
								'mode':'template',
								'templatePath':'/page/partials/storeList',
								'isShowMapLocation':false
							},
						}).then(function(data){
							var $defer = $.Deferred();
							var data = sandbox.utils.strToJson(data.replace(/&quot;/g, '"'));
							if (data !== '') {
								vm.dataList = data;
								$defer.resolve(data);
							} else {
								$defer.reject('location info is empty');
			                }

							return $defer.promise();
						}).fail(function(msg){
							UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'danger'});
			            });

						if(!window.naver){
							$.getScript("https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=" + args.mapkey + "&submodules=geocoder");
						}
					},

					computed:{
						storeList:function(s){
							var vm = this;
							var flag = this.flag;

							return this.dataList.filter(function (row, index){
								var _id = row.id;
								var _state = row.state;
								row.locationTarget = calculateDistance(currentGeoLocation.latitude, currentGeoLocation.longitude, row.latitude, row.longitude);
								row.isAbleCod = (args.ableCod === 'true') ? true : false;
								row.isAblePickup = (args.ablePickup === 'true') ? true : false;

								return vm.inventory.some(function(size){
									var _size = size.fulfillmentLocationId;
									if (_id == _size) row.quantityNo = size.quantityAvailable;
									return vm.localSelect.some(function (tag) {
										if(!flag){
											return _id == _size && vm.storeAll.active == true;
										}else{
											return _id == _size && tag.name == _state && tag.active === true;
										}
									});
								});
							}).sort(function(a, b){
								// var modifier = 1;
								if (vm.currentSortDir === 'desc') {
									if (a[vm.currentSort] < b[vm.currentSort]) return 1;
									if (a[vm.currentSort] > b[vm.currentSort]) return -1;
								}else{ // asc
									if(a[vm.currentSort] < b[vm.currentSort]) return -1;
									if(a[vm.currentSort] > b[vm.currentSort]) return 1;
								}
								return 0;
							});
						},
						storeType:function(){
							return this.storeType
						},
						localSelect:function(){
							return this.localSelect
						}
					},

					methods:{
						pickupLocation:function(size, skuId){
							var vm = this;
							this.skuIdNe = skuId;
							this.sizeIdNe = size;

							var obj = {
								'skuId': skuId,
								'json': 'true',
								'fType': 'PHYSICAL_PICKUP',
                                'pageSize': '10000'
							}
							// ajax:function(url, method, data, callback, isCustom, isLoadingBar, delay, dataType, cache){
							sandbox.utils.ajax(sandbox.utils.contextPath + '/processor/execute/pickable_inventory', 'GET', obj, function(data){
								vm.inventory = JSON.parse(data.responseText);

								// 지역 초기화
								vm.dataList.filter(function (row, index) {
									vm.localSelect[index] = { 'active': false, 'view': false, 'id': row.id, 'name': row.state};
								});

								// 사이즈 선택 시 해당 지역만 필터에 노출
								vm.localSelect.filter(function(row){
									var _id = row.id;
									vm.inventory.some(function(size){
										var _size = size.fulfillmentLocationId;
										if (_id == _size) row.view = true;
									});
									if (row.view !== true) row.name = '';
								});
								vm.localSelect = _.unionBy(vm.localSelect, vm.localSelect, 'name');

								// 사이즈 변경 시 초기화
								vm.sort('quantityNo');
								vm.toggle('false');
								vm.storeAll.active = true;
							}, true, false, 1200);
						},
						sort:function(s){
							switch (s) {
								case 'locationTarget':
									findGeoLocation(true);
									break;
								case 'name':
									this.currentSortDir = 'asc';
									this.currentSort = 'name';
									break;
								case 'quantityNo':
									this.currentSortDir = 'desc';
									this.currentSort = 'quantityNo';
									break;
							}
						},
						toggle:function(bools){
							var vm = this;
							this.flag = JSON.parse(bools);

							if(this.flag){ // 지역선택
								vm.storeAll.active = false;
							}else{ // 전체
								vm.localSelect.filter(function(row){
									row.active = false;
								});
								// vm.storeAll = true;
							}
						},
						pickupOrderQuantity:function(storeId, pickupType, maxQuantity){ // 수량 선택
							var $form = $this.find('form');
							var itemRequest = BLC.serializeObject($form);

							var _pickupType = (pickupType === 'lopis') ? true : false;

							itemRequest.isJustReservation = _pickupType
							itemRequest.titleName = (pickupType === 'lopis') ? '예약' : '픽업';

							$this.find('#isJustReservation').val(_pickupType);
							$this.find('#fulfillmentLocationId').val(storeId);

							itemRequest.fulfillmentLocationId = storeId;
							pickupConfirm.itemRequest = itemRequest;
							pickupConfirm.customer = sandbox.getModule('module_header').getCustomerInfo();

							for (var i = 0; i < totalPickupLocation.length; i++) {
								if (totalPickupLocation[i].id == storeId) {
									pickupConfirm.storeInfo = totalPickupLocation[i];
								}
							}

							// pickupQuantity.isTaskQuantity = true; // 수량 선택 활성화
							pickupQuantity.quantity.maxQuantity = pickupQuantity;
							// $this.find('.dim').addClass('active');

							// if (_pickupType) {
							//     pickupConfirm.isTaskConfirm = true;
							// } else {
							//     Method.executeOrderCountFinish();
							// }
							Method.executeOrderCountFinish();
						},
						pickupConfirmShow:function(qty){ // 수량 선택 완료
							pickupQuantity.isTaskQuantity = false;
							$this.find('.dim').removeClass('active');
							pickupConfirm.isTaskConfirm = true;
						},
						orderConfirmSubmit:function(){
							Method.executeOrderCountFinish();
						},
						orderCancel:function(status){
							$this.find('.dim').removeClass('active');

							var _productPriceDefault = $this.find('#productPriceDefault').val();

							// 상품가격 초기화
							$this.find('#productPrice').val(_productPriceDefault);
							$this.find('#retailPrice').val(_productPriceDefault);

							switch (status) {
								case 'orderConfirm' :
									pickupConfirm.isTaskConfirm = false;
									break;
								case 'quantity' :
									pickupQuantity.isTaskQuantity = false;
									break;
							}
						},
					}
				});

				var currentDate = new Date();
	            var reservationModal = UIkit.modal('#reservation-modal', {center:true});
	            //var disabledDays = []; 사용되지 않는 것으로 보입니다. 2020-04-02 pck 
                //var disabledDays = []; 사용되지 않는 것으로 보입니다. 2020-04-02 pck
                //console.log('a')
                var skuData = []; //sandbox.getComponents('component_product_option', {context:$(document)}).getDefaultSkuData();
                sandbox.getComponents('component_product_option', {context:$(document)}, function(i){
                    if (i==0) {
                        skuData = this.getDefaultSkuData();
                    }
                })

                
	            var radioComponent = sandbox.getComponents('component_radio', {context:$this}, function(i){
	                var _self = this;
	                var INDEX = i;

	                this.addEvent('change', function(size, value, id, friendlyName){
	                    var skuID = 0;
	                    var _this = this;
	                    skuData.some(function(size){
	                        if ($(_this).data('id') == size.selectedOptions[0]) skuID = size.skuId;
	                        return skuID;
	                    });
						sizeOptionToggle(size, friendlyName, skuID);

						//Adobe 태깅 부 추가 2020-04-02 pck (s)
						var param = {};
						var sizeRunAvailability = $('input[name="size-run-availability"]').val();

						param.link_name = 'Size Run Selections';
						param.size_run_selection = (size !== '') ? size : '';
						param.size_run_availability = (sizeRunAvailability !== '') ? sizeRunAvailability : '';
						param.page_event = {size_run_select : true}
						endPoint.call('adobe_script', param);
						//Adobe 태깅 부 추가 2020-04-02 pck (e)
	                });

	                // PDP 사이즈값 받아오기
	                var pdp_option_size = $('.size-grid-type .hidden-option').val();
	                if(pdp_option_size){
	                    this.trigger(pdp_option_size, pdp_option_size);
	                }
	            });
	        }
	    }

	    return {
	        init:function(){
	            sandbox.uiInit({
	                selector:'[data-module-pickup-location]',
	                attrName:'data-module-pickup-location',
	                moduleName:'module_pickup_location',
	                handler:{context:this, method:Method.moduleInit}
	            });
	        }
	    }
	});
})(Core);