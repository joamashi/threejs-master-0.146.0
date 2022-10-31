var UI_SNKRS = function () {
    var snkrs;

    //Selectors
    var snkrsVariables,
        snkrsListItems, filterMenu,
        snkrsPDPGallery, snkrsPDPGallerySwiper, snkrsPDPFullscreenSwiper,
        btnMobileGnb, btnToggleListMode,
        mobileGnbElement, mainLayoutOverlay, contentWrapper;

    function querySelector(querySelectorName){
        if(querySelectorName == null || querySelectorName == "" || typeof querySelectorName == "undefined") return false;
        var tmpElement = document.querySelectorAll(querySelectorName);
        if(tmpElement.length > 0){
            if(tmpElement.length == 1){
                return tmpElement[0];
            }else {
                return tmpElement; //배열로 리턴
            }
        }
        return false;
    }

    function setLocalStorage(key, value){
        if( typeof localStorage == 'undefined' || localStorage == null) return false;
        localStorage.setItem(key, value);
    }
    function getLocalStorage(key){
        if( typeof localStorage == 'undefined' || localStorage == null) return false;
        return localStorage.getItem(key);
    }

    function changeListType(type, listItemsArray){

        if(listItemsArray == null) return false;

        var listType = 'grid'; //기본 선택 값 grid
        if(type !== null || type !== ''){
            listType = type;
        }

        // grid class 변경
        if(listItemsArray.length > 0){
            switch (listType){
                case 'feed' :
                    //Feed type 처리 부
                    for( i = 0; i < listItemsArray.length; i++ ){
                        listItemsArray[i].classList.remove('pb2-sm', 'va-sm-t', 'ncss-col-sm-6', 'ncss-col-md-3', 'ncss-col-xl-2', 'prl1-sm', 'grid-type');
                        listItemsArray[i].classList.add('pb2-sm', 'va-sm-t', 'ncss-col-sm-12', 'ncss-col-md-6', 'ncss-col-lg-4', 'pb4-md', 'prl0-sm', 'prl2-md', 'ncss-col-sm-6', 'ncss-col-lg-3', 'pb4-md', 'prl2-md','pl0-md', 'pr1-md');
                    }
                    break;
                case 'grid' :
                    //Grid type 처리부
                    for( i = 0; i < listItemsArray.length; i++ ){
                        listItemsArray[i].classList.remove('pb2-sm', 'va-sm-t', 'ncss-col-sm-12', 'ncss-col-md-6', 'ncss-col-lg-4', 'pb4-md', 'prl0-sm', 'prl2-md', 'ncss-col-sm-6', 'ncss-col-lg-3', 'pb4-md', 'prl2-md','pl0-md', 'pr1-md');
                        listItemsArray[i].classList.add('pb2-sm', 'va-sm-t', 'ncss-col-sm-6', 'ncss-col-md-3', 'ncss-col-xl-2', 'prl1-sm', 'grid-type');
                    }
                    break;
            }
        }
    }

    try {
        snkrs = {
            init : function (){
                snkrsVariables = querySelector("form[name=snkrsVariables]") ? querySelector("form[name=snkrsVariables]") : null;
                filterMenu = querySelector(".filters-menu .nav-items a.custom-link") ? querySelector(".filters-menu .nav-items a.custom-link") : null;

                //PDP 부
                snkrsPDPgallery = querySelector('[data-component-gallery]') ? querySelector('[data-component-gallery]') : null;

                //모바일 gnb 버튼 부
                btnMobileGnb = querySelector("[data-snkrs-ui-mobile-nav-button]") ? querySelector("[data-snkrs-ui-mobile-nav-button]") : null; //mobile GNB Button
                mainLayoutOverlay = querySelector(".main-layout .content-overlay") ? querySelector(".main-layout .content-overlay") : null; //mobile main overlay

                mobileGnbElement = querySelector("[data-module-mobilegnb]") ? querySelector("[data-module-mobilegnb]") : null; //mobile GNB Element
                contentWrapper = querySelector(".main-layout .content-wrapper") ? querySelector(".main-layout .content-wrapper") : null; //content wrapper

                btnToggleListMode = querySelector("[data-snkrs-ui-toggle-listmode]") ? querySelector("[data-snkrs-ui-toggle-listmode]") : null; //mobile GNB Button

                var listType = getLocalStorage('listType');
                //저장된 값이 있을 때 grid 타입 설정
                if(listType !== null){
                    switch (listType){
                        case 'feed' :
                            snkrs.GNB.toggleGridMode('feed');
                            break;
                        case 'grid' :
                            snkrs.GNB.toggleGridMode('grid');
                            break;
                    }
                }else{
                    setLocalStorage('listType', 'feed'); //최초 생성 값 'feed'
                }

                //모바일 GNB Toggle
                if(btnMobileGnb !== null){
                    btnMobileGnb.addEventListener("click", function(){
                        snkrs.GNB.toggleMobileGnb();
                    });
                }
                if(mainLayoutOverlay !== null){
                    mainLayoutOverlay.addEventListener("click", function(){
                        snkrs.GNB.toggleMobileGnb();
                    });
                }

                //토글 버튼
                if(btnToggleListMode !== null){
                    btnToggleListMode.addEventListener("click", function(){
                        var listType = 'grid';
                        if(getLocalStorage('listType') !== ''){
                            listType = getLocalStorage('listType') == 'feed' ? 'grid' : 'feed';
                        }
                        snkrs.GNB.toggleGridMode(listType);
                    });
                }

                //PDP sticky init
                this.PDP.scrollSticky();

                //PDP Gallery Swiper init
                if(snkrsPDPgallery !== null){
                    if(snkrsPDPgallery.length > 0){ // 다중 케이스 ex) mini PDP
                        for(var i = 0; i < snkrsPDPgallery.length ; i++){
                            this.PDP.initGallerySwiper(snkrsPDPgallery[i]);
                        }
                    }else{
                        this.PDP.initGallerySwiper(snkrsPDPgallery);
                    }
                }

                //PDP - Mobile Size SelectBox
                var snkrsPDPSizeSelectBox = querySelector('[data-brz-components-type=SIZE]') ? querySelector('[data-brz-components-type=SIZE]') : null;
                this.PDP.focusSelectBox(snkrsPDPSizeSelectBox);
            },
            VALUE : {
              getGallerySwiper : function (){return snkrsPDPGallerySwiper;},
              setGallerySwiper : function (swiper){snkrsPDPGallerySwiper = swiper;},
              getFullscreenSwiper : function (){return snkrsPDPFullscreenSwiper;},
              setFullscreenSwiper : function (swiper){snkrsPDPFullscreenSwiper = swiper;}
            },
            UTIL : {
                isMobile : function (){
                    var isMobileMatche = false;

                    if(window.matchMedia !== null){
                        isMobileMatche = window.matchMedia('only screen and (max-width: 1024px)').matches;
                    }

                    return isMobileMatche;
                },
                getScrollbarWidth : function (){
                    var scrollDiv = document.createElement("div");
                        scrollDiv.className = "scrollbar-measure";

                    document.body.appendChild(scrollDiv);

                    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                    return scrollbarWidth;

                    document.body.removeChild(scrollDiv);
                },
                getScrollTop : function (){
                    var documentEl = document.documentElement;
                    var _left = (window.pageXOffset || documentEl.scrollLeft) - (documentEl.clientLeft || 0);
                    var _top = (window.pageYOffset || documentEl.scrollTop)  - (documentEl.clientTop || 0);
                    return {left : _left, top : _top};
                }
            },
            GNB : {
                toggleMobileGnb : function (){
                    if(btnMobileGnb == null) return false;
                    if(mainLayoutOverlay == null) return false;
                    if(mobileGnbElement == null) return false;
                    if(contentWrapper == null) return false;

                    var bodyElement = querySelector("body") ? querySelector("body") : null;

                    if( mobileGnbElement.classList.contains("show") ){
                        mobileGnbElement.classList.remove("show");
                        mainLayoutOverlay.classList.add("hide");
                        contentWrapper.classList.remove("hide");
                        bodyElement.classList.remove("no-scroll");
                    } else { //모바일 GNB Show
                        mobileGnbElement.classList.add("show");
                        mainLayoutOverlay.classList.remove("hide");
                        mainLayoutOverlay.classList.remove("hide");
                        contentWrapper.classList.add("hide");
                        bodyElement.classList.add("no-scroll");
                    }
                },
                toggleGridMode : function (type){ // listMode : 'feed' or 'grid'
                    if(btnToggleListMode == null) return false;
                    snkrsListItems = querySelector("[data-component-launchitem]") ? querySelector("[data-component-launchitem]") : null; //SNKRS category list items;

                    if(snkrsListItems == null) return false;

                    var listType = 'grid'; //최초 설정값 'feed' 상태에서 변경될 최초 대상 값 grid
                    if(type !== null || type !== ''){
                        listType = type;
                    }

                    //List Icon
                    var feedIcon = '<svg width="18px" height="18px" fill="#757575" class="feed-icon" viewBox="0 0 24 24"><path d="M0 18.64h24V24H0v-5.36zM0 0h24v16H0V0z"></path></svg>';
                    //Grid Icon
                    var gridIcon = '<svg width="18px" height="18px" fill="#757575" class="grid-icon" viewBox="0 0 24 24"><path d="M0 13.36h10.64V24H0V13.36zM13.36 0H24v10.64H13.36V0zm0 13.36H24V24H13.36V13.36zM0 0h10.64v10.64H0V0z"></path></svg>';

                    if(listType == 'feed'){ //feed 모드
                        btnToggleListMode.innerHTML = gridIcon;
                        if(btnToggleListMode.dataset.snkrsUiToggleListmode !== null) {
                            btnToggleListMode.dataset.snkrsUiToggleListmode = 'true';
                        }
                        btnToggleListMode.ariaLabel = '목록으로 제품보기';
                        btnToggleListMode.dataset.clickName = 'thumbnail';
                        setLocalStorage('listType', 'feed');
                        changeListType('feed', snkrsListItems);
                    }else{ //grid 모드
                        btnToggleListMode.innerHTML = feedIcon;
                        if(btnToggleListMode.dataset.snkrsUiToggleListmode !== null){
                            btnToggleListMode.dataset.snkrsUiToggleListmode = 'false';
                        }
                        btnToggleListMode.ariaLabel = '그리드로 제품보기';
                        btnToggleListMode.dataset.clickName = 'fullview';
                        setLocalStorage('listType', 'grid');
                        changeListType('grid', snkrsListItems);
                    }

                    //Lazy control
                    $('.launch-category .img-component').Lazy({
                        visibleOnly: true,
                        scrollDirection: 'vertical',
                        afterLoad: function() {
                            $('.launch-category .launch-list-item').addClass('complete');
                        },
                    });
                }
            },
            PDP : {
                scrollSticky : function (){
                    /*
                    SNKRS DRAW 시 PDP 내용이 짧으면 우측 부 DRAW신청 버튼 및 사이즈 선택부 가용 여백이 확보가 되지 않아서 클릭이 안되는 문제 해결
                    기존 오프셋을 이용한 세로 중앙정렬 방식에서 STICKY 방식으로 변경
                     */
                    var stickyEl = $('.card-product-component .fixie'),
                        stickyTargetEl = $('.lc-prd-conts .prd-img-wrap'),
                        scrollDirectionOffset = $(window).scrollTop();

                        if( (stickyEl == null) && (stickyEloffset == null) ) return false;

                        if(document.querySelector('[data-module-launchproduct]') == null) return false; // PDP 아닐 때 return

                    $(window).scroll(function(){
                        window.requestAnimationFrame(function () {
                            rightSideSticky($(window).scrollTop());
                        });
                    });

                    function rightSideSticky (offsetY){
                        var isMobile = window.matchMedia("(max-width: 1024px)")

                        if(!isMobile.matches){ //모바일이 아닐 때만 실행

                            (offsetY > stickyTargetEl.offset().top) ? stickyEl.addClass('sticky') : stickyEl.removeClass('sticky');

                            var scrollDirection = (offsetY >= scrollDirectionOffset) ? 'down' : 'up';
                            scrollDirectionOffset = offsetY;

                            var docViewBottom = offsetY + $(window).height(),
                                stickyTargetElBottomoffset = stickyTargetEl.offset().top + stickyTargetEl.outerHeight(),
                                bottomGap = ( $(window).height() - stickyEl.outerHeight() ) / 2;

                            if(scrollDirection == 'down'){
                                if( (stickyTargetElBottomoffset + bottomGap) <= docViewBottom ) {
                                    if(!stickyEl.hasClass('end'))stickyEl.addClass('end');
                                }
                            }else{
                                if( (stickyTargetElBottomoffset + bottomGap) > docViewBottom ) {
                                    if(stickyEl.hasClass('end')) stickyEl.removeClass('end');
                                }
                            }
                        }else{
                            if(stickyEl.hasClass('sticky')) stickyEl.removeClass('sticky');
                            if(stickyEl.hasClass('end')) stickyEl.removeClass('end');
                        }
                    }

                    rightSideSticky($(window).scrollTop());	//첫 load 시 스크롤 상태 확인
                },
                initGallerySwiper : function (targetEl){
                    if(targetEl == null) return false;

                    function initFullscreenSlider(setIndex, targetElement){ //pc일 때만 작동
                        if(targetElement == null) return false;
                        if(targetElement.querySelector('.snkrs-gallery-fullscreen-swiper') == null) return false;
                        var _setIndex = 0;
                            _setIndex = setIndex !== null ? setIndex : 0;
                        var _self = this;

                        var snkrsPDPGalleryFullscreenImageSwiper = new Swiper(targetElement.querySelector('.snkrs-gallery-fullscreen-swiper'), {
                            centeredSlides: true,
                            initialSlide: _setIndex,
                            slidesPerView: 1,
                            navigation: {nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev'},
                            scrollbar: {el: '.swiper-scrollbar'},
                            on: {
                                init: function () {
                                    var fullscreenContainer = targetElement.querySelector('.carousel.full-screen');
                                    if (fullscreenContainer !== null) {
                                        fullscreenContainer.classList.add('show');
                                    }

                                    if(!document.querySelector('html').classList.contains('quickview-fullscreen')){
                                        document.querySelector('html').classList.add('quickview-fullscreen');
                                    }

                                    var closeButtonClickEvent = function(event){
                                        var fullscreenContainer = targetEl.querySelector('.carousel.full-screen');
                                        if(fullscreenContainer !== null){
                                            fullscreenContainer.classList.remove('show');
                                        }

                                        if(document.querySelector('html').classList.contains('quickview-fullscreen')){
                                            document.querySelector('html').classList.remove('quickview-fullscreen');
                                        }

                                        var iFullscreenSwiper = snkrs.VALUE.getFullscreenSwiper();
                                        if ( typeof iFullscreenSwiper !== 'undefined' ){
                                            if(iFullscreenSwiper.length > 1){ //다중으로 처리 될 때 ex)Collection Mini PDP 중첩 상황...
                                                for(var i = 0; i < iFullscreenSwiper.length ; i++){
                                                    iFullscreenSwiper[i].destroy();
                                                }
                                            }else{
                                                iFullscreenSwiper.destroy();
                                            }
                                        }
                                    }
                                    var closeButton = targetElement.querySelector('.full-screen-close');
                                    if (closeButton !== null) {
                                        closeButton.addEventListener('click', closeButtonClickEvent.bind(targetEl));
                                    }
                                }
                            }
                        });
                        snkrs.VALUE.setFullscreenSwiper(snkrsPDPGalleryFullscreenImageSwiper);
                    }

                    // PDP Gallery 이미지 클릭 시 이벤트 - PC일 때만 실행
                    var clickPDPGalleryImage = function(event){
                        if (!snkrs.UTIL.isMobile()) {
                            if(targetEl == null) return false;
                            var images = targetEl.querySelectorAll('[data-ui-gallery-fullscreen-image]');
                            var selectedImageIndex = 0;
                            if(images !== null){
                                for(var i = 0 ; i < images.length ; i++){
                                    if(images[i] === event.currentTarget){
                                        selectedImageIndex = i;
                                        initFullscreenSlider(i, targetEl);
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    var snkrsPDPGalleryFullscreenImage = targetEl.querySelectorAll('[data-ui-gallery-fullscreen-image]');
                    for(var i = 0; i < snkrsPDPGalleryFullscreenImage.length ; i++){
                        snkrsPDPGalleryFullscreenImage[i].addEventListener('click', clickPDPGalleryImage.bind(targetEl));
                    }

                    function initSwiper(){
                        if(targetEl.querySelectorAll('.snkrs-gallery-swiper') == null) return false;

                        var targetSwiperEl = targetEl.querySelectorAll('.snkrs-gallery-swiper');
                        var swiper = null;

                        if(targetSwiperEl.length > 1){ //다중으로 처리 될 때 ex)Collection Mini PDP 중첩 상황...
                            swiper = [];
                            for(var i = 0; i < targetSwiperEl.length ; i++){
                                swiper.push(
                                    new Swiper(targetSwiperEl[i], {
                                        scrollbar: {el: '.snkrs-gallery-swiper-scrollbar', hide: false,},
                                    })
                                );
                            }
                        }else{
                            swiper = new Swiper(targetSwiperEl, {
                                scrollbar: {el: '.snkrs-gallery-swiper-scrollbar', hide: false,},
                            });
                        }

                        snkrs.VALUE.setGallerySwiper(swiper);
                    } // PDP Gallery 용 Swiper

                    function updateGallery(){
                        var isSwiper = null;
                        isSwiper = snkrs.VALUE.getGallerySwiper();

                        if (snkrs.UTIL.isMobile()) { // 모바일일 때 init
                            if(typeof isSwiper == 'undefined'){
                                initSwiper();
                            }else{
                                if(snkrs.VALUE.getGallerySwiper().destroyed){
                                    initSwiper();
                                }
                            }

                            if($('[data-scrollbar]').length === 1 && typeof Scrollbar == "function"){
                                if(Scrollbar.destroyAll() !== null)
                                    Scrollbar.destroyAll();
                            }
                        } else { // PC모드일 때 인스턴스 삭제
                            if ( typeof isSwiper !== 'undefined' ){
                                if(isSwiper.length > 1){ //다중으로 처리 될 때 ex)Collection Mini PDP 중첩 상황...
                                    for(var i = 0; i < isSwiper.length ; i++){
                                        isSwiper[i].destroy();
                                    }
                                }else{
                                    isSwiper.destroy();
                                }
                            }

                            if($('[data-scrollbar]').length === 1 && typeof Scrollbar == "function"){
                                if(Scrollbar.initAll() !== null)
                                    Scrollbar.initAll();
                            }
                        }
                    }


                    // optimize resize
                    var optimizedResize = (function() {
                        var callbacks = [], running = false;

                        function resize() {
                            if (!running) {
                                running = true;

                                if (window.requestAnimationFrame) {
                                    window.requestAnimationFrame(runCallbacks);
                                } else {
                                    setTimeout(runCallbacks, 66);
                                }
                            }
                        }

                        function runCallbacks() {
                            if (window.NodeList && !NodeList.prototype.forEach) {
                                NodeList.prototype.forEach = Array.prototype.forEach;
                            }
                            callbacks.forEach(function(callback) {callback();});
                            running = false;
                        }

                        function addCallback(callback) {
                            if (callback) {
                                callbacks.push(callback);
                            }
                        }

                        return {
                            add: function(callback) {
                                if (!callbacks.length) {
                                    window.addEventListener('resize', resize);
                                }
                                addCallback(callback);
                            }
                        }
                    }());

                    //리사이즈 시 PC모드에서 모바일 모드 진입 시작 점 체크 후 init
                    optimizedResize.add(function() {
                        updateGallery();
                    });
                    //최초 init
                    updateGallery();
                },
                focusSelectBox : function (targetEl){
                    if(targetEl == null) return false;

                    var selectBox = targetEl.querySelector('select#selectSize') ? targetEl.querySelector('select#selectSize') : null ;
                    if(selectBox !== null){

                        var selectBoxLabel = targetEl.querySelector('label.select-head') ? targetEl.querySelector('label.select-head') : null ;
                        selectBox.addEventListener('click', function (){
                            if( selectBoxLabel !== null && !selectBoxLabel.classList.contains('open') ){
                                 selectBoxLabel.classList.add('open');
                            }
                        });
                        selectBox.addEventListener('blur', function (){
                            if( selectBoxLabel !== null && selectBoxLabel.classList.contains('open') ){
                                selectBoxLabel.classList.remove('open');
                            }
                        });
                    }
                }
            },
            MINI_PDP : {
                init : function(targetEl){
                    snkrs.MINI_PDP.scrollSticky(targetEl)
                },
                scrollSticky : function (targetEl){
                    if(targetEl == null) return false;
                    /*
                    PDP와 달리 SmoothScroller의 이벤트를 scrolloffset으로 써야한다.
                     */
                    var stickyEl = targetEl.querySelector('.card-product-component .fixie');
                        if (stickyEl == null) return false;

                    var stickyTargetEl = targetEl.querySelector('.lc-prd-conts .prd-img-wrap'),
                        stickyTargetCover = targetEl.querySelector('.full.js-photo'),
                        scrollDirectionOffset = 0;

                    var quickViewEl = querySelector('.quickview');

                    if( quickViewEl !== null ){

                        scrollDirectionOffset = quickViewEl.scrollTop;
                        quickViewEl.addEventListener('scroll', function(event) {
                            window.requestAnimationFrame(function () {

                                var quickViewEl = querySelector('.quickview');
                                if(quickViewEl !== null){
                                    rightSideSticky(quickViewEl.scrollTop);
                                }
                            });
                        });

                        function rightSideSticky (offsetY){
                            if(offsetY == null) return false;

                            var isMobile = window.matchMedia("(max-width: 1024px)");

                            if(!isMobile.matches){ //모바일이 아닐 때만 실행

                                var targetOffset = stickyTargetEl.offsetTop;
                                if(stickyTargetCover !== null){
                                    targetOffset += stickyTargetCover.offsetHeight;
                                }

                                if(offsetY > targetOffset) {
                                    if(!stickyEl.classList.contains('sticky')){
                                        stickyEl.classList.add('sticky');
                                        stickyEl.dataset.isSticky = 'true';
                                    }
                                }else {
                                    if (stickyEl.classList.contains('sticky')) {
                                        stickyEl.classList.remove('sticky');
                                        stickyEl.dataset.isSticky = 'false';
                                    }
                                }

                                var scrollDirection = (offsetY >= scrollDirectionOffset) ? 'down' : 'up';
                                scrollDirectionOffset = offsetY;

                                var quickViewEl = querySelector('.quickview'),
                                    quickViewElHeight = 0;
                                if(quickViewEl !== null){
                                    quickViewElHeight
                                }

                                var docViewBottom = offsetY + window.innerHeight,
                                    stickyTargetElBottomoffset = stickyTargetEl.offsetTop + stickyTargetEl.offsetHeight,
                                    bottomGap = ( window.innerHeight - stickyEl.offsetHeight ) / 2;

                                if(stickyTargetCover !== null){
                                    stickyTargetElBottomoffset += stickyTargetCover.offsetHeight;
                                }

                                if(scrollDirection == 'down'){
                                    if( (stickyTargetElBottomoffset + bottomGap) <= docViewBottom ) {
                                        if( !stickyEl.classList.contains('end') ){
                                            stickyEl.dataset.isSticky = 'false';
                                            stickyEl.dataset.lastOffset = offsetY;
                                            stickyEl.classList.add('end');
                                        }
                                    }
                                }else{
                                    if( (stickyTargetElBottomoffset + bottomGap) > docViewBottom ) {
                                        if( stickyEl.classList.contains('end') ){
                                            stickyEl.dataset.isSticky = 'true';
                                            stickyEl.classList.remove('end');
                                        }
                                    }
                                }

                                if(stickyEl.dataset.isSticky == 'true'){
                                    var lastOffsetY = offsetY;
                                    if(typeof stickyEl.dataset.lastOffset !== 'undefined'){
                                        lastOffsetY = stickyEl.dataset.lastOffset;
                                        stickyEl.style.transform = 'translateY(' +  lastOffsetY + 'px)';
                                        delete stickyEl.dataset.lastOffset
                                    }else{
                                        stickyEl.style.transform = 'translateY(' +  offsetY + 'px)';
                                    }

                                }else{
                                    stickyEl.style.removeProperty('transform');
                                }

                            }else{

                                if(stickyEl.classList.contains('sticky')) stickyEl.classList.remove('sticky');
                                if(stickyEl.classList.contains('end')) stickyEl.classList.remove('end');
                            }
                        }

                        rightSideSticky(quickViewEl.scrollTop);	//첫 load 시 스크롤 상태 확인
                    }
                },
            }
        }
    } catch (error) {
        console.error("SNKRS js Error" + error)
    }

    return snkrs;
};

document.addEventListener("DOMContentLoaded", function () {
    if(document.body.classList.contains('snkrs')){  // body에 snkrs class 체크 후 init
        UI_SNKRS().init();
    }
});