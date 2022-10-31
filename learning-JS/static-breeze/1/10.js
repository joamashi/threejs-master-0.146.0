(function(Core){
	var Map = function(){
		'use strict';

		var $this, $btn, storeList = null, map = null, markers = [], infoWindows = [], currentStoreIndex = 0;
		var setting = {
			selector:'[data-component-map]',
			target:'map',
			storeList:null
		}

		var makeMarkerIcon = function(storeData){
			var icon =  {
				size: new naver.maps.Size(20, 31),
				origin: new naver.maps.Point(0, 0),
				anchor: new naver.maps.Point(10, 16)
			}

			if(storeData.additionalAttributes && storeData.additionalAttributes.icon && storeData.additionalAttributes.icon !== ''){
				icon.content = '<i class="icon_map_marker '+storeData.additionalAttributes.icon+'"></i>';
			} else if(undefined !== storeData.additionalAttributes && undefined !== storeData.additionalAttributes.storeType
			           && storeData.additionalAttributes.storeType.indexOf('direct') !== -1){
				// icon.url = Core.Utils.contextPath + '/cmsstatic/theme/c-commerce/cmsstatic/theme/SNKRS/assets/images/g_ico_mapFlag01.png';
				icon.url = 'https://static-breeze.nike.co.kr/kr/ko_kr/cmsstatic/theme/c-commerce/cmsstatic/theme/SNKRS/assets/images/g_ico_mapFlag01.png';
			} else{
				// icon.url = Core.Utils.contextPath + '/cmsstatic/theme/c-commerce/cmsstatic/theme/SNKRS/assets/images/g_ico_mapFlag02.png';
				icon.url = 'https://static-breeze.nike.co.kr/kr/ko_kr/cmsstatic/theme/c-commerce/cmsstatic/theme/SNKRS/assets/images/g_ico_mapFlag02.png';
			}

			return icon;
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
				var args = arguments[0];

				storeList = setting.storeList || args['data-store-list'];

				var firstLatitude = (storeList[0]) ? storeList[0].latitude:37.3595953;
				var firstLongitude = (storeList[0]) ? storeList[0].longitude:127.1053971;

				map = new naver.maps.Map(setting.target, {
					center:new naver.maps.LatLng(firstLatitude, firstLongitude),
					zoom:9
				});

				_self.initMap();
				return this;
			},
			mapEvent:function(seq){
				var _self = this;
				var marker = markers[seq], infoWindow = infoWindows[seq];
				if (infoWindow.getMap()) {
					infoWindow.close();
					_self.fireEvent('closeMarker', this, [seq]);
				} else {
					infoWindow.open(map, marker);
					_self.fireEvent('openMarker', this, [storeList[seq], seq]);
					map.setCenter(new naver.maps.LatLng(storeList[seq].latitude, storeList[seq].longitude));
					map.setZoom(10);
				}
			},
			initMap:function(){
				//store 위도, 경도 값으로 지도 마커 찍어내기
				//store type에 따라 2개의 마커icon 필요함
				var _self = this;

				for (var i=0; i<storeList.length; i++) {
					var position = new naver.maps.LatLng(storeList[i].latitude, storeList[i].longitude);
					var marker = new naver.maps.Marker({
						map:map,
						position:position,
						title:storeList[i].name,
						icon:makeMarkerIcon(storeList[i]),
						zIndex:100
					});

					var infoWindow;
					if($('body').attr('data-device') === 'mobile'){
						//mobile
						infoWindow = new naver.maps.InfoWindow({
							content: '<div id="map_store_info_layer" style="width:120px;text-align:center;padding:10px 6px 10px 10px;"><span class="tit">'+ storeList[i].name +'</span></div>'
						});
					} else {
						//pc
						infoWindow = new naver.maps.InfoWindow({
							content: '<div id="map_store_info_layer" style="width:260px;text-align:center;padding:20px 14px 20px 20px;">'+Handlebars.compile($('#map-window-store-info').html())(storeList[i])+'</div>'
						});
					}

					markers.push(marker);
					infoWindows.push(infoWindow);
				}

				// 지도 마커 클릭 이벤트
				for (var i=0, ii=markers.length; i<ii; i++) {
					naver.maps.Event.addListener(markers[i], 'click', (function(seq){
						return function(){
							_self.mapEvent(seq);
						}
					})(i));
				}
			},
			getStoreList:function(id){
				return (function(){
					if(!id){
						return storeList;
					}else{
						for(var key in storeList){
							if(storeList[key].id == id){
								return storeList[key];
							}
						}
					}
				});
			},
			setStoreList:function(arrStoreList){
				arrStoreList.forEach(function(current, index, arr){
					storeList.push(current);
				});

				return this;
			},
			reInit:function(){
				//변수 초기화
				// map = null;
				markers = [];
				infoWindows = [];
				// currentStoreIndex = 0;
				setting.storeList = storeList;
				this.initMap();
				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_map'] = {
		constructor:Map,
		attrName:['data-component-map', 'data-store-list']
	}
})(Core);