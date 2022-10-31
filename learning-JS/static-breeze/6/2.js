(function(Core, utils) {
	utils.url = {
		appendParamToURL: function (url, key, value) {
			var g = "?";
			if (url.indexOf(g) !== -1) {
				g = "&";
			}
			return url + g + key + "=" + (_.isEmpty($.trim(value)) ? "" : encodeURIComponent(value))

		},
		appendParamsToUrl: function (e, i, d) {
			var g = this.getUri(e),
				h = arguments.length < 3 ? false : d;
			var f = $.extend(g.queryParams, i);
			var c = g.path + "?" + $.param(f);
			if (h) {
				c += g.hash
			}
			if (c.indexOf("http") < 0 && c.charAt(0) !== "/") {
				c = "/" + c
			}
			return c
		},
		removeParamFromURL: function (d, k) {
			var g = d.split("?");
			if (g.length >= 2) {
				var c = g.shift();
				var j = g.join("?");
				var h = encodeURIComponent(k) + "=";
				var f = j.split(/[&;]/g);
				var e = f.length;
				while (0 < e--) {
					if (f[e].lastIndexOf(h, 0) !== -1) {
						f.splice(e, 1)
					}
				}
				d = c + "?" + f.join("&")
			}
			return d
		},
		updateParamFromURL: function (e, c, f) {
			var d = new RegExp("([?&])" + c + "=.*?(&|$)", "i");
			var g = e.indexOf("?") !== -1 ? "&" : "?";
			if (e.match(d)) {
				return e.replace(d, "$1" + c + "=" + f + "$2")
			} else {
				return e + g + c + "=" + f
			}
		},
		staticUrl: function (c) {
			if (!c || a.trim(c).length === 0) {
				return b.urls.staticPath
			}
			return b.urls.staticPath + (c.charAt(0) === "/" ? c.substr(1) : c)
		},
		ajaxUrl: function (c) {
			return this.appendParamToURL(c, "format", "ajax")
		},
		toAbsoluteUrl: function (c) {
			if (c.indexOf("http") !== 0 && c.charAt(0) !== "/") {
				c = "/" + c
			}
			return c;
		},
		toProtocolNeutralUrl: function (d) {
			var c = d ? d.indexOf("://") : -1;
			return c >= 0 ? d.substr(c + 1) : d;
		},
		// hot-fix (chohh) -20160513
		getCurrentUrl: function () {
			//return window.location.href
			return window.location.origin + window.location.pathname + window.location.search;
		},
		getQueryStringParams: function (c) {
			if (!c || c.length === 0) {
				return {};
			}
			var e = {},
				d = unescape(c);
			d.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function (g, f, i, h) {
				e[f] = h;
			});
			return e;
		},
		getUri: function (e) {
			var c;
			if (e.tagName && a(e).attr("href")) {
				c = e;
			} else {
				if (typeof e === "string") {
					c = document.createElement("a");
					c.href = e;
				} else {
					return null;
				}
			}
			var d = (c.pathname.charAt(0) === "/" ? "" : "/") + c.pathname;
			return {
				protocol: c.protocol,
				host: c.host,
				hostname: c.hostname,
				port: c.port,
				path: d,
				query: c.search,
				queryParams: c.search.length > 1 ? this.getQueryStringParams(c.search.substr(1)) : {},
				hash: c.hash,
				url: c.protocol + "//" + c.hostname + d,
				urlWithQuery: c.protocol + "//" + c.hostname + c.port + d + c.search
			}
		},
		hashExists: function () {
			return (window.location.hash) ? true : false;
		},
		getHashFromUrl: function () {
			return window.location.hash.substring(1);
		}
	}
})(Core = window.Core || {}, Core.Utils = window.Core.Utils || {});