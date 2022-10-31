// if (typeof jQuery === "undefined") {
//     throw new Error("Modal requires jQuery.");
// }

/*
    <div 
        class="layer-pop" 
        id="layer-pop-1" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="lp-title">
        <div class="layer-pop__inner">
            <button 
            type="button"
            class="layer-pop__close">X</button>

            <h2 id="lp-title">레이어 타이틀</h2>
            <a href="#">내용</a>
            <span tabindex="0">내용</span>
        </div>
    </div>
*/

$(".open-layer-pop").on("click", function() {
    
    var openPop = $(this);
    var layerPop = $("#" + $(this).attr("aria-controls"));
    var layerPopObj = layerPop.children(".layer-pop__inner");
    var layerPopObjClose = layerPop.find(".layer-pop__close");
    var layerPopObjTabbable = layerPopObj.find("button, input:not([type='hidden']), select, iframe, textarea, [href], [tabindex]:not([tabindex='-1'])");

    var layerPopObjTabbableFirst = layerPopObjTabbable && layerPopObjTabbable.first();
    var layerPopObjTabbableLast = layerPopObjTabbable && layerPopObjTabbable.last();

    // 레이어 바깥 영역의 요소
    var layerPopOuterObjHidden = $(".skip_nav, header, .container"); 

    var all = $(".masthead, .page__footer").add(layerPop);
    var tabDisable;
    var nowScrollPos = $(window).scrollTop();
    
    // $("body")
    //     .css("top", - nowScrollPos)
    //     .addClass("scroll-off")
    //     .on("scroll touchmove mousewheel", function (e) {
    //         e.preventDefault(); // iOS 레이어 열린 상태에서 body 스크롤되는 문제 fix
    //     });

    $("body")
        .css("top", - nowScrollPos)
        .addClass("scroll-off")
        .on("scroll touchmove", function (e) {
            e.preventDefault(); // iOS 레이어 열린 상태에서 body 스크롤되는 문제 fix
        });


    function layerPopClose() { // 레이어 닫기 함수
        $("body").removeClass("scroll-off").css("top", "").off("scroll touchmove mousewheel");
        $(window).scrollTop(nowScrollPos); // 레이어 닫은 후 화면 최상단으로 이동 방지
        if (tabDisable === true) layerPopObj.attr("tabindex", "-1");
        all.removeClass("on");

        layerPopOuterObjHidden.removeAttr("aria-hidden"); // 레이어 바깥 영역을 스크린리더가 읽지 않게 해지

        // 레이어 닫은 후 원래 있던 곳으로 초점 이동
        openPop.focus(); 
        $(document).off("keydown.layerPop_keydown");
    }

    $(this).blur();
    all.addClass("on");        
    layerPopOuterObjHidden.attr("aria-hidden", "true"); // 레이어 바깥 영역을 스크린리더가 읽지 않게

    layerPopObjTabbable.length ? layerPopObjTabbableFirst.focus()
        .on("keydown", function (e) { 
            // 레이어 열리자마자 초점 받을 수 있는 첫번째 요소로 초점 이동
            if (e.shiftKey && (e.keyCode || e.which) === 9) {
                // Shift + Tab키 : 초점 받을 수 있는 첫번째 요소에서 마지막 요소로 초점 이동
                e.preventDefault();
                layerPopObjTabbableLast.focus();
            }
        }) : layerPopObj.attr("tabindex", "0").focus()
        .on("keydown", function (e) {
            tabDisable = true;
            if ((e.keyCode || e.which) === 9) event.preventDefault();
            // Tab키 / Shift + Tab키 : 초점 받을 수 있는 요소가 없을 경우 레이어 밖으로 초점 이동 안되게
        });

    layerPopObjTabbableLast.on("keydown", function(e) {
        if (!e.shiftKey && (e.keyCode || e.which) === 9) {
            // Tab키 : 초점 받을 수 있는 마지막 요소에서 첫번째 요소으로 초점 이동
            e.preventDefault();
            layerPopObjTabbableFirst.focus();
        }
    });
    
    // 닫기 버튼 클릭 시 레이어 닫기
    layerPopObjClose.on("click", layerPopClose); 

    /*
        layerPop.on("click", function(e){
            if (e.target === e.currentTarget) {
                // 반투명 배경 클릭 시 레이어 닫기
                layerPopClose();
            }
        });
        
        $(document).on("keydown.layerPop_keydown", function (e) {
            // Esc키 : 레이어 닫기
            var keyType = e.keyCode || e.which;
        
            if (keyType === 27 && layerPop.hasClass("on")) {
            layerPopClose();
            }
        });
    */
});