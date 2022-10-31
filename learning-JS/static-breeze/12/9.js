(function(Core){
	Core.register('module_returnorder_history', function(sandbox){
		var Method = {
			moduleInit:function(){
				var args = Array.prototype.slice.call(arguments).pop();
				$.extend(Method, args);

				var $this = $(this);

				$this.find('button.return-cancel-item').on("click", Method.returnOrderCancelItem );
			},
			

			// 반품 취소 요청
			returnOrderCancelItem:function(e){
				e.preventDefault();
				var $form = $(this).closest("form");

				UIkit.modal.confirm('반품을 취소 하시겠습니까?', function(){
					$form.submit();
				}, function(){},
				{
					labels: {'Ok': '확인', 'Cancel': '취소'}
				});
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-returnorder-history]',
					attrName:'data-module-returnorder-history',
					moduleName:'module_returnorder_history',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);