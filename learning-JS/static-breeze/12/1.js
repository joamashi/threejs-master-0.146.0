(function(Core){

	Core.register('module_order', function(sandbox){
		//var $this = null,
		$allCheck = null, 					// 팝업 전체 선택 체크박스
		$itemList = null, 					// 선택 해서 popup에 노출되는 아이템 리스트
		$itemListObj = null, 				// addon 이 제거된 아이템들
		$popModal = null, 					// 취소 팝업
		cancelOrderId = null, 				// 취소할 주문 id
		$popSubmitBtn = null, 				// 취소 submit 버튼
		$previewContainer = null, 			// 사용안함
		isAllFg = null, 					// 취소 선택시 모든 fulfilment가 취소 가능했는지 여부
		isAblePartialVoid = null, 			// 부분 취소 가능여부
		beforeSelectedOrder = null, 		// 사용안함
		$refundAccountInfo = null, 			//환불정보 입력 폼
		oldOrderUrl = null, 				//이전 사이트 주문 정보 URL
		args = null,
		objStore = {store:[]};

		var Method = {
			moduleInit:function(){
				var $this = $(this);
				var args = arguments[0] || {};

		        //CTM 태깅..  상세보기 링크,,,
				$this.on('click', '.btn-order-detail', function(){
					var f_type       =	$(this).parent('div').parent('div').find('div').eq(1).attr('fulfillment_Type');   //PHYSICAL_PICKUP  ,PHYSICAL_SHIP
					var order_type   =  $(this).closest('.order-list').find("input[name='fulfillmentType']").val();   //inventory: BOPIS_store info, inventory: ROPIS_store info..
					var per_link     =  $(this).attr("data-link");   //링크주소

					if(f_type=='PHYSICAL_PICKUP'){
						if(order_type == 'inventory: BOPIS_cancellation: start'){
							click_name  = "inventory: BOPIS_order detail";
						} else{
							click_name  = "inventory: ROPIS_order detail" ;
						};

					    endPoint.call('clickEvent', {'area' : 'mypage', 'name' : click_name })
					} else{
						endPoint.call('clickEvent', {'area' : 'mypage', 'name' : 'inventory: ORDER/SHIPPING: order detail' })
					};

					location.href = per_link;
				});

				// 당일배송 배송추적 팝업
				trackingDto = "";
				$this.on('click', '[data-deliverycheck]', function(){
					var fgId = $(this).data('deliverycheck');
					var url = sandbox.utils.contextPath+'/account/orders/delivery/tracking' + '?fgId=' + fgId;
					Core.Loading.show();
					BLC.ajax({
						type : "GET",
						dataType : "json",
						url : url,
					},function(data){
						Core.Loading.hide();
						if(data.result == true){
							var modal = UIkit.modal('#order-delivery-check', {modal:false});
							var trackingDetails = modal.find(".body>table").find("tbody");
							trackingDetails.empty();
							modal.find('.body.info>dl>.referenceNumber').text(data.trackingDto.referenceNumber);
							if(data.trackingDto.trackingDetails !== null){
								trackingDetails.parents('table').show();
								$.each(data.trackingDto.trackingDetails,function(i,item) {
									if(item.stateCode !== "DLV_FAILED"){
										var gYear = item.processDate.substr(0, 4);
										var gMonth = item.processDate.substr(4, 2);
										var gDate = item.processDate.substr(6, 2);
										var gHours = item.processDate.substr(8, 2);
										var gMinutes = item.processDate.substr(10, 2);
										var gSeconds = item.processDate.substr(12, 2);
										var date = gYear + "-" + gMonth + "-" + gDate + " " + gHours + ":" + gMinutes;
										var html = "<tr>";
										html+= "<td>" + date +"</td>";
										if(item.stateCode == 'RECEIVED'){
											html+= "<td>" + (item.processPost!==null?item.processPost:'접수') +"</td>";
										} else{
											html+= "<td>" + item.processPost +"</td>";
										}
										html+= "<td>" + (item.remark!==null?item.remark:'-') +"</td>";
										html+= "</tr>";
										trackingDetails.append(html);
									}
								});
							} else{
								trackingDetails.parents('table').hide();
							}
							modal.show();
						} else {
							UIkit.modal.alert('배송추적을 할 수 없습니다.');
						}
					});
				});

				// 당일배송 배송서비스 보상 신청 노출
			    $this.find('.samedayrefund>li').each(function (i, item) {
			    	var refundStatus = $(this).data('refund-status');
			    	var refundNumber = $(this).data('refund-number');
			    	var refundId = $(this).data('refund-id');
			    	if(refundStatus == 'CONFIRM') {
						$this.find('.order-list').each(function (i, item) {
							var cancelDon = $(this).find('[data-cancel-don]');
							var orderNumber = $(this).find('.order-code>span').text();
							if(cancelDon.length == 0 && refundNumber == orderNumber){
								$(this).find('.btn-refund').show().attr({'data-btn-refundid': refundId, 'data-btn-refundstatus': refundStatus});
							}
						});
			    	}
			    	return;
			    });

				// 당일배송 배송서비스 보상 신청 확인
			    $this.on('click', '.btn-refund', function(e){
					e.preventDefault(e);
					var orderNumber = $(this).prev('.order-code').find('>span').text();
					var refundStatus = $(this).data('btn-refundstatus');
					var refundId = $(this).data('btn-refundid');
					var modal = UIkit.modal('#popup-refund', {center:false});
					var finishModal = UIkit.modal('#finish-refund', {center:false});
			        var $form = modal.find('form');
					var checkbox = modal.find('[data-component-checkbox]');
			        sandbox.validation.init($form);
					sandbox.validation.reset($form);
					if(refundStatus == 'CONFIRM'){
						modal.show();
						modal.find('input[name=owner]').val('');
						modal.find('select[name=bankCode]').val('');
						modal.find('input[name=accountNumber]').val('');
						modal.find('[data-error-info]').text('');
						modal.find('.info.error').remove();
						modal.find('.link-privacy').text('상세보기 >');
						modal.find('.detail-privacy').hide();
						checkbox.removeClass('checked');
						checkbox.find('input[type=checkbox]').removeAttr("checked");
						modal.find('[data-component-checkbox]').off('click').on('click', function(){
							if(checkbox.hasClass("checked") === true) {
								checkbox.removeClass('checked');
								checkbox.find('input[type=checkbox]').removeAttr("checked");
							} else{
								checkbox.addClass('checked');
								checkbox.find('input[type=checkbox]').attr("checked",true);
								checkbox.next('.info.error').remove();
							}
						});
						modal.find('input[type=number]').on("keyup", function(){
						    $(this).val($(this).val().replace(/[^0-9]/g,""));
						});
						modal.find('input[type=text]').on("keyup", function(){
						    $(this).val($(this).val().replace(' ',''));
						});
						modal.find('.link-privacy').off('click').on('click', function(){
							if(modal.find('.detail-privacy').is(':visible') == false){
								$(this).text('상세닫기 >');
								modal.find('.detail-privacy').show();
								return false;
							} else{
								$(this).text('상세보기 >');
								modal.find('.detail-privacy').hide();
								return false;
							}
						});
					    modal.find('[data-refund-btn]').off('click').on('click', function(){
							e.preventDefault(e);
							var _this = $(this);
							var refundBtn = _this.data('refund-btn');
							if(refundBtn === true){
								sandbox.validation.validate($form);
						    	if(checkbox.hasClass("checked") === true){
									if(sandbox.validation.isValid($form)){
										var owner = modal.find('input[name=owner]').val();
										var bankCode = modal.find('select[name=bankCode]').val();
										var accountNumber = modal.find('input[name=accountNumber]').val();
										var obj = {
											orderNumber : orderNumber,
											owner : owner,
											bankCode : bankCode,
											accountNumber : accountNumber,
											refundId : refundId
										}
										_this.removeData('refund-btn');
										_this.attr('data-refund-btn',false);
										BLC.ajax({
											url:sandbox.utils.contextPath +"/account/orders/refund",
											type:"POST",
											dataType:"json",
											data : obj
										},function(data){
											if(data.field == 'SUCCESS'){
												finishModal.find('h1').text('신청완료');
												finishModal.find('.contents-wrap>p>strong').html('배송서비스 보상 신청 접수가 완료되었습니다.<br>※ 지급시기 : 신청일 + 2일 이내(은행 영업일 기준)');
												finishModal.show();
												$this.find('.order-list').each(function (i, item) {
						 							var orderNumber = $(this).find('.order-code>span').text();
		   											if(orderNumber == data.refund.orderNumber){
														$(this).find('.btn-refund').hide();
													}
												});
											} else if(data.field == 'accountValidateCount'){
												modal.find('[data-error-info]').html('계좌정보 실명확인 3회 오류로 더 이상 입력하실 수 없습니다. <br>고객센터 080-022-0182 문의하셔서 오류 해제 도움을 받으세요.');
											} else if(data.field == 'owner'){
												modal.find('[data-error-info]').html('예금주를 입력해 주세요.');
											} else if(data.field == 'bankCode'){
												modal.find('[data-error-info]').html('은행/증권사를 선택해 주세요.');
											} else if(data.field == 'accountNumber'){
												modal.find('[data-error-info]').html('계좌번호를 입력해 주세요.');
											} else if(data.field == 'inisisAccountNumber'){
												modal.find('[data-error-info]').html('계좌정보가 유효하지 않습니다');
											} else{
												if(data.refund.refundType == 'CANCEL'){
													modal.find('[data-error-info]').text(data.message);
		    										$this.find('.order-list').each(function (i, item) {
							 							var orderNumber = $(this).find('.order-code>span').text();
			   											if(orderNumber == data.refund.orderNumber){
															$(this).find('.btn-refund').hide();
														}
													});
												}
												modal.find('[data-error-info]').text(data.message);
											}
											_this.removeData('refund-btn');
											_this.attr('data-refund-btn',true);
										});
									}
						    	} else if(checkbox.next('.info.error').length == 0){
						    		checkbox.after('<p class="info error">개인정보 수집·이용에 동의 하셔야 합니다.</p>');
						    	}
							}
					    });
					}
			    });

				//modal init
				var modal = UIkit.modal('#common-modal', {center:true});
				// 오늘 날짜 location 대입
		        var today = new Date(),
		            yyyy = today.getFullYear(),
		            mm = today.getMonth() + 1,
		            dd = today.getDate();

		        if (dd < 10) dd = '0' + dd
		        else if (mm < 10) mm = '0' + mm
		        today = yyyy + mm + dd;

				//주문취소 시작
				//상점정보 가져오기
				var orderHistoryContainer = new Vue({
					el:'[data-vue-orderhistory]',
					data:objStore,
					created:function(){
						objStore['store'] = 1;
						sandbox.utils.promise({
							url:sandbox.utils.contextPath +'/processor/execute/store',
							method:'GET',
							data:{
								'mode':'template',
								'templatePath':'/page/partials/storeList',
								'isShowMapLocation':false,
								'ignoreSharing':true
							},
							isLoadingBar:false
						}).then(function(data){
							objStore['store'] = sandbox.utils.strToJson(data.replace(/&quot;/g, '"'));
						}).fail(function(data){
							UIkit.notify(data, {timeout:3000,pos:'top-center',status:'danger'});
						});
					},
					components:{
						'location':{
							props:['store']
						},
						'order-cencel-button':{
							props:['orderId', 'isJustReservation'],
							template:'<button class="btn-link width-fix cancel-order" v-on:click="orderCencel">{{rtnLabel}}</button>',
							computed:{
								rtnLabel:function(){
									return (this.isJustReservation) ? '예약취소' : '주문취소';
								}
							},
							methods:{
								orderCencel:function(e){
									e.preventDefault();
									var orderId = this.orderId;

									sandbox.utils.promise({
										url:sandbox.utils.contextPath + '/account/order/cancel/' + orderId,
										method:'GET'
									}).then(function(data){
										var defer = $.Deferred();
										$('#common-modal').find('.contents').empty().append(data);
										sandbox.moduleEventInjection(data, defer);
										modal.show().one('hide.uk.modal', function() {     //ctm 로피스, 보피스 x 클릭시 태깅 진행,,,
											var f_type     = $("[data-fulfillmenttype]").data('fulfillmenttype');
					                    	var order_type = $("[data-ordertype]").data('ordertype');
											if(f_type=='PHYSICAL_PICKUP'){
							 	            	if(order_type==true){
							 	                	click_name  = "inventory: ROPIS_cancellation: quit";
							 					}else{	
													click_name  = "inventory: BOPIS_cancellation: quit" ;
							 					};
							 					endPoint.call('clickEvent', {'area' : 'mypage', 'name' : click_name });
											}else{
							 					endPoint.call('clickEvent', {'area' : 'mypage', 'name' : 'inventory: ORDER/SHIPPING_cancellation: quit' });
							 				};
										});

										return defer.promise();

									}).then(function(data){
										UIkit.modal.alert("취소 되었습니다.").on('hide.uk.modal', function() {
											window.location.reload();
										});
									}).fail(function(error){
										if(error){
											UIkit.modal.alert(error).on('hide.uk.modal', function() {
												window.location.reload();
											});
										}else{
											window.location.reload();
										}
									});
								}
							}
						},
						'order-delivery-button' :{
							props: ['orderId'],
							template: '<button class="btn-link width-fix" v-on:click="orderDelivery">상품수령확인</button>',
							methods:{
								orderDelivery:function(e){
									e.preventDefault();
									var $form = $(this.$el).closest('form');
									var url = $form.attr('action');
									var click_area = this.$attrs['data-click-area'];
									var click_name = this.$attrs['data-click-name'];
									
									endPoint.call('clickEvent', { 'area': click_area, 'name': click_name });
									
									UIkit.modal.confirm('<span style="word-break: keep-all;">상품을 이미 수령하신 후에도 배송중으로 표기되고 있다면, 상품수령확인 버튼을 눌러 배송상태를 배송완료로 변경할 수 있습니다. 변경하시겠습니까?<span>', function () {
										sandbox.utils.promise({
											url: url,
											data: $form.serialize(),
											method: 'POST'
										}).then(function (data) {
											UIkit.modal.alert(data.message).on('hide.uk.modal', function () {
												if (data.result == true) {
													endPoint.call('clickEvent', { 'area': click_area, 'name': click_name.replace("start", "quit") });
													window.location.reload();
												}
											});
										}).fail(function (error) {
											UIkit.modal.alert(error.message);
										});
									});
								}
							}
						}
					},
					methods:{
						findLocation:function(locationId){
							try{
								for(var i=0; i<this.store.length; i++){
									if(this.store[i]['id'] == locationId){
										return this.store[i]['name'];
									}
								}
							}catch(e){
								console.log(e);
							}
						},
						shipType:function(locationId){
							try{
								var rtnState = '온라인 물류센터';
								for(var i=0; i<this.store.length; i++){
									if(this.store[i]['id'] == locationId){
										rtnState = this.store[i]['isDefault'] ? '온라인 물류센터':'매장';
										break;
									}
								}
								return rtnState;
							}catch(e){
								console.log(e);
							}
						}
					}
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-order]',
					attrName:'data-module-order',
					moduleName:'module_order',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);