/**
 * Add Class
 * =================================================================================
 */

$(el).addClass(className);

el.classList.add(className);

/**
 * Toggle Class
 * =================================================================================
 */

$(el).toggleClass(className);

el.classList.toggle(className);
 
/**
 * Append
 * =================================================================================
 */

$(parent).append(el);

parent.appendChild(el);

/**
 * After
 * =================================================================================
 */

$(target).after(element);

target.insertAdjacentElement('afterend', element);

/**
 * Before
 * =================================================================================
 */

$(target).before(element);

target.insertAdjacentElement('beforebegin', element);
 
/**
 * Clone
 * =================================================================================
 */

$(el).clone();

el.cloneNode(true);

 /**
 * Contains
 * =================================================================================
 */

$.contains(el, child);

el !== child && el.contains(child);

/**
 * Contains Selector
 * =================================================================================
 */

$(el).find(selector).length;

!!el.querySelector(selector);
 
/**
 * Each
 * =================================================================================
 */

$(selector).each(function (i, el) {/* */});

var elements = document.querySelectorAll(selector);
Array.prototype.forEach.call(elements, function (el, i) {/* */});

 /**
 * Empty
 * =================================================================================
 */

$(el).empty();

el.removeChild(el.firstChild);

/**
 * Filter
 * =================================================================================
 */

$(selector).filter(filterFn);

Array.prototype.filter.call(document.querySelectorAll(selector), filterFn);
 
/**
 * Find Children
 * =================================================================================
 */

$(el).find(selector);

el.querySelectorAll(selector);

 /**
 * Find Elements
 * =================================================================================
 */

$('.my #awesome selector');

document.querySelectorAll('.my #awesome selector');

/**
 * Get Attributes
 * =================================================================================
 */

$(el).attr('tabindex');

el.getAttribute('tabindex');

 /**
 * Get HTML
 * =================================================================================
 */

$(el).html();

el.innerHTML

/**
 * Get Outer HTML
 * =================================================================================
 */

$(el).prop('outerHTML');

el.outerHTML

/**
 * Get Style
 * =================================================================================
 */

$(el).css(ruleName);

getComputedStyle(el)[ruleName];

 /**
 * Get Text
 * =================================================================================
 */

$(el).text();

el.textContent

/**
 * Get Width
 * =================================================================================
 */

$(el).width();

parseFloat(getComputedStyle(el, null).width.replace("px", ""))

/**
 * Get Height
 * =================================================================================
 */

$(el).height();

parseFloat(getComputedStyle(el, null).height.replace("px", ""))
 
/**
 * Has Class
 * =================================================================================
 */

$(el).hasClass(className);

el.classList.contains(className);

 /**
 * Index
 * =================================================================================
 */

$(el).index();

function index(el) {
  if (!el) return -1;
  var i = 0;
  do {
    i++;
  } while (el = el.previousElementSibling);
  return i;
}

/**
 * Matches. 매치스. 일치
 * =================================================================================
 */

$(el).is($(otherEl));

el === otherEl
 
/**
 * Matches Selector
 * =================================================================================
 */

$(el).is('.my-class');

var matches = function (el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
};
matches(el, '.my-class');


 /**
 * Outer Height
 * =================================================================================
 */

$(el).outerHeight();

el.offsetHeight
 
/**
 * Outer Width
 * =================================================================================
 */

$(el).outerWidth();

el.offsetWidth

/**
 * Outer Height With Margin
 * =================================================================================
 */

$(el).outerHeight(true);

function outerHeight(el) {
  var height = el.offsetHeight;
  var style = getComputedStyle(el);
  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
}
outerHeight(el);

 /**
 * Outer Width With Margin
 * =================================================================================
 */

$(el).outerWidth(true);

function outerWidth (el) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);
  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
}
outerWidth(el);

/**
 * Siblings
 * =================================================================================
 */

$(el).siblings();

Array.prototype.filter.call(el.parentNode.children, function (child) {
  return child !== el;
});

/**
 * Children
 * =================================================================================
 */

$(el).children();

el.children

/**
 * Parent
 * =================================================================================
 */

$(el).parent();

el.parentNode

/**
 * Offset
 * =================================================================================
 */

$(el).offset();

var rect = el.getBoundingClientRect();
 
/**
 * Offset Parent
 * =================================================================================
 */

$(el).offsetParent();

el.offsetParent || el
 
/**
 * Position
 * =================================================================================
 */

$(el).position();

{left: el.offsetLeft, top: el.offsetTop}

/**
 * Position Relative To Viewport
 * =================================================================================
 */

var offset = el.offset();

el.getBoundingClientRect()

/**
 * Prepend
 * =================================================================================
 */

$(parent).prepend(el);

parent.insertBefore(el, parent.firstChild);

/**
 * Next
 * =================================================================================
 */

$(el).next();

el.nextElementSibling
 
/**
 * Prev
 * =================================================================================
 */

$(el).prev();

el.previousElementSibling

/**
 * Remove
 * =================================================================================
 */

$(el).remove();

el.parentNode.removeChild(el);

/**
 * Remove Attributes
 * =================================================================================
 */

$(el).removeAttr('tabindex');

el.removeAttribute('tabindex');

/**
 * Remove Class
 * =================================================================================
 */

$(el).removeClass(className);

el.classList.remove(className);

 /**
 * Replace From HTML
 * =================================================================================
 */

$(el).replaceWith(string);

el.outerHTML = string;

/**
 * Set Attributes
 * =================================================================================
 */

$(el).attr('tabindex', 3);

el.setAttribute('tabindex', 3);

 
/**
 * Set Height
 * =================================================================================
 */

$(el).height(val);

function setHeight(el, val) {
  if (typeof val === "function") val = val();
  if (typeof val === "string") el.style.height = val;
  else el.style.height = val + "px";
}
setHeight(el, val);

 /**
 * Set HTML
 * =================================================================================
 */

$(el).html(string);

el.innerHTML = string;

/**
 * Set Style
 * =================================================================================
 */

$(el).css('border-width', '20px');

el.style.borderWidth = '20px';
 
/**
 * Set Text
 * =================================================================================
 */

$(el).text(string);

el.textContent = string;

 /**
 * Set Width
 * =================================================================================
 */

$(el).height(val);

function setHeight (el, val) {
  if (typeof val === "function") val = val();
  if (typeof val === "string") el.style.height = val;
  else el.style.height = val + "px";
}
setHeight(el, val);

