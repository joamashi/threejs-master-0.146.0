(function(Core){
	Core.register('module_sizeguide', function(sandbox){
		var $this = $(this);
        var endPoint;
		var Method = {
			moduleInit:function(){
				var args = arguments[0];
				endPoint = Core.getComponents('component_endpoint');

				Method.viewSlide('SP_001');

				$this.find('[data-view-slide]').each(function(){
                    $(this).on('click', function(){
						//console.log($(this).data('view-slide'));
					});
				});

			},
			initEventListener:function(chgCode){
				/*sizeChart*/
				var $sizeCategory = $('#view_tgt').find('.size_category');
				var $sizeMenu = $sizeCategory.find('.size_menu');
				var $sizeSubMenu = $sizeMenu.find('.size_sub_menu');
				var $sizeCategoryItem = $sizeCategory.find('>li');
				var $sizeMenuItem = $sizeMenu.find('>li');
				var $sizeSubMenuItem = $sizeSubMenu.find('>li');

				$sizeCategoryItem.find('>a').on('click', function () {
					$sizeCategoryItem.removeClass('on');
					$(this).parent().addClass('on');
					$sizeMenu.hide();
					$(this).parent().find($sizeMenu).show();
					$sizeMenuItem.removeClass('on');
					$sizeSubMenuItem.removeClass('on');
					$(this).parent().find($sizeMenuItem).eq(0).addClass('on');
					$sizeSubMenu.hide();
					$(this).parent().find($sizeSubMenu).eq(0).show();
					if ($(this).parent().find('ul').hasClass('size_sub_menu')) {
						$sizeCategory.height($(this).parent().find($sizeMenu).outerHeight(true) + $(this).parent().find($sizeSubMenu).outerHeight(true));
					} else {
						$sizeCategory.height($(this).parent().find($sizeMenu).outerHeight(true));
					}
					return false;
				});
				$sizeMenuItem.find('>a').on('click', function () {
					$sizeMenuItem.removeClass('on');
					$sizeSubMenuItem.removeClass('on');
					$(this).parent().addClass('on');
					$sizeSubMenu.hide();
					$(this).next().show();
				});
				$sizeSubMenuItem.find('>a').on('click', function () {
					$sizeSubMenuItem.removeClass('on');
					$(this).parent().addClass('on');
				});
				/*table*/
				var $sizeTable = $('#view_tgt').find('.pop_size_table');
				var $sizeTd = $sizeTable.find('tbody td');
				var $sizeTheadTh = $sizeTable.find('thead th');
				var $sizeTdFirst = $sizeTable.find('tbody td').eq(0);
				$sizeTd.on({
					mouseenter: function () {
						var $tdIdx = $(this).index();
						$sizeTheadTh.eq($tdIdx).addClass('highlight');
						$(this).parent().prevAll().each(function () {
							$(this).find('td').eq($tdIdx - 1).addClass('highlight2');
						});
						$(this).prevAll('td').addClass('highlight2');
						$(this).parent().prev('tr').find('td.face-1').addClass('highlight2');
						$(this).parent().prevAll('tr').find('td.face-2').addClass('highlight2');
						$(this).parent().find('th').addClass('highlight');
						$(this).addClass('highlight');
					}, mouseleave: function () {
						var $tdIdx = $(this).index();
						$sizeTheadTh.eq($tdIdx).removeClass('highlight');
						$(this).parent().prevAll().each(function () {
							$(this).find('td').eq($tdIdx - 1).removeClass('highlight2');
						});
						$(this).prevAll('td').removeClass('highlight2');
						$(this).parent().prev('tr').find('td.face-1').removeClass('highlight2');
						$(this).parent().prevAll('tr').find('td.face-2').removeClass('highlight2');
						$(this).parent().find('th').removeClass('highlight');
						$(this).removeClass('highlight');
					}
				});
				/*tab*/
				var $sizeTab = $('#view_tgt').find('.tabbtn');
				var $tabcon = $('#view_tgt').find('.tabcon');
				$sizeTab.find('a').bind('click', function (e) {
					var tar = $(this).attr('href'); 
					$sizeTab.find('a').removeClass('active');
					$(this).addClass('active');
					$tabcon.hide();
					$('#view_tgt').find(tar).show();
					if (tar == '#chart1') {
						$sizeTab.find('.tabbar').stop().animate({ 'left': '0' }, 400);
					} else {
						$sizeTab.find('.tabbar').stop().animate({ 'left': '73px' }, 400);
					}
					return false;
				});
				/*bra table*/
				$(function () {
					$(".one_row td").mouseover(function () {
						$(".us-size").removeClass("highlight");
						$(".one_row").find(".us-size").addClass("highlight");
						$(".indi").removeClass("highlight2");
						$(".one_row .indi").addClass("highlight2");
						if ($(this).hasClass("indi")) {
							$(".col-1, .col-2").removeClass("highlight2");
							$(".one_row").find(".col-1, .col-2").addClass("highlight2");
						}
					});
					$(".two_row td").mouseover(function () {
						$(".us-size").removeClass("highlight");
						$(".two_row").find(".us-size").addClass("highlight");
						$(".indi").removeClass("highlight2");
						$(".two_row .indi").addClass("highlight2");
						if ($(this).hasClass("indi")) {
							$(".col-1, .col-2").removeClass("highlight2");
							$(".two_row").find(".col-1, .col-2").addClass("highlight2");
						}
					});
					$(".three_row td").mouseover(function () {
						$(".us-size").removeClass("highlight");
						$(".three_row").find(".us-size").addClass("highlight");
						$(".indi").removeClass("highlight2");
						$(".three_row .indi").addClass("highlight2");
						if ($(this).hasClass("indi")) {
							$(".col-1, .col-2").removeClass("highlight2");
							$(".three_row").find(".col-1, .col-2").addClass("highlight2");
						}
					});
					$(".four_row td").mouseover(function () {
						$(".us-size").removeClass("highlight");
						$(".four_row").find(".us-size").addClass("highlight");
						$(".indi").removeClass("highlight2");
						$(".four_row .indi").addClass("highlight2");
						if ($(this).hasClass("indi")) {
							$(".col-1, .col-2").removeClass("highlight2");
							$(".four_row").find(".col-1, .col-2").addClass("highlight2");
						}
					});
					$(".five_row td").mouseover(function () {
						$(".us-size").removeClass("highlight");
						$(".five_row").find(".us-size").addClass("highlight");
						$(".indi").removeClass("highlight2");
						$(".five_row .indi").addClass("highlight2");
						if ($(this).hasClass("indi")) {
							$(".col-1, .col-2").removeClass("highlight2");
							$(".five_row").find(".col-1, .col-2").addClass("highlight2");
						}
					});
					$(".indi").mouseover(function () {
						$(".indi_thead").addClass("highlight");
						$(".col-1, .col-2").removeClass("highlight2");
						$(this).addClass("highlight3");
						$(this).mouseleave(function () {
							$(".indi_thead").removeClass("highlight");
							$(".col-1, .col-2").removeClass("highlight2");
							$(this).removeClass("highlight3");
						});
					});
					$(".col-1").mouseenter(function () {
						$(".one_col").addClass("highlight");
						$(this).removeClass("highlight2");
						$(this).mouseleave(function () {
							$(".one_col").removeClass("highlight");
							$(".us-size").removeClass("highlight");
						});
					});
					$(".col-2").mouseenter(function () {
						$(".two_col, .col_head").addClass("highlight");
						$(".indi_thead").addClass("normal");
						$(this).removeClass("highlight2");
						$(this).mouseleave(function () {
							$(".two_col, .col_head").removeClass("highlight");
							$(".indi_thead").removeClass("normal");
							$(".us-size").removeClass("highlight");
						});
					});
				});
			},
			viewSlide:function(chgCode){
				$("#view_tgt").html($("#" + chgCode).html());
				Method.initEventListener(chgCode);
			}
		}

		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-sizeguide]',
					attrName:'data-module-sizeguide',
					moduleName:'module_sizeguide',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);