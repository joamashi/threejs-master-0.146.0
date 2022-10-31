/**
 * Delegate
 * =================================================================================
 */

$(document).on(eventName, elementSelector, handler);

document.addEventListener(eventName, function(e) {
  // 대상에서 위임 노드로 상위 노드 루프
  for (var target = e.target; target && target != this; target = target.parentNode) {
    if (target.matches(elementSelector)) {
      handler.call(target, e);
      break;
    }
  }
}, false);

/**
 * Off
 * =================================================================================
 */

$(el).off(eventName, eventHandler);

el.removeEventListener(eventName, eventHandler);
 
/**
 * On
 * =================================================================================
 */

$(el).on(eventName, eventHandler);

el.addEventListener(eventName, eventHandler);
 
/**
 * Ready
 * =================================================================================
 */

$(document).ready(function(){/* */});

function ready (fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/**
 * Trigger Custom
 * =================================================================================
 */

$(el).trigger('my-event', {some: 'data'});

if (window.CustomEvent && typeof window.CustomEvent === 'function') {
  var event = new CustomEvent('my-event', {detail: {some: 'data'}});
} else {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent('my-event', true, true, {some: 'data'});
}
el.dispatchEvent(event);

 
/**
 * Trigger Native
 * =================================================================================
 */

$(el).trigger('change');

var event = document.createEvent('HTMLEvents');
event.initEvent('change', true, false);
el.dispatchEvent(event);
