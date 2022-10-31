(function(Core){
	'use strict';

	if(typeof define === "function" && define.amd) {
		define("Core", [], function(){
			return Core();
		});
	}else{
		window['Core'] = Core();
	}
})(function(){
	'use strict';

	var UI = {}; // Core;
	var moduleData = {}; //module
	var moduleSelector = {};
	var Sandbox = function(){
		var args = Array.prototype.slice.call(arguments);
		var callback = args.pop();
		var modules = (args[0] && typeof args[0] === 'string') ? args:args[0];

		return {
			rtnJson:function(data, notevil){
				return UI.Utils.strToJson(data, notevil || true);
			},
			uiInit:function(data){
				return UI.moduleBehavior(data);
			},
			sliderBar:function(data){
				return UI.SliderBar.call(data.context, data.callback);
			},
			rtnPrice:function(price){
				return UI.Utils.price(price);
			},
			rtnObjLength:function(obj){
				return UI.Utils.objLengtn(obj);
			},
			getModule:function(moduleID){
				return UI.getModule(moduleID);
			},
			getComponents:function(componentID, setting, callback){
				return UI.getComponents(componentID, setting, callback);
			},
			moduleEventInjection:function(strHtml, defer){
				UI.moduleEventInjection(strHtml, defer);
			},
			scrollController:function(wrapper, container, callback, id){
				return UI.Scrollarea.setScrollArea(wrapper, container, callback, id);
			},
			ui: UI.ui || {},
			utils:UI.Utils,
			setLoadingBarState:function(isLoad){
				if(isLoad) UI.Loading.show();
				else UI.Loading.hide();
			},
			validation:UI.validation,
			reSize:UI.reSizeWidth,
			cookie:UI.cookie,
			sessionHistory:UI.sessionHistory
		}
	}

	UI.register = function(moduleID, creator){
		//console.log(new Object({'moduleid':moduleID, 'creator':creator}));
		moduleData[moduleID] = {
			creator:creator,
			instance:null
		}
	}

	UI.init = function(moduleID){
		moduleData[moduleID].instance = moduleData[moduleID].creator(new Sandbox(this));
		moduleData[moduleID].instance.init();
		/*deplicated*/
		/*
			body의 Dom요소의 moduleName에 따라 모듈실행
		*/
		/*if(moduleData[moduleID].instance !== undefined && moduleData[moduleID].instance.init !== undefined && typeof moduleData[moduleID].instance.init == 'function'){
			moduleData[moduleID].instance.init();
		}*/
	}

	UI.destroy = function(moduleID){
		var data = moduleData[moduleID];
		if(data.instance && moduleData[moduleID].instance.destroy !== undefined && typeof moduleData[moduleID].instance.destroy == 'function'){
			data.instance.destroy();
			delete data.instance;
		}
	}

	UI.initAll = function(){
		for(var moduleID in moduleData){
			if(moduleData.hasOwnProperty(moduleID)){
				this.init(moduleID);
			}
		}
	}

	UI.destroyAll = function(){
		for(var moduleID in moduleData){
			if(moduleData.hasOwnProperty(moduleID)){
				this.destroy(moduleID);
			}
		}
	}

	UI.getModule = function(moduleID){
		try{
			return moduleData[moduleID].instance;
		}catch(e){
			console.log(moduleID + ' - This module is not defined');
		}
	}

	UI.moduleBehavior = function(data){
		/************************************************************************************************************
			모듈이 실행되는 context 내에 같은 이름( selector )을 가진 template 이 있을경우 모듈의 인스턴스 함수 init이 n번 실행되는 경우 발견
			해당 모듈은 각각의 스코프를 가지고 있기때문에 템플릿 내의 컴포넌트의 기능의 오류는 없으나 메모리를 차지하기 때문에 추후 변경 요망

			모듈 : 페이지내에 하나만 존재
			컴포넌트 : 페이지내에 여러개 존재

			따라서 모듈은 페이지 내에 하나만 존재하는 것이기 때문에 template의 레이아웃을 변경해야한다.
		************************************************************************************************************/

		/*if(data.hasOwnProperty('moduleName')){
			moduleSelector[data.attrName] = data.moduleName;
		}*/
		if($(data.selector).length <= 0) return;
		$(data.selector).each(function(i){
			if(data.hasOwnProperty('attrName')){
				if(data.attrName instanceof Array){
					data.handler.method.call(this, (function(){
						var obj = {};
						for(var i in data.attrName){
							obj[data.attrName[i]] = UI.Utils.strToJson($(this).attr(data.attrName[i]), true);
						}
						return obj;
					}.bind(this))());
				}else{
					data.handler.method.call(this, UI.Utils.strToJson($(this).attr(data.attrName), true));
				}
			}
		});
	}

	UI.getComponents = function(componentID, setting, callback){
		try{
			var _self = this;
			var component = this.Components[componentID];
			var $context = (setting && setting.context) ? setting.context : $('body');
			var attrName = (component.attrName instanceof Array) ? component.attrName[0] : component.attrName;
			var selector = (setting && setting.selector) ? setting.selector : '['+ attrName +']';
			var setting = (setting) ? setting : {};
			var arrComponent = [];
			var reInitIS = component.hasOwnProperty('reInit');

			if(component.hasOwnProperty('constructor') && component.hasOwnProperty('attrName')){
				//기존에 실행되었던 component 를 지운다.

				/*if(this.CurrentComponents.hasOwnProperty(componentID) && component.hasOwnProperty('reInit')){
					for(var i=0; i<this.CurrentComponents[componentID].components.length; i++){
						if(typeof this.CurrentComponents[componentID].components[i].destroy === 'function'){
							this.CurrentComponents[componentID].components[i].destroy();
						}
					}
				}*/

				$context.find(selector).each(function(i){
					var instance;
					var context = $(this).context;
					var indexOf = _self.CurrentComponentsContext.indexOf(context); //(reInitIS) ? _self.CurrentComponentsContext.indexOf(context) : -1;
					setting['selector'] = this;

					if(indexOf > -1){
						instance = _self.CurrentComponents[indexOf].setting(setting);
						//console.log('instance1', instance);
					}else{
						instance = component.constructor().setting(setting).init((function(){
						    if(component.attrName instanceof Array){
						        var obj = {};
        						for(var i in component.attrName){
        							obj[component.attrName[i]] = _self.Utils.strToJson($(this).attr(component.attrName[i]), true);
        						}
        						return obj;
						    }else{
						        return _self.Utils.strToJson($(this).attr(component.attrName), true);
						    }
						}.bind(this))());
						_self.CurrentComponentsContext.push(context);
						_self.CurrentComponents.push(instance);
					}

					if(callback && typeof callback === 'function'){
						callback.call(instance, i, this);
					}

					arrComponent.push(instance);
				});
				//console.log( 'com', (arrComponent.length > 1) ? arrComponent : arrComponent[0] );
				return (arrComponent.length > 1) ? arrComponent : arrComponent[0];
			}else{
				component = null;
				setting = null;
				console.log(componentID + ' - constructor is not defined.');
			}

		}catch(e){
			console.log(e);
		}
	}

	UI.moduleEventInjection = function(strHtml, defer){
		/************************************************************************************************************
			First starting is auto from component, definition is retry that component from module

			component 부터 자동으로 실행되어야한다. module에서 component를 다시 정의하기 때문에 기존의 이벤트들이 삭제되어 아무런 동작을 안한다.
			그리고 기본적인 동작을 하는 component만 실행한다. ( hasOwnProperty( object ) )
		************************************************************************************************************/

		if(!strHtml) return;

		var _self = this;
		var ID = this.Utils.arrSameRemove(strHtml.match(/data-(?:module|component)-+(?:\w|-)*/g)).sort();
		for(var i=0; i<ID.length; i++){
			var name = ID[i].replace(/data-/g, '').replace(/-/g, '_');
			var type = name.replace(/\_\w*/g, '');
			if(type === 'module'){
				try{
					/*if(moduleSelector.hasOwnProperty(ID[i])){
						if(this.getModule(moduleSelector[ID[i]]).hasOwnProperty('destroy')){
							this.getModule(moduleSelector[ID[i]]).destroy();
							delete moduleSelector[ID[i]];
						}
					}

					this.getModule(name).init();*/

					//UI.init
					if(this.getModule(name)){
						if(this.getModule(name).hasOwnProperty('destroy')){
							this.getModule(name).destroy();
							moduleData[name].instance = null;
							//delete moduleSelector[ID[i]];
						}
						//this.getModule(name).init();
					}

					this.init(name);
					if(defer && this.getModule(name).hasOwnProperty('setDeferred')){
						this.getModule(name).setDeferred(defer);
					}

				}catch(e){
					console.log(e);
				}
			}else if(type === 'component'){
				try{
					var component = this.Components[name];
					if(component.hasOwnProperty('constructor') && component.hasOwnProperty('reInit') && component.reInit){
						_self.getComponents(name);
					}else{
						component = null;
					}
				}catch(e){
					console.log(e);
				}

			}
		}
	}

	UI.Components = {};
	UI.CurrentComponentsContext = [];
	UI.CurrentComponents = [];
	UI.Observer = {
		eventID:0,
		addEvent:function(type, handler){
			if(!this.listeners) this.listeners = {};
			if(!this.listeners[type]) this.listeners[type] = {};

			var eventID = this.eventID++;
			this.listeners[type][eventID] = handler;
			return eventID;
		},
		fireEvent:function(type){
			if(!this.listeners || !this.listeners[type]) return false;
			var handlers = this.listeners[type];
			var eventID;
			var args =  Array.prototype.slice.call(arguments);

			if(handlers.stop) return false;

			args.shift();
			for(eventID in handlers) {
				if(handlers.hasOwnProperty(eventID)){
					if(eventID !== "stop"){
						if(!handlers[eventID].stop){
							handlers[eventID].apply(args[0], args[1]);
						}
					}
				}
			}
		},
		removeEvent:function(type, hnd){
			if(!this.listeners || !this.listeners[type]) return -1;
			var handlers = this.listeners[type];
			if(typeof hnd === "function"){
				for(eventID in handlers) if(handlers.hasOwnProperty(f)){
					if(handlers[eventID] === hnd){
						delete handlers[eventID];
						break;
					}
				}
				return !handlers[eventID];
			}else{
				if(handlers[hnd]) delete handlers[hnd]
					return !handlers[hnd];
			}
		},
		applyObserver:function(tclass){
			for(var p in this){
				tclass.prototype[p] = this[p];
			};

			return true;
		}
	}
	UI.Utils = {
		contextPath:(function(){
			try{
			    return _GLOBAL.SITE.CONTEXT_PATH ? _GLOBAL.SITE.CONTEXT_PATH : '';
			}catch(e){
			    return '';
			}
		})(),
		getValidateChk:function(components, msg){
			var isValidateChk = false;
			if(Array.isArray(components)){
				$.each(components, function(i){
					isValidateChk = this.getValidateChk(msg);
				});
			}else{
				isValidateChk = components.getValidateChk(msg);
			}

			return isValidateChk;
		},
		getQueryParams:function(str, type){
			if(!str) return [];

			var data = (type === 'array') ? [] : {};
			str.replace(/([^?=&]+)(?:=([^&]*))/g, function(pattern, key, value){
				if(type === 'array'){
					data.push(pattern);
				}else{
					//data[key] = decodeURI(value);
					if(data.hasOwnProperty(key)){
						if(typeof data[key] === 'object'){
							data[key].push(value);
						}else{
							data[key] = [data[key], value];
						}
					}else{
						data[key] = value;
					}
				}
			});

			return data;
		},
		arrSameRemove:function(arr){
			if(arr === null) return [];
			return arr.reduce(function(a,b){
				if (a.indexOf(b) < 0 ) a.push(b);
				return a;
			},[]);
		},
		objLengtn:function(obj){
			var size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		},
		trim:function(str){
			return str.replace(/(^\s*)|(\s*$)/gi, '');
		},
		price:function(price){
			//if(!price) return false;
			var temp = price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			if(_GLOBAL.SITE.USE_KOREA_WON_PRICE_FORMAT == true ){
				temp += '원';
			}
			return temp;
		},
		strToJson:function(str, notevil){
			try{
				// json 데이터에 "가 있을경우 변환할필요가 없으므로 notevil을 false로 변경
				if(str.match(/"/,'g') !== null) notevil = false;
				if(notevil) {
					return JSON.parse(str
						// wrap keys without quote with valid double quote
						//([\$\w]+)\s*:+([`'~!@#$%^&*?();:|_+=\/\w-#().\s0-9가-힣/\[/\]]*)
						.replace(/([\$\w]+)\s*:+([`'~!@#$%^&*?();:|_+=\/\w-#().가-힣\s/\[/\]]+|[{=\w\s,]+})*/g, function(_, $1, $2){
							if($2 !== '' && $2 !== undefined){
								return '"'+$1+'":"'+$2+'"';
							}else if($2 === undefined){
								return '"'+$1+'":';
							}else{
								return '"'+$1+'":""';
							}
						})
						//.replace(/([\$\w]+)\s*:+([`~!@#$%^&*()_=+|{};:,.<>?\s\w가-힣]*)/g, function(_, $1, $2){return '"'+$1+'":"'+$2+'"';})
						//replacing single quote wrapped ones to double quote
						.replace(/'([^']+)'/g, function(_, $1){return '"'+$1+'"';}));
				} else {
					return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
				}
			}catch(e){
				return false;
			}
		},
		mobileChk:(function(){
			return navigator.userAgent.match(/Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/);
		})(),
		mobileDetect:(function(){
			/*
				console.log( md.mobile() );          // 'Sony'
				console.log( md.phone() );           // 'Sony'
				console.log( md.tablet() );          // null
				console.log( md.userAgent() );       // 'Safari'
				console.log( md.os() );              // 'AndroidOS'
				console.log( md.is('iPhone') );      // false
				console.log( md.is('bot') );         // false
				console.log( md.version('Webkit') );         // 534.3
				console.log( md.versionStr('Build') );       // '4.1.A.0.562'
				console.log( md.match('playstation|xbox') ); // false
			*/
			return new MobileDetect(window.navigator.userAgent);
		})(),
		touch:(window.Modernizr && Modernizr.touch === true) || (function () {
			'use strict';
			return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
		})(),
		transforms3d:(window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
			'use strict';
			var div = document.createElement('div').style;
			return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
		})(),
		transforms:(window.Modernizr && Modernizr.csstransforms === true) || (function () {
			'use strict';
			var div = document.createElement('div').style;
			return ('transform' in div || 'WebkitTransform' in div || 'MozTransform' in div || 'msTransform' in div || 'MsTransform' in div || 'OTransform' in div);
		})(),
		transitions:(window.Modernizr && Modernizr.csstransitions === true) || (function () {
			'use strict';
			var div = document.createElement('div').style;
			return ('transition' in div || 'WebkitTransition' in div || 'MozTransition' in div || 'msTransition' in div || 'MsTransition' in div || 'OTransition' in div);
		})(),
		addEvent:function($target, evt, func){
			if(window.addEventListener || document.addEventListener){
				$target.addEventListener(evt, func);
			}else{
				$target.attachEvent('on'+ evt, func);
			}
		},
		removeEvent:function($target, evt, func){
			if(window.addEventListener){
				$target.removeEventListener(evt, func);
			}else{
				$target.detachEvent('on'+ evt, func);
			}
		},
		ajax:function(url, method, data, callback, isCustom, isLoadingBar, delay, dataType, cache){
			//$('.dim').addClass('active');
			if(!isLoadingBar) UI.Loading.show();

			// POST 일때 token 추가, 현재 admin에서만 동작함
			var $tokenForm = $('#tokenForm');
			if( $tokenForm != null && data != null && String(method).toLowerCase() == 'post'){
				if( typeof( data ) == 'object' ){
					if( data.csrfToken == null ){
						data.csrfToken = $tokenForm.find('input[name="csrfToken"]').val();
					}
				}
				if( typeof( data ) == 'string' ){
					if (data.indexOf('csrfToken') == -1 ){
						data = data + '&' + $tokenForm.serialize()
					}
				}
			}

			$.ajaxSetup({cache:false});
			$.ajax({
				url:url,
				type:method||'POST',
        		dataType:dataType||'json',
				data:data,
				cache:false,
				complete:function(data){
					//$('.dim').removeClass('active');

					_.delay(function(data){

						if(!isLoadingBar) UI.Loading.hide();
						if(data.status == 200 && data.readyState === 4 || isCustom ){
							callback(data);
						}else{
							UIkit.notify('error : ' + data.status, {timeout:3000,pos:'top-center',status:'danger'});
						}
					},( delay || 100 ), data);
				}
			});
		},
		jsonp:function(url, data, callbackName, callback, isLoadingBar){
			if(!isLoadingBar) UI.Loading.show();

			$.jsonp({
				url:url,
				data:data,
				dataType:'jsonp',
				callbackParameter:callbackName,
				timeout:5000,
				success:function(data, status){
					UI.Loading.hide();
					callback(data, status);
				},
				error:function(XHR, textStatus, errorThrown){
					UI.Loading.hide();
					callback({error:textStatus});
				}
			});

			/*$.ajax({
				url:url,
				data:data,
				dataType:'jsonp',
				jsonp:callbackName,
				success:function(data){
					console.log('fjdsjaflkdsjalkjvdlksanfklewnkl');
					if(!isLoadingBar) UI.Loading.hide();
					callback(data);
				}
			});*/

		},
		promise:function(opts){
			var isLoadingBar = (opts.isLoadingBar === false) ? opts.isLoadingBar : true;
			if(!opts.url) return false;
			if(isLoadingBar) UI.Loading.show();

			var defer = $.Deferred();
			$.ajaxSetup({cache:false});
			var promise = $.ajax({
				url:opts.url,
				type:opts.method || 'GET',
				data:opts.data || {},
				cache:false,
				success:function(data){
					if(isLoadingBar) UI.Loading.hide();
					if(opts.hasOwnProperty('custom') && opts.custom){
						defer.resolve(data);
					}else{
						if(data.hasOwnProperty('result')){
							if(data.result){
								defer.resolve(data);
							}else{
								defer.reject(data.errorMessage || data.errorMsg || data);
							}
						}else{
							defer.resolve(data);
						}
					}
				},
				error:function(data){
					if(isLoadingBar) UI.Loading.hide();
					defer.reject(data.statusText);
				}
			});

			return defer.promise();
		},
		replaceTemplate:function(template, rtnFunc){
			return template.replace(/{+[\w-]*}+/g, function(pattern){
				return rtnFunc(pattern.replace(/{{|}}/g, ''));
			});
		},
		replaceTemplateTest:function(template, data){
			function rtnTemp(template){
				data.forEach(function(data, i){
					var txt = '';
					var temp = template.replace(/({{each?[\s\w.]+}}{1})([\s\w<>="{}#\/.-]*){{\/each}}/g, function(){
						var argexp = new RegExp(/each/, 'g');
						var args = arguments;
						var arrKeys = args[1].match(/[^{}]/g).join('').replace(/(?:each|\s)/g, '').split(/\./g);
						var tempData = data;

						for(var i=0; i<arrKeys.length; i++){
							if(i > 0){
								tempData = rtnValue(tempData, arrKeys[i]);
							}
						}

						if(argexp.test(args[2])){
							rtnTemp(args[2]);
						}

						txt += args[2].replace(/{+[\w.]*}+/g, function(pattern){
							var arrKeys = pattern.match(/[^{}]/g).join('').split(/\./g);
							var val = data;

							for(var i=0; i<arrKeys.length; i++){
								if(i > 0){
									val = rtnValue(val, arrKeys[i]);
								}
							}

							return val;
						});
					});

					return txt;
				});
			}

			function rtnValue(data, key){
				return data[key];
			}

			return rtnTemp(template);
		},
		rtnMatchComma:function(keyword){
			return keyword.match(/[0-9a-zA-Z가-힣\s]+[^,\s]/g) || [];
		}
	}

	UI.Loading = (function(){
		var template = '<div class="loading"><div class="dim"></div><div class="contents"><img src="/cmsstatic/theme/SNKRS/assets/images/preloader.gif" /><span class="comment">처리중 입니다.</span></div></div>';
		var $loading = $('body').append((function(){
			return $('#loading-icon-template').html();
		})() || template).find('.loading');

		return {
			show:function(){
				$loading.focus();
				$loading.addClass('open');
			},
			hide:function(){
				$loading.removeClass('open');
			}
		}
	})();

	UI.Scrollarea = (function(){
		var ScrollArea = function(wrapper, container, callback, id){
			var ID = id || '';
			var $wrapper = $(wrapper);
			var $container = $(container);
			var currentPer = 0;
			var arrCallBackFunc = [];
			var maximumHeight;
			var percent;
			var scrollTop;

			return {
				init:function(){
					var _self = this;
					$wrapper.on('scroll.' + ID, function(e){
						scrollTop = $(this).scrollTop();
						maximumHeight = $container.height() - $(this).height();
						percent = Math.round((scrollTop / maximumHeight) * 100);

						if(callback && typeof callback === 'function'){
							callback.call(_self, percent, scrollTop);
							currentPer = percent;
						}else{
							console.log('Not defined that callbackfunc of scrollEvent');
							$wrapper.off('scroll');
						}
					});

					return _self;
				},
				setScrollTop:function(top){
					$wrapper.scrollTop(top);
					return this;
				},
				setScrollPer:function(per){
					return Math.round((maximumHeight / 100) * per);
				},
				getScrollTop:function(offsetTop){
					return Math.round(((offsetTop - $wrapper.height()) / maximumHeight) * 100);
				},
				getScrollPer:function(){
					return currentPer;
				},
				setAddCallBack:function(callbackfunc){
					arrCallBackFunc.push(callbackfunc);
				},
				destroy:function(){
					$wrapper.off('scroll.' + ID);
					return this;
				}
			}
		}

		return {
			setScrollArea:function(wrapper, container, callback, id){
				return new ScrollArea(wrapper, container, callback, id).init();
			}
		};
	})();

	UI.SliderBar = function(){
		var _self = this;
		var callback = Array.prototype.slice.call(arguments).pop();
		var $container = $(this).parent();
		var currentPer = 0;
		var startX = 0;

		if(UI.Utils.touch){
			UI.Utils.addEvent(this, 'touchstart', onStart);
			UI.Utils.addEvent(this, 'touchmove', onMove);
			UI.Utils.addEvent(this, 'touchend', onEnd);
		}else{
			UI.Utils.addEvent(this, 'mousedown', onStart);
		}

		function onStart(e){
			var touchobj = (UI.Utils.touch) ? e.touches[0] : e;

			startX = touchobj.clientX - $container.offset().left;
			currentPer = ((startX / $container.width()) * 100);

			if(typeof callback.start == 'function') callback.start(currentPer);
			if(!UI.Utils.touch){
				UI.Utils.addEvent(document, 'mousemove', onMove);
				UI.Utils.addEvent(document, 'mouseup', onEnd);
			}
		}

		function onMove(e){
			var touchobj = (UI.Utils.touch) ? e.touches[0] : e;
			var percent = ((((touchobj.clientX - $container.offset().left) - startX) / $container.width()) * 100) + currentPer;

			if(percent < 0) percent = 0;
			else if(percent > 100) percent = 100;

			//console.log(percent);

			if(typeof callback.move == 'function') callback.move(percent);
		}

		function onEnd(e){
			if(typeof callback.end == 'function') callback.end();
			if(!UI.Utils.touch){
				UI.Utils.removeEvent(document, 'mousemove', onMove);
				UI.Utils.removeEvent(document, 'mouseup', onEnd);
			}
		}

		return {
			getPercent:function(){
				return currentPer;
			},
			setPercent:function(per){
				currentPer = per;
				if(typeof callback.move == 'function') callback.move(currentPer);
			}
		}
	}

	UI.polyfill = (function(){

		//  ~ IE8 function bind method add
		Function.prototype.bind = Function.prototype.bind || function(b) {
			if (typeof this !== "function") {
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var a = Array.prototype.slice;
			var f = a.call(arguments, 1);
			var e = this;
			var c = function() {};
			var d = function() {
				return e.apply(this instanceof c ? this : b || window, f.concat(a.call(arguments)));
			};
			c.prototype = this.prototype;
			d.prototype = new c();
			return d;
		};




		//  ~ IE8 Object keys method add
		// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
		if (!Object.keys) {
			Object.keys = (function() {
				'use strict';
				var hasOwnProperty = Object.prototype.hasOwnProperty,
					hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
					dontEnums = [
						'toString',
						'toLocaleString',
						'valueOf',
						'hasOwnProperty',
						'isPrototypeOf',
						'propertyIsEnumerable',
						'constructor'
					],
					dontEnumsLength = dontEnums.length;

				return function(obj) {
					if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
						throw new TypeError('Object.keys called on non-object');
					}

					var result = [], prop, i;

					for (prop in obj) {
						if (hasOwnProperty.call(obj, prop)) {
							result.push(prop);
						}
					}

					if (hasDontEnumBug) {
						for (i = 0; i < dontEnumsLength; i++) {
							if (hasOwnProperty.call(obj, dontEnums[i])) {
							result.push(dontEnums[i]);
							}
						}
					}

					return result;
				};
			}());
		}



		// ECMA-262 5판, 15.4.4.21항의 작성 과정
		// 참고: http://es5.github.io/#x15.4.4.21
		if (!Array.prototype.reduce) {
			Array.prototype.reduce = function(callback /*, initialValue*/) {
				'use strict';
				if (this == null) {
					throw new TypeError('Array.prototype.reduce called on null or undefined');
				}
				if (typeof callback !== 'function') {
					throw new TypeError(callback + ' is not a function');
				}
				var t = Object(this), len = t.length >>> 0, k = 0, value;
				if (arguments.length == 2) {
					value = arguments[1];
				} else {
					while (k < len && !(k in t)) {
						k++;
					}
					if (k >= len) {
						throw new TypeError('Reduce of empty array with no initial value');
					}
					value = t[k++];
				}
				for (; k < len; k++) {
					if (k in t) {
						value = callback(value, t[k], k, t);
					}
				}
				return value;
			};
		}

	})();

	UI.validation = (function(){
		var DEFAULT_OPTION = {
			animate: false,
			errorClass: "error",
			errorsContainer : function(elem, isRadioOrCheckbox ) {
				var $target = null;
				if( $(elem.$element).is('input[type="radio"]') || $(elem.$element).is('input[type="checkbox"]') ){
					$target = $( elem.$element ).parent().parent();
				}else{
					$target = $( elem.$element ).parent();
				}
				$target.removeClass("server-error");
				return $target;
			},
			classHandler : function(elem, isRadioOrCheckbox ) {
				var $target = null;
				if( $(elem.$element).is('input[type="radio"]') || $(elem.$element).is('input[type="checkbox"]') ){
					$target = $( elem.$element ).parent().parent();
				}else{
					$target = $( elem.$element ).parent();
				}
				$target.removeClass("server-error");
				return $target;
			},
			errorsWrapper: '<span class="error-message"></span>',
			errorTemplate: '<span></span>',
			validationThreshold : 1,
			excluded: ':hidden'
		}

		function init( dom, opts ){
			dom.parsley( $.extend( DEFAULT_OPTION, opts ));
		}

		function reset( dom, opts ){
			dom.parsley( $.extend( DEFAULT_OPTION, opts ) ).reset();
		}

		function validate( dom ){
			dom.parsley().validate();
		}

		function isValid( dom ){
			return dom.parsley().isValid();
		}

		function destroy( dom ){
			dom.parsley().destroy();
		}

		return {
			init : init,
			reset : reset,
			validate : validate,
			isValid : isValid,
			destroy : destroy
		}
	})();
	
	UI.reSizeWidth = (function(){
		var frag = '';
		var currentDeviceInfo = {};
		var currentBreakPoint = 0;
		var arrDevice = ['mobile', 'tablet', 'pc'];

		$(window).resize(function(e){
			var wH = $(window).width();
			if(wH <= 480 && frag !== 'mobile'){
				frag = 'mobile';
				currentDeviceInfo = arrDevice[0];
				$('body').attr('data-device', 'mobile');
			}else if(wH > 480 && wH <= 960 && frag !== 'tablet'){
				frag = 'tablet';
				currentDeviceInfo = arrDevice[1];
				$('body').attr('data-device', 'tablet');
			}else if(wH > 960 && frag !== 'pc'){
				frag = 'pc';
				currentDeviceInfo = arrDevice[2];
				$('body').attr('data-device', 'pc');
			}
		});

		$(window).trigger('resize');

		return {
			getState:function(){
				return currentDeviceInfo;
			}
		}
	})();

	UI.sessionHistory = (function(){
		var currentQueryParam = UI.Utils.getQueryParams(location.href);
		for(var key in currentQueryParam){
			sessionStorage.setItem(key, currentQueryParam[key]);
		}

		var currentHistory = (function(){
			var obj = {};
			for(var key in sessionStorage){
				obj[key] = sessionStorage[key];
			}
			return obj;
		})();

		return {
			getHistory:function(key){
				if(key){
					return currentHistory[key];
				}else{
					return currentHistory;
				}
			},
			updateHistory:function(){
				currentHistory = {};
				for(var key in sessionStorage){
					currentHistory[key] = sessionStorage[key];
				}
				return currentHistory;
			},
			setHistory:function(obj){
				if(!obj || typeof obj !== 'object'){
					throw new Error('param obj is not Object');
					return;
				}

				for(var key in obj){
					sessionStorage.setItem(key, obj[key]);
				}

				this.updateHistory();
			},
			removeHistory:function(key){
				if(!key) return;
				if(key === 'all'){
					sessionStorage.clear();
				}else{
					sessionStorage.removeItem(key);
				}

				this.updateHistory();
			}
		}
	})();

	UI.cookie = (function(){
		var objCookies = {};
		unescape(window.cookie).split(/;/).forEach(function(v, i){
			var arrValue = v.split(/=/);
			objCookies[arrValue[0].replace(/[\s\n\t]/, '')] = arrValue[1];
		});

		var setExpiresDate = function (expires , time){
			var date = new Date();
			date.setTime(date.getTime()+(expires*time*1000));
			var expires = "expires=" + date.toUTCString();
			return expires;
		}

		return {
			getCookie:function(key){
				return (key) ? objCookies[key] : objCookies;
			},
			setCookie:function(key, value, options){
				/*
					expires           쿠키 만료일       new Date(year, month, day, hours, minutes, seconds, milliseconds)
					expires_day       쿠키 생존 일      숫자
					expires_hour      쿠키 생존 시간    숫자
					domain            도메인          www.example.com 또는 sub.example.com 또는 example.com
					path              경로            / 또는 /dir
					secure            ssl             true 또는 false

				*/

				var options = options || {};
				var arrCookie = [];

				if(options.encodeType == "encodeURI" ){
					arrCookie.push(escape(key) + '=' + encodeURI(value));
				}else if( options.encodeType == "encodeURIComponent" ) {
					arrCookie.push(escape(key) + '=' + encodeURIComponent(value));
				}else{
					arrCookie.push(escape(key) + '=' + escape(value));
				}


				if(options.expires){
					if( typeof options.expires === 'object' && options.expires instanceof Date ){
						var date = options.expires;
						var expires = "expires=" + date.toUTCString();
						arrCookie.push(expires);
					}
				}else if(options.expires_day){
					arrCookie.push(setExpiresDate(options.expires_day , 24*60*60));
				}else if(options.expires_hour){
					arrCookie.push(setExpiresDate(options.expires_hour , 60*60));
				}

				if(options.domain) arrCookie.push("domain=" + options.domain);
				if(options.path) arrCookie.push('path=' + options.path);
				if(options.secure === true) arrCookie.push('secure=' + options.secure);

				document.cookie = arrCookie.join('; ');
			},
			delCookie:function(key){
				if(!key){
					return 'You will try remove cookie ';
				}else{
					document.cookie=key + "=" + "; expires=" + new Date().toUTCString();
				}
				return objCookies[key];
			}
		}
	})();

	// 변수명 정리를 위한 소문자 재정의
	UI.utils = UI.Utils;
	return UI;
});
