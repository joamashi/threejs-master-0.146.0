const eachText = [];
$('td')
  .each((i, td) => { // 객체의 반복 생성. iterate. 순환문.
    if (td.textContent.starsWith('H')) {
      eachText.push(td.textContent);
    }
  });
eachText // ["Hamlet IV","Part I","History","Henry V"]
 
const forText = []; 
for (let td of $('td')) { // "of"
  if (td.textContent.startsWith('H')) {
    forText.push(td.textContent);
  }
}
forText // ["Hamlet IV","Part I","History","Henry V"]
  
// ------------------------------------------------------------------------

$(() => {
  cont toggleSwitcher = (e) => {
    if (!$(e.target).is('button')) {
      $(e.currentTarget)
        .children('button')
        .toggleClass('hidden');
    }
  }
  
  $('#switcher').on('click.collapse', togglSwitcher);
  $('#switcher-narrow, #switcher-large').
    .click(() => {
      $('#switcher').off('click.collapae');
    });
  $('#switcher-default')
    .click(() => {
      $('#switcher').on('click.collapse', toggleSwitcher);
    })
});

// ------------------------------------------------------------------------

// 세 개의 버튼 클릭 동작고 해당 키를 매핑함
const triggers = {
  D: 'default',
  N: 'narrow',
  L: 'large'
}

// 버튼을 클릭하면 setBodyClass()를 호출
$('#swicher')
  .click((e) => {
    if ($(e.tartget).is('button')) {
      setBodyClass(e.target.id.split('-')[1]);
    }
  });
  
// 키를 누르면 setBodyClass()를 호출
$(document)
  .keyup((e) => {
    const key = String.fromCharCode(e.which);
    
    if (key in triggers) { // in
      setBodyClass(triggers[key]);
    }
  });

// ------------------------------------------------------------------------

// 불필요한 DOM 순회 작업을 피하기

// 터너리 표현식. ternary
$(e.target).text() === 'read more' ? 
  'read less' : 'read more'
  
$(e.target).text() === 'read more' ? 'read less' : 'read more'

// ------------------------------------------------------------------------

$(() => {
  const sizeMap = {
    'switcher-small': n => n / 1.4,
    'switcher-large': n => n * 1.4,
    'switcher-default': () => defaultSize
  };
  
  const $speech = $('div.speech');
  const defaultSize = parseFloat($speech.css('fontSize'));
  
  $('#switcher button')
    .click((e) => {
      const num = parseFloat($speench.css('fontSize'));
      $speech.animate({
        fotSize: `${sizeMap[e.target.id](num)}px`
      });
    });
});

// ------------------------------------------------------------------------

const $switcher = $(e.target).parent();
const paraWidth = $('div.speech p').outerWidth();
const switcherWidth = $switcher.outerWidth();

$switcher
  .css('position', 'relative')
  .animate({
    borderWidth: '5px',
    left: paraWidth - switcherWidth,
    height: '+=20px'
  }, 'slow');
  
// ------------------------------------------------------------------------

.animate(
  {left: paraWidth - switcherWidth},
  {duration: 'slow', queue: false}
)
.fadeTo('slow', 1.0)
.slideUp('slow')
.css('backgroundColor', '#f00')
.slideDown('slow')

// 시각 효과 메서드와 비-시각 효과 메서드를 혼합해 순차적으로 작동하도록 하려면 적절한 위치에 .queue() 메서드 추가

.animate(
  {left: paraWidth - switcherWidth},
  {duration: 'slow', queue: false}
)
.fadeTo('slow', 1.0)
.slideUp('slow')
.queue((next) => {
  $switcher.css('bcakgroundColor', '#f00');
  next();
})
.slideDown('slow')

// 콜백 함수의 호출을 받은 .queue() 메서드는 선택된 요소에 대해 순차적으로 시각 효과를 구현하는 메서드를 추가한다. .queue() 메서는 내부에서 배경색을 red로 설정한 뒤 next() 함수를 호출해 콜백 함수에 다음번 인수를 전달한다.

"queue"


"단일 요소 그룹의 시각 효과"
// 하나의 .animat() 메서드에 여러 개의 속성을 추가하면 동시에 반생한다
// queue 옵션을 false로 설정하지 않았다면, 메서를 연쇄적으로 이어서 순차적으로 발생하도록 한다.

"다중 요소 그룹의 시각 효과"
// 기본적으로 동시에 발생한다
// 다른 시각 효과 메서드의 콜백 함수로 입력하거나 .queue() 메서드의 콜백 함수로 입력해 순차적으로 발생

// ------------------------------------------------------------------------

// 명시적인 반복 실행. explicit iterator. forEach 배열 반복기와 매우 유사

.each((i, span) => {
  $(`<sup>${i + 1}</sup>`)
    .insertBefore(span);

  $(span)
    .appendTo($notes)
    .wrap('<li></li>');
});

// ------------------------------------------------------------------------

$(span)
  .before([
    '<a herf="footnote-',
    i + 1,
    '" id="context-',
    i + 1,
    '" class="context">',
    '<sup>',
    i + 1,
    '</sup></a>'
  ].join(''))
  .appendTo($notes)
  .wrap('<li></li>');
  
// ------------------------------------------------------------------------

$.getJSON('b.json', (data) => {
  // reduce(). 배열을 HTML 문자열로 바꿔서 웹 문서에 삽입
  const html = data.reduce((result, entry) => ` // return 생략
    ${result}
    <div class="entry">
      <h3 class="term">${entry.term}</h3>
      <div class="part">${entry.part}</div>
      <div class="dafinition">${entry.definition}</div>
    </div>
  `, '');
  
  $('#dictionaty').html(html);
});

$.get('d.xml', (data) => {
  const html = $(data)
    .find('entry')
    .get()
    .reduce((result, entry) => `
      ${result}
      <div class="entry">
        <h3 class="term">${$(entry).attr('term')}</h3>
        <div class="part">${$(entry).attr('part')}</div>
        <div class="dafinition">
          ${$(entry).find('dafinition').text()}
          ${formatQuote(entry)}
        </div>
      </div>
    `, '');
  
  $('#dictionaty').html(html);
});

// ------------------------------------------------------------------------

"preventDefault()"
// false를 반환할 것인가, 기본 설정 동작을 막을 것인가?
// false를 반환하면 e.preventDefault()와 e.stopPropagation()이 동시에 호출
// 이벤트 버블링을 막으려면 .stopPropagation()으로 호출

// ------------------------------------------------------------------------

"연속적인 폼 데이터 전송"

// 서버로 전송할 데이터에는 폼에 대한 사용자 입력 데이터도 포함된다.

<form action="f">
  <input type="text" name="term" id="term" value="" />
  <input type="submit" name="search" id="search" value="search" />
</form>

app.post('/f', (req, res) => {
  const term = req.body.term.toUpperCase();
  const content = Object.keys(F_entries)
    .filter(k => k.includes(term))
    .reduce((result, k) => `
      ${result}
      ${formatEntry(k, F_entries[k])}
    `, '');
  res.send(content);
});

.submit((e) => {
  e.preventDefault();
  
  $.post(
    $(e.target).attr('action'),
    {term: $('input[name="term"]').val()},
    (data) => {$('#dictionary').html(data);}
  );
});

// ------------------------------------------------------------------------

"fetch()"
// Ajax 함수처럼 약정 객체를 반환
// URL이 실제로는 다른 도메인에 존재하는 경우, fetch() 함수를 이용해 접근 가능
// JSON 데이터가 필요한 경우, .then() 핸들러에서 .json()을 호출
// 두 번째 핸들러에 기존의 함수를 추가해 DOM구조를 채운다

"약정 객체의 가장 큰 특징은 일괄성.consistency"
// 약정 객체의 목적은 비동기적인 동작을 동기화하는 것이다
// 제이쿼리에서 일어나는 비동기적인 동작은 약정 객체를 이용해 실행 시기를 조절9867