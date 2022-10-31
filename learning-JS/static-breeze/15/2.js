(function(Core){
	Core.register('module_header', function(sandbox){
		var $this, $headerMenuWrap, args, isSignIn = false, modal, isModalHide = false, isRefresh = false, reDirectUrl = '', endPoint, errorCount=0;

		var Method = {
			moduleInit:function(){
				$this = $(this);
				$headerMenuWrap = $this.find('.header-mymenu');
				args = arguments[0];
				isSignIn = (args.isSignIn === 'true') ? true : false;
				modal = UIkit.modal('#common-modal', {center:true, modal:false});

				endPoint = Core.getComponents('component_endpoint');

				$('.log_user').click(function(e){
					if ($('.log_user').hasClass('on')) {
						$(this).removeClass('on');
					} else {
						$(this).removeClass('on');
						$(this).addClass('on');
					}
				});

				/*
				sandbox.utils.ajax(sandbox.utils.contextPath + '/processor/execute/cart_state', 'GET', obj , function(data){
				    console.log( data );
				    var $data = $(data.responseText);
					var itemSize = $data.filter('input[name=itemSize]').val();
					console.log( itemSize );
				}, false, true)
			    
			    
				var miniCartModule = sandbox.getModule('module_minicart');
				if( miniCartModule ){
				    miniCartModule.update( function(){}, false )
				}
				*/

			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-header]',
					attrName:'data-module-header',
					moduleName:'module_header',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			getCustomerInfo: function () {
				return args;
			},
			setLogin:function(callBackFunc){
				var _self = this;
				if(!isSignIn){
					/*
						@ yslee 2019.01.09
						@ 로그인 전에 로그아웃 처리를 먼저 실행한다.
					*/
					//sandbox.utils.ajax(sandbox.utils.contextPath+'/logout', 'GET', {}, function(){
						//로그인 전
						sandbox.utils.promise({
							url:sandbox.utils.contextPath + '/dynamicformpage',
							type:'GET',
							data:{'name':'login', 'dataType':'model'}
						}).then(function(data){
							var defer = $.Deferred();
							var appendTxt = $(data).find('.content-area').html();
							$('#common-modal').find('.contents').empty().append(appendTxt);
							sandbox.moduleEventInjection(appendTxt, defer);
							endPoint.call("openLogin");
							$('#common-modal').css('zIndex', 1010);
							$('#common-modal .uk-modal-dialog').css('width', '480px');  //로그인 모달 width 변경 20170412
							modal.show();
							return defer.promise();
						}).then(function(data){
							$headerMenuWrap.find('li').eq(0).empty().append($(args.template).html());
							isSignIn = true;
							endPoint.call("loginSuccess");
							if(isModalHide) modal.hide();
							if(!isRefresh) callBackFunc({isSignIn:true});
							else if(isRefresh) location.href = reDirectUrl;
						}).fail(function(data){
							// changsoo.rhi
							if(data instanceof Object) {
						        _self.popForgotPassword(callBackFunc, data.failureType);
						    } else {
	    						defer = null;
			    				//로그인 실패시 재귀호출
	    						if(errorCount > 3){
	    							UIkit.notify('일시적인 장애로 인해 잠시후 이용해 주시기 바랍니다.', {timeout:3000,pos:'top-center',status:'danger'});
	    						}else{
	    							UIkit.notify(data, {timeout:3000,pos:'top-center',status:'danger'});
	    							_self.setLogin(callBackFunc);
									errorCount++;
	    						}
						    }
						});
					//})
				}else{
					//로그인 후
					callBackFunc({isSignIn:true});
				}
				
			},
			getIsSignIn:function(){
				return isSignIn;
			},
			setModalHide:function(isHide){
				isModalHide = isHide;
				return this;
			},
			reDirect:function(url){
				isRefresh = true;
				reDirectUrl = (url) ? url : location.href;
				return this;
			},
			popRegister:function(callBackFunc, errorMsg){
				var _self = this;
				var isCheckedReceiveEmail = false;

				sandbox.utils.promise({
					url:sandbox.utils.contextPath + '/dynamicformpage',
					type:'GET',
					data:{'name':'register', 'dataType':'model'}
				}).then(function(data){
					// 팝업 노출
					var defer = $.Deferred();
					var appendTxt = $(data).find('.content-area').html();
					$('#common-modal').find('.contents').empty().append(appendTxt);
					sandbox.moduleEventInjection(appendTxt, defer);
					endPoint.call("openRegister");
					modal.show();
					//errorMsg 처리
					if(errorMsg){
						for(var key in errorMsg){
							$('#common-modal').find('#'+key).parent().addClass('error').append('<span class="error-message">' + errorMsg[key] + '</span>');
						}
					}
					return defer.promise();
				}).then(function(data){
					isCheckedReceiveEmail = $(modal.dialog).find("#receiveEmail").is(":checked");
					isCheckedReceiveSms = $(modal.dialog).find("#smsAgree").is(":checked");
					return sandbox.utils.promise({
						url: data.redirectUrl,
						type:'GET'
					});
				}).then( function(data){
					//회원가입 성공시
					$headerMenuWrap.find('li').eq(0).empty().append($(args.template).html());

					var appendTxt = $(data).find('.content-area').html();
					$('#common-modal').find('.contents').empty().append(appendTxt);

					endPoint.call("registerComplete", { isReceiveEmail : isCheckedReceiveEmail, isCheckedReceiveSms : isCheckedReceiveSms });
					modal.show();

					$('#common-modal').find('.register-success-btn').click(function(e){
						e.preventDefault();
						if(typeof callBackFunc === 'function'){
							callBackFunc(data);
						}
					});

					//modal hide
					UIkit.modal('#common-modal').off('hide.uk.modal.register').on({
						'hide.uk.modal.register':function(){
							callBackFunc(data);
						}
					});
				}).fail(function(msg){
					_self.popRegister(callBackFunc, msg);
				});
			},
			popForgotPassword:function(callBackFunc, type){
				var _self = this;
				sandbox.utils.promise({
					// url:'sandbox.utils.contextPath + /forgotPassword',
					url:sandbox.utils.contextPath + '/dynamicformpage?failureType='+type, // changsoo.rhi - failureType add
					type:'GET',
					data:{'name':'forgotPassword', 'dataType':'model'}
				}).then(function(data){
					var defer = $.Deferred();
					var appendTxt = $(data).find('.content-area').html();
					$('#common-modal').find('.contents').empty().append(appendTxt);
					sandbox.moduleEventInjection(appendTxt, defer);
					modal.show();
					return defer.promise();
				}).then(function(data){
					//find password success
					//console.log(data);
				}).fail(function(msg){
					defer = null;
					//console.log('msg:' , msg);
					UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'danger'});
					//회원 가입 실패시 재귀호출
					_self.popForgotPassword(callBackFunc);
				});
			}
		}
	});
})(Core);