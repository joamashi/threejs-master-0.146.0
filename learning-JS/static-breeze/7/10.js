(function(Core){
	Core.register('module_authenticate', function(sandbox){

		var customerListVue, args, $this, isDirectAuth, authData, customText, customerInfo = {isAuth:false, isSms:false, customers:[], authPhoneNum:null}, isConfirmed = false, sucCallback=null, failCallback=null, isTimerCounter=false;
		var Method = {
			moduleInit:function(){
				$this = $(this);
				args = arguments[0];
				if( isDirectAuth == true ){
					Method.setDirectAuthType();
				}else{
					Method.setDefaultType();
				}

				// 최종 확인 버튼
				$this.find('.btn-use-search-member').off('click').on('click',function(e){
					if(isConfirmed){
						isConfirmed = false;
						if( sucCallback != null ){
							e.preventDefault();
							Method.callSuccessCallback();
						}
					}else{
						e.preventDefault();
						UIkit.modal.alert('OTP인증을 진행해주세요.');
					}
				});

				$this.find('[data-authenticate-test-btn]').off('click').on('click',function(e){
					e.preventDefault();
					if( isDirectAuth == true ){
						customerInfo.isAuthSuccess=true;
						customerInfo.customers[0]['isOverTime'] = false;
						customerInfo.customers[0]['time'] = null;
						customerInfo.customers[0]['isRequest'] = false;
						customerInfo.isSms = false;
					}
					Method.confirmSuccess();
				});

				$('#popup-layer-order-custom').on({
					'hide.uk.modal': function(){
						if( isDirectAuth == true ){
							sandbox.setLoadingBarState(true);
							location.reload();
							/*
							if( _.isFunction(customerListVue.$destroy)){
								customerListVue.$destroy();
							}
							*/
						}else{
							customerInfo.isAuth = false;
							customerInfo.isSms = false;
							customerInfo.customers = [];
							customerInfo.autoPhoneNum = null;
							isConfirmed = false;
							isTimerCounter = false;
						}
					}
				});
			},
			// 검색 없이 바로 인증 진행시
			setDirectAuthType:function(){
				$this.find('#customText').html( customText );

				if( authData == null ){
					UIkit.modal.alert('인증 정보가 올바르지 않습니다. 관리자에게 문의 하세요.').on('hide.uk.modal', function(){
						Method.callFailCallback();
					});
					return false;
				}

				customerInfo = {
					isAuth:true,
					isSms:false,
					customers:[{
						time:null,
						isRequest:false,
						isOverTime:false,
					}],
					isAuthSuccess:false,
					authPhoneNum:null
				}

				customerListVue = new Vue({
					el:'#opt-direct-auth',
					data:customerInfo,
					methods:{
						authSms:function(e){
							if( e ) e.preventDefault();
							var _self = this;
							var index = 0;
							customerInfo.isSms = true;
							sandbox.utils.promise({
								url:'/otp/request',
								method:'POST',
								data:authData
							}).then(function(data){
								//카운터 시작
								isTimerCounter = true;
								if( customerInfo.customers[index]['time'] == null ){
									_self.countdown(index);
								}
								customerInfo.customers[index]['isOverTime'] = false;
								customerInfo.customers[index]['isRequest'] = true;
								customerInfo.customers[index]['time'] = parseInt(args.limitMin) * 60;
							}).fail(function(msg){
								customerInfo.isSms = false;
								UIkit.modal.alert('고객정보를 찾을수 없습니다.').on('hide.uk.modal', function(){
									Method.callFailCallback();
								});
							});
						},
						authConfirm:function(e){
							e.preventDefault();
							//otp 인증 비동기 처리
							if(isConfirmed!=true){
								var _self = this;
								var index = e.target.getAttribute('data-index');
								var $form = $(e.target).closest('form');
								var data = sandbox.utils.getQueryParams($form.serialize());
								sandbox.utils.promise({
									url:'/otp/confirm',
									method:'POST',
									data:$.extend( data, authData )
								}).then(function(data){
									customerInfo.customers[index]['isOverTime'] = false;
									customerInfo.customers[index]['isRequest'] = false;
									_self.isAuthSuccess=true;
									Method.confirmSuccess();
								}).fail(function(data){
									UIkit.modal.alert(data.errors || '인증번호가 일치하지 않습니다. 다시 시도해 주세요.');
								});
							}else{
								UIkit.modal.alert('인증번호가 확인되었습니다.<br/>확인을 클릭하여 다음단계를 진행해주세요.');
							}
						},
						countdown:function(index){
							/*
							console.log( 'index : ', index )
							console.log( 'time : ', time )
							console.log( 'isConfirmed : ', isConfirmed )
							console.log( 'isTimerCounter : ', isTimerCounter )
							*/
							var _self = this;

							setTimeout(function(){
								if(!isTimerCounter) return;
								var count = Number(customerInfo.customers[index]['time'])-1;
								customerInfo.customers[index]['time'] = count
								if(count > 0 && !isConfirmed){
									_self.countdown(index);
								}else{
									if( isConfirmed ){
										customerInfo.isAuthSuccess=true;
										customerInfo.customers[index]['isOverTime'] = false;
									}else{
										customerInfo.customers[index]['isOverTime'] = true;
									}
									customerInfo.customers[index]['time'] = null;
									customerInfo.customers[index]['isRequest'] = false;
									customerInfo.isSms = false;
								}
							}, 1000);
						}
					},
					created: function () {
						console.log( 'created' );
						this.$nextTick( function(){
							Core.moduleEventInjection($this.html());
						})
						//this.authSms();
					}
				});
			},
			// 일반적인 검색 후 인증 사용시
			setDefaultType:function(){
				$this.find('[data-authenticate-btn]').click(function(e){
					e.preventDefault();
					//costomer 비동기 처리
					var $form = $(this).closest('form');
					var data = sandbox.utils.getQueryParams($form.serialize());
					customerInfo.authPhoneNum = data.identifier;
					sandbox.utils.ajax($form.attr('action'), 'POST', data, function(data){
						var customerData = sandbox.rtnJson(data.responseText);
						if(customerData.result){
							for(var i=0; i<customerData.customerList.length; i++){
								customerData['customerList'][i]['isSmsConfirm'] = false;
								customerData['customerList'][i]['time'] = null;
							}
						}
						customerInfo.isAuth = true;
						customerInfo.customers = (customerData.result) ? customerData.customerList : [];
					});
				});

				customerListVue = new Vue({
					el:'#custom-list',
					data:customerInfo,
					watch:{
						customers:function(){
							this.$nextTick(function(){
								UIkit.accordion('#accordion-wrap', {showfirst:false});
							});
						}
					},
					methods:{
						authSms:function(e){
							e.preventDefault();

							if(!isConfirmed && !customerInfo.isSms){
								var _self = this;
								var index = e.target.getAttribute('data-index');
								var type = e.target.getAttribute('data-type');
								var msg = "";

								if(type=='KAKAO' || type=='kakao'){
									msg = this.authPhoneNum + '로 OTP(인증번호)를 전송하시겠습니까?'
								}else{
									msg = e.target.getAttribute('data-email') + '로 OTP(인증번호)를 전송하시겠습니까?'
								}
								customerInfo.isSms = true;


								UIkit.modal.confirm(msg, function(){
									var $form = $(e.target).closest('form');
									var data = sandbox.utils.getQueryParams($form.serialize());
									data['userName'] = _self.customers[index]['username'];
									data['messageType'] = type;

									/*
									sandbox.utils.ajax($form.attr('action'), 'POST', $.extend( data, {messageType : 'EMAIL'}), function(data){
										console.log( data );
									});
									*/
									sandbox.utils.promise({
										url:$form.attr('action'),
										method:'POST',
										data:data
									}).then(function(data){
										//카운터 시작
										isTimerCounter = true;
										customerInfo.customers[index]['isSmsConfirm'] = true;
										customerInfo.customers[index]['time'] = parseInt(args.limitMin) * 60;
										_self.countdown(index, parseInt(args.limitMin) * 60);
									}).fail(function(msg){
										customerInfo.isSms = false;
										UIkit.modal.alert('고객정보를 찾을수 없습니다.').on('hide.uk.modal', function(){
											Method.callFailCallback();
										});
									});

								}, function(){
									customerInfo.isSms = false;
								}, {bgclose:false});
							}else{
								if(isConfirmed) UIkit.modal.alert('인증번호가 확인되었습니다.<br/>확인을 클릭하여 다음단계를 진행해주세요.');
							}
						},
						authConfirm:function(e){
							e.preventDefault();
							//otp 인증 비동기 처리
							if(isConfirmed!=true){
								var _self = this;
								var defer = $.Deferred();
								var index = e.target.getAttribute('data-index');
								var $form = $(e.target).closest('form');
								var data = sandbox.utils.getQueryParams($form.serialize());
								data['userName'] = _self.customers[index]['username'];

								sandbox.utils.promise({
									url:$form.attr('action'),
									method:'POST',
									data:data
								}).then(function(data){
									if( data.result == true && data.confirmResult == true){
										customerInfo.customers[index]['isSmsConfirm'] = false;
										Method.confirmSuccess();
									}else{
										return defer.reject({'errors' : data.errors });
									}
								}).fail(function(data){
									UIkit.modal.alert(data.errors || '인증번호가 일치하지 않습니다. 다시 시도해 주세요.');
								});
							}else{
								UIkit.modal.alert('인증번호가 확인되었습니다.<br/>확인을 클릭하여 다음단계를 진행해주세요.');
							}
						},
						countdown:function(index, time){
							var count = time;
							var _self = this;

							setTimeout(function(){
								if(!isTimerCounter) return;
								customerInfo.customers[index]['time'] = --count;
								if(count > 0 && !isConfirmed){
									_self.countdown(index, count);
								}else{
									customerInfo.customers[index]['time'] = null;
									customerInfo.customers[index]['isSmsConfirm'] = false;
									customerInfo.isSms = false;
								}
							}, 1000);
						}
					}
				});

				var tabComponent = sandbox.getComponents('component_tabs', {context:$this}, function(){
					this.addEvent('tabClick', function(index){
						$this.find('.authenticate-type').eq(index).addClass('active').siblings().removeClass('active');
					});
				});


			},
			callSuccessCallback:function(){
				if( sucCallback != null ){
					sucCallback.call();
				}
			},
			callFailCallback:function(){
				if( failCallback != null ){
					failCallback.call();
				}
			},
			confirmSuccess:function(){
				if( isDirectAuth ){

				}else{
					UIkit.modal.alert('인증번호가 확인되었습니다.<br/>확인을 클릭하여 다음단계를 진행해주세요.');
				}
				isConfirmed = true;
				$this.find('.btn-use-search-member.disabled').removeClass('disabled');
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-authenticate]',
					attrName:'data-module-authenticate',
					moduleName:'module_authenticate',
					handler:{context:this, method:Method.moduleInit}
				});
			},
			customText:function( text ){
				customText = text;
				return this;
			},
			isDirectAuth:function(isDirect){
				isDirectAuth = isDirect || false;
				return this;
			},
			reset:function(otp){
				isDirectAuth = otp.isDirectAuth || false;
				customText = otp.customText || '';
				authData = otp.authData || null;
				this.init();
			},
			success:function( callback ){
				if( _.isFunction(callback)){
					sucCallback = callback;
				}
				return this;
			},
			fail:function( callback ){
				if( _.isFunction(callback)){
					failCallback = callback;
				}
				return this;
			}
		}
	});

	Vue.component('countdown', {
		props:['time'],
		template:'<span class="timer" v-if="time !== null">{{rtnTimer(Math.floor(time / 60 % 60))}}:{{rtnTimer(Math.floor(time % 60))}}</span>',
		methods:{
			rtnTimer:function(time){
				var numToString = time.toString();
				return (numToString.length > 1) ? numToString : '0' + numToString;
			}
		}
	});
})(Core);