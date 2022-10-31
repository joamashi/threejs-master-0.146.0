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
  /**
   * 
   */
}));

// ----------------------------------------------------------------------------------------

(function(global, factory) {

  'use strict';

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
  /**
   * 
   */
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

  /**
   {
      AutoScaleAxis: ƒ ()
      Axis: ƒ ()
      Bar: ƒ ()
      Base: ƒ ()
      Class: {extend: ƒ, cloneDefinitions: ƒ}
      EventEmitter: ƒ ()
      FixedScaleAxis: ƒ ()
      Interpolation: {none: ƒ, simple: ƒ, cardinal: ƒ, monotoneCubic: ƒ, step: ƒ}
      Line: ƒ ()
      Pie: ƒ ()
      StepAxis: ƒ ()
      Svg: ƒ ()
      alphaNumerate: ƒ (n)
      createChartRect: ƒ (svg, options, fallbackPadding)
      createGrid: ƒ (position, index, axis, offset, length, group, classes, eventEmitter)
      createGridBackground: ƒ (gridGroup, chartRect, className, eventEmitter)
      createLabel: ƒ (position, length, index, labels, axis, axisOffset, labelOffset, group, classes, useForeignObject, eventEmitter)
      createSvg: ƒ (container, width, height, className)
      deserialize: ƒ (data)
      ensureUnit: ƒ (value, unit)
      escapingMap: {&: '&amp;', <: '&lt;', >: '&gt;', ": '&quot;', ': '&#039;'}
      extend: ƒ (target)
      getAvailableHeight: ƒ (svg, options)
      getBounds: ƒ (axisLength, highLow, scaleMinSpace, onlyInteger)
      getDataArray: ƒ (data, reverse, multi)
      getHighLow: ƒ (data, options, dimension)
      getMetaData: ƒ (series, index)
      getMultiValue: ƒ (value, dimension)
      getNumberOrUndefined: ƒ (value)
      getSeriesOption: ƒ (series, options, key)
      isDataHoleValue: ƒ (value)
      isFalseyButZero: ƒ (value)
      isMultiValue: ƒ (value)
      isNumeric: ƒ (value)
      mapAdd: ƒ (addend)
      mapMultiply: ƒ (factor)
      namespaces: {svg: 'http://www.w3.org/2000/svg', xmlns: 'http://www.w3.org/2000/xmlns/', xhtml: 'http://www.w3.org/1999/xhtml', xlink: 'http://www.w3.org/1999/xlink', ct: 'http://gionkunz.github.com/chartist-js/ct'}
      noop: ƒ (n)
      normalizeData: ƒ (data, reverse, multi)
      normalizePadding: ƒ (padding, fallback)
      optionsProvider: ƒ (options, responsiveOptions, eventEmitter)
      orderOfMagnitude: ƒ (value)
      polarToCartesian: ƒ (centerX, centerY, radius, angleInDegrees)
      precision: 8
      projectLength: ƒ (axisLength, length, bounds)
      quantity: ƒ (input)
      querySelector: ƒ (query)
      replaceAll: ƒ (str, subStr, newSubStr)
      reverseData: ƒ (data)
      rho: ƒ (num)
      roundWithPrecision: ƒ (value, digits)
      safeHasProperty: ƒ (object, property)
      serialMap: ƒ (arr, cb)
      serialize: ƒ (data)
      splitIntoSegments: ƒ (pathCoordinates, valueData, options)
      sum: ƒ (previous, current)
      times: ƒ (length)
      version: "0.11.0"
   }
  */

  /* Chartist.js 0.11.4
  * Copyright © 2019 Gion Kunz
  * Free to use under either the WTFPL license or the MIT license.
  * https://raw.githubusercontent.com/gionkunz/chartist-js/master/LICENSE-WTFPL
  * https://raw.githubusercontent.com/gionkunz/chartist-js/master/LICENSE-MIT
  */
  /**
   * The core module of Chartist that is mainly providing static functions and higher level functions for chart modules.
   *
   * @module Chartist.Core
   */
  var Chartist = {
    version: '0.11.4'
  };

  (function (globalRoot, Chartist) {
    'use strict';

    var window = globalRoot.window;
    var document = globalRoot.document;

    /**
     * This object contains all namespaces used within Chartist.
     *
     * @memberof Chartist.Core
     * @type {{svg: string, xmlns: string, xhtml: string, xlink: string, ct: string}}
     */
    Chartist.namespaces = {
      svg: 'http://www.w3.org/2000/svg',
      xmlns: 'http://www.w3.org/2000/xmlns/',
      xhtml: 'http://www.w3.org/1999/xhtml',
      xlink: 'http://www.w3.org/1999/xlink',
      ct: 'http://gionkunz.github.com/chartist-js/ct'
    };

    Chartist.noop = function (n) {};

    Chartist.alphaNumerate = function (n) {};

    Chartist.extend = function (target) {
      // var i, source, sourceProp;
      // target = target || {};

      // for (i = 1; i < arguments.length; i++) {
      //   source = arguments[i];
      //   for (var prop in source) {
      //     sourceProp = source[prop];
      //     if (typeof sourceProp === 'object' && sourceProp !== null && !(sourceProp instanceof Array)) {
      //       target[prop] = Chartist.extend(target[prop], sourceProp);
      //     } else {
      //       target[prop] = sourceProp;
      //     }
      //   }
      // }

      // return target;
    };

    Chartist.replaceAll = function(str, subStr, newSubStr) {
      return str.replace(new RegExp(subStr, 'g'), newSubStr);
    };

    Chartist.ensureUnit = function(value, unit) {};

    Chartist.quantity = function(input) {};

    Chartist.querySelector = function(query) {
      return query instanceof Node ? query : document.querySelector(query);
    };

    Chartist.times = function(length) {
      return Array.apply(null, new Array(length));
    };

    Chartist.sum = function(previous, current) {};

    Chartist.mapMultiply = function(factor) {};

    Chartist.mapAdd = function(addend) {};

    Chartist.serialMap = function(arr, cb) {};

    Chartist.roundWithPrecision = function(value, digits) {};

    Chartist.precision = 8;

    Chartist.escapingMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#039;'
    };

    Chartist.serialize = function(data) {};

    Chartist.deserialize = function(data) {};

    Chartist.createSvg = function (container, width, height, className) {};

    Chartist.normalizeData = function(data, reverse, multi) {};

    Chartist.safeHasProperty = function(object, property) {};

    Chartist.isDataHoleValue = function(value) {};

    Chartist.reverseData = function(data) {};

    Chartist.getDataArray = function(data, reverse, multi) {};

    Chartist.normalizePadding = function(padding, fallback) {};

    Chartist.getMetaData = function(series, index) {};

    Chartist.orderOfMagnitude = function (value) {};

    Chartist.projectLength = function (axisLength, length, bounds) {};

    Chartist.getAvailableHeight = function (svg, options) {};

    Chartist.getHighLow = function (data, options, dimension) {};

    Chartist.isNumeric = function(value) {
      return value === null ? false : isFinite(value);
    };

    Chartist.isFalseyButZero = function(value) {};

    Chartist.getNumberOrUndefined = function(value) {};

    Chartist.isMultiValue = function(value) {};

    Chartist.getMultiValue = function(value, dimension) {};

    Chartist.rho = function(num) {};

    Chartist.getBounds = function (axisLength, highLow, scaleMinSpace, onlyInteger) {};

    Chartist.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {};

    Chartist.createChartRect = function (svg, options, fallbackPadding) {};

    /**
     * Creates a grid line based on a projected value.
     *
     * @memberof Chartist.Core
     * @param position
     * @param index
     * @param axis
     * @param offset
     * @param length
     * @param group
     * @param classes
     * @param eventEmitter
     */
    Chartist.createGrid = function(position, index, axis, offset, length, group, classes, eventEmitter) {
      var positionalData = {};
      positionalData[axis.units.pos + '1'] = position;
      positionalData[axis.units.pos + '2'] = position;
      positionalData[axis.counterUnits.pos + '1'] = offset;
      positionalData[axis.counterUnits.pos + '2'] = offset + length;

      var gridElement = group.elem('line', positionalData, classes.join(' '));

      // Event for grid draw
      eventEmitter.emit('draw',
        Chartist.extend({
          type: 'grid',
          axis: axis,
          index: index,
          group: group,
          element: gridElement
        }, positionalData)
      );
    };

    Chartist.createGridBackground = function (gridGroup, chartRect, className, eventEmitter) {};

    Chartist.createLabel = function(position, length, index, labels, axis, axisOffset, labelOffset, group, classes, useForeignObject, eventEmitter) {};

    Chartist.getSeriesOption = function(series, options, key) {};

    Chartist.optionsProvider = function (options, responsiveOptions, eventEmitter) {};

    Chartist.splitIntoSegments = function(pathCoordinates, valueData, options) {};

  }(this || global, Chartist));
  
  
  ;/**
  * @module Chartist.Interpolation
  */
  /* global Chartist */
  (function(globalRoot, Chartist) {
    'use strict';

    Chartist.Interpolation = {};

    Chartist.Interpolation.none = function(options) {};

    Chartist.Interpolation.simple = function(options) {};
    
    Chartist.Interpolation.cardinal = function(options) {};

    Chartist.Interpolation.monotoneCubic = function(options) {};

    Chartist.Interpolation.step = function(options) {};

  }(this || global, Chartist));
  
  /**
  * @module Chartist.Event
  */
  /* global Chartist */
  (function (globalRoot, Chartist) {
    'use strict';

    Chartist.EventEmitter = function () {
      var handlers = [];

      function addEventHandler(event, handler) {
        handlers[event] = handlers[event] || [];
        handlers[event].push(handler);
      }

      function removeEventHandler(event, handler) {
        // Only do something if there are event handlers with this name existing
        if(handlers[event]) {
          // If handler is set we will look for a specific handler and only remove this
          if(handler) {
            handlers[event].splice(handlers[event].indexOf(handler), 1);
            if(handlers[event].length === 0) {
              delete handlers[event];
            }
          } else {
            // If no handler is specified we remove all handlers for this event
            delete handlers[event];
          }
        }
      }
      
      function emit(event, data) {
        // Only do something if there are event handlers with this name existing
        if(handlers[event]) {
          handlers[event].forEach(function(handler) {
            handler(data);
          });
        }

        // Emit event to star event handlers
        if(handlers['*']) {
          handlers['*'].forEach(function(starHandler) {
            starHandler(event, data);
          });
        }
      }

      return {
        addEventHandler: addEventHandler,
        removeEventHandler: removeEventHandler,
        emit: emit
      };
    };

  }(this || global, Chartist));
  
  
  /**
  * @module Chartist.Class
  */
  /* global Chartist */
  (function(globalRoot, Chartist) {
    'use strict';

    function listToArray(list) {
      var arr = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          arr.push(list[i]);
        }
      }
      return arr;
    }

    function extend(properties, superProtoOverride) {}

    function cloneDefinitions() {}

    Chartist.Class = {
      extend: extend,
      cloneDefinitions: cloneDefinitions
    };

  }(this || global, Chartist));
  
  
  /**
  * @module Chartist.Base
  */
  /* global Chartist */
  (function(globalRoot, Chartist) {
    'use strict';

    var window = globalRoot.window;

    function update(data, options, override) {}

    function detach() {}

    function on(event, handler) {}

    function off(event, handler) {}

    function initialize() {}

    function Base(query, data, defaultOptions, options, responsiveOptions) {}

    // Creating the chart base class
    Chartist.Base = Chartist.Class.extend({
      constructor: Base,
      optionsProvider: undefined,
      container: undefined,
      svg: undefined,
      eventEmitter: undefined,
      createChart: function() {
        throw new Error('Base chart type can\'t be instantiated!');
      },
      update: update,
      detach: detach,
      on: on,
      off: off,
      version: Chartist.version,
      supportsForeignObject: false
    });

  }(this || global, Chartist));
  
  
  /**
  * @module Chartist.Svg
  */
  /* global Chartist */
  (function(globalRoot, Chartist) {
    'use strict';

    var document = globalRoot.document;

  }(this || global, Chartist));
  
  
  /**
  * @module Chartist.Svg.Path
  */
  /* global Chartist */
  (function(globalRoot, Chartist) {
    'use strict';

  }(this || global, Chartist));


  ;/* global Chartist */
  (function (globalRoot, Chartist) {
    'use strict';

    var window = globalRoot.window;
    var document = globalRoot.document;

  }(this || global, Chartist));
  
  
  /**
  * @module Chartist.AutoScaleAxis
  */
  /* global Chartist */
  (function (globalRoot, Chartist) {
    'use strict';

    var window = globalRoot.window;
    var document = globalRoot.document;

  }(this || global, Chartist));
  
  
  /**
  * @module Chartist.FixedScaleAxis
  */
  /* global Chartist */
  (function (globalRoot, Chartist) {
    'use strict';

    var window = globalRoot.window;
    var document = globalRoot.document;

  }(this || global, Chartist));
  
  
  /**
  * @module Chartist.StepAxis
  */
  /* global Chartist */
  (function (globalRoot, Chartist) {
    'use strict';

    var window = globalRoot.window;
    var document = globalRoot.document;

  }(this || global, Chartist));
  
  
  /**
  * @module Chartist.Line
  */
  /* global Chartist */
  (function(globalRoot, Chartist){
    'use strict';

    var window = globalRoot.window;
    var document = globalRoot.document;

  }(this || global, Chartist));
  
  
  /**
  * @module Chartist.Bar
  */
  /* global Chartist */
  (function(globalRoot, Chartist){
    'use strict';

    var window = globalRoot.window;
    var document = globalRoot.document;

  }(this || global, Chartist));
  
  
  /**
  * @module Chartist.Pie
  */
  /* global Chartist */
  (function(globalRoot, Chartist) {
    'use strict';

    var window = globalRoot.window;
    var document = globalRoot.document;

  }(this || global, Chartist));

  return Chartist;

}));
