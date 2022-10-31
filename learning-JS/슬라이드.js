"슬라이드 쇼"

    $(function(){
        $('slideshow').each(function(){
            var _img    = $(this).find('img'), // [img1, img2, img3, img4]
                count   = _img.length,
                current = 0;
                
            _img.eq(current).fadeIn();
            
            setInterval(showNextSlide, 7500); // 일정 시간마다 함수 호출. 7.5초. 7500ms
            
            function showNextSlide() {
                
                /*
                    next  current
                    1   = 0     + 1 % 4
                    2   = 1     + 1 % 4
                    3   = 2     + 1 % 4
                    0   = 3     + 1 % 4
                */
                var next = (current + 1) % count;   
                // 다음에 보여 줄 이미지 인덱스. 만약 마지막 이미지면 첫 번째 이미지 인덱스 저장
                // var next = (current++) % count
                
                /* ----------------------------------------------------- */
                _img.eq(current).fadeOut();         // 현재 이미지 페이드아웃
                _img.eq(next).fadeIn();             // 다음 이미지 페이드인
                /* ----------------------------------------------------- */
                
                current = next;
            }
        });
    });

    // <html class="no-js" lang="ko">
    // </html>.no-js .slideshow img:first-child { display:inline}






"다기능 슬라이드 쇼"

    "indicator | navigation | autoplay | pause"

    <div class="indicator"></div>

    $(function(){
        $('.slideshow').each(function(){
            
            /*
                변수에 담아 놓으세요.
            */
            
            var $this       = $(this),
                $group      = $this.find('.slideshow-slides'),
                $nav        = $this.find('.nav'),
                
                $indic      = $this.find('.indicator'),
                indic_html  = '',
                
                $slides     = $group.find('.slide'),
                count       = $slides.length,
                
                current     = 0,
                duration    = 500,
                easing      = 'easeInOutExp',
                interval    = 7500,
                timer;
                
                /*
                    current : 0으로 초기화. 현재 노출 번호.
                    count   : 이미지 전체 개수
                */
                
            // $group.find('.slide').each(function(){});
            
            
            
            // HTML요소 배치, 생성, 삽입
            $slides.each(function(i){
                $(this).css({left:100 * i + '%'}); // 각 이미지 위치 결정
                indic_html += '<a href="#">' + (i + 1) + '</a>'; // 해당 인디케이터 앵커 생성
            });
            $indic.html(indic_html);
            
            
            
            // 함수 정의
            function goToSlide(index) {
                
                // 슬라이드 그룹을 대상 위치에 맞게 이동
                $group.animate({left:-100 * index + '%'}, durration, easing);
                
                // 현재 이미지 인덱스값을 저장
                current = index;
                
                updateNav();
            }
            
            // 슬라이드 상태에 따라 내비게이션과 인디케이터를 업데이트하는 함수
            function updateNav() {
                var $prev = $nav.find('.prev'),
                    $naxt = $nav.find('.next');
                
                // 첫 번째 이미지면 prev 삭제    
                if(current === 0) $prev.addClass('disabled');
                else $prev.removeClass('disabled');
                
                // 마지막 이미지면 next 삭제
                if(current === count - 1) $next.addClass('disabled');
                else $next.removeClass('disabled');
                
                // 현재 슬라이드의 인디케이터를 해제
                $indic.find('a').removeClass('active').eq(current).addClass('active');
            }
            
            // 타이머를 시작하는 함수
            function startTimer() {
                
            // 변수 interval로 설정된 시간마다 작업을 수행
            timer = setInterval(function () {
                
                // 현재 슬라이드의 인덱스에 따라 다음에 표시할 슬라이드를 결정
                // 마지막 슬라이드라면 첫 번째 슬라이드의 인덱스값을 저장
                var nextIndex = (current + 1) % count;
                goToSlide(nextIndex);
            }, interval); 
            
            // 반환값을 변수에 저장.
            
            "setInterval()함수는 타이머를 시작할 때 타이머 고유의 ID를 생성. 이것이 setInterval()함수의 반환값."
            "clearInterval()함수는 이 ID를 전달받아 해당 타이머를 구분할 수 있고, 실행을 중지시킬 수 있다"
            }
            
            // 타이머를 중지시키는 함수
            function stopTimer() {
                clearInterval(timer);
            }
            
            
            
            // 이벤트 
            
            // 내비게이션 링크를 클릭하면 해당 슬라이드를 표시
            $nav.on('click', 'a', function (e) {
                e.preventDefault();
                
                if($(this).hasClass('prev')) goToSlide(current - 1);
                else goToSlide(current + 1); 
            });
            
            // 인디케이터 링크를 클릭하면 해당 슬라이드를 표시
            $indic.on('click', 'a', function (e) {
                e.preventDefault;
                
                // $(this).index()
                if(!$(this).hasClass('active')) goToSlide($(this).index());
            }); 
            
            // 마우스오버 시에는 타이머를 정지. 마우스아웃 시에는 타이머를 작동
            $this.on({
                mouseenter : stopTimer,
                mouseleave : startTimer
            });
            
            
            
            "먼저 setInterval()함수가 첫 번째 ID를 생성"
            
            "마우스오버 시 clearInterval()함수는 ID를 통해 타이머를 중지"
            
            "마우스아웃 시 setInterval()함수는 다시 새로운 ID를 생성"
            
            
            // 첫 번째 슬라이드 표시
            goToSlide(current);
            
            // 타이머 시작
            starTimer();
        });
    });