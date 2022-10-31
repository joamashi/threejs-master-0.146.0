(function(Core){
	'use strict';

	Core.register('module_dynamicentity_board_comment', function(sandbox){
		var Method = {
			$that : null, 
			$commentContainer : null,
			dynamicName : null,
			storageId : null,
			moduleInit:function(){
				var args = Array.prototype.slice.call(arguments).pop();
				$.extend(Method, args);				

				Method.$that = $(this);
				Method.dynamicName = $(this).find('input[name="dynamicName"]').val();
				Method.storageId = $(this).find('input[name="storageId"]').val();
				Method.$commentContainer = $(this).find('#'+ Method.dynamicName + '-comment');


				// 쓰기
				$(this).find('#comment-submit').off('click').on('click', Method.write );
				// 삭제
				$(this).find('a.deleteComment').off('click').on('click', Method.checkRemove );
				// 비빌번호 확인 후 삭제
				$(this).find('a.checkPassword').off('click').on('click', Method.togglePasswordForm );

				//paging 
				$(this).find('.btn-pagination > .paging').off('click').on('click', Method.paging );
			},
			write:function(e){
				e.preventDefault();
				if ( $.trim($("#authorName").val()) == "") {
					UIkit.notify('작성자를 입력해주세요.', {timeout:3000,pos:'top-center',status:'danger'});
					$("#authorName").focus();
					return;
				}

				if ($.trim($("#comment").val()) == "") {
					UIkit.notify('글 내용을 입력해주세요.', {timeout:3000,pos:'top-center',status:'danger'});
					$("#comment").focus();
					return;
				}

				 if( _GLOBAL.CUSTOMER.ANONYMOUS ){
					if ( $.trim($("#authorPassword").val()) == "") {
						UIkit.notify('비밀번호를 입력해주세요', {timeout:3000,pos:'top-center',status:'danger'});
						$("#authorPassword").focus();
						return;
					}
				}

				var $form = $(this).closest($('form#commentForm'));

				sandbox.utils.ajax($form.attr('action'), 'POST', $form.serialize(), function(data){
					var data = $.parseJSON( data.responseText );
					if( data.result ){
						location.reload();
					}else{
						UIkit.notify(data.errorMsg, {timeout:3000,pos:'top-center',status:'danger'});
					}
				}, true)				
			},
			// 비빌번호 확인 후 삭제 -- 사용안함
			checkPassword:function(e){
				e.preventDefault();
				var $form = $(this).closest('form');
				UIkit.modal.prompt("Password:", '', function(data){
					if( $.trim(data) != ''){
						$form.find('input[name="password"]').val(data);
						Method.remove($form);
					}
				});
			},

			togglePasswordForm:function(){
				if( $(this).hasClass('cancel')){
					$(this).removeClass('cancel').text('삭제');
					$(this).closest('form').find('.password-confirm').addClass('uk-hidden');
				}else{
					$(this).addClass('cancel').text('취소');
					$(this).closest('form').find('.password-confirm').removeClass('uk-hidden');
				}
			},

			// 삭제 확인
			checkRemove:function(e){
				e.preventDefault();

				var $form = $(this).closest('form');

				sandbox.validation.init( $form );
				sandbox.validation.validate( $form );

				if( sandbox.validation.isValid( $form )){
					UIkit.modal.confirm("삭제 하시겠습니까?", function(){
						Method.remove($form);
					});
				}
				/*
				if( $(this).hasClass('password')){
					var password = $(this).closest('form').find('input[name="password"]');
					if ( $.trim( password.val() ) == "") {
						UIkit.notify('비밀번호를 입력해주세요.', {timeout:3000,pos:'top-center',status:'danger'});
						password.focus();
						return;
					}
				}
				*/
				
				
			},
			// 삭제
			remove:function($form){
				sandbox.utils.ajax($form.attr('action'), 'POST', $form.serialize(), function(data){
					var data = $.parseJSON( data.responseText );
					if( data.result ){
						location.reload();
					}else{
						UIkit.notify(data.errorMsg, {timeout:3000,pos:'top-center',status:'danger'});
					}
				}, true)
			},

			paging:function(e){
				e.preventDefault();
				if( $(this).hasClass('active') ){
					return;
				}
				var param = _.object($(this).attr('href').split('&').map(function(p){return p.split('=');}));
				var obj = {
					'name': Method.dynamicName,
					'mode':'template',
					'storageId' : Method.storageId,
					'page' : Number(param.page) || 1,
					'pageSize' : Method.pageSize || 5,
					'pageListSize' : Method.pageListSize || 5,
					'_sort' : 'dateCreated',
					'_type_sort' : 'desc',
					'pagetype' : 'comment',
					'paging' : true,
				}

				sandbox.utils.ajax('/processor/execute/dynamic', 'GET', obj, function(data){
					var list = data.responseText;
					if( list != '' && list != undefined && list != null ){
						// TODO 페이징 타입에 따라 밑에 붙이던지 replace하던지
						Method.$commentContainer.replaceWith($(list).find('.comment-list'));
						sandbox.moduleEventInjection(list);
					}else{
						UIkit.notify('Server Error', {timeout:3000,pos:'top-center',status:'danger'});
					}
				}, true)
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-dynamicentity-board-comment]',
					attrName:'data-module-dynamicentity-board-comment',
					moduleName:'module_dynamicentity_board_comment',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);