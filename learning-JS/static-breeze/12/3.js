(function(Core){
	Core.register('module_pickup_product', function(sandbox){
		var $this, $deferred;
		var setStoreListTemplate = function(data, qty){

			$this.find('.store-list').empty().append(
				Handlebars.compile($("#store-list").html())({
					result:(data.length>0)?true:false,
					list:data,
					locationQuantity:qty
				})
			);
		}
		var Method = {
			moduleInit:function(){
				$this = $(this);
				//해당 skuPricing에서 넘어온 locationQuantity 값을 가지고 스토어 리스트를 불러온다.
				//var arrStoreList=[{151:1},{151:4},{151:26},{151:3},{151:65}];
				var itemRequest = sandbox.getModule('module_product').getItemRequest();
				var locationQuantity = sandbox.getModule('module_product').getSkuData().locationQuantity;
				var arrStoreList = [];
				var currentDate = new Date();
				var disabledDays = [];
				var defer = $.Deferred();

				for(var key in locationQuantity){
					arrStoreList.push(key);
				}

				sandbox.utils.promise({
					url:sandbox.utils.contextPath + '/processor/execute/store',
					type:'GET',
					data:{
						'mode':'template',
						'templatePath':'/page/partials/storeList',
						'storeId':arrStoreList.join(','),
						'resultVar':'stores',
						'cache':new Date().getTime()
					}
				}).then(function(data){
					var data = sandbox.utils.strToJson(data.replace(/&quot;/g, '"'));
					data.forEach(function(a,b,c){
						a['quantity'] = locationQuantity[a.id]
					});

					var mapComponent = sandbox.getComponents('component_map', {context:$this, storeList:data});
					var searchComponent = sandbox.getComponents('component_searchfield', {context:$this}, function(){
						this.addEvent('searchKeyword', function(e, keyword){
							var pattern = keyword + '[a-z0-9A-Z가-힣]*';
							var regex = new RegExp(pattern);
							var result = [];

							for(var i=0; i<data.length; i++){
								if(regex.test(data[i].address1) || regex.test(data[i].address2) || regex.test(data[i].city)|| regex.test(data[i].name)|| regex.test(data[i].state)){
									result.push(data[i]);
								}
							}

							setStoreListTemplate(result);
							mapComponent.reInit(result);
						});
					});

					setStoreListTemplate(data);
					$(document).off().on('click', '.location-btn', function(e){
						e.preventDefault();
						mapComponent.mapEvent($(this).closest('.shipping-list').index());
					});
					$this.off().on('click', '.reservation-apply', function(e){
						e.preventDefault();

						var index = $(this).closest('.shipping-list').index();
						itemRequest['fulfillmentLocationId'] = data[index].id;
						disabledDays = data[index].holidayClosedDates;

						$this.find('.datepicker').datepicker('refresh');
						$this.find('.datepicker-wrap').addClass('active');
						$this.find('.dim').addClass('active');
					});
				}).fail(function(msg){
					defer = null;
					UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'danger'});
				});

				$this.find('.confirm-btn').addClass('disabled').off().on('click', function(e){
					e.preventDefault();
					if(!$(this).hasClass('disabled')){
						$deferred.resolve(itemRequest);
					}
				});

				$this.find('.cancel-btn').off().on('click', function(e){
					e.preventDefault();
					$deferred.reject();
				});

				//datapicker
				$this.find('.datepicker').datepicker({
					dateFormat: "yy-mm-dd",
					minDate:new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
					maxDate:'+20D',
					onSelect:function(date){
						itemRequest['reservedDate'] = date;
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
						itemRequest['reservedDate'] += ' ' + time + ':00';
						$this.find('.datepicker-wrap').removeClass('active');
						$this.find('.dim').removeClass('active');
						$this.find('.confirm-btn').removeClass('disabled');
					},200);
				});

				//dim click addEvent
				$this.find('.dim').off().on('click', function(e){
					$(this).removeClass('active').parent().removeClass('active');
				});

			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-pickup-product]',
					attrName:'data-module-pickup-product',
					moduleName:'module_pickup_product',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			setDeferred:function(defer){
				$deferred = defer;
			}
		}
	});
})(Core);