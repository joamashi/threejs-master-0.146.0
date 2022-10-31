(function(Core){
    Core.register('module_new_gnb', function (sandbox) {	  
              
       var $this;
       var scrollTemp = 0;
       
       var Method = {
          moduleInit: function () {
             $this = $(this);
 
             var didScroll;
             var lastScrollTop = 0;
             var delta = 5;
             var navbarHeight = $('[data-preheader-area]').outerHeight();            
             
             $(window).scroll(function (event) {
                didScroll = true;
             });
             
             setInterval(function () {
                if (didScroll) {
                   Method.hasScrolled();
 
                   didScroll = false;
                }
             },  1);
             
             $(window).resize(win_resize);            
             function win_resize(){
                 var win_w = $(window).outerWidth();
                 var body_w = $('html, body').outerWidth();
 
                 $('[data-module-new-gnb]').css('width', win_w);
                 $('.wrapper').css('width', win_w);
                 $('.footer-contents').css('width', win_w);
             }
 
             //Website 상단메뉴 활성화
             $('[data-menulink-area]').on('mouseenter', Method.gnbMenuOn);
             
             //Website 상단메뉴 비활성화
             $('[data-nkgnb-area]').on('mouseleave', Method.gnbMenuOff);
             
             //검색창 열기 및 검색
             $('[data-new-searcharea]').on('click', Method.searchSubmit);
             
             //검색창 닫기
             $('[data-new-searchclose]').on('click', Method.searchClose);
 
             //검색창 입력 시 발생되는 event
             $('[data-newsearch-input]').on('keyup', Method.searchKeyUp);
             
             //Mobile menu 활성화 event
             $('[data-btn-mobilemenu]').click(Method.mobileMenuActive);
             
             //MobileMenu 1depth -> 2depth  
             $('.next_depth').click(Method.mobileMenuFS);
 
             //MobileMenu 2depth -> 3depth 
             $('.nxt_dp').click(Method.mobileMenuST);
             
             //MobileMenu 2depth -> 1depth
             $('.depth2 .back_m_menu').click(Method.mobileMenuFirstBack);
             
             //MobileMenu 3depth -> 2depth
             $('.depth3 .back_m_menu').click(Method.mobileMenuSecondBack);
             
             //상단 로그인 후 자신의 이름 mouseenter 시 메뉴 활성화
             $('[data-user-dropmenu]').on('mouseenter',Method.signOnUserMenuOn);
             
             //상단 로그인 후 자신의 이름 mouseleave 시 메뉴 비활성화
             $('[data-user-dropmenu], [data-user-area]').on('mouseleave',Method.signOnUserMenuOff);
             
             //Mobile 다시 검색하기 기능
             $('.search_less_txt_link a').on('click',Method.searchSubmit);
             
             //검색어 삭제 버튼
             $('[data-searchclear-btn]').on('click',Method.searchClear);
             
             //mobile -> pc 로 이동시 mobile 관련된 메뉴 및 효과 비활성화
             $(window).resize(Method.mobileEffectOff);
             
             //검색어 삭제 버튼 hide 
             $('[data-searchclear-btn]').on('click',Method.searchHide);
             
             //dim close
             $('[data-dimd-area]').on('click',Method.dimClose);
             
             
                         
          },
          searchKeyUp:function(){
             var currentVal = $(this).val();
             if(currentVal == ''){
                $(this).parents('[data-searchiner-area]').siblings('[data-searchlist-area]').removeClass('active');
                Method.gnbSearchInit();
                $('[data-searchclear-btn]').hide();
             } else{ 
                $(this).parents('[data-searchiner-area]').siblings('[data-searchlist-area]').addClass('active');  
                $('[data-searchclear-btn]').show();                 
             } 
          },
          searchClose:function(){
             $(this).closest('[data-gnbsearchwrap-area]').removeClass('open');
             $('[data-preheader-area]').removeClass('hdn');
             $('.header h1').removeClass('top');
             $('[data-dimd-area]').removeClass('on');
             $('html, body').removeClass('not_soroll');
             $('[data-searchlist-area]').removeClass('active');
             $("[data-newsearch-input]").val('');
             $('.pre_clear_btn').css('display', 'none');
             Method.gnbSearchInit();
          },
          getParameterByName:function(name){
             name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
              var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                      results = regex.exec(location.search);
              return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
          },
          PopularSearchSave:function(){
             var isPopularSearch = $('[data-search-area]').find('li').is('[data-popular-search]');
             if(isPopularSearch){
                sessionStorage.setItem('PopularSearch', $('[data-popular-search]').parents().html());
             }            
          },
          getPopularSearch:function(){
             return sessionStorage.getItem("PopularSearch");
          },
          gnbSearchInit:function(){
             var gnbBaseHtml = "";
             $('[data-searchlist-area]').find('p').css("display","block");
             $('[data-search-area]').empty();
             $('#ui-id-1').empty()
             $('[data-search-area]').html(Method.getPopularSearch());
          },
          gnbIsSearchList:function(){
             var result = true;
             var gnbSearchResult = $('#ui-id-1').html();
             if($.trim($('#ui-id-1').html())==''){
                result = false;   
             }
             return result;
          },
          hasScrolled:function(){
             var scroll = $(window).scrollTop(); 						//스크롤 최상단
             var pre_height =  $('[data-preheader-area]').outerHeight(); //고객센터 위치
             var all_h = $('.kr_nike').outerHeight(); 					// GNB 전체영역
             var sec_top = $('.section-header').length ? $('.section-header').offset().top : 0;
                          
             if(scroll >= sec_top){
                $('.section-header').addClass('fixed');
             }
 
             if (scroll > scrollTemp && scroll > 36 ) {
                $('.header').removeClass('reset');
                $('.header').addClass('nav_up');
                $('.header').removeClass('fixed');
                $('.section-header').removeClass('sticky');
             } else {
                if (scroll <= pre_height) {
                   $('.header').removeClass('fixed');
                   $('.header').removeClass('nav_up');
                   $('.section-header').removeClass('fixed');
                   $('.section-header').removeClass('sticky');
                   
                } else  if(scroll < scrollTemp ){
                   $('.header').removeClass('reset');
                   $('.header').removeClass('nav_up');
                   $('.header').addClass('fixed');
                   $('.section-header').addClass('sticky'); 
                }
             } 
             if(scroll <= 0){
                 $('.header').addClass('reset');
                 $('.header').removeClass('nav_up');
                 $('.header').removeClass('fixed');
             }
             scrollTemp = scroll 
          },
          searchSubmit:function(){
             var gnbSeatText = $("[data-newsearch-input]").val();
             var searchCheck = false;
             var searchValidate = false
             var searchClickTarget = false
             var searchName = Method.getParameterByName('q');
             var searchNameValidate = false
             
             //검색어 Validate
             if (((typeof gnbSeatText != "undefined") && (typeof gnbSeatText.valueOf() == "string")) && (gnbSeatText.length > 0) && gnbSeatText.trim() != '') {
                searchValidate = true;
             }
             
             //검색 클릭에 대한 target을 확인하여 svg,button의 target 대상만 submit 가능 
             if(event.target.nodeName == 'SPAN' || event.target.nodeName == 'BUTTON'){
                searchClickTarget = true;
             }
             
             //입력된 검색어에 대한 PLP화면에서 다시 검색창을 띄울때 검색되지 않게 설정 
             if( searchValidate && $('[data-gnbsearchwrap-area]').hasClass('open') == false && searchClickTarget){
                searchCheck = true;
             }
             
             /**
              * 검색창 닫기
              * 1. 검색어 입력창에 검색어 없는 경우
              * 2. 이미 검색한 결과가 존재하는 경우 
              * @returns
              */
             if((searchName == gnbSeatText) && searchName.trim() != '' && gnbSeatText.trim() != ''){
                searchNameValidate = true;
             }
             if(((!searchValidate && $('[data-gnbsearchwrap-area]').hasClass('open') == true) ||
                   ( searchValidate && $('[data-gnbsearchwrap-area]').hasClass('open') == true) && searchNameValidate) && searchClickTarget){
                // 입력된 검색어에 대한 PLP화면에서 검색창 화면에 동일한 검색어가 존재하는 경우 검색 클릭 시 닫기
                // 단,지웠다가 동일한 검색어를 다시 입력한 경우 검색이 가능하다.
                if(!Method.gnbIsSearchList()){
                   $(this).closest('[data-gnbsearchwrap-area]').removeClass('open');
                   $('[data-preheader-area]').removeClass('hdn');
                   $('.header h1').removeClass('top');
                   $('[data-dimd-area]').removeClass('on');
                   $('html, body').removeClass('not_soroll');
                   $('[data-searchlist-area]').removeClass('active');
                   return;
                }                  
             }
             
             $('[data-gnbsearchwrap-area]').addClass('open');
             $('[data-preheader-area]').addClass('hdn');
             $('.header h1').addClass('top');
             $('html, body').addClass('not_soroll');
             $("[data-newsearch-input]").focus();   
             if($(window).width() > 960){
                 $('[data-dimd-area]').addClass('on');	
             } 
 
             $('[data-dimd-area]').click(function(){
                $('[data-gnbsearchwrap-area]').removeClass('open');
                $('[data-dimd-area]').removeClass('on');
                $('[data-preheader-area]').removeClass('hdn');
                $("[data-newsearch-input]").val('');
                $('.pre_clear_btn').css('display', 'none');
                Method.gnbSearchInit();
             });
             
             //검색창이 활성화 된 상태에서만 검색 가능
             if(searchValidate && $('[data-gnbsearchwrap-area]').hasClass('open') == true && !searchCheck && searchClickTarget){
                
                $('#search-form').submit();
             }
             
             //Default 검색어 저장            	
                Method.PopularSearchSave();
 
             
          },
          mobileMenuActive:function(){
             $('[data-mobilemenu-area]').addClass('open');
             $('[data-dimd-area]').addClass('on');
             $('.header').addClass('hdn');
             $('html, body').addClass('not_soroll');
             $('html, body').css('overflow-y', 'hidden');
             $('[data-header-area]').removeClass('nav_up');
 
             $('[data-dimd-area]').click(function(){
                $('[data-mobilemenu-area]').removeClass('open');
                $('.mobile_menu_panel').removeClass('view');
                $('[data-mobilemenuinner-area]').removeClass('rotate');
                $('[data-dimd-area]').removeClass('on');
                $('.header').removeClass('hdn');
                $('[data-mobilemenuinner-area]').find('.mobile_menu_panel').removeClass('rotate');
                $('html, body').removeClass('not_soroll');
                $('html, body').removeAttr('style');
             });          
             $('.mobile_menu').animate({ scrollTop : '0' }, 0);
          },
          mobileMenuFS:function(){
             $(this).closest('[data-mobilemenuinner-area]').addClass('rotate');  
             $(this).parent('li').addClass('on').siblings().removeClass('on');
          },
          mobileMenuST:function(){
             $(this).parent().parent().parent().parent('.depth2').addClass('rotate');
          },
          mobileMenuFirstBack:function(){
             $(this).closest('li').removeClass('open');      
             $(this).parent().parent().parent().parent().parent().removeClass('rotate');
          },
          mobileMenuSecondBack:function(){
             $(this).closest('li').removeClass('open');                  
             $(this).parents('.depth2').removeClass('rotate');
          },
          signOnUserMenuOn:function(){
             $(this).addClass('open');
          },
          signOnUserMenuOff:function(){
             $(this).removeClass('open');
          },
          mobileEffectOff:function(){
             if($(window).width() > 960) {
             // $('[data-dimd-area]').removeClass('on');
                $('[data-mobilemenu-area]').removeClass('open'); 
             // $('html, body').removeClass('not_soroll'); 
                $('.header').removeClass('hdn');
             }                     
             
          },
          gnbMenuOn:function(){
             $(this).parent().addClass('active').siblings().removeClass('active');
             $('[data-dimd-area]').addClass('on');
          },
          gnbMenuOff:function(){
             $(this).find('ul li').removeClass('active');
             $('[data-dimd-area]').removeClass('on');           
          },
          searchClear:function(){
              $("[data-newsearch-input]").val('').focus();
              $("[data-searchclear-btn]").hide();
              Method.gnbSearchInit();
          },
          dimClose:function(){
              $('[data-dimd-area]').removeClass('on');  
          }
          
       }
 
       return {
          init: function () {
             sandbox.uiInit({
                selector: '[data-module-new-gnb]',
                attrName: 'data-module-new-gnb',
                moduleName: 'module_new_gnb',
                handler: { context: this, method: Method.moduleInit }
             });
          }
       }
    });
 })(Core);