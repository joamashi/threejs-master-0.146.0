(function(Core, utils) {
	function isString(str){
		return _.isString(str);
	}
	function isEmpty(obj){
		return _.isEmpty(obj);
	}
	function isFunction(fn){
		return _.isFunction(fn);
	}
	function isArray(arr){
		return _.isArray(arr);
	}
	utils.is = {
		isString: isString,
		isEmpty : isEmpty,
		isFunction : isFunction,
		isArray : isArray
	}
})(Core = window.Core || {}, Core.Utils = window.Core.Utils || {});