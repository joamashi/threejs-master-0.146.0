(function(Core){
	var CustomerAddress = function(){
		'use strict';

		var $this, args;
		var setting = {
			selector:'[data-component-customer-address]',
			selectBtn:'[data-customer-address-select-btn]',
			baseDom : '[data-customer-address]'
		}

		var getAddressInfoBySelect = function( $el ){
			var data = {};
			$el.closest(setting.baseDom).find('input[type=hidden]').each(function() {
				data[$(this).attr('name')] = $(this).val() || '';
			});
			return data;
		}
		var getAddressInfoByDefault = function(){
			var data = null;
			$this.find(setting.baseDom).each(function () {
				if (_.isEqual($(this).find('input[name="default"]').val(), 'true')) {
					data = getAddressInfoBySelect($(this));
				}
			})
			return data;
		}
		var removeAddress = function(id, callback){
			$.ajax({
				url: Core.Utils.contextPath + '/account/addresses/' + id,
				type: 'POST',
				data: { 'removeAddress': 'Remove', 'csrfToken' : $('input[name="csrfToken"]').val()},
				complete: function (data){
					// 해당 컨트롤러에서 에러확인이 안된는 상황이라 data를 넘기기는 하지만 의미는 없다.
					if (callback) {
						callback(data);
					}
				}
			})
		}

		var Closure = function(){}
		Closure.prototype = {
			getDefaultAddress: getAddressInfoByDefault,
			removeAddress: removeAddress,
			setting:function(){
				var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
			},
			init:function(){
				var _self = this;
				args = arguments[0];
				$this = $(setting.selector);

				if( $this.find(setting.selectBtn).length == 0 ){
					return;
				}

				$this.find(setting.selectBtn).on('click', function(e){
					e.preventDefault();
					_self.fireEvent( 'select', this, [getAddressInfoBySelect( $(this) )]);
				});

				return this;
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_customer_address'] = {
		constructor:CustomerAddress,
		attrName:'data-component-customer-address'
	}
})(Core);
