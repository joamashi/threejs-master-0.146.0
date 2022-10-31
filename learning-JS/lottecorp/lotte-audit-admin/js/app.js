!function($) {
	'use strict';

	window.myFunc = function () {
	
		let nav = {},
			modal = {},
			loader = {};
		
		/**
		 * 상단 네비게이션
		 * myFunc.nav(1depth, 2depth)
		 */
		nav = function (depth1, depth2) {		  
			
			let _nav = $('header nav'),
				_depth1 = _nav.find('> ul > li');
			
			_depth1.eq(depth1).addClass('active');
			_depth1.eq(depth1).find('ul > li').eq(depth2).find('a').addClass('active');

			_depth1.off().on('focusin mouseenter', function (e) {
				e.preventDefault();
				_depth1.removeClass('active');
				_depth1.eq(depth1).find('ul > li').eq(depth2).find('a').removeClass('active');
				$(this).addClass('active');
			});

			$('header').on('mouseleave', function (e) {
				e.preventDefault();
				_depth1.removeClass('active');
				_depth1.eq(depth1).addClass('active');
				_depth1.eq(depth1).find('ul > li').eq(depth2).find('a').addClass('active');
			});
		};

		/**
		 * 모달 팝업
		 * myFunc.modal.open('id');
		 * myFunc.modal.close('id');
		 */
		modal = function () {
			let open = {}, 
				close = {};
			
			open = function (id, zIndex) {
				if (zIndex) {
					$('.modal-backdrop').addClass('show').css('z-index', 1070);
					$('#' + id).addClass('show').css('z-index', 1080);
				} else {
					$('.modal-backdrop').addClass('show');
					$('#' + id).addClass('show');
				}
			}
		
			close = function (id, zIndex) {
				if (zIndex) {
					$('.modal-backdrop').css('z-index', 1040);
					$('#' + id).removeClass('show');
				} else {
					$('.modal-backdrop').removeClass('show');
					$('#' + id).removeClass('show');
				}
			}
		  
			return {
				open: open,
				close: close
			}
		}();

		/**
		 * 로딩 중 실행 : myFunc.loader.open();
		 * 로딩 중 중지 : myFunc.loader.close();
		 */
		loader = function () {
			let open = {}, 
				close = {};
			
			open = function () {
				$('.loader').addClass('show');
				$('.modal-backdrop').addClass('show');
			}
		
			close = function (id) {
				$('.loader').removeClass('show');
				$('.modal-backdrop').removeClass('show');
			}
		  
			return {
				open: open,
				close: close
			}
		}();
	
		return {
			nav: nav,
			modal: modal,
			loader: loader,
		}
	}();
}(jQuery);