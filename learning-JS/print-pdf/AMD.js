/**
 * AMD 
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory());
})(this, (function () {
  'use strict';
}));

// ----------------------------------------------------------------------------------------

(function (root, factory) {
  if (root === undefined && window !== undefined) root = window;
  if (typeof define === 'function' && define.amd) {
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require("jquery"));
  } else {
    factory(root["jQuery"]);
  }
}(this, function (jQuery) {
  'use strict';
}));

// ----------------------------------------------------------------------------------------

(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], function($) {
      return factory($, global, global.document, global.Math);
    });
  } else if (typeof exports === "object" && exports) {
    module.exports = factory(require('jquery'), global, global.document, global.Math);
  } else {
    factory(jQuery, global, global.document, global.Math);
  }

})(typeof window !== 'undefined' ? window : this, function ($, window, document, Math, undefined) {
  'use strict';
});

// ----------------------------------------------------------------------------------------

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Chartist', [], function () {
      return (root['Chartist'] = factory());
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root['Chartist'] = factory();
  }
}(this, function () {
  'use strict';
}));