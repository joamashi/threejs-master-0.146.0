
"터치 이벤트를 이용한 사용자 제스처 분석 "

"터치 이벤트의 종류"

    "touchstart"        // 스크린에 손가락이 닿을 때 발생
    "touchmove"         // 스크린에 손가락이 닿은 채로 움직일 때 발생
    "touchend"          // 스크린에서 손가락을 뗄 때 발생
    "touchcancel"       // 시스템에서 이벤트를 취소시킬 때 발생. 정확한 발생 조건은 브라우저마다 다름



    터치를 취소한다는 것에 대한 표준이 정의되지 않아 각 브라우저마다 다르게 발생하여 touchend 이벤트로 간주해도 무방

    - 터치 이벤트는 사용자가 2, 3개의 손가락으로 화면을 조작할 때처럼 2개 이상의 개별 터치로 구성되는 경우가 있어 각 터치에 대한 정보를 모두 포함 (안드로이드 3.0 버전 미만 브라우저 제외)

    - 정확한 좌표 값을 얻을 수 있는 마우스 이벤트와 달리 터치 이벤트는 손가락 접촉면이 크기 때문에 접촉 표면의 평균 좌표 값을 얻는다.

    - Mouseover 이벤트에 해당하는 터치 이벤트가 없다.

    각 터치와 터치에 대한 정보는 이벤트 객체의 touches 속성과 targetTouches 속성, changedTouches 속성에 배열 형태로 저장되며, 
    터치한 손가락에 개수에 따라 배열의 크기가 결정. 멀티터치를 지원하지 않는 안드로이드 3.0 미만의 브라우저에서는 배열의 크기는 항상 1

    배열에 저장된 객체는 Touch 타입의 객체이며 마우스 이벤트와 거의 차이가 없다.



"Touch 객체 속성"

    "identifier"        // 인식 점을 구분하기 위한 인식 점 번호
    "screenX"           // 디바이스 화면을 기준으로 한 X 좌표
    "screenY"           // 디바이스 화면을 기준으로 한 Y 좌표
    "clientX"           // 브라우저 화면을 기준으로 한 X 좌표 (스크롤 미포함)
    "clientY"           // 브라우저 화면을 기준으로 한 Y 좌표 (스크롤 미포함)
    "pageX"             // 가로 스크롤을 포함한 브라우저 화면을 기준으로 한 X 좌표
    "pageY"             // 세로 스크롤을 포함한 브라우저 화면을 기준으로 한 Y 좌표
    "target"            // 터치된 DOM 객체
    ​

    현재 터치 이벤트는 WebKit 계열의 브라우저(사파리 모바일, 안드로이드 브라우저, 돌핀)에서만 지원하고 그 외 브라우저(오페라미니, 파이어폭스, 인터넷 익스플로러 모바일 등)에서는 지원하지 않는다.

    멀티터치는 touchstart 이벤트와 touchend 이벤트를 활용해서는 구별하기 힘들다. 손가락으로 터치하는 특성상 한 번에 두 개를 터치해도 시스템적으로 터치 시점에 차이가 있기 때문에 touchstart 이벤트와 touchend 이벤트 시점을 구별하기 힘들다. 멀티터치를 구현할 때에는 touchmove 이벤트를 활용하기를 권장



"터치 이벤트"

    touchstart / touchmove / touchend / touchcancel // touchend 이벤트로 간주해도 무방하다.

"탭"
    touchmove 이벤트가 발생하지 않고 touchstart 이벤트, touchend 이벤트의 순서로 이벤트가 발생할 때 탭이라고 판단


"더블탭"
    탭 이벤트가 두 번 발생하면 더블탭으로 판단한다.
    두 개의 탭 이벤트 간의 기준 시간은 개발자가 설정할 수 있으며, 이 예제에서는 1000ms로 설정
    또한 손가락 면적이 넓어 정확히 같은 좌표를 누르기는 힘들기 때문에 같은 탭으로 인지하는 임계 값을 설정해 비교


"롱탭"
    touchstart 이벤트 발생 후, 기준 시간 내에 touchmove 이벤트와 touchend 이벤트가 발생하지 않으면 롱탭으로 판단


"Touch()"
    arguments : null
    caller    : null
    length    : 0
    name    : "Touch"

    clientX
    clientY

    pageX
    pageY

    radiusX
    radiusY

    screenX
    screenY

    constructor

    force

    identifier

    target

    prototype

​
​"JSON"
    parse()
    stringify()




this.touch = {
    start: {x: 0, y: 0},
    end:   {x: 0, y: 0}
};

this.el.on('touchstart', this.touchstart_.bind(this));
this.el.on('touchend', this.touchend_.bind(this));
this.el.on('touchmove', this.touchmove_.bind(this));

this.el.hover(function () {
    that.pauseRotateTimer();
}, function () {
    that.startRotateTimer();
});

$(this.options.btnPrev).click(function (e) {
    e.preventDefault();
    that.prev();
});

$(this.options.btnNext).click(function (e) {
    e.preventDefault();
    that.next();
});

DacCarousel.prototype.touchstart_ = function (event) {
    var t = event.originalEvent.touches[0];
    this.touch.start = {
        x: t.screenX, 
        y: t.screenY
    };
};

DacCarousel.prototype.touchend_ = function () {
    var deltaX = this.touch.end.x - this.touch.start.x;
    var deltaY = Math.abs(this.touch.end.y - this.touch.start.y);
    var shouldSwipe = (deltaY < Math.abs(deltaX)) && (Math.abs(deltaX) >= this.options.swipeThreshold);

    if (shouldSwipe) {
        if (deltaX > 0) {
            this.prev();
        } else {
            this.next();
        }
    }
};

DacCarousel.prototype.touchmove_ = function (event) {
    var t = event.originalEvent.touches[0];
    this.touch.end = {x: t.screenX, y: t.screenY};
};


function Modal (el, options) {
    this.el = $(el);
    this.options = $.extend({}, ToggleModal.DEFAULTS_, options);
    this.isOpen = false;

    this.el.on('click', function (event) {
        if (!$.contains($('.dac-modal-window')[0], event.target)) {
            return this.el.trigger('modal-close');
        }
    }.bind(this));

    this.el.on('modal-open', this.open_.bind(this));
    this.el.on('modal-close', this.close_.bind(this));
    this.el.on('modal-toggle', this.toggle_.bind(this));
}

Modal.prototype.toggle_ = function () {
    this.el.trigger('modal-' + (this.isOpen ? 'close' : 'open'));
};

Modal.prototype.close_ = function () {
    this.el.removeClass('dac-active');
    $('body').removeClass('dac-modal-open');
    this.isOpen = false;
};

Modal.prototype.open_ = function () {
    this.el.addClass('dac-active');
    $('body').addClass('dac-modal-open');
    this.isOpen = true;
};

function ToggleModal (el, options) {
    this.el = $(el);
    this.options = $.extend({}, ToggleModal.DEFAULTS_, options);
    this.modal = this.options.modalToggle ? $('[data-modal="' + this.options.modalToggle + '"]') : this.el.closest('[data-modal]');

    this.el.on('click', this.clickHandler_.bind(this));
}

ToggleModal.prototype.clickHandler_ = function (event) {
    event.preventDefault();
    this.modal.trigger('modal-toggle');
};
