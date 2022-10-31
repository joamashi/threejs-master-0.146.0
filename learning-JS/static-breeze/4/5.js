(function(Core){
	var CategorySlider = function(){
		'use strict';

		var $this, modal, args, endPoint;
		var setting = {
			selector:'[data-component-categoryslider]'
        }

		var Closure = function(){}
		Closure.prototype = {
			setting:function(){
				var opt = Array.prototype.slice.call(arguments).pop();
				$.extend(setting, opt);
				return this;
			},
			init:function(){
				var _self = this;
				args = arguments[0];
                $this = $(setting.selector);
                
                //change category primary image
				$this.find('ul').on('mouseenter', 'li', function(e){
                    e.preventDefault();
                    var curImg = $(this).find("img").attr('src');
                    curImg = curImg.replace("thumbnail", "browse");
                    //$(this).closest(".action-hover").find(".item-imgwrap").children("img").attr('src',curImg);
                    
                    var primaryImg = $(this).parents('.a-product').find('.a-product-image-primary'); // primary 이미지
                    var secondaryImg = $(this).parents('.a-product').find('.a-product-image-secondary'); // hover 이미지
                    var extraImg = $(this).parents('.a-product').find('.a-product-image-extra'); // 컬러웨이 노출 이미지
                    var curImgLink = $(this).find('a').attr('href'); // 컬러웨이 상품 링크
                    var productLink = $(this).parents('.a-product').find('.a-product-image-link'); // 주 상품링크
                    var soldoutBadge = $(this).parents('.a-product').find('.product-soldout-badge'); // 품절배지

                    // 주 상품과 같은 상품이고 hover 이미지를 갖고 있을때 주 이미지에 active 클래스 추가(주 이미지 일때만 hover 노출 위해)
                    $(this).hasClass('checked') && secondaryImg.length ? primaryImg.addClass('active') : primaryImg.removeClass('active');

                    extraImg.show();
                    productLink.attr('href', curImgLink); // 주 링크를 컬러웨이 링크로 변경

                    // 상품이 품절인때 품절 배지 노출
                    $(this).hasClass('isSoldout') ? soldoutBadge.addClass('isActive') : soldoutBadge.removeClass('isActive');

                    _self.fireEvent('sliderOver', this, [curImg, primaryImg, secondaryImg, extraImg, curImgLink, productLink, soldoutBadge]);
                 });
                 
                // $this.find('ul').on('mouseleave', 'li', function(e){
                //     e.preventDefault();
                //     var curImg = $(this).find("img").attr('src');
				// 	curImg = curImg.replace("thumbnail", "browse");
                //     _self.fireEvent('sliderLeave', this, [curImg]);
                // });

                // var prdWidth = $('.a-product').width(); //상품 가로사이즈
                // var liWidth = $this.find('ul div li').width(); // 썸네일 li 가로 사이즈
                // var ulWrapper = $this.parents().find('.ulWrapper');

                var count = $this.find('ul').children().length;
                var extraNum = $this.find('.extraNum'); // 컬러웨이 상품 갯수
                if(count <= 5){
                    // $this.find("#btn_prev_smallthumb").hide();
                    // $this.find("#btn_next_smallthumb").hide();
                    extraNum.hide();
                }else{
                    extraNum.show();
                    extraNum.find('span').text(count - 5);
                    // $this.find("#btn_next_smallthumb").show();
                    // $this.find("#small_slider_curr_pos").val(0);
                    // $this.find("#small_slider_curr_page").val(1);
                    // ulWrapper.css('width', prdWidth - 15); // setul width

                    /*
                    var pageCnt = Math.trunc(count / 3);
                    if(count % 3 != 0){
                        $this.find("#small_slider_lastimg_cnt").val(count-(pageCnt*3));
                        pageCnt++;
                    }
                    $this.find("#small_slider_page_cnt").val(pageCnt);
                    */
                }

                // set ul width
                // $this.find('ul').each(function() {
                //     // $(this).width($(this).find('li').length * 45);
                //     // console.log(imgWidth[0].offsetWidth);
                //     $(this).width(imgWidth[0].offsetWidth - 15);
                // });
                
                /*
                $this.find("#btn_prev_smallthumb").click(function(){
                    var currPos = Number($this.find("#small_slider_curr_pos").val());
                    var currPage = Number($this.find("#small_slider_curr_page").val());
                    var pageCnt = Number($this.find("#small_slider_page_cnt").val());
                    var lastImgCnt = Number($this.find("#small_slider_lastimg_cnt").val());
                    var goSliderPos = currPos;
                    if(currPage == 1){
                        //console.log("Warning, first page !!!");
                        return false;
                    }
                    if(pageCnt == 2){
                            goSliderPos=0;
                    }else{
                        if(pageCnt == currPage){
                            if(lastImgCnt == 0)
                                goSliderPos = currPos - 183;
                            else
                                goSliderPos = currPos - 61*lastImgCnt;
                        }else{
                            goSliderPos = currPos - 183;
                        }
                    }
                    currPage--;
                    $this.find("#small_slider_curr_page").val(currPage);
                    $this.find("#small_slider_curr_pos").val(goSliderPos);
                    $this.find('ul').css("transform","translate( -"+goSliderPos+"px, 0px) translateZ(0px)");
                    $this.find('ul').css("transition-duration","0.5s");
                    if(currPage == 1){
                        $this.find("#btn_prev_smallthumb").hide();
                        // $this.find("#btn_next_smallthumb").show();
                        $this.find('.ulWrapper').removeClass('prevActive');
                    }
                    
                    //console.log("go this position ::: " + goSliderPos);
                })
                
                
                 $this.find("#btn_next_smallthumb").click(function(){
                    var currPos = Number($this.find("#small_slider_curr_pos").val());
                    var currPage = Number($this.find("#small_slider_curr_page").val());
                    var pageCnt = Number($this.find("#small_slider_page_cnt").val());
                    var lastImgCnt = Number($this.find("#small_slider_lastimg_cnt").val());
                    var goSliderPos = currPos;
                    if(currPage == pageCnt){
                        //console.log("Warning, last page !!!");
                        return false;
                    }
                    if((pageCnt-currPage) > 1 || ((pageCnt-currPage) == 1 && lastImgCnt == 0)){
                        goSliderPos=currPos+183;
                    }
                    if((pageCnt-currPage) == 1 && lastImgCnt != 0){
                        goSliderPos = currPos + 61*lastImgCnt;
                    }
                    currPage++;
                    $this.find("#small_slider_curr_page").val(currPage);
                    $this.find("#small_slider_curr_pos").val(goSliderPos);
                    $this.find('ul').css("transform","translate( -"+goSliderPos+"px, 0px) translateZ(0px)");
                    $this.find('ul').css("transition-duration","0.5s");
                    if(currPage == pageCnt){
                        $this.find("#btn_prev_smallthumb").show();
                        $this.find("#btn_next_smallthumb").hide();
                        $this.find('.ulWrapper').addClass('prevActive');
                    }
                    //console.log("next button, go this position ::: " + goSliderPos);
                })
                */
                
                return this;
			}
		}

		Core.Observer.applyObserver(Closure);
        return new Closure();
        
    }

	Core.Components['component_categoryslider'] = {
		constructor:CategorySlider,
		attrName:'data-component-categoryslider'
	}
})(Core);