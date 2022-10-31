// Core.getModule('module_header').setLogin(function(data){
// 	console.log(data)
// });

// sandbox.getModule('module_header').reDirect().setLogin(function(data){
// 	console.log(data)
// });

if (sandbox.getModule('module_header').getIsSignIn() === true) {
  _.delay(function(){ 
      window.location.assign( sandbox.utils.contextPath + '/checkout' );
  }, 500);
} else {
  UIkit.modal('#order-signin-check', {modal:true}).show();
}






/*
  fireEvent 가 등록되기전에 호출하여 처음 이벤트는 발생하지 않는다 그래서 setTimeout으로 자체 딜레이를 주어 해결하였다.
  조금 위험한 방법아지만 해결방법을 찾기 전까지 사용해야 할꺼 같다.

  동기가 끝나면 실행
*/
setTimeout(function(){
  _self.fireEvent('notifyLoadComplete', _self, [notify_closure]);
});


$this.find('.item-notify-me').on('click', function (e) {
  var url = $(this).attr('url');

  Core.Utils.ajax(url, 'GET', {}, function (data) {
      $("#restock-notification").remove();
      
      var notifyPop = $(data.responseText).find('#restock-notification');
      $('body').append(notifyPop)
      
      Core.moduleEventInjection(data.responseText);

      var obj = {
          'productId': $this.find('[name="productId"]').val()
      }

      Core.Utils.ajax(Core.Utils.contextPath + '/productSkuInventory', 'GET', {
          'productId': $this.find('[name="productId"]').val()
      }, function(data){
          var responseData = data.responseText;
          var allSkuData = Core.Utils.strToJson(responseData).skuPricing;
          _self.fireEvent('skuLoadComplete', _self, [allSkuData, 'PW']);
      }, false, true);

      var modal = UIkit.modal("#restock-notification");
      if (modal.isActive()) {
          modal.hide();
      } else {
          modal.show();
      }
  });
});


sandbox.getComponents('component_product_option', {context:$(document)}, function () {
  this.addEvent('skuLoadComplete', function (data) {
      
      allSkuData = data;

      Method.checkQuantity(); 

      // 입고알림 문자받기 show or hide
      if ($("#set-restock-alarm").length > 0 && allSkuData) {
          for (var index = 0; allSkuData.length > index; index++) {
              if (args.isForcedDisplay == 'true' || allSkuData[index].quantity == 0) {
                  $('#set-restock-alarm').show();
                  break;
              }
          }
      }

      // ONE SIZE 초기값 설정
      var oneSize = $('#size-grid li');
      if (oneSize.hasClass('ONE')) {
          oneSize.find('a').addClass('selected');
          $('#size-value').text(oneSize.text()).attr('data-sku-id', allSkuData[0].skuId);
      }
  });
});


setTimeout(function () {
  if (sandbox.getModule('module_launchcategory')) {
      allSkuData = sandbox.getModule('module_launchcategory').getTotalSkuData();
      NotifyName = sandbox.getModule('module_launchcategory').getTotalSkuNotify();
      Method.checkQuantity();
  }
}, 1000);



var defer = $.Deferred();

sandbox.utils.promise({
  url:sandbox.utils.contextPath + '/review/reviewWriteCheck',
  type:'GET',
  data:{'productId':productId, 'orderItemId':orderItemId}
}).then(function(data){
  //data.expect 기대평
  //data.review 구매평
  if(data.expect || data.review){
      return sandbox.utils.promise({
          url:sandbox.utils.contextPath + '/review/write',
          type:'GET',
          data:{'productId':productId, 'redirectUrl':location.pathname, 'startCount':startCount, 'isPurchased':data.review, 'orderItemId':orderItemId}
      });
  }else{
      $.Deferred().reject('리뷰를 작성할 수 없습니다.');
  }

}).then(function(data){
  modal.show();

  $(target).addClass('review-write');
  $(target).find('.contents').empty().append(data);
  sandbox.moduleEventInjection(data, defer);

  return defer.promise();
}).then(function(data){
  Method.reviewProcessorController();
  modal.hide();
}).fail(function(msg){
  //console.log('write fail');
  defer = null;
  UIkit.notify(msg, {timeout:3000,pos:'top-center',status:'danger'});
});













function initVersionSelect () {
  // version select
  var versionSelect = document.querySelector('.version-select')
  versionSelect && versionSelect.addEventListener('change', function (e) {
      var version = e.target.value
      var section = window.location.pathname.match(/\/v\d\/(\w+?)\//)[1]
      if (version === 'SELF') return
      window.location.assign('https://' + version + (version && '.') + 'vuejs.org/' + section + '/')
  })
}

/**
* Sub headers in sidebar
*/

function initSubHeaders () {
  var each = [].forEach
  var main = document.getElementById('main')
  var header = document.getElementById('header')
  var sidebar = document.querySelector('.sidebar')
  var content = document.querySelector('.content')

  // build sidebar
  var currentPageAnchor = sidebar.querySelector('.sidebar-link.current')
  var contentClasses = document.querySelector('.content').classList
  var isAPIOrStyleGuide = (
      contentClasses.contains('api') ||
      contentClasses.contains('style-guide')
  )

  if (currentPageAnchor || isAPIOrStyleGuide) {
      var allHeaders = []
      var sectionContainer

      if (isAPIOrStyleGuide) {
          sectionContainer = document.querySelector('.menu-root')
      } else {
          sectionContainer = document.createElement('ul')
          sectionContainer.className = 'menu-sub'
          currentPageAnchor.parentNode.appendChild(sectionContainer)
      }

      var headers = content.querySelectorAll('h2')
      if (headers.length) {
          each.call(headers, function (h) {
              sectionContainer.appendChild(makeLink(h))
              var h3s = collectH3s(h)
              allHeaders.push(h)
              allHeaders.push.apply(allHeaders, h3s)
              if (h3s.length) {
                  sectionContainer.appendChild(makeSubLinks(h3s, isAPIOrStyleGuide))
              }
          })
      } else {
          headers = content.querySelectorAll('h3')
          each.call(headers, function (h) {
              console.log(h)
              sectionContainer.appendChild(makeLink(h))
              allHeaders.push(h)
          })
      }

      var animating = false
      sectionContainer.addEventListener('click', function (e) {

          // Not prevent hashchange for smooth-scroll
          // e.preventDefault()

          if (e.target.classList.contains('section-link')) {
              sidebar.classList.remove('open')
              setActive(e.target)
              animating = true
              setTimeout(function () {
                  animating = false
              }, 400)
          }
      }, true)

      // make links clickable
      allHeaders
      .filter(function(el) {
          if (!el.querySelector('a')) return false
          var demos = [].slice.call(document.querySelectorAll('demo'))
          return !demos.some(function(demoEl) {
              return demoEl.contains(el)
          })
      })
      .forEach(makeHeaderClickable)

      smoothScroll.init({
          speed: 400,
          offset: 0
      })
  }

  var hoveredOverSidebar = false
  sidebar.addEventListener('mouseover', function () {
      hoveredOverSidebar = true
  })
  sidebar.addEventListener('mouseleave', function () {
      hoveredOverSidebar = false
  })

  // listen for scroll event to do positioning & highlights
  window.addEventListener('scroll', updateSidebar)
  window.addEventListener('resize', updateSidebar)

  function updateSidebar () {
      var doc = document.documentElement
      var top = doc && doc.scrollTop || document.body.scrollTop
      if (animating || !allHeaders) return
      var last
      for (var i = 0; i < allHeaders.length; i++) {
          var link = allHeaders[i]
          if (link.offsetTop > top) {
              if (!last) last = link
              break
          } else {
              last = link
          }
      }
      if (last)
      setActive(last.id, !hoveredOverSidebar)
  }

  function makeLink (h) {
      var link = document.createElement('li')
      window.arst = h
      
      var text = [].slice.call(h.childNodes).map(function (node) {
          if (node.nodeType === Node.TEXT_NODE) {
              return node.nodeValue
          } else if (['CODE', 'SPAN'].indexOf(node.tagName) !== -1) {
              return node.textContent
          } else {
              return ''
          }
      }).join('').replace(/\(.*\)$/, '')

      link.innerHTML = '<a class="section-link" data-scroll href="#' + h.id + '">' + htmlEscape(text) + '</a>'
      return link
  }

  function htmlEscape (text) {
      return text
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  function collectH3s (h) {
      var h3s = []
      var next = h.nextSibling
      while (next && next.tagName !== 'H2') {
          if (next.tagName === 'H3') {
              h3s.push(next)
          }
          next = next.nextSibling
      }
      return h3s
  }

  function makeSubLinks (h3s, small) {
      var container = document.createElement('ul')
      if (small) {
          container.className = 'menu-sub'
      }
      h3s.forEach(function (h) {
          container.appendChild(makeLink(h))
      })
      return container
  }

  function setActive (id, shouldScrollIntoView) {
      var previousActive = sidebar.querySelector('.section-link.active')
      var currentActive = typeof id === 'string' ? sidebar.querySelector('.section-link[href="#' + id + '"]') : id
      
      if (currentActive !== previousActive) {
          if (previousActive) previousActive.classList.remove('active') currentActive.classList.add('active');
          if (shouldScrollIntoView) {
              var currentPageOffset = currentPageAnchor ? currentPageAnchor.offsetTop - 8 : 0
              var currentActiveOffset = currentActive.offsetTop + currentActive.parentNode.clientHeight
              var sidebarHeight = sidebar.clientHeight
              var currentActiveIsInView = (
                  currentActive.offsetTop >= sidebar.scrollTop &&
                  currentActiveOffset <= sidebar.scrollTop + sidebarHeight
              )
              var linkNotFurtherThanSidebarHeight = currentActiveOffset - currentPageOffset < sidebarHeight
              var newScrollTop = currentActiveIsInView
              ? sidebar.scrollTop
              : linkNotFurtherThanSidebarHeight
              ? currentPageOffset
              : currentActiveOffset - sidebarHeight
              sidebar.scrollTop = newScrollTop
          }
      }
  }

  function makeHeaderClickable (header) {
      var link = header.querySelector('a')
      link.setAttribute('data-scroll', '')

      // transform DOM structure from
      // `<h2><a></a>Header</a>` to <h2><a>Header</a></h2>`
      // to make the header clickable
      var nodes = Array.prototype.slice.call(header.childNodes)
      for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i]
          if (node !== link) {
              link.appendChild(node)
          }
      }
  }
}







// <div data-module-minicart-text="{miniCartCnt:.cart-num}"></div>
Core.register('module_minicart_text', function (sandbox) {
  var args;
  var endPoint;

  var Method = {
      $that: null,
      $closeBtn: null,

      moduleInit:function () {
          var $this = $(this);
          Method.$that = $this;
          
          args = arguments[0];
          endPoint = Core.getComponents('component_endpoint');

          console.log($this)

          $this.on('click', 'a', function (e) {
              e.preventDefault();
              console.log($(args.miniCartCnt))
          });
      }
  }
  return {
      init:function(){
          sandbox.uiInit({
              selector: '[data-module-minicart-text]',
              attrName: 'data-module-minicart-text',
              moduleName: 'module_minicart_text',
              handler: {
                  context:this,
                  method:Method.moduleInit
              }
          })
      }
  }
});
// Core.register('module_minicart_text', function (sandbox) {});
