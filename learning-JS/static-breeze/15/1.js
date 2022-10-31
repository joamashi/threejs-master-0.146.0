(function(Core){
	Core.register('module_snkrs_swiper', function(sandbox){
		var Method = {
			moduleInit:function(){
                var reAutoPlayTimer = null; //중복 이벤트 방지
                var paginationEl = document.querySelector('.snkrs-story-pagination');
                var currentURL = window.location.href;
                var snkrsStorySwiper = null;
                var isTouchSwipe = false;
                var realActiveIndex = 0;

                //공유버튼 처리 부
                var btnShare = document.querySelectorAll('ul.sns-share-list > li > button');
                btnShare.forEach(function(button){
                    button.addEventListener('click', function () {

                        //Kakao 공유버튼 : class="kakao"
                        if(button.classList.contains('kakao')){
                            var kakaoAPI = Core.kakaoApi;
                            if(typeof kakaoAPI == 'object'){
                                kakaoAPI.link(currentURL);
                            }else{
                                console.log('Kakao lib loading err');
                            }
                        }

                        //URL 복사버튼 : class="copy-url"
                        if(button.classList.contains('copy-url')){
                            //클립보드 복사용 임시 DOM생성
                            var tmpDOMforCopy = document.createElement('textarea');
                                tmpDOMforCopy.value = currentURL;
                                document.body.appendChild(tmpDOMforCopy);

                                tmpDOMforCopy.select();
                                tmpDOMforCopy.setSelectionRange(0, 9999);
                                try {
                                    var success = document.execCommand('copy');
                                    tmpDOMforCopy.blur();
                                    if (success) {
                                        alert("URL이 복사 되었습니다.");
                                    } else {
                                        alert('이 브라우저는 지원하지 않습니다.');
                                    }
                                } catch (err) {
                                    alert('이 브라우저는 지원하지 않습니다.');
                                }

                                document.body.removeChild(tmpDOMforCopy); //삭제
                        }

                    });
                });

                snkrsStorySwiper = new Swiper('.snkrs-story-container', {
                    autoplay: {delay: 15000,},
                    speed:500,
                    loop: true,
                    preloadImages: true,
                    updateOnImagesReady: true,
                    pagination: {el: '.snkrs-story-pagination',
                        renderBullet: function (index, className) {
                            if(index == this.realIndex)
                                className += ' completed';
                            return '<li class="' + className + '"></li>';
                        }
                    },
                    navigation: {nextEl: '.snkrs-story-button-next', prevEl: '.snkrs-story-button-prev',},
                    scrollbar: {el: '.snkrs-story-scrollbar',},
                    on: {
                        init: function(){
                            document.querySelector('.snkrs-story-button-prev').addEventListener('click', function(event){
                                snkrsStorySwiper.allowSlidePrev = true;
                                this.setAttribute('style','pointer-events:none;');
                                var el = document.elementFromPoint(event.clientX, event.clientY);
                                if(el.tagName == 'BUTTON'){
                                    snkrsStorySwiper.allowSlidePrev = false;

                                    //@pck 2020-09-21 DATA-CLICK-NAME 미작동 오류로 강제 실행
                                    var name = el.dataset.clickName;
                                    var area = el.dataset.clickArea;
                                    var endPoint = Core.getComponents('component_endpoint');
                                    endPoint.call('clickEvent', {area : area, name : name});

                                    el.onclick();
                                }
                                this.setAttribute('style','pointer-events:auto;');
                            });
                            document.querySelector('.snkrs-story-button-next').addEventListener('click', function(event){
                                snkrsStorySwiper.allowSlideNext = true;
                                this.setAttribute('style','pointer-events:none;');
                                var el = document.elementFromPoint(event.clientX, event.clientY);
                                if(el.tagName == 'BUTTON'){
                                    snkrsStorySwiper.allowSlideNext = false;

                                    //@pck 2020-09-21 DATA-CLICK-NAME 미작동 오류로 강제 실행
                                    var name = el.dataset.clickName;
                                    var area = el.dataset.clickArea;
                                    var endPoint = Core.getComponents('component_endpoint');
                                    endPoint.call('clickEvent', {area : area, name : name});

                                    el.onclick();
                                }
                                this.setAttribute('style','pointer-events:auto;');
                            });

                            //show share modal view
                            document.querySelector('.show-share').addEventListener('click', function(event){
                                document.querySelector('.sns-share-modal-bg').classList.add('show');
                            });
                            //hide share modal view
                            document.querySelector('.sns-share-modal-bg .close').addEventListener('click', function(event){
                                document.querySelector('.sns-share-modal-bg').classList.remove('show');
                            });
                            //DIM Layer prevent
                            document.querySelector('.sns-share-modal-bg').addEventListener('click', function(event){
                                event.preventDefault();
                                document.querySelector('.sns-share-modal-bg').classList.remove('show');
                            });

                            //최초 init 시 index 값 전달
                            param = {}; //초기화
                            param.SNKRS_mobile_index_number = this.realIndex + 1;
                            param.SNKRS_mobile_swipe_type = 'loaded';
                            endPoint.call('snkrsMobileSwipeIndex', param);

                        },
                        slideChange: function(){
                            document.querySelectorAll('.swiper-pagination-bullet').forEach(function(el, index) {
                                el.classList.add('completed');
                                if(index > snkrsStorySwiper.realIndex){
                                    if(el.classList.contains('completed'))
                                    el.classList.remove('completed');
                                }
                            });
                        },
                        slideChangeTransitionEnd: function(event){
                            if(realActiveIndex !== this.realIndex){
                                realActiveIndex = this.realIndex;

                                param = {}; //초기화
                                param.SNKRS_mobile_index_number = realActiveIndex + 1;
                                param.SNKRS_mobile_swipe_type = (isTouchSwipe) ? 'swipe' : '6secs swipe';
                                endPoint.call('snkrsMobileSwipeIndex', param);
                            }
                            this.autoplay.stop();
                            clearTimeout(reAutoPlayTimer);
                            reAutoPlayTimer = setTimeout(function() {
                                isTouchSwipe = false;
                                snkrsStorySwiper.slideNext();
                                snkrsStorySwiper.autoplay.start();
                                clearTimeout(reAutoPlayTimer);
                            }, 15000); //6초 후에 자동재생 활성화
                        },
                        touchEnd: function(){
                            isTouchSwipe = true;
                        },
                    },
                });

		    }
		}
		return {
			init:function(){
				sandbox.uiInit({
					selector:'[data-module-snkrs-swiper]',
					attrName:'data-module-snkrs-swiper',
					moduleName:'module_snkrs_swiper',
					handler:{context:this, method:Method.moduleInit}
				});
			}
		}
	});
})(Core);