(function(Core){
	'use strict';
	Core.register('module_snkrs_polling', function (sandbox) {
		var $this, args, $form, pollingId, fadeEffectClass, activeClass, activeTargetClass, numberClass, numberEffectClass, $answer1Zone, $answer2Zone, answer1Rate, answer2Rate;
		var Method = {
			moduleInit: function () {
				console.log('init');
				$this = $(this);
				args = arguments[0];
				pollingId = args;
				fadeEffectClass = $(this).attr("fade-effect-class");
				activeClass = $(this).attr("active-class");
				activeTargetClass = $(this).attr("active-target-class");
				numberClass = $(this).attr("number-class");
				numberEffectClass = $(this).attr("number-effect-class");
				$this.find('[module-snkrs-polling-answer]').on('click', Method.submitAnswer);
				
				$answer1Zone = $this.find('[module-snkrs-polling-answer1]');
				$answer2Zone = $this.find('[module-snkrs-polling-answer2]');
				try {
					if ($answer1Zone != null) {
						answer1Rate = Number($answer1Zone.attr("module-snkrs-polling-answer1"));
						answer2Rate = Number($answer2Zone.attr("module-snkrs-polling-answer2"));
					}
				} catch(ex) {
					console.log(ex);
				}
			},
			submitAnswer: function(e) {
				var issignin = $(this).parent('div').data('issignin');
				if(issignin == false){
					var isRequiredLogin = $(this).parent('div').data('required-login') || false;	
					if(isRequiredLogin){
						$('#login-info-polling-modal').find('[data-link-target]').attr('href', Core.Utils.contextPath+'/login?successUrl='+String(window.location.pathname).replace(Core.Utils.contextPath,''));
						Core.ui.modal.open('login-info-polling-modal', { modal:false});
						return; 
					}
				}
				var answer = $(this).attr('module-snkrs-polling-answer');
				$(this).addClass(fadeEffectClass);
				var polling = $(this).parent('div');
				$(this).parent().next('.'+activeTargetClass).addClass(activeClass);
				var pollingNumEffect = $(this).parent().next('.'+numberClass);
		        setTimeout(function(){pollingNumEffect.addClass(numberEffectClass);},1000);
		        setTimeout(function(){
		        	polling.addClass(activeClass);
			        //투표응답 비율은 Max 85 : 15
			        if( answer1Rate != 100 && answer1Rate >= 85) { 
			        	answer1Rate = 85;
			        }
			        if( answer1Rate != 100 && answer1Rate !=0 && answer1Rate <= 15) {
			        	answer1Rate = 15;
			        }
			        if( answer2Rate != 100 && answer2Rate >= 85) {
			        	answer2Rate = 85;
			        }
			        if( answer2Rate != 100 && answer2Rate !=0 && answer2Rate <= 15) {
			        	answer2Rate = 15;
			        }
			        
			        if(answer1Rate != 0){
			        	$answer1Zone.css( { 'width': 'calc('+answer1Rate+'% - 1px)' });
			        }
			        if(answer2Rate != 0){
			        	$answer2Zone.css( { 'width': 'calc('+answer2Rate+'% - 1px)' });
			        }
					
			        if (answer1Rate == 100) {
			        	$answer1Zone.addClass('poll-full');
			        }
			        if (answer1Rate == 0) {
			        	$answer1Zone.css( { 'opacity': '0' });
			        }
			        if (answer2Rate == 100) {
			        	$answer2Zone.addClass('poll-full');
			        }
			        if (answer2Rate == 0) {
			        	$answer2Zone.css( { 'opacity': '0' });
			        }
			        
			        if (answer1Rate > answer2Rate && answer2Rate != 0) {
			        	$answer1Zone.addClass('selected');
			        	$answer2Zone.addClass('not-selected');
			        }
			        if (answer2Rate > answer1Rate && answer1Rate != 0) {
			        	$answer1Zone.addClass('not-selected');
			        	$answer2Zone.addClass('selected');
			        }
			        if (answer2Rate == answer1Rate) {
			        	$answer1Zone.addClass('selected');
			        	$answer2Zone.addClass('selected');
			        }
		        },1000);
		        setTimeout(function(){ 
		        	if(polling.hasClass(activeClass)){
			        	$('[polling-answer-'+answer+']').removeClass('bg');
			        }
		        },1000);
		        
		       
				$this.find('[module-snkrs-polling-answer]').off('click');
				
		        var url = sandbox.utils.contextPath +"/polling/apply";
		        var params = {
		        	pollingId : pollingId,
		        	answer : answer
        		};

				Core.Utils.ajax(url, 'GET', params, function (data) {
					var resultData = data.responseJSON;
					if (resultData.code != '0') {
						UIkit.modal.alert(resultData.message);
					}
				});
			},
			
		}
		return {
			init: function () {
				sandbox.uiInit({
					selector: '[data-module-snkrs-polling]',
					attrName: 'data-module-snkrs-polling',
					moduleName: 'module_snkrs_polling',
					handler: { context: this, method: Method.moduleInit }
				});
			}
		}
	});
})(Core);