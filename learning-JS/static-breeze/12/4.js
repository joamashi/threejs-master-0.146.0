(function(Core){
	Core.register('module_orderdetail', function(sandbox){
	   var Method = {
		  moduleInit:function(){
			 var $this = $(this);

			 // 당일배송 배송추적 팝업
			 var trackingDto = "";
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
		  }
	   }
	   return {
		  init:function(){
			 sandbox.uiInit({
				selector:'[data-module-orderdetail]',
				attrName:'data-module-orderdetail',
				moduleName:'module_orderdetail',
				handler:{context:this, method:Method.moduleInit}
			 });
		  }
	   }
	});
})(Core);