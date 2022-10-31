(function(Core, ui) {
	var template = '<div class="loading"><div class="dim"></div><div class="contents"><img src="/cmsstatic/theme/SNKRS/assets/images/preloader.gif" /><span class="comment">처리중 입니다.</span></div></div>';
	var $loading = $('body').append((function () {
		return $('#loading-icon-template').html();
	})() || template).find('.loading');
	
	function show() {
		$loading.focus();
		$loading.addClass('open');
	}
	function hide(){
		$loading.removeClass('open');
	}
	ui.loader = {
		show: show,
		hide: hide
	}
})(Core = window.Core || {}, Core.ui = window.Core.ui || {});