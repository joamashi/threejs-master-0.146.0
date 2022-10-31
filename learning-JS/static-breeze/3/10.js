(function(Core){
	var EndPoint = function(){
		'use strict';

		var _self;
		var setting = {}


		var Closure = function(){}
		Closure.prototype = {
			setting:function(){
				var opt = Array.prototype.slice.call(arguments).pop();

				$.extend(setting, opt);
				return this;
			},
			init:function(){
				_self = this;
				return this;
			}, 
			call:function( status, data ){
				//console.log('endpoint : ', status );
				_self.fireEvent(status, this, [data]);
			}
		}

		Core.Observer.applyObserver(Closure);
		return new Closure();
	}

	Core.Components['component_endpoint'] = {
		constructor:EndPoint,
		reInit : true,
		attrName:'data-component-endpoint'
	}
})(Core);