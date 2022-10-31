(function(Core){
	Core.register('module_restocklist', function(sandbox){
		var $this = $(this);
        var endPoint;
		var Method = {
			moduleInit:function(){
				var args = arguments[0];
				endPoint = Core.getComponents('component_endpoint');

				$(this).on('click', '#restock-delete', function(e){
					e.preventDefault();
					var alarm_id = $(this).find("input[id='hidden-restock-id']").val();

					if(typeof(alarm_id) !== "undefined" && alarm_id !== "" && isNaN(alarm_id) === false){
						UIkit.modal.confirm('입고 알림 신청 내역을 삭제 하시겠습니까?', function(){
							Core.Loading.show();
							Core.Utils.ajax(Core.Utils.contextPath + '/restock/remove', 'GET',{'id':alarm_id}, function(data) {
								var data = $.parseJSON( data.responseText );
								if(data.result) {
									location.reload();
									UIkit.notify("입고 알림 신청이 삭제 되었습니다." , {timeout:3000,pos:'top-center',status:'success'});
								} else {
									UIkit.notify(args.errorMsg, {timeout:3000,pos:'top-center',status:'error'});
								}
							},true);
						}, function(){},
						{
							labels: {'Ok': '확인', 'Cancel': '취소'}
						});												
					}else{
						UIkit.notify("입고 알림 신청 삭제에 실패하였습니다. 잠시 후 다시 시도 해주세요.", {timeout:3000,pos:'top-center',status:'error'});
					}
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-restocklist]',
					attrName:'data-module-restocklist',
					moduleName:'module_restocklist',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);