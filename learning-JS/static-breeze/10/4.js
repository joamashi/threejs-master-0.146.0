(function(Core){
	Core.register('module_repair_menu', function (sandbox) {
		var Method = {

			moduleInit: function () {
				var $this = $(this);

				$this.find('#reapir_sch_btn').on('click', function (e) {

					var n = "1";    //1개월.
					var m = "0";
					var date = new Date();
					var start = new Date(Date.parse(date) - n);
					var today = new Date(Date.parse(date) - m * 1000 * 60 * 60 * 24);

					if (n < 10) {
						start.setMonth(start.getMonth() - n);
					}
					var yyyy = start.getFullYear();
					var mm = start.getMonth() + 1;
					var dd = start.getDate();

					var t_yyyy = today.getFullYear();
					var t_mm = today.getMonth() + 1;
					var t_dd = today.getDate();

					//  샘플... stdDt=20180918&endDt=20181018&dateType=1
					stdDt = yyyy + '' + addzero(mm) + '' + addzero(dd);
					endDt = t_yyyy + '' + addzero(t_mm) + '' + addzero(t_dd);
					window.document.location.href = "/kr/ko_kr/account/repairable?stdDt=" + stdDt + "&endDt=" + endDt + "&dateType=1";
					return;
				});

				function addzero(n) {
					return n < 10 ? "0" + n : n;
				}

			}
		}
		return {
			init: function () {
				sandbox.uiInit({
					selector: '[data-module-repair-menu]',
					attrName: 'data-module-repair-menu',
					moduleName: 'module_repair_menu',
					handler: { context: this, method: Method.moduleInit }
				});
			}
		}
	});
})(Core);