(function(Core){
	var opt = {};
	var apiUrl = '';
	Core.Utils.addressApi = {
		isEmpty: function (keyword, callback){
			var result = true;
			$.ajax({
				url: apiUrl,
				type:'GET',
				dataType: 'json',
				data: { 'q': keyword },
				async: false,
				cache: false,
				complete: function (data) {
					var json = (typeof data === Object) ? data : Core.Utils.strToJson(data.responseText || data, true);
					if (_.isArray(json.results)) {
						result = json.results.length == 0;
					}
				}
			});
			return result;
			
			/*
			Core.Utils.ajax(apiUrl, 'GET', { 'q': keyword }, function(data){
				var json = (typeof data === Object) ? data : Core.Utils.strToJson(data.responseText || data, true);
				if (_.isFunction(callback) && _.isArray(json.results)){
					callback(json.results.length == 0);
				}
			}, true, true);
			*/
		},
		search : function(keyword, callback){
			Core.Utils.ajax(apiUrl, 'GET', { 'q': keyword }, callback, true, true);
		},
		init : function(data){
			var DEFAULT_OPTION = {
				"type": "daum"
			}
			var API_URL = {
				'daum': '//api.poesis.kr/post/search.php'
			}
			opt = _.extend(DEFAULT_OPTION, data);
			apiUrl = API_URL[opt.type];

			return this;
		}
	}
})(Core);