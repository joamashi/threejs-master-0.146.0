

// 마우스 방향을 감지. 상하좌우. 수학함수
function getMouseDirection (e) {

  var $el = $(e.currentTarget),
  offset = $el.offset(),
  w = $el.outerWidth(),
  h = $el.outerHeight(),
  x = (e.pageX - offset.left - w / 2) * ((w > h) ? h / w : 1),
  y = (e.pageY - offset.top - h / 2) * ((h > w) ? w / h : 1),
  direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4

  return direction 
}


// 주소입력 나머지 주소 입력시 한글, 숫자, 알파벳 대소문자, 공란, @, -, /, 괄호만 입력받을수 있게 변경
// replace(/[^가-힣0-9a-zA-Z\\s\\@\\-\\/\\(\\)]/g,'')

// <input type="text" id="addressLine2" name="addressLine2" th:attr="data-parsley-required-message=#{Validation_required}" data-parsley-required=""/>

// <input type="text" id="addressLine2" name="addressLine2" th:attr="data-parsley-required-message=#{Validation_required}" data-parsley-minlength-message="입력값이 너무 짧습니다." data-parsley-minlength="2"	data-parsley-required="" data-parsley-trigger="keyup" onkeydown="this.value=this.value.replace(/[^가-힣0-9a-zA-Z\\s\\@\\-\\/\\(\\)]/g,'')" onkeyup="this.value=this.value.replace(/[^가-힣0-9a-zA-Z\\s\\@\\-\\/\\(\\)]/g,'')" onblur="this.value=this.value.replace(/[^가-힣0-9a-zA-Z\\s\\@\\-\\/\\(\\)]/g,'')"/>