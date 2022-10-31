(function(){
    var stickySectionEl = null;
    if (document.querySelector('[data-ui-sticky-section] ') !== null) {
        stickySectionEl = document.querySelector('[data-ui-sticky-section] ');
        stickySectionEl.dataset.uiStickySection = true; //임시로 지정
    }

    function stickyInteraction() {
        // sticky section dom object에 [data-ui-sticky-section] Attr value(boolean)값으로 css 작동
        document.querySelector('.footer-contents').style.padding = "0";

        var targetButtons = document.querySelectorAll('.sticky-buttons .order-wrap > a');
        if (targetButtons !== null) {
            for (idx = 0; targetButtons.length > idx; idx++) {
                targetButtons[idx].addEventListener('click', function () {
                    UIkit.Utils.scrollToElement($(stickySectionEl), {duration: 500, offset: 60});
                });
            }
        }

        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        var scrollOffset = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop; //ie9 미만 브라우저 대응

        function isVisible(element) {
            var scrollDirection = (scrollOffset < window.scrollY) ? 'down' : 'up';
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();
            var elementTop = $(element).offset().top;
            var elementBottom = elementTop + $(element).height();
            var headerHeight = $('header').height();
            //console.log('--------------------------------------------------------');
            //console.log('elementBottom : ' + elementBottom + ' / docViewBottom : ' + docViewBottom + ' / elementTop : ' + elementTop  + ' / docViewTop : ' + docViewTop);
            if (scrollDirection == 'down') {
                elementTop -= headerHeight;
            } else {
                elementBottom += headerHeight;
            }
            return ((elementTop <= docViewBottom) && (elementBottom >= docViewTop));
        }

        function findScrollTrigger(windowScrollOffsetY) {
            var stickyHideOffsetTriggers = (document.querySelectorAll('[data-ui-sticky-hide]') !== null) ? document.querySelectorAll('[data-ui-sticky-hide]') : 0;
            var stickyElement = (document.querySelector('[data-ui-sticky-element]') !== null) ? document.querySelector('[data-ui-sticky-element]') : null;
            var stickyElementHeight = (stickyElement !== null) ? stickyElement.offsetHeight : 0;
            var isStickyVisible = true;

            for (idx = 0; stickyHideOffsetTriggers.length > idx; idx++) {
                //console.log('--------------------------------------------------------');
                //console.log('isScrolledIntoView( $(stickyHideOffsetTriggers[' + idx +  '] ) : ' + isVisible( stickyHideOffsetTriggers[idx] ) );
                if (isVisible(stickyHideOffsetTriggers[idx])) {
                    isStickyVisible = false;
                }
            }
            if (isStickyVisible) {
                stickyElement.classList.add('sticky');
            } else {
                stickyElement.classList.remove('sticky');
            }

            scrollOffset = windowScrollOffsetY;
        }

        window.addEventListener('scroll', function (event) {
            window.requestAnimationFrame(function () {
                findScrollTrigger(window.scrollY);
            });
        });

        var delaying = false;
        window.addEventListener('resize', function (event) {
            if (!delaying) {
                window.requestAnimationFrame(function () {
                    findScrollTrigger(window.scrollY);
                    delaying = false;
                });
                delaying = true;
            }
        });
        // A그룹일 때 운영에서 사용될 스크립트 (e)
    }

    document.addEventListener('DOMContentLoaded', function () {
        // data-ui-sticky-section 어튜리뷰트가 존재해야 실행
        if ( stickySectionEl !== null) {
            stickyInteraction();
        }
    });
})();