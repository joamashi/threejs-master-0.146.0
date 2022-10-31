/*!
 * fullPage 2.9.7
 * https://github.com/alvarotrigo/fullPage.js
 * @license MIT licensed
 *
 * Copyright (C) 2015 alvarotrigo.com - A project by Alvaro Trigo
 */
(function(global, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
          return factory($, global, global.document, global.Math);
        });
    } else if (typeof exports === "object" && exports) {
        module.exports = factory(require('jquery'), global, global.document, global.Math);
    } else {
        factory(jQuery, global, global.document, global.Math);
    }

})(typeof window !== 'undefined' ? window : this, function ($, window, document, Math, undefined) {

    'use strict';

    // keeping central set of classnames and selectors
    // 클래스 이름과 선택자의 중앙 집합 유지
    var WRAPPER =               'fullpage-wrapper';
    var WRAPPER_SEL =           '.' + WRAPPER; // .fullpage-wrapper

    // slimscroll
    var SCROLLABLE =            'fp-scrollable';
    var SCROLLABLE_SEL =        '.' + SCROLLABLE; // .fp-scrollable

    // util
    var RESPONSIVE =            'fp-responsive';
    var NO_TRANSITION =         'fp-notransition';
    var DESTROYED =             'fp-destroyed';
    var ENABLED =               'fp-enabled';
    var VIEWING_PREFIX =        'fp-viewing';
    var ACTIVE =                'active';
    var ACTIVE_SEL =            '.' + ACTIVE; // .active
    var COMPLETELY =            'fp-completely';
    var COMPLETELY_SEL =        '.' + COMPLETELY; // .fp-completely

    // section
    var SECTION_DEFAULT_SEL =   '.section';
    var SECTION =               'fp-section';
    var SECTION_SEL =           '.' + SECTION; // .fp-section
    var SECTION_ACTIVE_SEL =    SECTION_SEL + ACTIVE_SEL; // .fp-section.active
    var SECTION_FIRST_SEL =     SECTION_SEL + ':first'; // .fp-section:first
    var SECTION_LAST_SEL =      SECTION_SEL + ':last'; // .fp-section:last
    var TABLE_CELL =            'fp-tableCell';
    var TABLE_CELL_SEL =        '.' + TABLE_CELL; // .fp-tableCell
    var AUTO_HEIGHT =           'fp-auto-height';
    var AUTO_HEIGHT_SEL =       '.fp-auto-height';
    var NORMAL_SCROLL =         'fp-normal-scroll';
    var NORMAL_SCROLL_SEL =     '.fp-normal-scroll';

    // section nav
    var SECTION_NAV =           'fp-nav';
    var SECTION_NAV_SEL =       '#' + SECTION_NAV; // #fp-nav
    var SECTION_NAV_TOOLTIP =   'fp-tooltip';
    var SECTION_NAV_TOOLTIP_SEL='.'+SECTION_NAV_TOOLTIP; // .fp-tooltip
    var SHOW_ACTIVE_TOOLTIP =   'fp-show-active';

    // slide
    var SLIDE_DEFAULT_SEL =     '.slide';
    var SLIDE =                 'fp-slide';
    var SLIDE_SEL =             '.' + SLIDE; // .fp-slide
    var SLIDE_ACTIVE_SEL =      SLIDE_SEL + ACTIVE_SEL; // .fp-slide.active
    var SLIDES_WRAPPER =        'fp-slides';
    var SLIDES_WRAPPER_SEL =    '.' + SLIDES_WRAPPER; // .fp-slides
    var SLIDES_CONTAINER =      'fp-slidesContainer';
    var SLIDES_CONTAINER_SEL =  '.' + SLIDES_CONTAINER; // .fp-slidesContainer
    var TABLE =                 'fp-table';

    // slide nav
    var SLIDES_NAV =            'fp-slidesNav';
    var SLIDES_NAV_SEL =        '.' + SLIDES_NAV; // .fp-slidesNav
    var SLIDES_NAV_LINK_SEL =   SLIDES_NAV_SEL + ' a'; // .fp-slidesNav a
    
    var SLIDES_ARROW =          'fp-controlArrow';
    var SLIDES_ARROW_SEL =      '.' + SLIDES_ARROW; // .fp-controlArrow

    var SLIDES_PREV =           'fp-prev';
    var SLIDES_PREV_SEL =       '.' + SLIDES_PREV; // .fp-prev
    var SLIDES_ARROW_PREV =     SLIDES_ARROW + ' ' + SLIDES_PREV; // .fp-controlArrow .fp-prev
    var SLIDES_ARROW_PREV_SEL = SLIDES_ARROW_SEL + SLIDES_PREV_SEL; // .fp-controlArrow.fp-prev

    var SLIDES_NEXT =           'fp-next';
    var SLIDES_NEXT_SEL =       '.' + SLIDES_NEXT; // .fp-next
    var SLIDES_ARROW_NEXT =     SLIDES_ARROW + ' ' + SLIDES_NEXT; // .fp-controlArrow .fp-next
    var SLIDES_ARROW_NEXT_SEL = SLIDES_ARROW_SEL + SLIDES_NEXT_SEL; // .fp-controlArrow .fp-next

    var $window = $(window);
    var $document = $(document);

    $.fn.fullpage = function(options) {
        // only once my friend!
        if($('html').hasClass(ENABLED)){ displayWarnings(); return; } // 'fp-enabled'

        // common jQuery objects
        var $htmlBody = $('html, body');
        var $body = $('body');

        var FP = $.fn.fullpage;

        // Creating some defaults, extending them with any options that were provided
        // 일부 기본값 생성, 제공된 옵션으로 확장
        options = $.extend({
            //navigation
            menu: false,
            anchors:[],
            lockAnchors: false,
            navigation: false,
            navigationPosition: 'right',
            navigationTooltips: [],
            showActiveTooltip: false,
            slidesNavigation: false,
            slidesNavPosition: 'bottom',
            scrollBar: false,
            hybrid: false,

            //scrolling
            css3: true,
            scrollingSpeed: 700,
            autoScrolling: true,
            fitToSection: true,
            fitToSectionDelay: 1000,
            easing: 'easeInOutCubic',
            easingcss3: 'ease',
            loopBottom: false,
            loopTop: false,
            loopHorizontal: true,
            continuousVertical: false,
            continuousHorizontal: false,
            scrollHorizontally: false,
            interlockedSlides: false,
            dragAndMove: false,
            offsetSections: false,
            resetSliders: false,
            fadingEffect: false,
            normalScrollElements: null,
            scrollOverflow: false,
            scrollOverflowReset: false,
            scrollOverflowHandler: $.fn.fp_scrolloverflow ? $.fn.fp_scrolloverflow.iscrollHandler : null,
            scrollOverflowOptions: null,
            touchSensitivity: 5,
            normalScrollElementTouchThreshold: 5,
            bigSectionsDestination: null,

            //Accessibility
            keyboardScrolling: true,
            animateAnchor: true,
            recordHistory: true,

            //design
            controlArrows: true,
            controlArrowColor: '#fff',
            verticalCentered: true,
            sectionsColor : [],
            paddingTop: 0,
            paddingBottom: 0,
            fixedElements: null,
            responsive: 0, // backwards compabitility with responsiveWiddth
            responsiveWidth: 0,
            responsiveHeight: 0,
            responsiveSlides: false,
            parallax: false,
            parallaxOptions: {
                type: 'reveal',
                percentage: 62,
                property: 'translate'
            },

            //Custom selectors
            sectionSelector: SECTION_DEFAULT_SEL,
            slideSelector: SLIDE_DEFAULT_SEL,

            //events
            afterLoad: null,
            onLeave: null,
            afterRender: null,
            afterResize: null,
            afterReBuild: null,
            afterSlideLoad: null,
            onSlideLeave: null,
            afterResponsive: null,

            lazyLoading: true
        }, options);

        // flag to avoid very fast sliding for landscape sliders
        // 가로 슬라이더에 대한 매우 빠른 슬라이딩을 방지하기 위한 플래그
        var slideMoving = false;

        var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
        var container = $(this);
        var windowsHeight = $window.height();
        var isResizing = false;
        var isWindowFocused = true;
        var lastScrolledDestiny;
        var lastScrolledSlide;
        var canScroll = true;
        var scrollings = [];
        var controlPressed;
        var startingSection;
        var isScrollAllowed = {};
        isScrollAllowed.m = {  'up':true, 'down':true, 'left':true, 'right':true };
        isScrollAllowed.k = $.extend(true,{}, isScrollAllowed.m);
        var MSPointer = getMSPointer();
        var events = {
            touchmove: 'ontouchmove' in window ? 'touchmove' :  MSPointer.move,
            touchstart: 'ontouchstart' in window ? 'touchstart' :  MSPointer.down
        };
        var scrollBarHandler;

        // taken from https://github.com/udacity/ud891/blob/gh-pages/lesson2-focus/07-modals-and-keyboard-traps/solution/modal.js
        var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

        // timeouts
        var resizeId;
        var afterSectionLoadsId;
        var afterSlideLoadsId;
        var scrollId;
        var scrollId2;
        var keydownId;
        var originals = $.extend(true, {}, options); //deep copy

        displayWarnings();

        // easeInOutCubic animation included in the plugin
        // 플러그인에 포함된 easyInOutCubic 애니메이션
        $.extend($.easing, { easeInOutCubic: function (x, t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t + b;return c/2*((t-=2)*t*t + 2) + b;}});

        /**
        * Sets the autoScroll option.
        * 자동 스크롤 옵션을 설정합니다.
        * It changes the scroll bar visibility and the history of the site as a result.
        * 결과적으로 스크롤바 가시성 및 사이트 히스토리를 변경합니다.
        */
        function setAutoScrolling (value, type) {
            // removing the transformation
            // 변형 제거
            if (!value) {
                silentScroll(0);
            }

            setVariableState('autoScrolling', value, type);

            var element = $(SECTION_ACTIVE_SEL);

            if(options.autoScrolling && !options.scrollBar){
                $htmlBody.css({
                    'overflow' : 'hidden',
                    'height' : '100%'
                });

                setRecordHistory(originals.recordHistory, 'internal');

                // for IE touch devices
                container.css({
                    '-ms-touch-action': 'none',
                    'touch-action': 'none'
                });

                if(element.length){
                    //moving the container up
                    silentScroll(element.position().top);
                }

            } else {
                $htmlBody.css({
                    'overflow' : 'visible',
                    'height' : 'initial'
                });

                setRecordHistory(false, 'internal');

                //for IE touch devices
                container.css({
                    '-ms-touch-action': '',
                    'touch-action': ''
                });

                //scrolling the page to the section with no animation
                if (element.length) {
                    $htmlBody.scrollTop(element.position().top);
                }
            }
        }

        /**
        * Defines wheter to record the history for each hash change in the URL.
        * URL의 각 해시 변경에 대한 기록을 기록할지 여부를 정의합니다.
        */
        function setRecordHistory (value, type) {
            setVariableState('recordHistory', value, type);
        }

        /**
        * Defines the scrolling speed
        * 스크롤 속도를 정의합니다.
        */
        function setScrollingSpeed (value, type) {
            setVariableState('scrollingSpeed', value, type);
        }

        /**
        * Sets fitToSection
        * fitToSection 설정
        */
        function setFitToSection (value, type) {
            setVariableState('fitToSection', value, type);
        }

        /**
        * Sets lockAnchors
        * lockAnchors 설정
        */
        function setLockAnchors (value) {
            options.lockAnchors = value;
        }

        /**
        * Adds or remove the possibility of scrolling through sections by using the mouse wheel or the trackpad.
        * 마우스 휠이나 트랙패드를 사용하여 섹션을 스크롤할 가능성을 추가하거나 제거합니다.
        */
        function setMouseWheelScrolling (value) {
            if(value){
                addMouseWheelHandler();
                addMiddleWheelHandler();
            }else{
                removeMouseWheelHandler();
                removeMiddleWheelHandler();
            }
        }

        /**
        * Adds or remove the possibility of scrolling through sections by using the mouse wheel/trackpad or touch gestures.
        * 마우스 휠/트랙패드 또는 터치 제스처를 사용하여 섹션을 스크롤할 수 있는 가능성을 추가하거나 제거합니다.
        * Optionally a second parameter can be used to specify the direction for which the action will be applied.
        * 선택적으로 두 번째 매개변수를 사용하여 작업이 적용될 방향을 지정할 수 있습니다.
        *
        * @param directions string containing the direction or directions separated by comma.
        * @param Directions 문자열은 쉼표로 구분된 방향을 포함합니다.
        */
        function setAllowScrolling (value, directions) {
            if(typeof directions !== 'undefined'){
                directions = directions.replace(/ /g,'').split(',');

                $.each(directions, function (index, direction){
                    setIsScrollAllowed(value, direction, 'm');
                });
            }
            else{
                setIsScrollAllowed(value, 'all', 'm');

                if(value){
                    setMouseWheelScrolling(true);
                    addTouchHandler();
                }else{
                    setMouseWheelScrolling(false);
                    removeTouchHandler();
                }
            }
        }

        /**
        * Adds or remove the possibility of scrolling through sections by using the keyboard arrow keys
        * 키보드 화살표 키를 사용하여 섹션을 스크롤할 가능성을 추가하거나 제거합니다.
        */
        function setKeyboardScrolling (value, directions) {
            if(typeof directions !== 'undefined'){
                directions = directions.replace(/ /g,'').split(',');

                $.each(directions, function (index, direction){
                    setIsScrollAllowed(value, direction, 'k');
                });
            }else{
                setIsScrollAllowed(value, 'all', 'k');
                options.keyboardScrolling = value;
            }
        }

        /**
        * Moves the page up one section.
        * 페이지를 한 섹션 위로 이동합니다.
        */
        function moveSectionUp () {
            var prev = $(SECTION_ACTIVE_SEL).prev(SECTION_SEL);

            //looping to the bottom if there's no more sections above
            if (!prev.length && (options.loopTop || options.continuousVertical)) {
                prev = $(SECTION_SEL).last();
            }

            if (prev.length) {
                scrollPage(prev, null, true);
            }
        }

        /**
        * Moves the page down one section.
        * 페이지를 한 섹션 아래로 이동합니다.
        */
        function moveSectionDown () {
            var next = $(SECTION_ACTIVE_SEL).next(SECTION_SEL);

            //looping to the top if there's no more sections below
            if(!next.length &&
                (options.loopBottom || options.continuousVertical)){
                next = $(SECTION_SEL).first();
            }

            if(next.length){
                scrollPage(next, null, false);
            }
        }

        /**
        * Moves the page to the given section and slide with no animation.
        * 페이지를 지정된 섹션으로 이동하고 애니메이션 없이 슬라이드합니다.
        * Anchors or index positions can be used as params.
        * 앵커 또는 인덱스 위치를 매개변수로 사용할 수 있습니다.
        */
        function silentMoveTo (sectionAnchor, slideAnchor) {
            setScrollingSpeed (0, 'internal');
            moveTo(sectionAnchor, slideAnchor);
            setScrollingSpeed (originals.scrollingSpeed, 'internal');
        }

        /**
        * Moves the page to the given section and slide.
        * 페이지를 주어진 섹션으로 이동하고 슬라이드합니다.
        * Anchors or index positions can be used as params.
        * 앵커 또는 인덱스 위치를 매개변수로 사용할 수 있습니다.
        */
        function moveTo (sectionAnchor, slideAnchor) {
            var destiny = getSectionByAnchor(sectionAnchor);

            if (typeof slideAnchor !== 'undefined'){
                scrollPageAndSlide(sectionAnchor, slideAnchor);
            }else if(destiny.length > 0){
                scrollPage(destiny);
            }
        }

        /**
        * Slides right the slider of the active section.
        * 활성 섹션의 슬라이더를 오른쪽으로 밉니다.
        * Optional `section` param.
        * 선택적 '섹션' 매개변수.
        */
        function moveSlideRight (section) {
            moveSlide('right', section);
        }

        /**
        * Slides left the slider of the active section.
        * 활성 섹션의 슬라이더를 왼쪽으로 밉니다.
        * Optional `section` param.
        * 선택적 '섹션' 매개변수.
        */
        function moveSlideLeft (section) {
            moveSlide('left', section);
        }

        /**
         * When resizing is finished, we adjust the slides sizes and positions
         * 크기 조정이 완료되면 슬라이드 크기와 위치를 조정합니다.
         */
        function reBuild (resizing) {
            if(container.hasClass(DESTROYED)){ return; }  
            // nothing to do if the plugin was destroyed
            // 플러그인이 파괴되면 할 일이 없습니다.

            isResizing = true;

            windowsHeight = $window.height();  
            // updating global var
            // 전역 변수 업데이트

            $(SECTION_SEL).each(function () {
                var slidesWrap = $(this).find(SLIDES_WRAPPER_SEL);
                var slides = $(this).find(SLIDE_SEL);

                // adjusting the height of the table-cell for IE and Firefox
                // IE 및 Firefox의 테이블 셀 높이 조정
                if(options.verticalCentered){
                    $(this).find(TABLE_CELL_SEL).css('height', getTableHeight($(this)) + 'px');
                }

                $(this).css('height', windowsHeight + 'px');

                // adjusting the position fo the FULL WIDTH slides...
                // FULL WIDTH 슬라이드의 위치를 조정하는 중...
                if (slides.length > 1) {
                    landscapeScroll(slidesWrap, slidesWrap.find(SLIDE_ACTIVE_SEL));
                }
            });

            if(options.scrollOverflow){
                scrollBarHandler.createScrollBarForAll();
            }

            var activeSection = $(SECTION_ACTIVE_SEL);
            var sectionIndex = activeSection.index(SECTION_SEL);

            // isn't it the first section?
            // 첫 번째 섹션이 아닌가요?
            if(sectionIndex){
                // adjusting the position for the current section
                // 현재 섹션의 위치 조정
                silentMoveTo(sectionIndex + 1);
            }

            isResizing = false;
            $.isFunction( options.afterResize ) && resizing && options.afterResize.call(container);
            $.isFunction( options.afterReBuild ) && !resizing && options.afterReBuild.call(container);
        }

        /**
        * Turns fullPage.js to normal scrolling mode when the viewport `width` or `height` are smaller than the set limit values.
        * 뷰포트 'width' 또는 'height'가 설정된 제한 값보다 작으면 fullPage.js를 일반 스크롤 모드로 전환합니다.
        */
        function setResponsive(active){
            var isResponsive = $body.hasClass(RESPONSIVE);

            if(active){
                if(!isResponsive){
                    setAutoScrolling(false, 'internal');
                    setFitToSection(false, 'internal');
                    $(SECTION_NAV_SEL).hide();
                    $body.addClass(RESPONSIVE);
                    $.isFunction( options.afterResponsive ) && options.afterResponsive.call( container, active);
                }
            }
            else if(isResponsive){
                setAutoScrolling(originals.autoScrolling, 'internal');
                setFitToSection(originals.autoScrolling, 'internal');
                $(SECTION_NAV_SEL).show();
                $body.removeClass(RESPONSIVE);
                $.isFunction( options.afterResponsive ) && options.afterResponsive.call( container, active);
            }
        }
        
        // ------------------------------------------------------------

        if($(this).length){
            // public functions
            // 공공 기능
            FP.version = '2.9.7';
            FP.setAutoScrolling = setAutoScrolling;
            FP.setRecordHistory = setRecordHistory;
            FP.setScrollingSpeed = setScrollingSpeed;
            FP.setFitToSection = setFitToSection;
            FP.setLockAnchors = setLockAnchors;
            FP.setMouseWheelScrolling = setMouseWheelScrolling;
            FP.setAllowScrolling = setAllowScrolling;
            FP.setKeyboardScrolling = setKeyboardScrolling;
            FP.moveSectionUp = moveSectionUp;
            FP.moveSectionDown = moveSectionDown;
            FP.silentMoveTo = silentMoveTo;
            FP.moveTo = moveTo;
            FP.moveSlideRight = moveSlideRight;
            FP.moveSlideLeft = moveSlideLeft;
            FP.fitToSection = fitToSection;
            FP.reBuild = reBuild;
            FP.setResponsive = setResponsive;
            FP.destroy = destroy;

            // functions we want to share across files but which are not mean to be used on their own by developers
            // 파일 간에 공유하고 싶지만 개발자가 자체적으로 사용할 수 없는 기능
            FP.shared ={
                afterRenderActions: afterRenderActions
            };

            init();

            bindEvents();
        }

        // ------------------------------------------------------------

        function init () {
            // if css3 is not supported, it will use jQuery animations
            // css3이 지원되지 않으면 jQuery 애니메이션을 사용합니다.
            if(options.css3){
                options.css3 = support3d();
            }

            options.scrollBar = options.scrollBar || options.hybrid;

            setOptionsFromDOM();
            prepareDom();
            setAllowScrolling(true);
            setAutoScrolling(options.autoScrolling, 'internal');
            responsive();

            //setting the class for the body element
            setBodyClass();

            if(document.readyState === 'complete'){
                scrollToAnchor();
            }
            $window.on('load', scrollToAnchor);
        }

        function bindEvents () {

            $window
                // when scrolling...
                // 스크롤할 때...
                .on('scroll', scrollHandler)

                // detecting any change on the URL to scroll to the given anchor link
                // 주어진 앵커 링크로 스크롤하기 위해 URL의 모든 변경 감지

                // (a way to detect back history button as we play with the hashes on the URL)
                // (URL의 해시로 재생할 때 이전 기록 버튼을 감지하는 방법)
                .on('hashchange', hashChangeHandler)

                // when opening a new tab (ctrl + t), `control` won't be pressed when coming back.
                // 새 탭을 열 때(ctrl + t), 돌아올 때 `control`이 눌러지지 않습니다.
                .blur(blurHandler)

                // when resizing the site, we adjust the heights of the sections, slimScroll...
                // 사이트 크기를 조정할 때 섹션의 높이를 조정합니다. SlimScroll...
                .resize(resizeHandler);

            $document
                // Sliding with arrow keys, both, vertical and horizontal
                // 화살표 키로 슬라이딩(수직 및 수평)
                .keydown(keydownHandler)

                // to prevent scrolling while zooming
                // 확대/축소 중 스크롤 방지
                .keyup(keyUpHandler)

                // Scrolls to the section when clicking the navigation bullet
                // 탐색 글머리 기호를 클릭하면 섹션으로 스크롤
                .on('click touchstart', SECTION_NAV_SEL + ' a', sectionBulletHandler)

                // Scrolls the slider to the given slide destination for the given section
                // 슬라이더를 지정된 섹션의 지정된 슬라이드 대상으로 스크롤합니다.
                .on('click touchstart', SLIDES_NAV_LINK_SEL, slideBulletHandler)

                .on('click', SECTION_NAV_TOOLTIP_SEL, tooltipTextHandler);

            // Scrolling horizontally when clicking on the slider controls.
            // 슬라이더 컨트롤을 클릭할 때 수평으로 스크롤합니다.
            $(SECTION_SEL).on('click touchstart', SLIDES_ARROW_SEL, slideArrowHandler);

            /**
            * Applying normalScroll elements.
            * normalScroll 요소 적용.
            * 
            * Ignoring the scrolls over the specified selectors.
            * 지정된 선택기 위의 스크롤을 무시합니다.
            */
            if(options.normalScrollElements){
                $document.on('mouseenter touchstart', options.normalScrollElements, function () {
                    setAllowScrolling(false);
                });

                $document.on('mouseleave touchend', options.normalScrollElements, function () {
                    setAllowScrolling(true);
                });
            }
        }

        /**
        * Setting options from DOM elements if they are not provided.
        * 제공되지 않는 경우 DOM 요소에서 옵션을 설정합니다.
        */
        function setOptionsFromDOM () {
            var sections = container.find(options.sectionSelector);

            // no anchors option? Checking for them in the DOM attributes
            // 앵커 옵션이 없습니까? DOM 속성에서 확인
            if(!options.anchors.length){
                options.anchors = sections.filter('[data-anchor]').map(function () {
                    return $(this).data('anchor').toString();
                }).get();
            }

            // no tooltips option? Checking for them in the DOM attributes
            // 툴팁 옵션이 없나요? DOM 속성에서 확인
            if(!options.navigationTooltips.length){
                options.navigationTooltips = sections.filter('[data-tooltip]').map(function () {
                    return $(this).data('tooltip').toString();
                }).get();
            }
        }

        /**
        * Works over the DOM structure to set it up for the current fullpage options.
        * DOM 구조에 대해 작업하여 현재 전체 페이지 옵션에 대해 설정합니다.
        */
        function prepareDom () {
            container.css({
                'height': '100%',
                'position': 'relative'
            });

            // adding a class to recognize the container internally in the code
            // 코드에서 내부적으로 컨테이너를 인식하는 클래스 추가
            container.addClass(WRAPPER);
            $('html').addClass(ENABLED);

            // due to https://github.com/alvarotrigo/fullPage.js/issues/1502
            windowsHeight = $window.height();

            container.removeClass(DESTROYED); 
            // in case it was destroyed before initializing it again
            // 다시 초기화하기 전에 파괴된 경우

            addInternalSelectors();

            // styling the sections / slides / menu
            // 섹션 / 슬라이드 / 메뉴 스타일 지정
            $(SECTION_SEL).each(function(index){
                var section = $(this);
                var slides = section.find(SLIDE_SEL);
                var numSlides = slides.length;

                // caching the original styles to add them back on destroy('all')
                // 원래 스타일을 캐싱하여 destroy('all')에 다시 추가합니다.
                section.data('fp-styles', section.attr('style'));

                styleSection(section, index);
                styleMenu(section, index);

                // if there's any slide
                // 슬라이드가 있다면
                if (numSlides > 0) {
                    styleSlides(section, slides, numSlides);
                }else{
                    if(options.verticalCentered){
                        addTableClass(section);
                    }
                }
            });

            // fixed elements need to be moved out of the plugin container due to problems with CSS3.
            // CSS3 문제로 인해 고정 요소를 플러그인 컨테이너 밖으로 이동해야 합니다.
            if(options.fixedElements && options.css3){
                $(options.fixedElements).appendTo($body);
            }

            // vertical centered of the navigation + active bullet
            // 탐색의 세로 중앙 + 활성 글머리 기호
            if(options.navigation){
                addVerticalNavigation();
            }

            enableYoutubeAPI();

            if(options.scrollOverflow){
                scrollBarHandler = options.scrollOverflowHandler.init(options);
            }else{
                afterRenderActions();
            }
        }

        /**
        * Styles the horizontal slides for a section.
        * 섹션의 가로 슬라이드 스타일을 지정합니다.
        */
        function styleSlides (section, slides, numSlides) {
            var sliderWidth = numSlides * 100;
            var slideWidth = 100 / numSlides;

            slides.wrapAll('<div class="' + SLIDES_CONTAINER + '" />');
            slides.parent().wrap('<div class="' + SLIDES_WRAPPER + '" />');

            section.find(SLIDES_CONTAINER_SEL).css('width', sliderWidth + '%');

            if(numSlides > 1){
                if(options.controlArrows){
                    createSlideArrows(section);
                }

                if(options.slidesNavigation){
                    addSlidesNavigation(section, numSlides);
                }
            }

            slides.each(function(index) {
                $(this).css('width', slideWidth + '%');

                if(options.verticalCentered){
                    addTableClass($(this));
                }
            });

            var startingSlide = section.find(SLIDE_ACTIVE_SEL);

            // if the slide won't be an starting point, the default will be the first one the active section isn't the first one? Is not the first slide of the first section? Then we load that section/slide by default.
            // 슬라이드가 시작점이 아닌 경우 기본값이 첫 번째 항목이 됩니다. 활성 섹션이 첫 번째 항목이 아닌가요? 첫 번째 섹션의 첫 번째 슬라이드가 아닌가요? 그런 다음 기본적으로 해당 섹션/슬라이드를 로드합니다.
            if( startingSlide.length &&  ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) !== 0 || ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) === 0 && startingSlide.index() !== 0))){
                silentLandscapeScroll(startingSlide, 'internal');
            }else{
                slides.eq(0).addClass(ACTIVE);
            }
        }

        /**
        * Styling vertical sections
        * 세로 섹션 스타일링
        */
        function styleSection (section, index) {
            // if no active section is defined, the 1st one will be the default one
            // 활성 섹션이 정의되지 않은 경우 첫 번째 섹션이 기본 섹션이 됩니다.
            if (!index && $(SECTION_ACTIVE_SEL).length === 0) {
                section.addClass(ACTIVE);
            }
            startingSection = $(SECTION_ACTIVE_SEL);

            section.css('height', windowsHeight + 'px');

            if (options.paddingTop) {
                section.css('padding-top', options.paddingTop);
            }

            if (options.paddingBottom) {
                section.css('padding-bottom', options.paddingBottom);
            }

            if (typeof options.sectionsColor[index] !==  'undefined') {
                section.css('background-color', options.sectionsColor[index]);
            }

            if (typeof options.anchors[index] !== 'undefined') {
                section.attr('data-anchor', options.anchors[index]);
            }
        }

        /**
        * Sets the data-anchor attributes to the menu elements and activates the current one.
        * 데이터 앵커 속성을 메뉴 요소로 설정하고 현재 요소를 활성화합니다.
        */
        function styleMenu (section, index) {
            if (typeof options.anchors[index] !== 'undefined') {
                // activating the menu / nav element on load
                if(section.hasClass(ACTIVE)){
                    activateMenuAndNav(options.anchors[index], index);
                }
            }

            // moving the menu outside the main container if it is inside (avoid problems with fixed positions when using CSS3 tranforms)
            // 메뉴가 내부에 있는 경우 기본 컨테이너 외부로 이동(CSS3 변환을 사용할 때 고정 위치 문제 방지)
            if(options.menu && options.css3 && $(options.menu).closest(WRAPPER_SEL).length){
                $(options.menu).appendTo($body);
            }
        }

        /**
        * Adds internal classes to be able to provide customizable selectors keeping the link with the style sheet.
        * 스타일 시트와의 링크를 유지하는 사용자 지정 가능한 선택기를 제공할 수 있도록 내부 클래스를 추가합니다.
        */
        function addInternalSelectors () {
            container.find(options.sectionSelector).addClass(SECTION);
            container.find(options.slideSelector).addClass(SLIDE);
        }

        /**
        * Creates the control arrows for the given section
        * 주어진 섹션에 대한 제어 화살표를 만듭니다.
        */
        function createSlideArrows (section) {
            section.find(SLIDES_WRAPPER_SEL).after('<div class="' + SLIDES_ARROW_PREV + '"></div><div class="' + SLIDES_ARROW_NEXT + '"></div>');

            if(options.controlArrowColor!='#fff'){
                section.find(SLIDES_ARROW_NEXT_SEL).css('border-color', 'transparent transparent transparent '+options.controlArrowColor);
                section.find(SLIDES_ARROW_PREV_SEL).css('border-color', 'transparent '+ options.controlArrowColor + ' transparent transparent');
            }

            if(!options.loopHorizontal){
                section.find(SLIDES_ARROW_PREV_SEL).hide();
            }
        }

        /**
        * Creates a vertical navigation bar.
        * 수직 탐색 모음을 만듭니다.
        */
        function addVerticalNavigation () {
            $body.append('<div id="' + SECTION_NAV + '"><ul></ul></div>');
            var nav = $(SECTION_NAV_SEL);

            nav.addClass(function() {
                return options.showActiveTooltip ? SHOW_ACTIVE_TOOLTIP + ' ' + options.navigationPosition : options.navigationPosition;
            });

            for (var i = 0; i < $(SECTION_SEL).length; i++) {
                var link = '';
                if (options.anchors.length) {
                    link = options.anchors[i];
                }

                var li = '<li><a href="#' + link + '"><span></span></a>';

                // Only add tooltip if needed (defined by user)
                // 필요한 경우에만 툴팁 추가(사용자 정의)
                var tooltip = options.navigationTooltips[i];

                if (typeof tooltip !== 'undefined' && tooltip !== '') {
                    li += '<div class="' + SECTION_NAV_TOOLTIP + ' ' + options.navigationPosition + '">' + tooltip + '</div>';
                }

                li += '</li>';

                nav.find('ul').append(li);
            }

            // centering it vertically
            // 세로로 중앙에
            $(SECTION_NAV_SEL).css('margin-top', '-' + ($(SECTION_NAV_SEL).height()/2) + 'px');

            // activating the current active section
            // 현재 활성 섹션 활성화
            $(SECTION_NAV_SEL).find('li').eq($(SECTION_ACTIVE_SEL).index(SECTION_SEL)).find('a').addClass(ACTIVE);
        }

        /*
        * Enables the Youtube videos API so we can control their flow if necessary.
        * YouTube 동영상 API를 활성화하여 필요한 경우 흐름을 제어할 수 있습니다.
        */
        function enableYoutubeAPI () {
            container.find('iframe[src*="youtube.com/embed/"]').each(function () {
                addURLParam($(this), 'enablejsapi=1');
            });
        }

        /**
        * Adds a new parameter and its value to the `src` of a given element
        * 주어진 요소의 `src`에 새 매개변수와 그 값을 추가합니다.
        */
        function addURLParam (element, newParam) {
            var originalSrc = element.attr('src');
            element.attr('src', originalSrc + getUrlParamSign(originalSrc) + newParam);
        }

        /*
        * Returns the prefix sign to use for a new parameter in an existen URL.
        * 기존 URL의 새 매개변수에 사용할 접두사 기호를 반환합니다.
        */
        function getUrlParamSign (url) {
            return ( !/\?/.test( url ) ) ? '?' : '&';
        }

        /**
        * Actions and callbacks to fire afterRender
        * AfterRender를 실행하는 작업 및 콜백
        */
        function afterRenderActions () {
            var section = $(SECTION_ACTIVE_SEL);

            section.addClass(COMPLETELY);

            lazyLoad(section);
            playMedia(section);

            if(options.scrollOverflow){
                options.scrollOverflowHandler.afterLoad();
            }

            if(isDestinyTheStartingSection()){
                $.isFunction( options.afterLoad ) && options.afterLoad.call(section, section.data('anchor'), (section.index(SECTION_SEL) + 1));
            }

            $.isFunction( options.afterRender ) && options.afterRender.call(container);
        }

        /**
        * Determines if the URL anchor destiny is the starting section (the one using 'active' class before initialization)
        * URL 앵커 데스티니가 시작 섹션인지 확인합니다(초기화 전에 '활성' 클래스를 사용하는 섹션).
        */
        function isDestinyTheStartingSection () {
            var destinationSection = getSectionByAnchor(getAnchorsURL().section);
            return !destinationSection || destinationSection.length && destinationSection.index() === startingSection.index();
        }


        var isScrolling = false;
        var lastScroll = 0;

        // when scrolling...
        // 스크롤할 때...
        function scrollHandler () {
            var currentSection;

            if (!options.autoScrolling || options.scrollBar) {
                var currentScroll = $window.scrollTop();
                var scrollDirection = getScrollDirection(currentScroll);
                var visibleSectionIndex = 0;
                var screen_mid = currentScroll + ($window.height() / 2.0);
                var isAtBottom = $body.height() - $window.height() === currentScroll;
                var sections =  document.querySelectorAll(SECTION_SEL);

                // when using `auto-height` for a small last section it won't be centered in the viewport
                // 작은 마지막 섹션에 '자동 높이'를 사용할 때 뷰포트 중앙에 배치되지 않습니다.
                if (isAtBottom) {
                    visibleSectionIndex = sections.length - 1;
                }
                // is at top? when using `auto-height` for a small first section it won't be centered in the viewport
                // 위에 있습니까? 작은 첫 번째 섹션에 '자동 높이'를 사용할 때 뷰포트 중앙에 배치되지 않습니다.
                else if(!currentScroll) {
                    visibleSectionIndex = 0;
                }

                // taking the section which is showing more content in the viewport
                // 뷰포트에 더 많은 콘텐츠를 표시하는 섹션 가져오기
                else {
                    for (var i = 0; i < sections.length; ++i) {
                        var section = sections[i];

                        // Pick the the last section which passes the middle line of the screen.
                        // 화면의 중간 선을 통과하는 마지막 섹션을 선택합니다.
                        if (section.offsetTop <= screen_mid) {
                            visibleSectionIndex = i;
                        }
                    }
                }

                if (isCompletelyInViewPort(scrollDirection)) {
                    if (!$(SECTION_ACTIVE_SEL).hasClass(COMPLETELY)) {
                        $(SECTION_ACTIVE_SEL).addClass(COMPLETELY).siblings().removeClass(COMPLETELY);
                    }
                }

                // geting the last one, the current one on the screen
                // 마지막 것, 화면의 현재 것 가져오기
                currentSection = $(sections).eq(visibleSectionIndex);

                // setting the visible section as active when manually scrolling
                // 수동으로 스크롤할 때 보이는 섹션을 활성으로 설정

                // executing only once the first time we reach the section
                // 섹션에 처음 도달할 때 한 번만 실행
                if (!currentSection.hasClass(ACTIVE)) {
                    isScrolling = true;
                    var leavingSection = $(SECTION_ACTIVE_SEL);
                    var leavingSectionIndex = leavingSection.index(SECTION_SEL) + 1;
                    var yMovement = getYmovement(currentSection);
                    var anchorLink  = currentSection.data('anchor');
                    var sectionIndex = currentSection.index(SECTION_SEL) + 1;
                    var activeSlide = currentSection.find(SLIDE_ACTIVE_SEL);
                    var slideIndex;
                    var slideAnchorLink;

                    if (activeSlide.length) {
                        slideAnchorLink = activeSlide.data('anchor');
                        slideIndex = activeSlide.index();
                    }

                    if (canScroll) {
                        currentSection.addClass(ACTIVE).siblings().removeClass(ACTIVE);

                        $.isFunction( options.onLeave ) && options.onLeave.call( leavingSection, leavingSectionIndex, sectionIndex, yMovement);
                        $.isFunction( options.afterLoad ) && options.afterLoad.call( currentSection, anchorLink, sectionIndex);

                        stopMedia(leavingSection);
                        lazyLoad(currentSection);
                        playMedia(currentSection);

                        activateMenuAndNav(anchorLink, sectionIndex - 1);

                        if (options.anchors.length) {
                            // needed to enter in hashChange event when using the menu with anchor links
                            // 앵커 링크가 있는 메뉴를 사용할 때 hashChange 이벤트에 입력해야 함
                            lastScrolledDestiny = anchorLink;
                        }
                        setState(slideIndex, slideAnchorLink, anchorLink, sectionIndex);
                    }

                    // small timeout in order to avoid entering in hashChange event when scrolling is not finished yet
                    // 스크롤이 아직 완료되지 않았을 때 hashChange 이벤트에 들어가는 것을 피하기 위한 작은 시간 초과
                    clearTimeout(scrollId);
                    scrollId = setTimeout(function () {
                        isScrolling = false;
                    }, 100);
                }

                if (options.fitToSection) {
                    // for the auto adjust of the viewport to fit a whole section
                    // 전체 섹션에 맞게 뷰포트의 자동 조정
                    clearTimeout(scrollId2);

                    scrollId2 = setTimeout(function () {
                        // checking it again in case it changed during the delay
                        // 지연 중에 변경된 경우 다시 확인
                        if(options.fitToSection &&

                            // is the destination element bigger than the viewport?
                            // 대상 요소가 뷰포트보다 더 큽니까?
                            $(SECTION_ACTIVE_SEL).outerHeight() <= windowsHeight
                        ){
                            fitToSection();
                        }
                    }, options.fitToSectionDelay);
                }
            }
        }

        /**
        * Fits the site to the nearest active section
        * 가장 가까운 활성 섹션에 사이트를 맞춥니다.
        */
        function fitToSection () {
            // checking fitToSection again in case it was set to false before the timeout delay
            // 시간 초과 지연 전에 false로 설정된 경우 fitToSection 다시 확인
            if(canScroll){
                // allows to scroll to an active section and if the section is already active, we prevent firing callbacks
                // 활성화된 섹션으로 스크롤할 수 있으며 섹션이 이미 활성화된 경우 콜백 실행을 방지합니다.
                isResizing = true;

                scrollPage($(SECTION_ACTIVE_SEL));
                isResizing = false;
            }
        }

        /**
        * Determines whether the active section has seen in its whole or not.
        * 활성 섹션이 전체를 보았는지 여부를 결정합니다.
        */
        function isCompletelyInViewPort (movement) {
            var top = $(SECTION_ACTIVE_SEL).position().top;
            var bottom = top + $window.height();

            if(movement == 'up'){
                return bottom >= ($window.scrollTop() + $window.height());
            }
            return top <= $window.scrollTop();
        }

        /**
        * Gets the directon of the the scrolling fired by the scroll event.
        * scroll 이벤트에 의해 발생한 스크롤 방향을 가져옵니다.
        */
        function getScrollDirection (currentScroll) {
            var direction = currentScroll > lastScroll ? 'down' : 'up';

            lastScroll = currentScroll;

            // needed for auto-height sections to determine if we want to scroll to the top or bottom of the destination
            // 대상의 맨 위 또는 맨 아래로 스크롤할지 여부를 결정하기 위해 자동 높이 섹션에 필요
            previousDestTop = currentScroll;

            return direction;
        }

        /**
        * Determines the way of scrolling up or down:
        * 위 또는 아래로 스크롤하는 방법을 결정합니다.
        * by 'automatically' scrolling a section or by using the default and normal scrolling.
        * 섹션을 '자동으로' 스크롤하거나 기본 및 일반 스크롤을 사용합니다.
        */
        function scrolling (type) {
            if (!isScrollAllowed.m[type]){
                return;
            }

            var scrollSection = (type === 'down') ? moveSectionDown : moveSectionUp;

            if(options.scrollOverflow){
                var scrollable = options.scrollOverflowHandler.scrollable($(SECTION_ACTIVE_SEL));
                var check = (type === 'down') ? 'bottom' : 'top';

                if(scrollable.length > 0 ){
                    // is the scrollbar at the start/end of the scroll?
                    // 스크롤 막대가 스크롤의 시작/끝에 있습니까?
                    if(options.scrollOverflowHandler.isScrolled(check, scrollable)){
                        scrollSection();
                    }else{
                        return true;
                    }
                }else{
                    // moved up/down
                    scrollSection();
                }
            }else{
                // moved up/down
                scrollSection();
            }
        }

        /*
        * Preventing bouncing in iOS #2285
        * iOS #2285에서 바운싱 방지
        */
        function preventBouncing (event) {
            var e = event.originalEvent;
            if(options.autoScrolling && isReallyTouch (e) ){
                //preventing the easing on iOS devices
                event.preventDefault();
            }
        }

        var touchStartY = 0;
        var touchStartX = 0;
        var touchEndY = 0;
        var touchEndX = 0;

        /* Detecting touch events

        * As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
        * 스크롤할 때 페이지의 상단 속성을 변경하기 때문에 기존 방식으로 이를 감지할 수 없습니다.
        * This way, the touchstart and the touch moves shows an small difference between them which is the used one to determine the direction.
        * 이런 식으로 터치 시작과 터치 이동은 방향을 결정하는 데 사용되는 약간의 차이를 보여줍니다.
        */
        function touchMoveHandler (event) {
            var e = event.originalEvent;
            var activeSection = $(e.target).closest(SECTION_SEL);

            // additional: if one of the normalScrollElements isn't within options.normalScrollElementTouchThreshold hops up the DOM chain
            // 추가: normalScrollElements 중 하나가 options.normalScrollElementTouchThreshold 내에 있지 않은 경우 DOM 체인을 홉업합니다.
            if (isReallyTouch (e)  ) {

                if(options.autoScrolling){
                    // preventing the easing on iOS devices
                    // iOS 기기에서 완화 방지
                    event.preventDefault();
                }

                var touchEvents = getEventsPage (e) ;

                touchEndY = touchEvents.y;
                touchEndX = touchEvents.x;

                // if movement in the X axys is greater than in the Y and the currect section has slides...
                // X축의 움직임이 Y보다 크고 현재 섹션에 슬라이드가 있는 경우...
                if (activeSection.find(SLIDES_WRAPPER_SEL).length && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {

                    // is the movement greater than the minimum resistance to scroll?
                    // 움직임이 스크롤에 대한 최소 저항보다 큰가요?
                    if (!slideMoving && Math.abs(touchStartX - touchEndX) > ($window.outerWidth() / 100 * options.touchSensitivity)) {
                        if (touchStartX > touchEndX) {
                            if(isScrollAllowed.m.right){
                                moveSlideRight(activeSection); //next
                            }
                        } else {
                            if(isScrollAllowed.m.left){
                                moveSlideLeft(activeSection); //prev
                            }
                        }
                    }
                }

                // vertical scrolling (only when autoScrolling is enabled)
                // 수직 스크롤(자동 스크롤이 활성화된 경우에만)
                else if(options.autoScrolling && canScroll){

                    //is the movement greater than the minimum resistance to scroll?
                    if (Math.abs(touchStartY - touchEndY) > ($window.height() / 100 * options.touchSensitivity)) {
                        if (touchStartY > touchEndY) {
                            scrolling('down');
                        } else if (touchEndY > touchStartY) {
                            scrolling('up');
                        }
                    }
                }
            }
        }

        /**
        * As IE >= 10 fires both touch and mouse events when using a mouse in a touchscreen this way we make sure that is really a touch event what IE is detecting.
        * IE >= 10은 터치스크린에서 마우스를 사용할 때 터치 및 마우스 이벤트를 모두 실행하므로 이러한 방식으로 IE가 감지하는 터치 이벤트인지 확인합니다.
        */
        function isReallyTouch (e) {
            //if is not IE   ||  IE is detecting `touch` or `pen`
            return typeof e.pointerType === 'undefined' || e.pointerType != 'mouse';
        }

        /**
        * Handler for the touch start event.
        * 터치 시작 이벤트의 핸들러입니다.
        */
        function touchStartHandler (event) {
            var e = event.originalEvent;

            // stopping the auto scroll to adjust to a section
            // 자동 스크롤을 중지하여 섹션 조정
            if(options.fitToSection){
                $htmlBody.stop();
            }

            if(isReallyTouch (e) ){
                var touchEvents = getEventsPage (e) ;
                touchStartY = touchEvents.y;
                touchStartX = touchEvents.x;
            }
        }

        /**
        * Gets the average of the last `number` elements of the given array.
        * 주어진 배열의 마지막 '숫자' 요소의 평균을 가져옵니다.
        */
        function getAverage (elements, number) {
            var sum = 0;

            // taking `number` elements from the end to make the average, if there are not enought, 1
            // 평균을 만들기 위해 끝에서 '숫자' 요소를 취하여 충분하지 않은 경우 1
            var lastElements = elements.slice(Math.max(elements.length - number, 1));

            for(var i = 0; i < lastElements.length; i++){
                sum = sum + lastElements[i];
            }

            return Math.ceil(sum/number);
        }

        /**
         * Detecting mousewheel scrolling
         * 마우스휠 스크롤 감지
         *
         * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
         * http://www.sitepoint.com/html5-javascript-mouse-wheel/
         */
        var prevTime = new Date().getTime();

        function MouseWheelHandler (e) {
            var curTime = new Date().getTime();
            var isNormalScroll = $(COMPLETELY_SEL).hasClass(NORMAL_SCROLL);

            // autoscrolling and not zooming?
            // 자동 스크롤 및 확대/축소가 안되나요?
            if(options.autoScrolling && !controlPressed && !isNormalScroll){
                // cross-browser wheel delta
                // 크로스 브라우저 휠 델타
                e = e || window.event;
                var value = e.wheelDelta || -e.deltaY || -e.detail;
                var delta = Math.max(-1, Math.min(1, value));

                var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
                var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX ) < Math.abs(e.deltaY) || !horizontalDetection);

                // Limiting the array to 150 (lets not waste memory!)
                // 배열을 150으로 제한(메모리 낭비를 방지합니다!)
                if(scrollings.length > 149){
                    scrollings.shift();
                }

                // keeping record of the previous scrollings
                // 이전 스크롤 기록 유지
                scrollings.push(Math.abs(value));

                // preventing to scroll the site on mouse wheel when scrollbar is present
                // 스크롤바가 있을 때 마우스 휠로 사이트 스크롤 방지
                if(options.scrollBar){
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                }

                // time difference between the last scroll and the current one
                // 마지막 스크롤과 현재 스크롤 사이의 시차
                var timeDiff = curTime-prevTime;
                prevTime = curTime;

                // haven't they scrolled in a while?
                // 그들은 잠시 동안 스크롤하지 않았습니까?
                // (enough to be consider a different scrolling action to scroll another section)
                // (다른 섹션을 스크롤하기 위해 다른 스크롤 동작을 고려하기에 충분)
                if(timeDiff > 200){
                    // emptying the array, we dont care about old scrollings for our averages
                    // 배열을 비우면 평균에 대한 오래된 스크롤링은 신경 쓰지 않습니다.
                    scrollings = [];
                }

                if(canScroll){
                    var averageEnd = getAverage(scrollings, 10);
                    var averageMiddle = getAverage(scrollings, 70);
                    var isAccelerating = averageEnd >= averageMiddle;

                    // to avoid double swipes...
                    // 이중 스와이프를 방지하려면...
                    if(isAccelerating && isScrollingVertically){
                        // scrolling down?
                        if (delta < 0) {
                            scrolling('down');

                        // scrolling up?
                        }else {
                            scrolling('up');
                        }
                    }
                }

                return false;
            }

            if(options.fitToSection){
                // stopping the auto scroll to adjust to a section
                // 자동 스크롤을 중지하여 섹션 조정
                $htmlBody.stop();
            }
        }

        /**
        * Slides a slider to the given direction.
        * 슬라이더를 주어진 방향으로 밉니다.
        * 
        * Optional `section` param.
        * 선택적 '섹션' 매개변수입니다.
        */
        function moveSlide (direction, section) {
            var activeSection = typeof section === 'undefined' ? $(SECTION_ACTIVE_SEL) : section;
            var slides = activeSection.find(SLIDES_WRAPPER_SEL);
            var numSlides = slides.find(SLIDE_SEL).length;

            // more than one slide needed and nothing should be sliding
            // 하나 이상의 슬라이드가 필요하고 아무것도 미끄러지지 않아야 합니다.
            if (!slides.length || slideMoving || numSlides < 2) {
                return;
            }

            var currentSlide = slides.find(SLIDE_ACTIVE_SEL);
            var destiny = null;

            if(direction === 'left'){
                destiny = currentSlide.prev(SLIDE_SEL);
            }else{
                destiny = currentSlide.next(SLIDE_SEL);
            }

            // isn't there a next slide in the secuence?
            // 시퀀스에 다음 슬라이드가 없습니까?
            if(!destiny.length){
                // respect loopHorizontal settin
                // 리스펙트 루프 수평 설정
                if (!options.loopHorizontal) return;

                if(direction === 'left'){
                    destiny = currentSlide.siblings(':last');
                }else{
                    destiny = currentSlide.siblings(':first');
                }
            }

            slideMoving = true;

            landscapeScroll(slides, destiny, direction);
        }

        /**
        * Maintains the active slides in the viewport
        * 뷰포트에서 활성 슬라이드를 유지합니다.
        * 
        * (Because the `scroll` animation might get lost with some actions, such as when using continuousVertical)
        * (continuousVertical을 사용하는 경우와 같이 일부 작업으로 '스크롤' 애니메이션이 손실될 수 있기 때문에)
        */
        function keepSlidesPosition () {
            $(SLIDE_ACTIVE_SEL).each(function () {
                silentLandscapeScroll($(this), 'internal');
            });
        }

        var previousDestTop = 0;
        /**
        * Returns the destination Y position based on the scrolling direction and the height of the section.
        * 스크롤 방향과 섹션 높이를 기반으로 대상 Y 위치를 반환합니다.
        */
        function getDestinationPosition (element) {
            var elemPosition = element.position();

            // top of the desination will be at the top of the viewport
            // 목적지의 상단은 뷰포트의 상단에 있을 것입니다.
            var position = elemPosition.top;
            var isScrollingDown =  elemPosition.top > previousDestTop;
            var sectionBottom = position - windowsHeight + element.outerHeight();
            var bigSectionsDestination = options.bigSectionsDestination;

            // is the destination element bigger than the viewport?
            // 대상 요소가 뷰포트보다 더 큽니까?
            if(element.outerHeight() > windowsHeight){
                //scrolling up?
                if(!isScrollingDown && !bigSectionsDestination || bigSectionsDestination === 'bottom' ){
                    position = sectionBottom;
                }
            }

            // sections equal or smaller than the viewport height && scrolling down? ||  is resizing and its in the last section
            // 뷰포트 높이와 같거나 작은 섹션 && 아래로 스크롤합니까? || 크기 조정 중이며 마지막 섹션에 있습니다.
            else if(isScrollingDown || (isResizing && element.is(':last-child')) ){
                // The bottom of the destination will be at the bottom of the viewport
                // 목적지의 맨 아래는 뷰포트의 맨 아래가 됩니다.
                position = sectionBottom;
            }

            /*
            Keeping record of the last scrolled position to determine the scrolling direction.
            스크롤 방향을 결정하기 위해 마지막으로 스크롤된 위치의 기록을 유지합니다.

            No conventional methods can be used as the scroll bar might not be present AND the section might not be active if it is auto-height and didnt reach the middle of the viewport.
            스크롤 막대가 없을 수 있고 섹션이 자동 높이이고 뷰포트 중앙에 도달하지 않은 경우 섹션이 활성화되지 않을 수 있으므로 기존 방법을 사용할 수 없습니다.
            */
            previousDestTop = position;
            return position;
        }

        /**
        * Scrolls the site to the given element and scrolls to the slide if a callback is given.
        * 사이트를 지정된 요소로 스크롤하고 콜백이 제공되면 슬라이드로 스크롤합니다.
        */
        function scrollPage (element, callback, isMovementUp) {
            if(typeof element === 'undefined'){ return; } //there's no element to scroll, leaving the function

            var dtop = getDestinationPosition(element);
            var slideAnchorLink;
            var slideIndex;

            // local variables
            // 지역 변수
            var v = {
                element: element,
                callback: callback,
                isMovementUp: isMovementUp,
                dtop: dtop,
                yMovement: getYmovement(element),
                anchorLink: element.data('anchor'),
                sectionIndex: element.index(SECTION_SEL),
                activeSlide: element.find(SLIDE_ACTIVE_SEL),
                activeSection: $(SECTION_ACTIVE_SEL),
                leavingSection: $(SECTION_ACTIVE_SEL).index(SECTION_SEL) + 1,

                // caching the value of isResizing at the momment the function is called because it will be checked later inside a setTimeout and the value might change
                // 캐싱 값은 나중에 setTimeout 내에서 확인되고 값이 변경될 수 있기 때문에 함수가 호출되는 순간 크기 조정입니다.
                localIsResizing: isResizing
            };

            // quiting when destination scroll is the same as the current one
            // 대상 스크롤이 현재 스크롤과 같을 때 종료
            if((v.activeSection.is(element) && !isResizing) || (options.scrollBar && $window.scrollTop() === v.dtop && !element.hasClass(AUTO_HEIGHT) )){ return; }

            if(v.activeSlide.length){
                slideAnchorLink = v.activeSlide.data('anchor');
                slideIndex = v.activeSlide.index();
            }

            // callback (onLeave) if the site is not just resizing and readjusting the slides
            // 사이트가 슬라이드의 크기를 조정하고 재조정하지 않는 경우 콜백(onLeave)
            if($.isFunction(options.onLeave) && !v.localIsResizing){
                var direction = v.yMovement;

                // required for continousVertical
                // 연속 수직에 필요
                if(typeof isMovementUp !== 'undefined'){
                    direction = isMovementUp ? 'up' : 'down';
                }

                if(options.onLeave.call(v.activeSection, v.leavingSection, (v.sectionIndex + 1), direction) === false){
                    return;
                }
            }

            // If continuousVertical && we need to wrap around
            // ContinuousVertical && 인 경우 둘러싸야 합니다.
            if (options.autoScrolling && options.continuousVertical && typeof (v.isMovementUp) !== "undefined" &&
                ((!v.isMovementUp && v.yMovement == 'up') || // Intending to scroll down but about to go up or
                (v.isMovementUp && v.yMovement == 'down'))) { // intending to scroll up but about to go down

                v = createInfiniteSections(v);
            }

            // pausing media of the leaving section (if we are not just resizing, as destinatino will be the same one)
            // 떠나는 섹션의 미디어 일시 중지(크기만 조정하는 것이 아닌 경우 대상이 같으므로)
            if(!v.localIsResizing){
                stopMedia(v.activeSection);
            }

            if(options.scrollOverflow){
                options.scrollOverflowHandler.beforeLeave();
            }

            element.addClass(ACTIVE).siblings().removeClass(ACTIVE);
            lazyLoad(element);

            if(options.scrollOverflow){
                options.scrollOverflowHandler.onLeave();
            }

            // preventing from activating the MouseWheelHandler event more than once if the page is scrolling
            // 페이지가 스크롤되는 경우 MouseWheelHandler 이벤트를 두 번 이상 활성화하는 것을 방지
            canScroll = false;

            setState(slideIndex, slideAnchorLink, v.anchorLink, v.sectionIndex);

            performMovement(v);

            // flag to avoid callingn `scrollPage()` twice in case of using anchor links
            // 앵커 링크를 사용하는 경우 `scroll Page()`를 두 번 호출하지 않도록 플래그
            lastScrolledDestiny = v.anchorLink;

            // avoid firing it twice (as it does also on scroll)
            // 두 번 실행하지 마십시오(스크롤에서도 마찬가지).
            activateMenuAndNav(v.anchorLink, v.sectionIndex);
        }

        /**
        * Performs the vertical movement (by CSS3 or by jQuery)
        * 수직 이동을 수행합니다(CSS3 또는 jQuery에 의해)
        */
        function performMovement (v) {
            // using CSS3 translate functionality
            // CSS3 번역 기능 사용
            if (options.css3 && options.autoScrolling && !options.scrollBar) {

                // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
                // 첫 번째 섹션은 iOS 10에서 음수 값을 가질 수 있습니다. 이유는 확실하지 않습니다. -0.0142822265625
                // that's why we round it to 0.
                // 그래서 우리는 그것을 0으로 반올림합니다.
                var translate3d = 'translate3d(0px, -' + Math.round(v.dtop) + 'px, 0px)';
                transformContainer(translate3d, true);

                // even when the scrollingSpeed is 0 there's a little delay, which might cause the scrollingSpeed to change in case of using silentMoveTo();
                // scrollingSpeed가 0인 경우에도 약간의 지연이 있으므로 silentMoveTo()를 사용하는 경우 scrollingSpeed가 변경될 수 있습니다.
                if(options.scrollingSpeed){
                    clearTimeout(afterSectionLoadsId);
                    afterSectionLoadsId = setTimeout(function () {
                        afterSectionLoads(v);
                    }, options.scrollingSpeed);
                }else{
                    afterSectionLoads(v);
                }
            }

            // using jQuery animate
            // jQuery 애니메이트를 사용하여
            else{
                var scrollSettings = getScrollSettings(v);

                $(scrollSettings.element).animate(
                    scrollSettings.options,
                options.scrollingSpeed, options.easing).promise().done(function () { 
                    // only one single callback in case of animating  `html, body`
                    // `html, body`에 애니메이션을 적용하는 경우 하나의 단일 콜백만

                    if(options.scrollBar){

                        /* Hack!
                            The timeout prevents setting the most dominant section in the viewport as "active" when the user
                            scrolled to a smaller section by using the mousewheel (auto scrolling) rather than draging the scroll bar.
                            시간 초과는 사용자가 스크롤 막대를 드래그하는 대신 마우스휠(자동 스크롤)을 사용하여 더 작은 섹션으로 스크롤할 때 뷰포트에서 가장 지배적인 섹션을 "활성"으로 설정하는 것을 방지합니다.

                            When using scrollBar:true It seems like the scroll events still getting propagated even after the scrolling animation has finished.
                            scrollBar:true를 사용할 때 스크롤 애니메이션이 끝난 후에도 스크롤 이벤트가 계속 전파되는 것 같습니다.
                        */
                        setTimeout(function () {
                            afterSectionLoads(v);
                        },30);
                    }else{
                        afterSectionLoads(v);
                    }
                });
            }
        }

        /**
        * Gets the scrolling settings depending on the plugin autoScrolling option
        * 플러그인 autoScrolling 옵션에 따라 스크롤링 설정을 가져옵니다.
        */
        function getScrollSettings (v) {
            var scroll = {};

            if(options.autoScrolling && !options.scrollBar){
                scroll.options = { 'top': -v.dtop};
                scroll.element = WRAPPER_SEL;
            }else{
                scroll.options = { 'scrollTop': v.dtop};
                scroll.element = 'html, body';
            }

            return scroll;
        }

        /**
        * Adds sections before or after the current one to create the infinite effect.
        * 현재 섹션 앞이나 뒤에 섹션을 추가하여 무한 효과를 만듭니다.
        */
        function createInfiniteSections (v) {
            // Scrolling down
            if (!v.isMovementUp) {
                // Move all previous sections to after the active section
                // 모든 이전 섹션을 활성 섹션 뒤로 이동
                $(SECTION_ACTIVE_SEL).after(v.activeSection.prevAll(SECTION_SEL).get().reverse());
            }
            else { // Scrolling up
                // Move all next sections to before the active section
                // 다음 섹션을 모두 활성 섹션 앞으로 이동
                $(SECTION_ACTIVE_SEL).before(v.activeSection.nextAll(SECTION_SEL));
            }

            // Maintain the displayed position (now that we changed the element order)
            // 표시된 위치 유지(이제 요소 순서를 변경했으므로)
            silentScroll($(SECTION_ACTIVE_SEL).position().top);

            // Maintain the active slides visible in the viewport
            // 뷰포트에 표시되는 활성 슬라이드 유지
            keepSlidesPosition();

            // save for later the elements that still need to be reordered
            // 여전히 재정렬해야 하는 요소는 나중을 위해 저장합니다.
            v.wrapAroundElements = v.activeSection;

            // Recalculate animation variables
            // 애니메이션 변수 재계산
            v.dtop = v.element.position().top;
            v.yMovement = getYmovement(v.element);

            // sections will temporally have another position in the DOM updating this values in case we need them
            // 섹션은 필요한 경우 이 값을 업데이트하는 DOM의 다른 위치를 일시적으로 갖게 됩니다.
            v.leavingSection = v.activeSection.index(SECTION_SEL) + 1;
            v.sectionIndex = v.element.index(SECTION_SEL);

            return v;
        }

        /**
        * Fix section order after continuousVertical changes have been animated
        * 연속적인 수직 변경이 애니메이션된 후 섹션 순서 수정
        */
        function continuousVerticalFixSectionOrder (v) {
            // If continuousVertical is in effect (and autoScrolling would also be in effect then), finish moving the elements around so the direct navigation will function more simply
            // 연속 수직이 적용되는 경우(그리고 자동 스크롤도 적용됨) 직접 탐색이 더 간단하게 작동하도록 요소 이동을 완료합니다.
            if (!v.wrapAroundElements || !v.wrapAroundElements.length) {
                return;
            }

            if (v.isMovementUp) {
                $(SECTION_FIRST_SEL).before(v.wrapAroundElements);
            }
            else {
                $(SECTION_LAST_SEL).after(v.wrapAroundElements);
            }

            silentScroll($(SECTION_ACTIVE_SEL).position().top);

            // Maintain the active slides visible in the viewport
            // 뷰포트에 표시되는 활성 슬라이드 유지
            keepSlidesPosition();
        }


        /**
        * Actions to do once the section is loaded.
        * 섹션이 로드되면 수행할 작업입니다.
        */
        function afterSectionLoads (v) {
            continuousVerticalFixSectionOrder(v);

            // callback (afterLoad) if the site is not just resizing and readjusting the slides
            // 사이트가 슬라이드 크기를 조정하고 재조정하지 않는 경우 콜백(afterLoad)
            $.isFunction(options.afterLoad) && !v.localIsResizing && options.afterLoad.call(v.element, v.anchorLink, (v.sectionIndex + 1));

            if(options.scrollOverflow){
                options.scrollOverflowHandler.afterLoad();
            }

            if(!v.localIsResizing){
                playMedia(v.element);
            }

            v.element.addClass(COMPLETELY).siblings().removeClass(COMPLETELY);

            canScroll = true;

            $.isFunction(v.callback) && v.callback.call(this);
        }

        /**
        * Sets the value for the given attribute from the `data-` attribute with the same suffix
        * 동일한 접미사를 가진 `data-` 속성에서 주어진 속성에 대한 값을 설정합니다.
        * 
        * ie: data-srcset ==> srcset  |  data-src ==> src
        */
        function setSrc (element, attribute) {
            element
                .attr(attribute, element.data(attribute))
                .removeAttr('data-' + attribute);
        }

        /**
        * Lazy loads image, video and audio elements.
        * Lazy는 이미지, 비디오 및 오디오 요소를 로드합니다.
        */
        function lazyLoad (destiny) {
            if (!options.lazyLoading){
                return;
            }

            var panel = getSlideOrSection(destiny);
            var element;

            panel.find('img[data-src], img[data-srcset], source[data-src], source[data-srcset], video[data-src], audio[data-src], iframe[data-src]').each(function () {
                element = $(this);

                $.each(['src', 'srcset'], function(index, type){
                    var attribute = element.attr('data-' + type);
                    if(typeof attribute !== 'undefined' && attribute){
                        setSrc(element, type);
                    }
                });

                if(element.is('source')){
                    var typeToPlay = element.closest('video').length ? 'video' : 'audio';
                    element.closest(typeToPlay).get(0).load();
                }
            });
        }

        /**
        * Plays video and audio elements.
        * 비디오 및 오디오 요소를 재생합니다.
        */
        function playMedia (destiny) {
            var panel = getSlideOrSection(destiny);

            //playing HTML5 media elements
            panel.find('video, audio').each(function () {
                var element = $(this).get(0);

                if( element.hasAttribute('data-autoplay') && typeof element.play === 'function' ) {
                    element.play();
                }
            });

            // youtube videos
            panel.find('iframe[src*="youtube.com/embed/"]').each(function () {
                var element = $(this).get(0);

                if ( element.hasAttribute('data-autoplay') ){
                    playYoutube(element);
                }

                // in case the URL was not loaded yet. On page load we need time for the new URL (with the API string) to load.
                // URL이 아직 로드되지 않은 경우. 페이지 로드 시 새 URL(API 문자열 포함)이 로드될 시간이 필요합니다.
                element.onload = function() {
                    if ( element.hasAttribute('data-autoplay') ){
                        playYoutube(element);
                    }
                };
            });
        }

        /**
        * Plays a youtube video
        */
        function playYoutube (element) {
            element.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }

        /**
        * Stops video and audio elements.
        * 비디오 및 오디오 요소를 중지합니다.
        */
        function stopMedia (destiny) {
            var panel = getSlideOrSection(destiny);

            // stopping HTML5 media elements
            // HTML5 미디어 요소 중지
            panel.find('video, audio').each(function () {
                var element = $(this).get(0);

                if( !element.hasAttribute('data-keepplaying') && typeof element.pause === 'function' ) {
                    element.pause();
                }
            });

            // youtube videos
            panel.find('iframe[src*="youtube.com/embed/"]').each(function () {
                var element = $(this).get(0);

                if( /youtube\.com\/embed\//.test($(this).attr('src')) && !element.hasAttribute('data-keepplaying')){
                    $(this).get(0).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}','*');
                }
            });
        }

        /**
        * Gets the active slide (or section) for the given section
        * 주어진 섹션에 대한 활성 슬라이드(또는 섹션)를 가져옵니다.
        */
        function getSlideOrSection (destiny) {
            var slide = destiny.find(SLIDE_ACTIVE_SEL);
            if( slide.length ) {
                destiny = $(slide);
            }

            return destiny;
        }

        /**
        * Scrolls to the anchor in the URL when loading the site
        * 사이트를 로드할 때 URL의 앵커로 스크롤합니다.
        */
        function scrollToAnchor () {
            var anchors =  getAnchorsURL();
            var sectionAnchor = anchors.section;
            var slideAnchor = anchors.slide;

            if(sectionAnchor){  //if theres any #
                if(options.animateAnchor){
                    scrollPageAndSlide(sectionAnchor, slideAnchor);
                }else{
                    silentMoveTo(sectionAnchor, slideAnchor);
                }
            }
        }

        /**
        * Detecting any change on the URL to scroll to the given anchor link
        * 주어진 앵커 링크로 스크롤하기 위한 URL 변경 감지
        * 
        * (a way to detect back history button as we play with the hashes on the URL)
        * (URL의 해시로 재생할 때 이전 기록 버튼을 감지하는 방법)
        */
        function hashChangeHandler () {
            
            if(!isScrolling && !options.lockAnchors){
                var anchors = getAnchorsURL();
                var sectionAnchor = anchors.section;
                var slideAnchor = anchors.slide;

                // when moving to a slide in the first section for the first time (first time to add an anchor to the URL)
                // 첫 번째 섹션의 슬라이드로 처음 이동할 때(URL에 앵커를 처음 추가하는 경우)
                var isFirstSlideMove =  (typeof lastScrolledDestiny === 'undefined');
                var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined' && typeof slideAnchor === 'undefined' && !slideMoving);

                if(sectionAnchor && sectionAnchor.length){
                    /*
                        in order to call scrollpage() only once for each destination at a time
                        It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange`
                        event is fired on every scroll too.

                        한 번에 각 대상에 대해 한 번만 scrollpage()를 호출하기 위해 그렇지 않으면 앵커 링크를 사용하는 경우 'hashChange' 이벤트가 모든 스크롤에서 발생하므로 각 스크롤에 대해 두 번 호출됩니다.
                    */
                    if ((sectionAnchor && sectionAnchor !== lastScrolledDestiny) && !isFirstSlideMove
                        || isFirstScrollMove
                        || (!slideMoving && lastScrolledSlide != slideAnchor )){

                        scrollPageAndSlide(sectionAnchor, slideAnchor);
                    }
                }
            }
        }

        // gets the URL anchors (section and slide)
        // URL 앵커(섹션 및 슬라이드)를 가져옵니다.
        function getAnchorsURL () {
            var section; 
            var slide;
            var hash = window.location.hash;

            if(hash.length){
                // getting the anchor link in the URL and deleting the `#`
                // URL에서 앵커 링크 가져오기 및 `#` 삭제
                var anchorsParts =  hash.replace('#', '').split('/');

                // using / for visual reasons and not as a section/slide separator #2803
                // 섹션/슬라이드 구분 기호가 아닌 시각적인 이유로 / 사용 #2803
                var isFunkyAnchor = hash.indexOf('#/') > -1;

                section = isFunkyAnchor ? '/' + anchorsParts[1] : decodeURIComponent(anchorsParts[0]);

                var slideAnchor = isFunkyAnchor ? anchorsParts[2] : anchorsParts[1];
                if(slideAnchor && slideAnchor.length){
                    slide = decodeURIComponent(slideAnchor);
                }
            }

            return {
                section: section,
                slide: slide
            }
        }

        /*
            function keydownHandler (e)  {
                clearTimeout(keydownId);

                var activeElement = $(':focus');
                var keyCode = e.which;

                if (keyCode === 9) {
                    onTab (e) ;
                } else if(!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select') &&
                    activeElement.attr('contentEditable') !== "true" && activeElement.attr('contentEditable') !== '' &&
                    options.keyboardScrolling && options.autoScrolling) {

                    var keyControls = [40, 38, 32, 33, 34];

                    if($.inArray(keyCode, keyControls) > -1){
                        e.preventDefault();
                    }

                    controlPressed = e.ctrlKey;

                    keydownId = setTimeout(function () {
                        onkeydown (e) ;
                    }, 150);
                }
            }


            function onTab (e) {
                var isShiftPressed = e.shiftKey;
                var activeElement = $(':focus');
                var activeSection = $(SECTION_ACTIVE_SEL);
                var activeSlide = activeSection.find(SLIDE_ACTIVE_SEL);
                var focusableWrapper = activeSlide.length ? activeSlide : activeSection;
                var focusableElements = focusableWrapper.find(focusableElementsString).not('[tabindex="-1"]');

                function preventAndFocusFirst (e) {
                    e.preventDefault();
                    return focusableElements.first().focus();
                }

                if(activeElement.length){
                    if(!activeElement.closest(SECTION_ACTIVE_SEL, SLIDE_ACTIVE_SEL).length){
                        activeElement = preventAndFocusFirst (e) ;
                    }
                } else{
                    preventAndFocusFirst (e) ;
                }

                if(!isShiftPressed && activeElement.is(focusableElements.last()) ||
                    isShiftPressed && activeElement.is(focusableElements.first())
                ){
                    e.preventDefault();
                }
        }
        */

        function keydownHandler  (e)  {
            clearTimeout(keydownId);

            var activeElement = $(':focus');

            if (!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select') && activeElement.attr('contentEditable') !== "true" && activeElement.attr('contentEditable') !== '' && options.keyboardScrolling && options.autoScrolling) {

                var keyCode = e.which;
                var keyControls = [40, 38, 32, 33, 34];

                if ($.inArray(keyCode, keyControls) > -1) {
                    e.preventDefault()
                }

                controlPressed = e.ctrlKey;

                keydownId = setTimeout(function() {
                    onkeydown (e) 
                }, 150)
            }
        }

        function tooltipTextHandler () {
            $(this).prev().trigger('click');
        }

        // to prevent scrolling while zooming
        // 확대/축소 중 스크롤 방지
        function keyUpHandler (e) {
            if(isWindowFocused){ 
                // the keyup gets fired on new tab ctrl + t in Firefox
                // Firefox의 새 탭 ctrl + t에서 키업이 시작됩니다.
                controlPressed = e.ctrlKey;
            }
        }

        // binding the mousemove when the mouse's middle button is released
        // 마우스의 가운데 버튼을 놓을 때 mousemove 바인딩
        function mouseDownHandler (e) {
            //middle button
            if (e.which == 2){
                oldPageY = e.pageY;
                container.on('mousemove', mouseMoveHandler);
            }
        }

        // unbinding the mousemove when the mouse's middle button is released
        // 마우스 가운데 버튼을 놓을 때 mousemove 바인딩 해제
        function mouseUpHandler (e) {
            //middle button
            if (e.which == 2){
                container.off('mousemove');
            }
        }

        // Scrolling horizontally when clicking on the slider controls.
        // 슬라이더 컨트롤을 클릭할 때 수평으로 스크롤합니다.
        function slideArrowHandler () {
            var section = $(this).closest(SECTION_SEL);

            if ($(this).hasClass(SLIDES_PREV)) {
                if(isScrollAllowed.m.left){
                    moveSlideLeft(section);
                }
            } else {
                if(isScrollAllowed.m.right){
                    moveSlideRight(section);
                }
            }
        }

        // when opening a new tab (ctrl + t), `control` won't be pressed when coming back.
        // 새 탭을 열 때(ctrl + t), 돌아올 때 `control`이 눌러지지 않습니다.
        function blurHandler () {
            isWindowFocused = false;
            controlPressed = false;
        }

        // Scrolls to the section when clicking the navigation bullet
        // 탐색 글머리 기호를 클릭하면 섹션으로 스크롤
        function sectionBulletHandler (e) {
            e.preventDefault();
            var index = $(this).parent().index();
            scrollPage($(SECTION_SEL).eq(index));
        }

        // Scrolls the slider to the given slide destination for the given section
        // 슬라이더를 지정된 섹션의 지정된 슬라이드 대상으로 스크롤합니다.
        function slideBulletHandler (e) {
            e.preventDefault();
            var slides = $(this).closest(SECTION_SEL).find(SLIDES_WRAPPER_SEL);
            var destiny = slides.find(SLIDE_SEL).eq($(this).closest('li').index());

            landscapeScroll(slides, destiny);
        }

        /**
        * Keydown event
        * 키다운 이벤트
        */
        function onkeydown (e) {
            var shiftPressed = e.shiftKey;

            // do nothing if we can not scroll or we are not using horizotnal key arrows.
            // 스크롤할 수 없거나 수평 키 화살표를 사용하지 않는 경우 아무 것도 하지 마십시오.
            if(!canScroll && [37,39].indexOf(e.which) < 0){
                return;
            }

            switch (e.which) {
                // up
                case 38:
                case 33:
                    if(isScrollAllowed.k.up){
                        moveSectionUp();
                    }
                    break;

                // down
                case 32: //spacebar
                    if(shiftPressed && isScrollAllowed.k.up){
                        moveSectionUp();
                        break;
                    }
                /* 
                    falls through
                    넘어지다
                */
                case 40:
                case 34:
                    if(isScrollAllowed.k.down){
                        moveSectionDown();
                    }
                    break;

                // Home
                case 36:
                    if(isScrollAllowed.k.up){
                        moveTo(1);
                    }
                    break;

                // End
                case 35:
                     if(isScrollAllowed.k.down){
                        moveTo( $(SECTION_SEL).length );
                    }
                    break;

                // left
                case 37:
                    if(isScrollAllowed.k.left){
                        moveSlideLeft();
                    }
                    break;

                // right
                case 39:
                    if(isScrollAllowed.k.right){
                        moveSlideRight();
                    }
                    break;

                default:
                    return; 
                    // exit this handler for other keys
                    // 다른 키에 대해 이 핸들러를 종료합니다.
            }
        }

        /**
        * Detecting the direction of the mouse movement.
        * 마우스 움직임의 방향을 감지합니다.
        * 
        * Used only for the middle button of the mouse.
        * 마우스의 가운데 버튼에만 사용됩니다.
        */
        var oldPageY = 0;
        function mouseMoveHandler (e) {
            if(canScroll){
                // moving up
                if (e.pageY < oldPageY && isScrollAllowed.m.up){
                    moveSectionUp();
                }

                // moving down
                else if(e.pageY > oldPageY && isScrollAllowed.m.down){
                    moveSectionDown();
                }
            }
            oldPageY = e.pageY;
        }

        /**
        * Scrolls horizontal sliders.
        * 수평 슬라이더를 스크롤합니다.
        */
        function landscapeScroll (slides, destiny, direction) {
            var section = slides.closest(SECTION_SEL);
            var v = {
                slides: slides,
                destiny: destiny,
                direction: direction,
                destinyPos: destiny.position(),
                slideIndex: destiny.index(),
                section: section,
                sectionIndex: section.index(SECTION_SEL),
                anchorLink: section.data('anchor'),
                slidesNav: section.find(SLIDES_NAV_SEL),
                slideAnchor:  getAnchor(destiny),
                prevSlide: section.find(SLIDE_ACTIVE_SEL),
                prevSlideIndex: section.find(SLIDE_ACTIVE_SEL).index(),

                // caching the value of isResizing at the momment the function is called because it will be checked later inside a setTimeout and the value might change
                // 캐싱 값은 나중에 setTimeout 내에서 확인되고 값이 변경될 수 있기 때문에 함수가 호출되는 순간 크기 조정입니다.
                localIsResizing: isResizing
            };
            v.xMovement = getXmovement(v.prevSlideIndex, v.slideIndex);

            // important!! Only do it when not resizing
            // 중요한!! 크기를 조정하지 않을 때만 하십시오.
            if(!v.localIsResizing){
                // preventing from scrolling to the next/prev section when using scrollHorizontally
                // scrollHorizontally를 사용할 때 다음/이전 섹션으로 스크롤하는 것을 방지
                canScroll = false;
            }

            if(options.onSlideLeave){

                // if the site is not just resizing and readjusting the slides
                // 사이트가 슬라이드의 크기를 조정하고 재조정하는 것이 아닌 경우
                if(!v.localIsResizing && v.xMovement!=='none'){
                    if($.isFunction( options.onSlideLeave )){
                        if(options.onSlideLeave.call( v.prevSlide, v.anchorLink, (v.sectionIndex + 1), v.prevSlideIndex, v.direction, v.slideIndex ) === false){
                            slideMoving = false;
                            return;
                        }
                    }
                }
            }

            destiny.addClass(ACTIVE).siblings().removeClass(ACTIVE);

            if(!v.localIsResizing){
                stopMedia(v.prevSlide);
                lazyLoad(destiny);
            }

            if(!options.loopHorizontal && options.controlArrows){
                // hidding it for the fist slide, showing for the rest
                // 첫 번째 슬라이드에는 숨기고 나머지 슬라이드에는 표시
                section.find(SLIDES_ARROW_PREV_SEL).toggle(v.slideIndex!==0);

                // hidding it for the last slide, showing for the rest
                // 마지막 슬라이드에는 숨기고 나머지 슬라이드에는 표시
                section.find(SLIDES_ARROW_NEXT_SEL).toggle(!destiny.is(':last-child'));
            }

            // only changing the URL if the slides are in the current section (not for resize re-adjusting)
            // 슬라이드가 현재 섹션에 있는 경우에만 URL 변경(크기 재조정용 아님)
            if(section.hasClass(ACTIVE) && !v.localIsResizing){
                setState(v.slideIndex, v.slideAnchor, v.anchorLink, v.sectionIndex);
            }

            performHorizontalMove(slides, v, true);
        }


        function afterSlideLoads (v) {
            activeSlidesNavigation(v.slidesNav, v.slideIndex);

            // if the site is not just resizing and readjusting the slides
            // 사이트가 슬라이드의 크기를 조정하고 재조정하는 것이 아닌 경우
            if(!v.localIsResizing){
                $.isFunction( options.afterSlideLoad ) && options.afterSlideLoad.call( v.destiny, v.anchorLink, (v.sectionIndex + 1), v.slideAnchor, v.slideIndex);

                // needs to be inside the condition to prevent problems with continuousVertical and scrollHorizontally and to prevent double scroll right after a windows resize
                // ContinuousVertical 및 scrollHorizontally 문제를 방지하고 창 크기 조정 직후 이중 스크롤을 방지하려면 조건 내에 있어야 합니다.
                canScroll = true;

                playMedia(v.destiny);
            }

            // letting them slide again
            // 그들이 다시 미끄러지도록
            slideMoving = false;
        }

        /**
        * Performs the horizontal movement. (CSS3 or jQuery)
        * 수평 이동을 수행합니다. (CSS3 또는 jQuery)
        *
        * @param fireCallback {Bool} - 
        * determines whether or not to fire the callback
        * 콜백을 실행할지 여부를 결정합니다.
        */
        function performHorizontalMove (slides, v, fireCallback) {
            var destinyPos = v.destinyPos;

            if(options.css3){
                var translate3d = 'translate3d(-' + Math.round(destinyPos.left) + 'px, 0px, 0px)';

                addAnimation(slides.find(SLIDES_CONTAINER_SEL)).css(getTransforms(translate3d));

                afterSlideLoadsId = setTimeout(function () {
                    fireCallback && afterSlideLoads(v);
                }, options.scrollingSpeed, options.easing);
            }else{
                slides.animate({
                    scrollLeft : Math.round(destinyPos.left)
                }, options.scrollingSpeed, options.easing, function() {

                    fireCallback && afterSlideLoads(v);
                });
            }
        }

        /**
        * Sets the state for the horizontal bullet navigations.
        * 가로 글머리 기호 탐색의 상태를 설정합니다.
        */
        function activeSlidesNavigation (slidesNav, slideIndex){
            slidesNav.find(ACTIVE_SEL).removeClass(ACTIVE);
            slidesNav.find('li').eq(slideIndex).find('a').addClass(ACTIVE);
        }

        var previousHeight = windowsHeight;

        // when resizing the site, we adjust the heights of the sections, slimScroll...
        // 사이트 크기를 조정할 때 섹션의 높이를 조정합니다. SlimScroll...
        function resizeHandler () {
            // checking if it needs to get responsive
            // 응답해야 하는지 확인
            responsive();

            // rebuild immediately on touch devices
            // 터치 장치에서 즉시 재구축
            if (isTouchDevice) {
                var activeElement = $(document.activeElement);

                // if the keyboard is NOT visible
                // 키보드가 보이지 않는 경우
                if (!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select')) {
                    var currentHeight = $window.height();

                    // making sure the change in the viewport size is enough to force a rebuild. (20 % of the window to avoid problems when hidding scroll bars)
                    // 뷰포트 크기의 변경이 강제로 다시 빌드하기에 충분한지 확인합니다. (스크롤 막대를 숨길 때 문제를 피하기 위해 창의 20%)
                    if( Math.abs(currentHeight - previousHeight) > (20 * Math.max(previousHeight, currentHeight) / 100) ){
                        reBuild(true);
                        previousHeight = currentHeight;
                    }
                }
            }else{
                // in order to call the functions only when the resize is finished
                // 크기 조정이 완료되었을 때만 함수를 호출하기 위해
                //http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
                clearTimeout(resizeId);

                resizeId = setTimeout(function () {
                    reBuild(true);
                }, 350);
            }
        }

        /**
        * Checks if the site needs to get responsive and disables autoScrolling if so.
        * 사이트가 응답해야 하는지 확인하고 필요한 경우 자동 스크롤을 비활성화합니다.
        * 
        * A class `fp-responsive` is added to the plugin's container in case the user wants to use it for his own responsive CSS.
        * 사용자가 자신의 반응형 CSS에 사용하려는 경우를 대비하여 'fp-responsive' 클래스가 플러그인의 컨테이너에 추가됩니다.
        */
        function responsive () {
            var widthLimit = options.responsive || options.responsiveWidth; // backwards compatiblity // 이전 버전과의 호환성
            var heightLimit = options.responsiveHeight;

            // only calculating what we need. Remember its called on the resize event.
            // 필요한 만큼만 계산합니다. 크기 조정 이벤트에서 호출되었음을 기억하십시오.
            var isBreakingPointWidth = widthLimit && $window.outerWidth() < widthLimit;
            var isBreakingPointHeight = heightLimit && $window.height() < heightLimit;

            if(widthLimit && heightLimit){
                setResponsive(isBreakingPointWidth || isBreakingPointHeight);
            }
            else if(widthLimit){
                setResponsive(isBreakingPointWidth);
            }
            else if(heightLimit){
                setResponsive(isBreakingPointHeight);
            }
        }

        /**
        * Adds transition animations for the given element
        * 주어진 요소에 대한 전환 애니메이션을 추가합니다.
        */
        function addAnimation (element) {
            var transition = 'all ' + options.scrollingSpeed + 'ms ' + options.easingcss3;

            element.removeClass(NO_TRANSITION);
            return element.css({
                '-webkit-transition': transition,
                'transition': transition
            });
        }

        /**
        * Remove transition animations for the given element
        * 주어진 요소에 대한 전환 애니메이션 제거
        */
        function removeAnimation (element) {
            return element.addClass(NO_TRANSITION);
        }

        /**
        * Activating the vertical navigation bullets according to the given slide name.
        * 주어진 슬라이드 이름에 따라 세로 탐색 글머리 기호를 활성화합니다.
        */
        function activateNavDots (name, sectionIndex) {
            if(options.navigation){
                $(SECTION_NAV_SEL).find(ACTIVE_SEL).removeClass(ACTIVE);
                if(name){
                    $(SECTION_NAV_SEL).find('a[href="#' + name + '"]').addClass(ACTIVE);
                }else{
                    $(SECTION_NAV_SEL).find('li').eq(sectionIndex).find('a').addClass(ACTIVE);
                }
            }
        }

        /**
        * Activating the website main menu elements according to the given slide name.
        * 주어진 슬라이드 이름에 따라 웹사이트 메인 메뉴 요소를 활성화합니다.
        */
        function activateMenuElement (name) {
            if(options.menu){
                $(options.menu).find(ACTIVE_SEL).removeClass(ACTIVE);
                $(options.menu).find('[data-menuanchor="'+name+'"]').addClass(ACTIVE);
            }
        }

        /**
        * Sets to active the current menu and vertical nav items.
        * 현재 메뉴 및 수직 탐색 항목을 활성화하도록 설정합니다.
        */
        function activateMenuAndNav (anchor, index) {
            activateMenuElement(anchor);
            activateNavDots(anchor, index);
        }

        /**
        * Retuns `up` or `down` depending on the scrolling movement to reach its destination from the current section.
        * 현재 섹션에서 목적지에 도달하기 위한 스크롤 움직임에 따라 '위' 또는 '아래'를 반환합니다.
        */
        function getYmovement (destiny) {
            var fromIndex = $(SECTION_ACTIVE_SEL).index(SECTION_SEL);
            var toIndex = destiny.index(SECTION_SEL);
            if( fromIndex == toIndex){
                return 'none';
            }
            if(fromIndex > toIndex){
                return 'up';
            }
            return 'down';
        }

        /**
        * Retuns `right` or `left` depending on the scrolling movement to reach its destination from the current slide.
        * 현재 슬라이드에서 대상에 도달하기 위한 스크롤 동작에 따라 '오른쪽' 또는 '왼쪽'을 반환합니다.
        */
        function getXmovement (fromIndex, toIndex) {
            if( fromIndex == toIndex){
                return 'none';
            }
            if(fromIndex > toIndex){
                return 'left';
            }
            return 'right';
        }

        function addTableClass (element) {
            // In case we are styling for the 2nd time as in with reponsiveSlides
            // reponsiveSlides에서와 같이 두 번째로 스타일링하는 경우
            if(!element.hasClass(TABLE)){
                var wrapper = $('<div class="' + TABLE_CELL + '" />').height(getTableHeight(element));
                element.addClass(TABLE).wrapInner(wrapper);
            }
        }

        function getTableHeight (element) {
            var sectionHeight = windowsHeight;

            if(options.paddingTop || options.paddingBottom){
                var section = element;
                if(!section.hasClass(SECTION)){
                    section = element.closest(SECTION_SEL);
                }

                var paddings = parseInt(section.css('padding-top')) + parseInt(section.css('padding-bottom'));
                sectionHeight = (windowsHeight - paddings);
            }

            return sectionHeight;
        }

        /**
        * Adds a css3 transform property to the container class with or without animation depending on the animated param.
        * 애니메이션 매개변수에 따라 애니메이션이 있거나 없는 컨테이너 클래스에 css3 변환 속성을 추가합니다.
        */
        function transformContainer (translate3d, animated) {
            if(animated){
                addAnimation(container);
            }else{
                removeAnimation(container);
            }

            container.css(getTransforms(translate3d));

            // syncronously removing the class after the animation has been applied.
            // 애니메이션이 적용된 후 클래스를 동기적으로 제거합니다.
            setTimeout(function () {
                container.removeClass(NO_TRANSITION);
            },10);
        }

        /**
        * Gets a section by its anchor / index
        * 앵커/인덱스로 섹션을 가져옵니다.
        */
        function getSectionByAnchor (sectionAnchor) {
            var section = container.find(SECTION_SEL + '[data-anchor="'+sectionAnchor+'"]');
            if(!section.length){
                var sectionIndex = typeof sectionAnchor !== 'undefined' ? sectionAnchor -1 : 0;
                section = $(SECTION_SEL).eq(sectionIndex);
            }

            return section;
        }

        /**
        * Gets a slide inside a given section by its anchor / index
        * 앵커/인덱스로 지정된 섹션 내부의 슬라이드를 가져옵니다.
        */
        function getSlideByAnchor (slideAnchor, section) {
            var slide = section.find(SLIDE_SEL + '[data-anchor="'+slideAnchor+'"]');
            if(!slide.length){
                slideAnchor = typeof slideAnchor !== 'undefined' ? slideAnchor : 0;
                slide = section.find(SLIDE_SEL).eq(slideAnchor);
            }

            return slide;
        }

        /**
        * Scrolls to the given section and slide anchors
        * 지정된 섹션으로 스크롤하고 앵커를 슬라이드합니다.
        */
        function scrollPageAndSlide (sectionAnchor, slideAnchor) {
            var section = getSectionByAnchor(sectionAnchor);

            // do nothing if there's no section with the given anchor name
            // 주어진 앵커 이름을 가진 섹션이 없으면 아무 것도 하지 않음
            if(!section.length) return;

            var slide = getSlideByAnchor(slideAnchor, section);

            // we need to scroll to the section and then to the slide
            // 섹션으로 스크롤한 다음 슬라이드로 스크롤해야 합니다.
            if (sectionAnchor !== lastScrolledDestiny && !section.hasClass(ACTIVE)){
                scrollPage(section, function () {
                    scrollSlider(slide);
                });
            }
            // if we were already in the section
            // 우리가 이미 섹션에 있었다면
            else{
                scrollSlider(slide);
            }
        }

        /**
        * Scrolls the slider to the given slide destination for the given section
        * 슬라이더를 지정된 섹션의 지정된 슬라이드 대상으로 스크롤합니다.
        */
        function scrollSlider (slide) {
            if(slide.length){
                landscapeScroll(slide.closest(SLIDES_WRAPPER_SEL), slide);
            }
        }

        /**
        * Creates a landscape navigation bar with dots for horizontal sliders.
        * 가로 슬라이더에 점이 있는 가로 탐색 모음을 만듭니다.
        */
        function addSlidesNavigation (section, numSlides) {
            section.append('<div class="' + SLIDES_NAV + '"><ul></ul></div>');
            var nav = section.find(SLIDES_NAV_SEL);

            //top or bottom
            nav.addClass(options.slidesNavPosition);

            for(var i=0; i< numSlides; i++){
                nav.find('ul').append('<li><a href="#"><span></span></a></li>');
            }

            //centering it
            nav.css('margin-left', '-' + (nav.width()/2) + 'px');

            nav.find('li').first().find('a').addClass(ACTIVE);
        }


        /**
        * Sets the state of the website depending on the active section/slide.
        * 활성 섹션/슬라이드에 따라 웹사이트의 상태를 설정합니다.
        * 
        * It changes the URL hash when needed and updates the body class.
        * 필요할 때 URL 해시를 변경하고 본문 클래스를 업데이트합니다.
        */
        function setState (slideIndex, slideAnchor, anchorLink, sectionIndex) {
            var sectionHash = '';

            if(options.anchors.length && !options.lockAnchors){

                // isn't it the first slide?
                // 첫 슬라이드 아닌가요?
                if(slideIndex){
                    if(typeof anchorLink !== 'undefined'){
                        sectionHash = anchorLink;
                    }

                    // slide without anchor link? We take the index instead.
                    // 앵커 링크가 없는 슬라이드? 대신 인덱스를 사용합니다.
                    if(typeof slideAnchor === 'undefined'){
                        slideAnchor = slideIndex;
                    }

                    lastScrolledSlide = slideAnchor;
                    setUrlHash(sectionHash + '/' + slideAnchor);

                // first slide won't have slide anchor, just the section one
                // 첫 번째 슬라이드에는 슬라이드 앵커가 없고 섹션 1만 있습니다.
                }else if(typeof slideIndex !== 'undefined'){
                    lastScrolledSlide = slideAnchor;
                    setUrlHash(anchorLink);
                }

                // section without slides
                // 슬라이드가 없는 섹션
                else{
                    setUrlHash(anchorLink);
                }
            }

            setBodyClass();
        }

        /**
        * Sets the URL hash.
        * URL 해시를 설정합니다.
        */
        function setUrlHash (url) {
            if(options.recordHistory){
                location.hash = url;
            }else{
                // Mobile Chrome doesn't work the normal way, so... lets use HTML5 for phones :)
                // 모바일 크롬은 정상적으로 작동하지 않으니... 휴대폰용 HTML5를 사용해보세요 :)
                if(isTouchDevice || isTouch){
                    window.history.replaceState(undefined, undefined, '#' + url);
                }else{
                    var baseUrl = window.location.href.split('#')[0];
                    window.location.replace( baseUrl + '#' + url );
                }
            }
        }

        /**
        * Gets the anchor for the given slide / section. Its index will be used if there's none.
        * 주어진 슬라이드/섹션의 앵커를 가져옵니다. 인덱스가 없는 경우 해당 인덱스가 사용됩니다.
        */
        function getAnchor (element) {
            var anchor = element.data('anchor');
            var index = element.index();

            // Slide without anchor link? We take the index instead.
            // 앵커 링크가 없는 슬라이드? 대신 인덱스를 사용합니다.
            if(typeof anchor === 'undefined'){
                anchor = index;
            }

            return anchor;
        }

        /**
        * Sets a class for the body of the page depending on the active section / slide
        * 활성 섹션/슬라이드에 따라 페이지 본문에 대한 클래스 설정
        */
        function setBodyClass () {
            var section = $(SECTION_ACTIVE_SEL);
            var slide = section.find(SLIDE_ACTIVE_SEL);

            var sectionAnchor = getAnchor(section);
            var slideAnchor = getAnchor(slide);

            var text = String(sectionAnchor);

            if(slide.length){
                text = text + '-' + slideAnchor;
            }

            // changing slash for dash to make it a valid CSS style
            // 대시의 슬래시를 변경하여 유효한 CSS 스타일로 만들기
            text = text.replace('/', '-').replace('#','');

            // removing previous anchor classes
            // 이전 앵커 클래스 제거
            var classRe = new RegExp('\\b\\s?' + VIEWING_PREFIX + '-[^\\s]+\\b', "g");
            $body[0].className = $body[0].className.replace(classRe, '');

            // adding the current anchor
            // 현재 앵커 추가
            $body.addClass(VIEWING_PREFIX + '-' + text);
        }

        /**
        * Checks for translate3d support
        * translate3d 지원 확인
        * 
        * @return boolean
        * http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
        */
        function support3d () {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform':'-webkit-transform',
                    'OTransform':'-o-transform',
                    'msTransform':'-ms-transform',
                    'MozTransform':'-moz-transform',
                    'transform':'transform'
                };

            // Add it to the body to get the computed style.
            // 계산된 스타일을 얻으려면 본문에 추가하십시오.
            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
        }

        /**
        * Removes the auto scrolling action fired by the mouse wheel and trackpad.
        * 마우스 휠과 트랙패드에서 발생하는 자동 스크롤 동작을 제거합니다.
        * 
        * After this function is called, the mousewheel and trackpad movements won't scroll through sections.
        * 이 함수가 호출된 후에는 마우스휠과 트랙패드 움직임이 섹션을 스크롤하지 않습니다.
        */
        function removeMouseWheelHandler () {
            if (document.addEventListener) {
                document.removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                document.removeEventListener('wheel', MouseWheelHandler, false); //Firefox
                document.removeEventListener('MozMousePixelScroll', MouseWheelHandler, false); //old Firefox
            } else {
                document.detachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
            }
        }

        /**
        * Adds the auto scrolling action for the mouse wheel and trackpad.
        * 마우스 휠과 트랙패드에 대한 자동 스크롤 동작을 추가합니다.
        * 
        * After this function is called, the mousewheel and trackpad movements will scroll through sections
        * 이 함수가 호출되면 마우스휠과 트랙패드 움직임이 섹션을 스크롤합니다.
        * https://developer.mozilla.org/en-US/docs/Web/Events/wheel
        */
        function addMouseWheelHandler () {
            var prefix = '';
            var _addEventListener;

            if (window.addEventListener){
                _addEventListener = "addEventListener";
            }else{
                _addEventListener = "attachEvent";
                prefix = 'on';
            }

            // detect available wheel event
            // 사용 가능한 휠 이벤트 감지
            var support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel" // 최신 브라우저는 "휠"을 지원합니다.
                      document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel" // Webkit 및 IE는 최소한 "마우스휠"을 지원합니다.
                      'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox // 나머지 브라우저가 이전 Firefox라고 가정해 보겠습니다.

            if(support == 'DOMMouseScroll'){
                document[ _addEventListener ](prefix + 'MozMousePixelScroll', MouseWheelHandler, false);
            }

            // handle MozMousePixelScroll in older Firefox
            // 이전 Firefox에서 MozMousePixelScroll 처리
            else{
                document[ _addEventListener ](prefix + support, MouseWheelHandler, false);
            }
        }

        /**
        * Binding the mousemove when the mouse's middle button is pressed
        * 마우스의 가운데 버튼을 눌렀을 때 mousemove 바인딩
        */
        function addMiddleWheelHandler () {
            container
                .on('mousedown', mouseDownHandler)
                .on('mouseup', mouseUpHandler);
        }

        /**
        * Unbinding the mousemove when the mouse's middle button is released
        * 마우스 가운데 버튼을 놓을 때 mousemove 바인딩 해제
        */
        function removeMiddleWheelHandler () {
            container
                .off('mousedown', mouseDownHandler)
                .off('mouseup', mouseUpHandler);
        }

        /**
        * Adds the possibility to auto scroll through sections on touch devices.
        * 터치 장치의 섹션을 자동으로 스크롤할 수 있는 가능성을 추가합니다.
        */
        function addTouchHandler () {
            if(isTouchDevice || isTouch){
                if(options.autoScrolling){
                    $body.off(events.touchmove).on(events.touchmove, preventBouncing);
                }

                $(WRAPPER_SEL)
                    .off(events.touchstart).on(events.touchstart, touchStartHandler)
                    .off(events.touchmove).on(events.touchmove, touchMoveHandler);
            }
        }

        /**
        * Removes the auto scrolling for touch devices.
        * 터치 장치의 자동 스크롤을 제거합니다.
        */
        function removeTouchHandler () {
            if(isTouchDevice || isTouch){
                if(options.autoScrolling){
                    $body.off(events.touchmove);
                }

                $(WRAPPER_SEL)
                    .off(events.touchstart)
                    .off(events.touchmove);
            }
        }

        /*
        * Returns and object with Microsoft pointers (for IE<11 and for IE >= 11)
        * Microsoft 포인터가 있는 반환 및 개체(IE<11 및 IE>= 11)
        * http://msdn.microsoft.com/en-us/library/ie/dn304886(v=vs.85).aspx
        */
        function getMSPointer () {
            var pointer;

            //IE >= 11 & rest of browsers
            if(window.PointerEvent){
                pointer = { down: 'pointerdown', move: 'pointermove'};
            }

            //IE < 11
            else{
                pointer = { down: 'MSPointerDown', move: 'MSPointerMove'};
            }

            return pointer;
        }

        /**
        * Gets the pageX and pageY properties depending on the browser.
        * 브라우저에 따라 pageX 및 pageY 속성을 가져옵니다.
        * https://github.com/alvarotrigo/fullPage.js/issues/194#issuecomment-34069854
        */
        function getEventsPage (e) {
            var events = [];

            events.y = (typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY);
            events.x = (typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX);

            //in touch devices with scroll bar, e.pageY is detected, but we have to deal with touch events. #1008
            if(isTouch && isReallyTouch (e)  && (options.scrollBar || !options.autoScrolling)){
                events.y = e.touches[0].pageY;
                events.x = e.touches[0].pageX;
            }

            return events;
        }

        /**
        * Slides silently (with no animation) the active slider to the given slide.
        * 애니메이션 없이 활성 슬라이더를 지정된 슬라이드로 자동으로 슬라이드합니다.
        * @param noCallback {bool} true or defined -> no callbacks
        */
        function silentLandscapeScroll (activeSlide, noCallbacks) {
            setScrollingSpeed (0, 'internal');

            if(typeof noCallbacks !== 'undefined'){
                // preventing firing callbacks afterSlideLoad etc.
                // AfterSlideLoad 등의 콜백 실행 방지
                isResizing = true;
            }

            landscapeScroll(activeSlide.closest(SLIDES_WRAPPER_SEL), activeSlide);

            if(typeof noCallbacks !== 'undefined'){
                isResizing = false;
            }

            setScrollingSpeed(originals.scrollingSpeed, 'internal');
        }

        /**
        * Scrolls silently (with no animation) the page to the given Y position.
        * 페이지를 자동으로(애니메이션 없이) 지정된 Y 위치로 스크롤합니다.
        */
        function silentScroll (top) {
            // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
            // 첫 번째 섹션은 iOS 10에서 음수 값을 가질 수 있습니다. 이유는 확실하지 않습니다. -0.0142822265625

            // that's why we round it to 0.
            // 그래서 우리는 그것을 0으로 반올림합니다.
            var roundedTop = Math.round(top);

            if (options.css3 && options.autoScrolling && !options.scrollBar){
                var translate3d = 'translate3d(0px, -' + roundedTop + 'px, 0px)';
                transformContainer(translate3d, false);
            }
            else if(options.autoScrolling && !options.scrollBar){
                container.css('top', -roundedTop);
            }
            else{
                $htmlBody.scrollTop(roundedTop);
            }
        }

        /**
        * Returns the cross-browser transform string.
        * 브라우저 간 변환 문자열을 반환합니다.
        */
        function getTransforms (translate3d) {
            return {
                '-webkit-transform': translate3d,
                '-moz-transform': translate3d,
                '-ms-transform':translate3d,
                'transform': translate3d
            };
        }

        /**
        * Allowing or disallowing the mouse/swipe scroll in a given direction. (not for keyboard)
        * 주어진 방향으로 마우스/스와이프 스크롤을 허용하거나 허용하지 않습니다. (키보드용 아님)
        */
        function setIsScrollAllowed (value, direction, type) {
            //up, down, left, right
            if(direction !== 'all'){
                isScrollAllowed[type][direction] = value;
            }

            //all directions?
            else{
                $.each(Object.keys(isScrollAllowed[type]), function(index, key){
                    isScrollAllowed[type][key] = value;
                });
            }
        }

        /*
        * Destroys fullpage.js plugin events and optinally its html markup and styles
        * fullpage.js 플러그인 이벤트와 html 마크업 및 스타일을 선택적으로 삭제합니다.
        */
        function destroy (all) {
            setAutoScrolling(false, 'internal');
            setAllowScrolling(false);
            setKeyboardScrolling(false);
            container.addClass(DESTROYED);

            clearTimeout(afterSlideLoadsId);
            clearTimeout(afterSectionLoadsId);
            clearTimeout(resizeId);
            clearTimeout(scrollId);
            clearTimeout(scrollId2);

            $window
                .off('scroll', scrollHandler)
                .off('hashchange', hashChangeHandler)
                .off('resize', resizeHandler);

            $document
                .off('keydown', keydownHandler)
                .off('keyup', keyUpHandler)
                .off('click touchstart', SECTION_NAV_SEL + ' a')
                .off('mouseenter', SECTION_NAV_SEL + ' li')
                .off('mouseleave', SECTION_NAV_SEL + ' li')
                .off('click touchstart', SLIDES_NAV_LINK_SEL)
                .off('mouseover', options.normalScrollElements)
                .off('mouseout', options.normalScrollElements);

            $(SECTION_SEL)
                .off('click touchstart', SLIDES_ARROW_SEL);

            clearTimeout(afterSlideLoadsId);
            clearTimeout(afterSectionLoadsId);

            //lets make a mess!
            if(all){
                destroyStructure();
            }
        }

        /*
        * Removes inline styles added by fullpage.js
        * fullpage.js에 의해 추가된 인라인 스타일 제거
        */
        function destroyStructure () {
            //reseting the `top` or `translate` properties to 0
            silentScroll(0);

            //loading all the lazy load content
            container.find('img[data-src], source[data-src], audio[data-src], iframe[data-src]').each(function () {
                setSrc($(this), 'src');
            });

            container.find('img[data-srcset]').each(function () {
                setSrc($(this), 'srcset');
            });

            $(SECTION_NAV_SEL + ', ' + SLIDES_NAV_SEL +  ', ' + SLIDES_ARROW_SEL).remove();

            //removing inline styles
            $(SECTION_SEL).css( {
                'height': '',
                'background-color' : '',
                'padding': ''
            });

            $(SLIDE_SEL).css( {
                'width': ''
            });

            container.css({
                'height': '',
                'position': '',
                '-ms-touch-action': '',
                'touch-action': ''
            });

            $htmlBody.css({
                'overflow': '',
                'height': ''
            });

            // remove .fp-enabled class
            $('html').removeClass(ENABLED);

            // remove .fp-responsive class
            $body.removeClass(RESPONSIVE);

            // remove all of the .fp-viewing- classes
            $.each($body.get(0).className.split(/\s+/), function (index, className) {
                if (className.indexOf(VIEWING_PREFIX) === 0) {
                    $body.removeClass(className);
                }
            });

            //removing added classes
            $(SECTION_SEL + ', ' + SLIDE_SEL).each(function () {
                if(options.scrollOverflowHandler){
                    options.scrollOverflowHandler.remove($(this));
                }
                $(this).removeClass(TABLE + ' ' + ACTIVE);
                $(this).attr('style', $(this).data('fp-styles'));
            });

            removeAnimation(container);

            //Unwrapping content
            container.find(TABLE_CELL_SEL + ', ' + SLIDES_CONTAINER_SEL + ', ' + SLIDES_WRAPPER_SEL).each(function () {
                //unwrap not being use in case there's no child element inside and its just text
                $(this).replaceWith(this.childNodes);
            });

            //removing the applied transition from the fullpage wrapper
            container.css({
                '-webkit-transition': 'none',
                'transition': 'none'
            });

            //scrolling the page to the top with no animation
            $htmlBody.scrollTop(0);

            //removing selectors
            var usedSelectors = [SECTION, SLIDE, SLIDES_CONTAINER];
            $.each(usedSelectors, function(index, value){
                $('.' + value).removeClass(value);
            });
        }

        /*
        * Sets the state for a variable with multiple states (original, and temporal)
        * 여러 상태(원래 및 임시)가 있는 변수의 상태를 설정합니다.

        * Some variables such as `autoScrolling` or `recordHistory` might change automatically its state when using `responsive` or `autoScrolling:false`.
        * 'autoScrolling' 또는 'recordHistory'와 같은 일부 변수는 'responsive' 또는 'autoScrolling:false'를 사용할 때 상태가 자동으로 변경될 수 있습니다.

        * This function is used to keep track of both states, the original and the temporal one.
        * 이 기능은 원래 상태와 임시 상태의 두 가지 상태를 모두 추적하는 데 사용됩니다.

        * If type is not 'internal', then we assume the user is globally changing the variable.
        * type이 'internal'이 아니면 사용자가 전역적으로 변수를 변경한다고 가정합니다.
        */
        function setVariableState (variable, value, type) {
            options[variable] = value;
            if(type !== 'internal'){
                originals[variable] = value;
            }
        }

        /**
        * Displays warnings
        * 경고 표시
        */
        function displayWarnings () {
            var extensions = ['fadingEffect', 'continuousHorizontal', 'scrollHorizontally', 'interlockedSlides', 'resetSliders', 'responsiveSlides', 'offsetSections', 'dragAndMove', 'scrollOverflowReset', 'parallax'];
            if($('html').hasClass(ENABLED)){
                showError('error', 'Fullpage.js can only be initialized once and you are doing it multiple times!');
                return;
            }

            // Disable mutually exclusive settings
            if (options.continuousVertical && (options.loopTop || options.loopBottom)) {
                options.continuousVertical = false;
                showError('warn', 'Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }

            if(options.scrollBar && options.scrollOverflow){
                showError('warn', 'Option `scrollBar` is mutually exclusive with `scrollOverflow`. Sections with scrollOverflow might not work well in Firefox');
            }

            if(options.continuousVertical && (options.scrollBar || !options.autoScrolling)){
                options.continuousVertical = false;
                showError('warn', 'Scroll bars (`scrollBar:true` or `autoScrolling:false`) are mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }

            if(options.scrollOverflow && !options.scrollOverflowHandler){
                options.scrollOverflow = false;
                showError('error', 'The option `scrollOverflow:true` requires the file `scrolloverflow.min.js`. Please include it before fullPage.js.');
            }

            // using extensions? Wrong file!
            // 확장 프로그램을 사용 중이신가요? 잘못된 파일입니다!
            $.each(extensions, function(index, extension){
                //is the option set to true?
                if(options[extension]){
                    showError('warn', 'fullpage.js extensions require jquery.fullpage.extensions.min.js file instead of the usual jquery.fullpage.js. Requested: '+ extension);
                }
            });

            // anchors can not have the same value as any element ID or NAME
            // 앵커는 요소 ID 또는 NAME과 동일한 값을 가질 수 없습니다.
            $.each(options.anchors, function (index, name) {

                // case insensitive selectors (http://stackoverflow.com/a/19465187/1081396)
                // 대소문자를 구분하지 않는 선택자
                var nameAttr = $document.find('[name]').filter(function() {
                    return $(this).attr('name') && $(this).attr('name').toLowerCase() == name.toLowerCase();
                });

                var idAttr = $document.find('[id]').filter(function() {
                    return $(this).attr('id') && $(this).attr('id').toLowerCase() == name.toLowerCase();
                });

                if(idAttr.length || nameAttr.length ){
                    showError('error', 'data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE).');
                    idAttr.length && showError('error', '"' + name + '" is is being used by another element `id` property');
                    nameAttr.length && showError('error', '"' + name + '" is is being used by another element `name` property');
                }
            });
        }

        /**
        * Shows a message in the console of the given type.
        * 주어진 유형의 콘솔에 메시지를 표시합니다.
        */
        function showError (type, text) {
            console && console[type] && console[type]('fullPage: ' + text);
        }


        // 112개 함수들...
    };
});
