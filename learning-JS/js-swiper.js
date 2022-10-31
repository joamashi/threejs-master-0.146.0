/*글램덩크*/
var galleryThumbs = new Swiper('.gallery-thumbs', {
  spaceBetween: 10,
  slidesPerView: 3,
  freeMode: true,
  watchSlidesVisibility: true,
  watchSlidesProgress: true,
  observer: true,
  observeParents: true,
});

var galleryTop=  new Swiper('.gallery-top', {
  spaceBetween: 10,
  thumbs: {
    swiper: galleryThumbs
  },
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
    snapOnRelease: false
  },
  on:{
    slideChange: function () {
      $('.pop_swiper').hide();
    }
  }
});

var element = $(".blink_btn");
var shown = true;
var offset = $('.pop_swiper').offset();

setInterval(text_blink, 500);

function text_blink() {
 if(shown) {
     element.hide();
     shown = false;
 } else {
     element.show();
     shown = true;
 }
}

$(function () {
  $('.pop_swiper').hide();
  $('.toggle_bt').click(function (e) {
    var this_num = $(this).attr('name')
    $( '#'+ this_num ).slideToggle(400);
    $('html, body').animate({scrollTop : offset.top-300}, 400);
  });
});

$(function () {
    new Swiper(".swiper-container-product-134", {
      direction: "horizontal",
      freeMode: true,
      noSwiping: false,
      allowSlidePrev: true,
      allowSlideNext: true,
      mousewheel: {
        invert: true,
        forceToAxis: true
      },
      slidesPerView: "auto",
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
      breakpoints: {
        480: {
          slidesOffsetBefore: 0,
          slidesOffsetAfter: 0
        },
        640: {
          slidesOffsetBefore: 0,
          slidesOffsetAfter: 0
        },
        768: {
          slidesPerView: 3,
          noSwiping: true,
          allowSlidePrev: false,
          allowSlideNext: false
        }
      },
      pagination: {
        el: ".swiper-pagination"
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
      snapOnRelease : false
      }
    });

    new Swiper(".swiper-container-product-135", {
      direction: "horizontal",
      freeMode: true,
      noSwiping: false,
      allowSlidePrev: true,
      allowSlideNext: true,
      mousewheel: {
        invert: true,
        forceToAxis: true
      },
      slidesPerView: "auto",
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
      breakpoints: {
        480: {
          slidesOffsetBefore: 0,
          slidesOffsetAfter: 0
        },
        640: {
          slidesOffsetBefore: 0,
          slidesOffsetAfter: 0
        },
        768: {
          slidesPerView: 3,
          noSwiping: true,
          allowSlidePrev: false,
          allowSlideNext: false
        }
      },
      pagination: {
        el: ".swiper-pagination"
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
      snapOnRelease : false
      }
    });

  new Swiper(".swiper-container-product-136", {
    direction: "horizontal",
    freeMode: true,
    noSwiping: false,
    allowSlidePrev: false,
    allowSlideNext: false,
    mousewheel: {
      invert: true,
      forceToAxis: true
    },
    breakpoints: {          
      1024: {
        allowSlidePrev: true,
        allowSlideNext: true,
      }
    },
    slidesPerView: "auto",
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,      
    pagination: {
      el: ".swiper-pagination"
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
  });

  new Swiper(".pop_swiper", {
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    observer: true,
    observeParents: true
  });
});

$(window).resize(function() {
  if ($(window).outerWidth() <= 640) {
    $('.btn_drop').unbind('mouseenter').on('click', function() {
          if ($(this).hasClass('on') == false) {
            $(this).addClass('on');
            $(this).find('b').html("∨");
            $(this).find('.btn_menu').css('z-index', '11').show();
          } 
          else {
            $(this).removeClass('on');
            $(this).find('b').text("＞");
            $(this).find('.btn_menu').css('z-index', '-1').hide();
          }
    });
  } 
  else if ($(window).outerWidth() > 640) {
    $('.btn_drop').on({
        mouseenter: function () {
            $(this).addClass('on');
            $(this).find('b').html("∨");
            $(this).find('.btn_menu').css('z-index', '11').show();
        },
        mouseleave: function () {
            $(this).removeClass('on');
            $(this).find('b').text("＞");
            $(this).find('.btn_menu').css('z-index', '-1').hide();
        }
    });
  }
  });
  $(document).ready(function() {
  if ($(window).outerWidth() <= 640) {
    $('.btn_drop').unbind('mouseenter').on('click', function() {
          if ($(this).hasClass('on') == false) {
            $(this).addClass('on');
            $(this).find('b').html("∨");
            $(this).find('.btn_menu').css('z-index', '11').show();
          } 
          else {
            $(this).removeClass('on');
            $(this).find('b').text("＞");
            $(this).find('.btn_menu').css('z-index', '-1').hide();
          }
    });
  } 
  else if ($(window).outerWidth() > 640) {
    $('.btn_drop').on({
        mouseenter: function () {
            $(this).addClass('on');
            $(this).find('b').html("∨");
            $(this).find('.btn_menu').css('z-index', '11').show();
        },
        mouseleave: function () {
            $(this).removeClass('on');
            $(this).find('b').text("＞");
            $(this).find('.btn_menu').css('z-index', '-1').hide();
        }
    });
  }
});

function video_out() {
$(".p2_Video").fadeOut();
}