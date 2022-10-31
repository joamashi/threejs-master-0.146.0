(function(Core){
	var md = null;
	var target = 'master.send';
	var useGa = false;
	function init(){
		md = _GLOBAL.MARKETING_DATA();
		useGa = md.useGa;
		
		switch (md.pageType) {
			case "confirmation":
				submitOrderConfirmationData();
				break;
		}
	}
	function isValid() {
		if (!useGa) {
			return false;
		}
		var ga = window.ga || {};
		return _.isFunction(ga);
	}
	// non-interaction event 처리
	function sendEvent(type, action, label, value) {
		if (isValid()) {
			if (_.isEmpty(action)) { action = 'action is empty'; }
			if (_.isEmpty(label)) { label = 'label is empty'; }
			if (typeof value === 'undefined' || isNaN(value) || !_.isNumber(value)) {
				value = 0;
			}
			ga(target, 'event', type, action, label, value, { 'nonInteraction': 1 });
		}
	}
	function submitOrderConfirmationData(){
		//http://sub1.localserver1.co.kr:8180/confirmation/2020062213445291717703
		if (isValid()) {
			createCommerceData(md, 'add');
		}
	}
	function createCommerceData(orderInfo, type){
		ga('master.require', 'ecommerce', 'ecommerce.js');
		ga('master.ecommerce:addTransaction', {
			'id': orderInfo.orderNumber,
			'revenue': ((type !== 'add') ? '-' : '') + orderInfo.orderTotalAmount,
			'shipping': '0',
			'tax': '0',
			'currency': 'KRW'
		});
		if (_.isArray(orderInfo.itemList)) {
			$.each(orderInfo.itemList, function () {
				ga('master.ecommerce:addItem', getTransProductItemData(orderInfo.orderNumber, this, type));
			})
		}
		ga('master.ecommerce:send');
	}
	function getTransProductItemData(orderNumber, item, type){
		return {
			'id': orderNumber,
			'name': item.name,
			'sku': item.skuId,
			'category': (function (opt) {
				var optValue = ''
				if (_.isArray(opt)) {
					$.each(opt, function (i) {
						if (i == 0) {
							for (key in this) {
								optValue = this[key];
							}
						}
					})
				}
				return optValue;
			})(item.option),
			'price': item.price,
			'quantity': ((type !== 'add') ? '-' : '') + item.quantity
		}
	}
	// 서버에서 처리 되는 ga 호출시 사용
	function processor(data) {
		switch (data.orderType) {
			// 반품시
			case 'RETURN':
				// 반품되는 전체 order 정보가 필요함 복수 일수도 있음
				//commerce( "order-return",  md.returnOrderNumber, "" );
				break;
			// 부분 반품시
			case 'PARTIAL_RETURN':
				break;
			// 취소시
			case 'VOID':
				commerce("order-cancel", data.orderId, md.cancelPrice);
				break;
			// 부분 취소시
			case 'PARTIAL_VOID':
				commerce("order-partial-cancel", data.orderId, md.cancelPrice);
				break;
		}
		
		// 반품 취소 처리 필요
		Core.Utils.ajax(Core.Utils.contextPath + '/processor/execute/google_enhanced_ec', 'GET', data, function (data) {
			if (data.status == 200) {
				if (String(data.responseText).indexOf('html') == -1) {
					$("body").append(data.responseText);
				}
			}
		}, true, true);
	}
	function pv(type, url) {
		if (isValid()) {
			ga(target, type, url); // ex) ga("master.send", "pageview", "/pagename");
		}
	}
	function social(name, action, url) {
		if (isValid()) {
			ga(target, 'social', name, action, url);
		}
	}
	function action(action, label, value) {
		sendEvent('user-action', action, label, value);
	}
	function commerce(action, label, value) {
		sendEvent('commerce', action, label, value);
	}
	function error(action, label, value) {
		sendEvent('error', action, label, value);
	}
	Core.ga = {
		init:init,
		processor: processor,
		pv: pv,
		social: social,
		action: action,
		commerce: commerce,
		error: error
	}
})(Core);