var k = function () {
  function e (t) {
    !function (e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }(this, e),
    this.templateClass = "single-post",
    this.doc = document.body,
    this.paletteEl = document.getElementById("".concat(t, "-imgix-json")) || !1,
    this.palette = !!this.paletteEl && JSON.parse(this.paletteEl.innerHTML),
    this.paletteLength = !!this.paletteEl && this.palette.colors.length
  }

  var t, n, r;
  
  return t = e,
  (n = [{
    key: "getColors",
    value: function () {
      if (!this.palette) return !1;
      for (var e = ["vibrant", "vibrant_light", "vibrant_dark", "muted_light", "muted", "muted_dark"], t = this.palette.colors[this.paletteLength - 1], n = 0; n < e.length; n++)
        if (this.palette.dominant_colors[e[n]]) {
          t = this.palette.dominant_colors[e[n]];
          break
        }

      var r = v.a.from(y)(t.hex);
      
      return {
        primaryColor: g[y.indexOf(r)],
        accentColor: r
      }
    }
  }, {
    key: "init",
    value: function() {
      return !!this.doc.classList.contains(this.templateClass) && (!!(this.paletteEl && this.palette && this.colorBlock) && void 0)
    }
  }]) && b(t.prototype, n),
  r && b(t, r),
  e
}();


function w (e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1,
    r.configurable = !0,
    "value"in r && (r.writable = !0),
    Object.defineProperty(e, r.key, r)
  }
}


var C = function () {

  
  function e () {
    !function(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }(this, e),
    this.heroBlock = document.querySelector(".post-thumbnail"),
    this.block = document.querySelector(".color-block"),
    this.threshold = window.innerHeight + 100,
    this.pastThreshold = !1,
    this.categoryColor,
    this.header = document.querySelector(".site-header"),
    this.nav = document.querySelector(".site-header-menu"),
    this.searchBar = document.querySelector(".search-form-wrap"),
    this.searchForm = document.querySelector(".search-form"),
    this.searchButton = document.querySelector(".search-submit"),
    this.colorBlock = document.querySelector(".color-block"),
    this.spacer = document.querySelector(".icon-spacer"),
    this.icon = document.querySelector(".icon-wrap svg"),
    this.fadeBackground = document.querySelector(".icon-wrap-fade")
  }
  
  var t, n, r;

  return t = e,
  (n = [{
    key: "scrollHandler",
    value: function () {
      this.getOffsetValueFromHero(),
      this.pastThreshold ? (this.removeColorStyle(),
      this.block.style.opacity = 0) : (this.addColorToPageStyles(),
      this.block.style.opacity = 1)
    }
  }, {
    key: "getOffsetValueFromHero",
    value: function () {
      var e = this.heroBlock.getBoundingClientRect()
        , t = e.height / 2 + e.top;
      this.pastThreshold = t < window.scrollY
    }
  }, {
    key: "addColorToPageStyles",
    value: function () {
      var e = this.categoryColor.getColors();
      this.header.style.backgroundColor = e.primaryColor,
      this.searchBar.style.backgroundColor = e.primaryColor,
      this.searchForm.style.backgroundColor = e.primaryColor,
      this.searchButton.style.background = e.primaryColor,
      this.nav.style.backgroundColor = e.primaryColor,
      this.colorBlock.style.backgroundColor = e.primaryColor,
      this.spacer.style.backgroundColor = e.primaryColor,
      this.icon.style.backgroundColor = e.primaryColor,
      this.fadeBackground.style.background = "linear-gradient(90deg, ".concat(e.primaryColor, " 0,hsla(0,0%,100%,0))")
      }
  }, {
    key: "removeColorStyle",
    value: function () {
      this.header.style.backgroundColor = "#fff",
      this.nav.style.backgroundColor = "#fff",
      this.searchButton.style.background = "#fff",
      this.searchBar.style.backgroundColor = "#fff",
      this.searchForm.style.backgroundColor = "#fff",
      this.spacer.style.backgroundColor = "#fff",
      this.icon.style.backgroundColor = "#fff",
      this.fadeBackground.style.background = "linear-gradient(90deg, transparent 0,hsla(0,0%,100%,0))"
    }
  }, {
    key: "addEvents",
    value: function () {
      var e = this;
      this.categoryColor.init(),
      this.scrollHandler(),
      window.addEventListener("scroll", m()(function(t) { e.scrollHandler() }, 200))
    }
  }, {
    key: "init",
    value: function () {
      this.block && this.heroBlock && (this.categoryColor = new k("featured-article"),
      this.addEvents())
    }
  }]) && w(t.prototype, n),
  r && w(t, r),
  e
}(), 


S = {
  queue: {},
  registerCallback: function(e, t) {
    var n = t;
    this.queue[e] = this.queue[e] || [],
    this.queue[e].push(n)
  },
  runCallbacks: function(e, t) {
    var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2]
    , r = (!(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
    
    window.matchMedia(e));
    r.matches;

    n && t(r.matches),
    r.addListener(function(e) { e.matches, t(e.matches) })
  },
  register: function (e, t, n) {
    this.registerCallback(e, t),
    this.runCallbacks(e, t, n)
  },
  deregister: function (e, t) {
    for (var n = this.queue[e], r = 0; r < n.length; r++) {
      var o = n.indexOf(n[r]);
      -1 !== o && n.splice(o, 1)
    }
  }
}, 


L = n("./node_modules/stickybits/dist/stickybits.es.js"), 


A = function () {
  if (document.body.classList.contains("single-post")) {
    var e, t = ".article-sidebar__inner", n = {
      useStickyClasses: !0,
      stickyBitStickyOffset: 75,
      useFixed: !0
    }, 
    
    r = function () {
      document.querySelector(t).classList.remove("js-is-sticky--change")
    };

    S.register("(min-width: 1024px)", function (o) {
      o && e ? e.instances.length > 0 ? e.update() : (r(),
      e = Object(L.default)(t, n)) : o && !e ? (e = Object(L.default)(t, n)).update() : !o && e && (e.cleanup(),
      r())
    }),
    S.register("(min-width: 1200px)", function () { return e.update() }, !1),
    S.register("(min-width: 1440px)", function () { return e.update() }, !1),
    a()("body").on("vimeo:loaded", function () { e && e.update() })
  }
};


function E (e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1,
    r.configurable = !0,
    "value"in r && (r.writable = !0),
    Object.defineProperty(e, r.key, r)
  }
}


var _ = function () {
  function e () {
    !function (e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }(this, e),
    this.heroBlock = document.querySelector(".post-thumbnail"),
    this.block = document.querySelector("[data-color-block]"),
    this.categoryColor
  }

  var t, n, r;

  return t = e,
  (n = [{
    key: "addColor",
    value: function () {
      this.block.style.backgroundColor = this.categoryColor.getColors().primaryColor
    }
  }, {
    key: "init",
    value: function () {
      this.block && (this.categoryColor = new k("related-story"),
      this.addColor())
    }
  }]) && E(t.prototype, n),
  r && E(t, r),
  e
}();


n("./node_modules/waypoints/lib/noframework.waypoints.min.js");


function q (e) {
  return function (e) {
    if (Array.isArray(e)) {
      for (var t = 0, n = new Array(e.length); t < e.length; t++) n[t] = e[t];
      return n
    }
  }(e) || function (e) {
    if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e)
  }(e) || function () {
    throw new TypeError("Invalid attempt to spread non-iterable instance")
  }()
}


var O = document.querySelector(".post-hero")
  , F = document.querySelector(".social-share")
  , j = document.querySelector(".article-footer")
  , x = document.querySelector(".article-body")
  , T = {
    facebook: "https://www.facebook.com/sharer.php?u=",
    twitter: "https://twitter.com/intent/tweet?url=",
    linkedin: "https://www.linkedin.com/shareArticle?mini=true&url="
  }, 


H = function (e) {
  var t = (screen.width - 570) / 2
    , n = "menubar=no,toolbar=no,status=no,width=570,height=570,top=" + (screen.height - 570) / 2 + ",left=" + t;
  window.open(e, "NewWindow", n)
}, 


I = function () {
  var e = document.querySelector(".article-title");
  
  if (!e) return !1;
  
  var t = encodeURIComponent(document.URL)
  , n = encodeURIComponent(e.textContent)
  , r = q(document.querySelectorAll("[data-share-type]"));
  
  if (r.length <= 0) return !1;

  r.map(function (e) {
    e.addEventListener("click", function(r) {
      var o, s, i;
      r.preventDefault(),
      "twitter" === e.dataset.shareType ? H(T.twitter + t + "&text=" + n) : "copy" === e.dataset.shareType ? (o = e,
      s = document.createElement("input"),
      i = o.querySelector(".copy-text"),
      document.body.append(s),
      s.value = location.href,
      s.select(),
      document.execCommand("copy", !0),
      document.body.removeChild(s),
      i.classList.remove("fade-out"),
      i.classList.add("fade-in"),
      i.classList.contains("fade-in") && i.addEventListener("transitionend", function(e) {
        
        e.propertyName,

        setTimeout(function () {
          i.classList.add("fade-out"),
          i.classList.remove("fade-in")
        }, 2e3)

      })) : H(T[e.dataset.shareType] + t)
    })
  })
}, 


D = function (e) {
  var t = O || x
  , n = O ? O.getBoundingClientRect().top : x.getBoundingClientRect().top;
  
  e.matches,
  F.style.top = n > 0 ? "".concat(t.offsetTop, "px") : "75px"
}, 


B = function () {
  if (!document.body.classList.contains("single-post")) return !1;

  !function () {
    var e = O ? O.offsetTop : x.offsetTop;
    F.classList.remove("fade-out");

    var t = new Waypoint({
      element: O || x,
      group: "article",
      handler: function(t) {
        "down" === t ? (F.classList.add("stuck"),
        F.classList.remove("not-stuck"),
        F.style.top = "".concat(75, "px")) : (F.classList.remove("stuck"),
        F.classList.add("not-stuck"),
        F.style.top = "".concat(e, "px"))
      },
      offset: 75
    })
    , n = new Waypoint({
      element: j,
      group: "article",
      handler: function(e) {
        "down" === e ? (F.classList.remove("stuck"),
        F.classList.add("not-stuck"),
        F.style.top = "auto",
        F.style.bottom = "".concat(j.getBoundingClientRect().height, "px")) : (F.classList.add("stuck"),
        F.classList.remove("not-stuck"),
        F.style.top = "".concat(75, "px"),
        F.style.bottom = "auto")
      },
      offset: 255
    });

    S.register("(min-width: 1024px)", function (e) {
      e ? (t.enable(),
      n.enable()) : (t.disable(),
      n.disable(),
      document.querySelector(".share-below-large").classList.remove("fade-out"))
    })
  }(),
  S.register("(min-width: 1024px)", D),
  S.register("(min-width: 1200px)", D),
  S.register("(min-width: 1440px)", D)
};


function M (e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1,
    r.configurable = !0,
    "value"in r && (r.writable = !0),
    Object.defineProperty(e, r.key, r)
  }
}


var N = function () {
  function e () {
    !function(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }(this, e),
    this.colorBlock = new C,
    this.rsColorBlock = new _
  }

  var t, n, r;
  
  return t = e,
  (n = [{
    key: "init",
    value: function () {
      if (!document.body.classList.contains("single-post")) return !1;
      this.colorBlock.init(),
      this.rsColorBlock.init(),
      A(),
      I(),
      B()
    }
  }]) && M(t.prototype, n),
  r && M(t, r),
  e
}(), 


P = (n("./node_modules/lazysizes/lazysizes.js"), function () {
    document.addEventListener("lazybeforeunveil", function(e) {
      var t = e.target.getAttribute("data-src");
      if (!t) return !1;
      e.target.style.backgroundImage = "url(" + t + ")"
    })
  }
), 


V = n("./node_modules/@vimeo/player/dist/player.es.js"), 


R = function() {
  var e = document.querySelector("#feat-vid");
  if (!document.body.classList.contains("single-post") || !e) return !1;
  new V.default("feat-vid",{ id: e.dataset.videoId, responsive: !0, width: 640}).ready().then(function() {
      a()("body").trigger("vimeo:loaded")
  })
}, 


z = n("./node_modules/query-string/index.js"), 


J = n.n(z);


function U (e) {
  return function (e) {
    if (Array.isArray(e)) {
      for (var t = 0, n = new Array(e.length); t < e.length; t++) n[t] = e[t];
      return n
    }
  }(e) || function (e) {
      if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e)
  }(e) || function () {
      throw new TypeError("Invalid attempt to spread non-iterable instance")
  }()
}


var W = function(e) {
  return null == e || 0 == e.length
}, 


G = function(e) {
  var t;
  
  if (W(e)) return !0;

  for (t = 0; t < e.length; t++) {
    var n = e.charAt(t);
    if (-1 == " \t\n\r".indexOf(n)) return !1
  }
  
  return !0
}, 


Y = function(e, t) {
  var n = e.querySelector(".form-control")
    , r = e.querySelector(".form__message")
    , o = e.querySelector(".upsell__content-cta-link")
    , s = e.classList.contains("inline-response");
  e.classList.remove("has-error"),
  e.classList.add("has-success"),
  n.value = "",
  n.blur(),
  r.textContent = t,
  s ? (n.classList.add("fade-out"),
  o.classList.add("fade-out"),
  setTimeout(function() {
    r.classList.add("fade-in")
  }, 200)) : setTimeout(function() {
    r.classList.add("fade-in")
  }, 200)
}, 

K = function() {
  U(document.querySelectorAll("[data-vimeo-form]")).map(function(e) {
    e.addEventListener("submit", function(t) {
      var n, r, o, s, i;
      t.preventDefault(),
      function(e) {
          if (W(e)) return !1;
          if (G(e)) return !1;
          for (var t = 1, n = e.length; t < n && "@" != e.charAt(t); ) t++;
          if (t >= n || "@" != e.charAt(t)) return !1;
          for (t += 2; t < n && "." != e.charAt(t); ) t++;
          return !(t >= n - 1 || "." != e.charAt(t))
      }(e.querySelector(".form-control").value) ? (n = e,
      r = a()(n).attr("data-nonce"),
      o = n.querySelector("input"),
      s = a()(n).attr("data-form-id"),
      i = {
        action: "vimeo_form_submit",
        email: o.value,
        security: r,
        SubAction: "sub",
        MID: vimeoAjax.MID,
        listID: s
      },
      a.a.ajax({
        type: "POST",
        dataType: "json",
        data: i,
        url: vimeoAjax.url
      }).done(function(e) {
        var t = a()(e).filter("h2").find("a").get(0).getAttribute("href")
        , r = J.a.parse(t)
        , o = r.errorcode ? function(e) {
          switch (e) {
          case "1": return "An error has occurred while attempting to save your subscriber information.";
          case "2": return "The list provided does not exist.";
          case "3": return "Information was not provided for a mandatory field.";
          case "4": return "Invalid information was provided.";
          case "5": return "Information provided is not unique.";
          case "6":
          case "7": return "An error has occurred while attempting to save your subscriber information.";
          case "8": return "Subscriber already exists.";
          case "9":
          case "10": return "An error has occurred while attempting to save your subscriber information.";
          case "12": return "The subscriber you are attempting to insert is on the master unsubscribe list or the global unsubscribe list.";
          case "13":
          default: return "Please refresh and try again."
          }
        }(r.errorcode) : "Thanks for subscribing!";
        
        Y(n, o)

      }).fail(function(e) {
        console.log("error", e),
        Y(n, "Opps! There was an error. Please try again.")
      })) : function(e) {
        var t = e.querySelector(".form-control");
        e.classList.remove("has-success"),
        e.classList.add("has-error"),
        t.focus(),
        t.value = "",
        t.placeholder = "please try again"
      }(e)
    })
  })
};


new h("nav").init(),
(new N).init(),
R(),
P(),
K()