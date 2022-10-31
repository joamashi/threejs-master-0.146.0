(function(Core, ui) {
	var MID = 0;
	var ID_PREFIX = 'M_MODAL_';
	var ATTR_PREFIX = 'data-make-modal-';
	var DEFAULT_OPTION = {
		fullscreen: false,
		keyboard: true,
		bgclose: true,
		center: false,
		modal: false,
	}
	var DEFAULT_ALERT_OPTION = {
		bgclose: false,
		keyboard: false,
		modal: false,
		labels: {
			Ok: '확인',
			Cancel: '취소'
		}
	}
	var selector = {
		modalContent: '[data-wrap-modal-content]'
	}
	function getMergedDefaultOption(options) {
		return $.extend({}, DEFAULT_OPTION, options = options || {});
	}
	function getMergedAlertDefaultOption(options) {
		return $.extend({}, DEFAULT_ALERT_OPTION, options = options || {});
	}
	// 유효한 modal id 확인
	function getModalId(id){
		var mId = (typeof id == 'object') ? id.attr('id') : id;
		if (!_.startsWith(mId, '#')) {
			mId = '#' + mId;
		}
		return mId;
	}

	// 이벤트 적용
	function addEvent(modal, options){
		if (_.isFunction(options.show)) {
			modal.on({ 'show.uk.modal': options.show })
		}
		if (_.isFunction(options.hide)) {
			modal.on({ 'hide.uk.modal': options.hide })
		}
		modal.on({ 'hide.uk.modal': function() { 
			var target = this;
			setTimeout(function(){
				target.remove();
			},300)
		}})
		return modal;
	}

	// modal dom 생성 및 오픈
	function makeModal(html, options){
		MID++;
		UIkit.modal.dialog.template = '<div id="'+ ID_PREFIX+MID +'" class="uk-modal uk-make-modal"><div class="uk-modal-dialog"></div></div>';
		var modal = UIkit.modal.dialog($(([
			'<a class="uk-modal-close uk-close"></a>',
			'<div class="contents" data-wrap-modal-content="">' + html+ '</div>',
		]).join("")));
		var $dialog = $(modal.dialog);
		if (options.fullscreen == true) {
			$dialog.css('width', '100%');
			$dialog.addClass('uk-modal-dialog-blank');	
			$dialog.find(selector.modalContent).addClass('uk-height-viewport');
		}
		if (!_.isEmpty(options.width)) {
			$dialog.css('width', options.width );
		}
		openModal(modal, options);
		// 오픈을 안한 상태로 모듈 스크립트가 돌면 swife 에서 가로 사이즈를 정상적으로 인식 하지 못하는 경우가 생겨 순서를 바꿈
		// Core.moduleEventInjection(html);
	}

	// 이미 생성되어있는 modal 오픈
	function open(id, options){
		openModal(UIkit.modal($(getModalId(id))), getMergedDefaultOption(options));
	}
	
	function close(id) {
		UIkit.modal($(getModalId(id))).hide();
	}

	// ajax 통신후 오픈
	function ajax(url, options){
		var opt = getMergedDefaultOption(options);
		opt.isAjax = true;
		Core.Utils.ajax(url, opt.type || 'GET', opt.param || {}, function (data) {
			var appendHtml = '';
			if (_.isEmpty(opt.selector)) {
				appendHtml = data.responseText;
			} else {
				appendHtml = $(data.responseText).find(opt.selector).html();
			}
			if (_.isEmpty(appendHtml)) {
				alert('정보를 불러 올 수 없습니다.');
			}else{
				makeModal(appendHtml, opt);
			}
		}, true, false, 1500);
	}

	// 컨텐츠(HTML) 오픈
	function content(html, options){
		makeModal(html, getMergedDefaultOption(options));
	}

	function openModal(modal, options){
		/*
		 modal 안에서 다시 modal 이 뜰 경우 부모 modal 창 사이즈 안에서만 그려지는 오류로 인하여
		 오픈하기전 body에 다시 append 시키고 오픈한다.
		*/
		if (modal.element.length > 0) {
			var element = modal.element[0];
			var modalId = $(element).attr('id');
			var modalSelectorAttr = ATTR_PREFIX + modalId;
			$(element).attr(modalSelectorAttr, true);
			var elementHtml = element.outerHTML;
			if( options.isAjax ){
				// ajax 일 경우 원본 modal을 삭제
				element.remove();
			}else{
				// 이미 만들어져있던 modal 을 오픈하는 경우 원본은 유지하고 selector로 사용한 attribute 만 삭제
				element.removeAttribute(modalSelectorAttr);
			}
			$('body').append(elementHtml);
			uiKitModal = UIkit.modal($('['+modalSelectorAttr+']'));
			uiKitModal.options = options;
			addEvent(uiKitModal, options).show();
			Core.moduleEventInjection(elementHtml);
		}else{
			UIkit.modal.alert('팝업 정보가 올바르지 않습니다.');
		}
	}
	function alert(msg, options){
		var opt = getMergedAlertDefaultOption(options);
		var alert = UIkit.modal.alert(msg, opt);
		addEvent(alert, opt);
	}
	function confirm(msg, confirmCb, cancelCb, options) {
		var opt = getMergedAlertDefaultOption(options);
		var confirm = UIkit.modal.confirm(msg, confirmCb, cancelCb, opt);
		addEvent(confirm, opt);
	}
	ui.modal = {
		open: function (id, options) {
			return open(id, options);
		},
		close: function (id, options) {
			return close(id, options);
		},
		ajax: function (url, options) {
			return ajax(url, options);
		},
		content: function (html, options) {
			return content(html, options);
		},
		alert: function (message, options) {
			alert(message, options);
		},
		confirm: function (message, confirmCb, cancelCb, options) {
			confirm(message, confirmCb, cancelCb, options);
		}
	}
})(Core = window.Core || {}, Core.ui = window.Core.ui || {});