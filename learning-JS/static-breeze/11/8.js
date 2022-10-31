(function(Core){
	Core.register('module_launchproduct', function(sandbox){
		var $that;
		// var arrViewLineClass=['uk-width-medium-1-3', 'uk-width-large-1-2', 'uk-width-large-1-3', 'uk-width-large-1-4', 'uk-width-large-1-5'];
		var Method = {
			moduleInit:function(){
				$this = $(this);
				var args = {};
				args.skudata = $(this).find("[data-sku]").data("sku");
				$(this).find("[data-sku]").remove();

                //상품정보 스크롤 이동
                var _conH = $('.lc-prd-conts .product-info').height();
                var _conBox = $('.lc-prd-conts .lc-prd-images').height();
                var _winH = $(window).height();
                var _conOT = $('.lc-prd-conts').offset().top;
                var _winST = $(window).scrollTop();
				var _pt = (_winH - _conH)/3;

				//사이즈 셀렉트 수정
				var widthMatch = matchMedia("all and (max-width: 767px)");
				if (Core.Utils.mobileChk || widthMatch.matches) {
					$this.find('#selectSize').on('change', function(){
						var option = $('#selectSize option:selected').text();
						$(this).prev('label').text(option);
					});
				}

				/*
				// 당일배송 자세히보기 버튼
				$this.find('[data-btn-samedaymodal]').click(function(e){
					var samedayModal = UIkit.modal('#detail-sameday', {modal: false, center:false});
					samedayModal.show();
					samedayModal.find('.uk-close').click(function(e){
						samedayModal.hide();
					});
					return false;
				});
				*/

				// THE DRAW Count Down
				var certificationYnModal = UIkit.modal('#certification-yn-modal', {center:true, bgclose:false, keyboard:false});
				certificationYnModal.hide();
				if($('[data-thedrawend]').length === 1){
					var startTime = $('[data-currentdate]').data("currentdate");
				  var endTime = $('[data-thedrawend]').data("thedrawend");
					startTime = String(startTime);
					endTime = String(endTime);
					console.log(startTime);
					console.log(endTime);
					var startDate = new Date(parseInt(startTime.substring(0,4), 10),
					         parseInt(startTime.substring(4,6), 10)-1,
					         parseInt(startTime.substring(6,8), 10),
					         parseInt(startTime.substring(8,10), 10),
					         parseInt(startTime.substring(10,12), 10),
					         parseInt(startTime.substring(12,14), 10)
					        );
					var endDate   = new Date(parseInt(endTime.substring(0,4), 10),
					         parseInt(endTime.substring(4,6), 10)-1,
					         parseInt(endTime.substring(6,8), 10),
					         parseInt(endTime.substring(8,10), 10),
					         parseInt(endTime.substring(10,12), 10),
					         parseInt(endTime.substring(12,14), 10)
					        );
					var dateGap = endDate.getTime() - startDate.getTime();
					var timeGap = new Date(0, 0, 0, 0, 0, 0, endDate - startDate);
					var diffDay  = Math.floor(dateGap / (1000 * 60 * 60 * 24)); // 일수
					var diffHour = timeGap.getHours();       // 시간
					var diffMin  = timeGap.getMinutes();      // 분
					var diffSec  = timeGap.getSeconds();      // 초

					jQuery(function ($){
					    var twentyFourHours = diffHour * 60 * 60;
							var twentyFourMin = diffMin * 60;
					    var display = $('.draw-date>dd');
					    Method.timer((diffDay * 24 * 60 * 60)+twentyFourHours+twentyFourMin+diffSec, display);
					});

					$.removeCookie('thedrawCertified');
					$.removeCookie('thedrawRedirectUrl');
					$.removeCookie('thedrawCertified', { path: '/' });
					$.removeCookie('thedrawRedirectUrl', { path: '/' });
				}

				// THE DRAW 참여여부
				/* @pck 2020-07-31 draw 응모여부 확인 후 미응모 시 Draw응모버튼 활성화 */
				var isDisabled = false;
				var btnEntryDraw = $('[action-type="drawentry"]');
				if(btnEntryDraw !== null){
					isDisabled = $(btnEntryDraw).hasClass('disabled');
					if(isDisabled){
						Core.Loading.show();
					}
				}

				var skuId = 111;
				var productId = $("[data-product-id]").data("product-id");
				var theDrawId = $("[data-thedrawid]").data("thedrawid");
				var redirectUrl = $(location).attr('href');
				var drawurl = sandbox.utils.contextPath + '/theDraw/entry/isWin';

				//@pck 2020-10-14 draw 응모 여부는 로그인 후 확인 가능한 것으로 변경
				var isLogin = false;
					if( _GLOBAL.CUSTOMER.ISSIGNIN) isLogin = true;

				if($('[data-thedrawend]').length === 1 && isLogin){
					BLC.ajax({
						type : "POST",
						dataType : "json",
						url : drawurl,
						data : {
							prodId : productId,
							theDrawId : theDrawId,
							skuId : skuId,
							redirectUrl : redirectUrl
						}
					},function(data){
						if(data.result) {
							Core.Loading.hide();
							if(data.winFlag == "win" || data.winFlag == "lose") {
								$('[data-module-product]').remove();
								$('.btn-box').append('<span class="btn-link xlarge btn-order disabled" style="cursor:default">THE DRAW 응모완료</span>');
							}
							if(data.winFlag == "notEntry"){
								var btnEntryDraw = $('[action-type="drawentry"]');
								$(btnEntryDraw).removeClass('disabled');

								$(btnEntryDraw).on('click', function (){
									$(this).addClass('disabled');
									Core.Loading.show();
									Method.drawEntryAjax();
								});
							}
						}else{
							Core.Loading.hide();
							//UIkit.modal.alert(data.errorMessage);
							console.log(data.errorMessage);
						}
					});
				}

				// THE DRAW 당첨자 확인 Start
				$this.find("#btn-drawiswin").click(function(e){
					e.preventDefault();
					$('.uk-modal .draw-entry').find('.attention>p>a').click(function(){
						$(this).parents('p').next('div').toggle();
						return;
					});
					BLC.ajax({
						type : "POST",
						dataType : "json",
						url : drawurl,
						data : {
							prodId : productId,
							theDrawId : theDrawId,
							skuId : skuId,
							redirectUrl : redirectUrl
						}
					},function(data){
						if(data.result) {
							if(data.winFlag == "win") {
							    $('#theDrawBuyForm').attr('productId', data.productId);
							    $('#theDrawBuyForm').attr('fType', data.fType);
							    $('#theDrawBuyForm').attr('quantity', data.quantity);
							    $('#theDrawBuyForm').attr('SIZE', data.SIZE);
							    $('#theDrawBuyForm').attr('itemAttributes', data.itemAttributes);
							    $('#theDrawBuyForm').attr('attributename', data.attributename);

								//더드로우 용 attributename 추가.
								$('#theDrawBuyForm').attr('draw_itemAttributes', data.theDrawEntryId);

								UIkit.modal('#draw-win-modal', {modal:false}).show();
								//$('#draw-win-modal').find('#directOrder').attr('href',data.drawProductUrl);
							}
							else if(data.winFlag == "lose") {
								UIkit.modal('#draw-lose-modal', {modal:false}).show();
							}
							else if(data.winFlag == "notEntry") {
								UIkit.modal('#draw-notentry-modal', {modal:false}).show();
							}
						}
					});
				});
				// THE DRAW 당첨자 확인 End

				// 재입고알림 click area 변경
				$('[data-restock]').find('[data-click-area]').attr('data-click-area','snkrs');

				//excute component_gallery
				sandbox.getComponents('component_gallery', {context:$this}, function(i){
					//excuted js
				});

				//입고알림 문자받기 show or hide
				Method.displayRestockAlarm(args);
			},
			timer:function(duration, display) {
				var timer = duration, hours, minutes, seconds;
				setInterval(function () {
					hours = parseInt((timer / 3600), 10);
					minutes = parseInt((timer / 60) % 60, 10)
					seconds = parseInt(timer % 60, 10);

					hours = hours < 10 ? "0" + hours : hours;
					minutes = minutes < 10 ? "0" + minutes : minutes;
					seconds = seconds < 10 ? "0" + seconds : seconds;

					display.text(hours + ":" + minutes + ":" + seconds);
					st = hours + ":" + minutes + ":" + seconds;
					if (st == "00:00:00") {
						return;
					}
					--timer;
				}, 1000);
			},
			displayRestockAlarm:function(args){
				if(args && undefined != args.skudata){
					for(var index = 0; args.skudata.length > index; index++){
						if(0==args.skudata[index].quantity){
							//enable 입고알림문자받기
							$('#set-restock-alarm').show();
							return;
						}
					}
				}
			},
			drawEntryAjax:function () {
				var $productModule = $("[data-module-product]");
				var option = $productModule.find('.hidden-option').val();
				var infoAgree = $productModule.find('[name="infoAgree"]').is(':checked');
				var smsAgree = $productModule.find('[name="smsAgree"]').is(':checked');

				if(infoAgree == null) infoAgree = false;
				if(smsAgree == null) smsAgree = false;

				if(!infoAgree){
					$productModule.find('.opt-tit>.msg').addClass('msg-on').text('개인정보 수집 및 이용에 동의해주세요.');
					$productModule.find('#checkTerms').addClass('error');
					$('[action-type="drawentry"]').removeClass('disabled');
					Core.Loading.hide();
				}else if(option == 'undefined' || option == '') {
					$productModule.find('.opt-tit>.msg').addClass('msg-on').text('사이즈를 선택해 주세요.');
					$('[action-type="drawentry"]').removeClass('disabled');
					Core.Loading.hide();
				}else{
					var productId = $("[data-product-id]").data("product-id");
					var theDrawId = $("[data-thedrawid]").data("thedrawid");
					var redirectUrl = $(location).attr('href');
					var drawurl = sandbox.utils.contextPath + '/theDraw/entry';
					var thedrawproductxref = $productModule.find('#selectSize').find("option:selected").data("thedrawproductxref");
					var thedrawskuxref = $productModule.find('#selectSize').find("option:selected").data("thedrawskuxref");

					BLC.ajax({
						type : "POST",
						dataType : "json",
						url : drawurl,
						data : {
							prodId : productId,
							theDrawId : theDrawId,
							skuId : option,
							redirectUrl : redirectUrl,
							thedrawproductxref : thedrawproductxref,
							thedrawskuxref : thedrawskuxref,
							infoAgree : infoAgree,
							smsAgree : smsAgree
						}
					},function(data){
						if(data.result == true){
							var entryTrue = $('#draw-entryTrue-modal');
							UIkit.modal(entryTrue, {modal:false}).show();
							$('[data-module-product]').remove();
							$('.btn-box').append('<span class="btn-link xlarge btn-order disabled" style="cursor:default">THE DRAW 응모완료</span>');
							entryTrue.find('.attention>p>a').click(function(){
								$(this).parents('p').next('div').toggle();
								return;
							});
							$('[action-type="drawentry"]').removeClass('disabled');
							Core.Loading.hide();
						} else{
							Core.Loading.hide();
							$('[action-type="drawentry"]').removeClass('disabled');
							UIkit.modal.alert(data.errorMessage);
						}
					});
				}
			},
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-launchproduct]',
					attrName:'data-module-launchproduct',
					moduleName:'module_launchproduct',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);