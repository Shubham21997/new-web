var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function (a) {
  var b = 0;
  return function () {
    return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (a) {
  return { next: $jscomp.arrayIteratorImpl(a) };
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (a, b, c) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[b] = c.value;
        return a;
      };
$jscomp.getGlobal = function (a) {
  a = [
    "object" == typeof globalThis && globalThis,
    a,
    "object" == typeof window && window,
    "object" == typeof self && self,
    "object" == typeof global && global,
  ];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) return c;
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE =
  "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS =
  !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (a, b) {
  var c = $jscomp.propertyToPolyfillSymbol[b];
  if (null == c) return a[b];
  c = a[c];
  return void 0 !== c ? c : a[b];
};
$jscomp.polyfill = function (a, b, c, d) {
  b &&
    ($jscomp.ISOLATE_POLYFILLS
      ? $jscomp.polyfillIsolated(a, b, c, d)
      : $jscomp.polyfillUnisolated(a, b, c, d));
};
$jscomp.polyfillUnisolated = function (a, b, c, d) {
  c = $jscomp.global;
  a = a.split(".");
  for (d = 0; d < a.length - 1; d++) {
    var e = a[d];
    if (!(e in c)) return;
    c = c[e];
  }
  a = a[a.length - 1];
  d = c[a];
  b = b(d);
  b != d &&
    null != b &&
    $jscomp.defineProperty(c, a, { configurable: !0, writable: !0, value: b });
};
$jscomp.polyfillIsolated = function (a, b, c, d) {
  var e = a.split(".");
  a = 1 === e.length;
  d = e[0];
  d = !a && d in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var f = 0; f < e.length - 1; f++) {
    var g = e[f];
    if (!(g in d)) return;
    d = d[g];
  }
  e = e[e.length - 1];
  c = $jscomp.IS_SYMBOL_NATIVE && "es6" === c ? d[e] : null;
  b = b(c);
  null != b &&
    (a
      ? $jscomp.defineProperty($jscomp.polyfills, e, {
          configurable: !0,
          writable: !0,
          value: b,
        })
      : b !== c &&
        (void 0 === $jscomp.propertyToPolyfillSymbol[e] &&
          ((c = (1e9 * Math.random()) >>> 0),
          ($jscomp.propertyToPolyfillSymbol[e] = $jscomp.IS_SYMBOL_NATIVE
            ? $jscomp.global.Symbol(e)
            : $jscomp.POLYFILL_PREFIX + c + "$" + e)),
        $jscomp.defineProperty(d, $jscomp.propertyToPolyfillSymbol[e], {
          configurable: !0,
          writable: !0,
          value: b,
        })));
};
$jscomp.initSymbol = function () {};
$jscomp.polyfill(
  "Symbol",
  function (a) {
    if (a) return a;
    var b = function (f, g) {
      this.$jscomp$symbol$id_ = f;
      $jscomp.defineProperty(this, "description", {
        configurable: !0,
        writable: !0,
        value: g,
      });
    };
    b.prototype.toString = function () {
      return this.$jscomp$symbol$id_;
    };
    var c = "jscomp_symbol_" + ((1e9 * Math.random()) >>> 0) + "_",
      d = 0,
      e = function (f) {
        if (this instanceof e)
          throw new TypeError("Symbol is not a constructor");
        return new b(c + (f || "") + "_" + d++, f);
      };
    return e;
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Symbol.iterator",
  function (a) {
    if (a) return a;
    a = Symbol("Symbol.iterator");
    for (
      var b =
          "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(
            " "
          ),
        c = 0;
      c < b.length;
      c++
    ) {
      var d = $jscomp.global[b[c]];
      "function" === typeof d &&
        "function" != typeof d.prototype[a] &&
        $jscomp.defineProperty(d.prototype, a, {
          configurable: !0,
          writable: !0,
          value: function () {
            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
          },
        });
    }
    return a;
  },
  "es6",
  "es3"
);
$jscomp.iteratorPrototype = function (a) {
  a = { next: a };
  a[Symbol.iterator] = function () {
    return this;
  };
  return a;
};
$jscomp.iteratorFromArray = function (a, b) {
  a instanceof String && (a += "");
  var c = 0,
    d = !1,
    e = {
      next: function () {
        if (!d && c < a.length) {
          var f = c++;
          return { value: b(f, a[f]), done: !1 };
        }
        d = !0;
        return { done: !0, value: void 0 };
      },
    };
  e[Symbol.iterator] = function () {
    return e;
  };
  return e;
};
$jscomp.polyfill(
  "Array.prototype.keys",
  function (a) {
    return a
      ? a
      : function () {
          return $jscomp.iteratorFromArray(this, function (b) {
            return b;
          });
        };
  },
  "es6",
  "es3"
);
EBG = "undefined" != typeof EBG ? EBG : {};
EBG.Semi = EBG.Semi || {};
EBG.Semi.Infra = function () {};
EBG.Semi.Infra.declareNamespace = function (a) {
  var b = window.EBG.Semi;
  a = a.split(".");
  for (var c = 0; c < a.length; c++) {
    var d = a[c],
      e = b[d];
    e || (e = b[d] = {});
    b = e;
  }
};
EBG.Semi.Infra.isDefined = function (a) {
  return "undefined" != typeof a;
};
EBG.Semi.Infra.isDefinedNotNull = function (a) {
  return EBG.Semi.Infra.isDefined(a) && null != a;
};
EBG.Semi.Infra.runTimed = function (a, b, c, d) {
  return setTimeout(function () {
    b.apply(a, c);
  }, d);
};
EBG.Semi.Infra.indexOfArray = function (a, b, c) {
  c = c || 0;
  for (var d = a.length; c < d; c++) if (a[c] === b) return c;
  return -1;
};
EBG.Semi.Infra.getTimestamp = function () {
  var a = new Date();
  return (
    parseInt(a.getHours() + 1) +
    ":" +
    a.getMinutes() +
    ":" +
    a.getSeconds() +
    "." +
    a.getMilliseconds() +
    " " +
    a.getDate() +
    "." +
    parseInt(a.getMonth() + 1) +
    "." +
    a.getFullYear()
  );
};
EBG.Semi.Infra.getQuerystringParam = function (a, b) {
  if (!a) return null;
  b || (b = window.location.href);
  a = a.replace(/[\[\]]/g, "\\$&");
  return (a = new RegExp("[?&]" + a + "(=([^&#]*)|&|#|$)").exec(b))
    ? a[2]
      ? decodeURIComponent(a[2].replace(/\+/g, " "))
      : ""
    : null;
};
EBG.Semi.Infra.getValueFromPath = function (a) {
  try {
    a = a.split(".");
    for (var b = window, c = 0; c < a.length; c++) b = b[a[c]];
    return b;
  } catch (d) {}
  return null;
};
EBG.Semi.Infra.getUrlParameter = function (a) {
  var b = "",
    c = EBG.Semi.Infra.getWindowLocation().toString(),
    d = new RegExp("[&,?]" + a + "=(.*)$", "i");
  (a = c.match(new RegExp("[&,?]" + a + "=(.*)[&]", "i")) || c.match(d)) &&
    0 < a.length &&
    (-1 < a[1].indexOf("&") && (a[1] = a[1].substr(0, a[1].indexOf("&"))),
    (b = a[1]));
  return b;
};
EBG.Semi.Infra.mergeObj = function (a, b, c) {
  c = !!c;
  for (var d in a)
    !a.hasOwnProperty(d) || (b.hasOwnProperty(d) && !c) || (b[d] = a[d]);
};
EBG.Semi.Infra.combinePaths = function (a, b) {
  a = a || "";
  b = b || "";
  a && "/" != a[a.length - 1] && b && "/" != b[0] && (a += "/");
  b && (a += b);
  return a;
};
EBG.Semi.Infra.isPageLoaded = function () {
  var a = !0;
  "complete" != document.readyState &&
    "loaded" != document.readyState &&
    "interactive" != document.readyState &&
    (a = !1);
  return a;
};
EBG.Semi.Infra.addChildToPage = function (a, b, c, d) {
  ("undefined" != typeof b && b) ||
    (b = document.body || document.getElementsByTagName("head")[0]);
  this.isDefined(c) && null != c && this.addEventListener(a, c, d);
  b.appendChild(a);
};
EBG.Semi.Infra.addEventListener = function (a, b, c) {
  a.addEventListener
    ? a.addEventListener(b, c, !1)
    : ((b = "on" + b),
      a.attachEvent ? a.attachEvent(b, c) : b in a && (a[b] = c));
};
EBG.Semi.Infra.createScriptElement = function (a, b, c, d) {
  try {
    var e = a.createElement(b);
    e.type = c;
    e.src = d;
    e.async = !1;
    return e;
  } catch (f) {}
};
EBG.Semi.Infra.addScriptElement = function (a, b, c) {
  var d = c ? c : document;
  b
    ? ((c = b),
      0 == c.childNodes.length &&
        ((d = d.createElement("div")),
        (d.style.display = "none"),
        b.appendChild(d)))
    : (c = d.head || d.documentElement);
  c.insertBefore(a, c.firstChild);
};
EBG.Semi.Infra.ajax = (function () {
  var a = {
    x: function () {
      if ("undefined" !== typeof XMLHttpRequest) return new XMLHttpRequest();
      for (
        var b =
            "MSXML2.XmlHttp.6.0 MSXML2.XmlHttp.5.0 MSXML2.XmlHttp.4.0 MSXML2.XmlHttp.3.0 MSXML2.XmlHttp.2.0 Microsoft.XmlHttp".split(
              " "
            ),
          c,
          d = 0;
        d < b.length;
        d++
      )
        try {
          c = new ActiveXObject(b[d]);
          break;
        } catch (e) {}
      return c;
    },
    send: function (b, c, d, e, f) {
      void 0 === f && (f = !0);
      var g = a.x();
      g.open(d, b, f);
      g.onreadystatechange = function () {
        4 == g.readyState && c(g.responseText);
      };
      "POST" == d &&
        g.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      g.send(e);
    },
    get: function (b, c, d, e) {
      var f = [],
        g;
      for (g in c)
        f.push(encodeURIComponent(g) + "=" + encodeURIComponent(c[g]));
      a.send(b + (f.length ? "?" + f.join("&") : ""), d, "GET", null, e);
    },
    post: function (b, c, d, e) {
      var f = [],
        g;
      for (g in c)
        f.push(encodeURIComponent(g) + "=" + encodeURIComponent(c[g]));
      a.send(b, d, "POST", f.join("&"), e);
    },
  };
  return a;
})();
EBG.Semi.Infra.injectScript = function (a) {
  a = "<html><head></head><body>" + a + "</body></html>";
  var b = this.createFriendlyIframe();
  this.addChildToPage(b);
  document.documentMode &&
    7 < document.documentMode &&
    !this.isIframeScriptable(b) &&
    this.enableIframeScriptable(b);
  this.writeToFriendlyIframe(b, a, !0);
};
EBG.Semi.Infra.loadFileByScriptElem = function (a, b, c, d, e, f) {
  if (d)
    (a = a ? a : document),
      a.write("<script src='" + b + "'>\x3c/script>"),
      a.close();
  else {
    a = a || document;
    var g = a.createElement("script");
    g.type = "text/" + (b.type || "javascript");
    g.src = b.src || b;
    g.async = !0;
    var k = !1;
    g.onreadystatechange = g.onload = function () {
      var n = g.readyState;
      !c ||
        k ||
        (n && !/loaded|complete/.test(n)) ||
        ((k = !0), c.apply(e, [f]));
    };
    g.onerror = function () {
      c.apply(e, [f]);
    };
    EBG.Semi.Infra.addChildToPage(
      g,
      a.body || a.getElementsByTagName("head")[0]
    );
  }
};
EBG.Semi.Infra.executeTextByScriptElem = function (a, b, c, d, e) {
  a = a || document;
  var f = a.createElement("script");
  f.type = "text/javascript";
  f.text = b;
  EBG.Semi.Infra.addChildToPage(f, a.body || a.getElementsByTagName("head")[0]);
  c && c.apply(d || window, [e]);
};
EBG.Semi.Infra.getWindowLocation = function () {
  return window.location;
};
EBG.Semi.Infra.getCurrentScriptElement = (function () {
  if (document.currentScript) var a = document.currentScript;
  else
    for (
      var b = document.getElementsByTagName("script"), c = 0;
      !a && c < b.length;
      c++
    )
      -1 === b[c].src.indexOf("ebOneTag.js") ||
        b[c].chosen ||
        ((b[c].chosen = !0), (a = b[c]));
  return function () {
    return a;
  };
})();
EBG.Semi.Infra.getRandomNumber = function () {
  try {
    var a = Math.random().toString();
    return (a = a.substr(a.indexOf(".") + 1));
  } catch (b) {}
};
EBG.Semi.Infra.getAddInEyeDomain = function (a, b) {
  var c = (b = ""),
    d = 0;
  a = (a ? a : window).document;
  a = a.referrer ? a.referrer : a.location.href;
  try {
    (a = a.toLowerCase()),
      7 <= a.length && "http://" == a.substr(0, 7)
        ? ((c = a.substr(7)), a.substr(0, 7))
        : 8 <= a.length && "https://" == a.substr(0, 8)
        ? ((c = a.substr(8)), a.substr(0, 8))
        : (c = a),
      (d = c.indexOf("/")),
      0 < d && (c = c.substr(0, d)),
      (b = c);
  } catch (e) {
    b = "";
  }
  return b;
};
EBG.Semi.Infra.createFriendlyIframe = function (a, b, c, d) {
  a = a ? a : document;
  a = a.createElement("iframe");
  b && a.setAttribute("id", b);
  a.style.display = c ? "" : "none";
  a.style.width = c ? c + "px" : "0px";
  a.style.height = d ? d + "px" : "0px";
  document.documentMode && 8 > document.documentMode
    ? ((a.frameBorder = 0),
      (a.margin = 0),
      (a.marginWidth = 0),
      (a.marginHeight = 0),
      (a.scrolling = "no"))
    : (a.setAttribute("scrolling", "no"),
      a.setAttribute("marginwidth", "0"),
      a.setAttribute("marginheight", "0"),
      a.setAttribute("frameborder", "0"));
  return a;
};
EBG.Semi.Infra.isIframeScriptable = function (a) {
  try {
    this.ifrmDocument = a.contentWindow.document;
  } catch (b) {
    return !1;
  }
  return !0;
};
EBG.Semi.Infra.enableIframeScriptable = function (a) {
  a &&
    (a.setAttribute("data-isready", "false"),
    (a.src =
      "javascript:document.write('<scr'+'ipt>\rtry{parent.document.domain;}catch(e){document.domain=\"" +
      (document.domain +
        "\";}\rparent.EBG.Semi.Infra.friendlyIframeIsReadyCallback(window);\r</scr'+'ipt>\r');")));
};
EBG.Semi.Infra.friendlyIframeIsReadyCallback = function (a) {
  for (
    var b = document.getElementsByTagName("iframe"), c = 0;
    c < b.length;
    c++
  )
    try {
      if (
        (b[c].contentWindow || b[c].contentDocument.window || b[c].window) == a
      ) {
        b[c].setAttribute("data-isready", "true");
        break;
      }
    } catch (d) {}
};
EBG.Semi.Infra.writeToFriendlyIframe = function (a, b, c) {
  if (
    document.documentMode &&
    7 < document.documentMode &&
    "false" == a.getAttribute("data-isready")
  )
    setTimeout(function () {
      EBG.Semi.Infra.writeToFriendlyIframe(a, b, c);
    }, 100);
  else {
    c = this.isDefined(c) ? c : !1;
    var d = a.contentWindow
      ? a.contentWindow.document
      : a.contentDocument && a.contentDocument.document
      ? a.contentDocument.document
      : a.contentDocument;
    d.write(b);
    c &&
      setTimeout(function () {
        d.close();
      }, 1e3);
  }
};
EBG.Semi.Infra.createUnfriendlyIframe = function (a, b, c) {
  b && !EBG.Semi.Infra.isPageLoaded()
    ? (this.logger &&
        this.logger.info("Adding unfriendly iframe in sync mode, url: " + a),
      document.write(
        '<iframe src="' +
          a +
          '" style="display:none;width:0px;height:0px"></iframe>'
      ))
    : (this.logger &&
        this.logger.info("Adding unfriendly iframe in async mode, url: " + a),
      (b = document.createElement("iframe")),
      b.setAttribute("src", a),
      (b.style.display = "none"),
      (b.onload = c),
      EBG.Semi.Infra.addChildToPage(b));
};
EBG.Semi.Infra.getTopLevelReferrer = function (a) {
  var b = null;
  try {
    if (a.top && a.top.document && a.top.document.referrer)
      b = a.top.document.referrer.toString();
    else throw Error("Unfriendly iframe");
  } catch (c) {
    this.isDefined(a) &&
      a.document &&
      a.document.referrer &&
      (b = a.document.referrer.toString());
  }
  return b;
};
EBG.Semi.Infra.getTokenValueFromURL = function (a, b) {
  if ((b = b.indexOf("?") ? b.split("?")[1] : "")) {
    b = b.split("&");
    for (var c = 0; c < b.length; c++) {
      var d = b[c].split("=");
      if (d[0] == a) return d[d.length - 1];
    }
  }
  return null;
};
EBG.Semi.Infra.urlAvailableLength = function (a) {
  var b = 8e3;
  EBG.Semi.Infra.isOldIE() && (b = 2048);
  return b - a.length;
};
EBG.Semi.Infra.isOldIE = function (a) {
  a = navigator.userAgent;
  var b, c;
  return -1 != (b = a.indexOf("MSIE")) &&
    ((a = a.substring(b + 5)),
    -1 != (c = a.indexOf(";")) && (a = a.substring(0, c)),
    -1 != (c = a.indexOf(" ")) && (a = a.substring(0, c)),
    (c = parseInt("" + a, 10)),
    isNaN(c) &&
      (parseFloat(navigator.appVersion),
      (c = parseInt(navigator.appVersion, 10))),
    9 > c)
    ? !0
    : !1;
};
EBG.Semi.Infra.typeOf = function (a) {
  var b = typeof a;
  if ("object" == b)
    if (a) {
      if (
        a instanceof Array ||
        (!(a instanceof Object) &&
          "[object Array]" == Object.prototype.toString.call(a)) ||
        ("number" == typeof a.length &&
          "undefined" != typeof a.splice &&
          "undefined" != typeof a.propertyIsEnumerable &&
          !a.propertyIsEnumerable("splice"))
      )
        return "array";
      if (
        !(
          a instanceof Object ||
          ("[object Function]" != Object.prototype.toString.call(a) &&
            ("undefined" == typeof a.call ||
              "undefined" == typeof a.propertyIsEnumerable ||
              a.propertyIsEnumerable("call")))
        )
      )
        return "function";
    } else return "null";
  else if ("function" == b && "undefined" == typeof a.call) return "object";
  return b;
};
EBG.Semi.declareNamespace = EBG.Semi.Infra.declareNamespace;
EBGVT = "undefined" != typeof EBGVT ? EBGVT : {};
EBGVT.JSON =
  "JSON" in window && window.JSON && window.JSON.stringify && window.JSON.parse
    ? JSON
    : {};
(function () {
  function a(h) {
    return 10 > h ? "0" + h : h;
  }
  function b(h) {
    e.lastIndex = 0;
    return e.test(h)
      ? '"' +
          h.replace(e, function (m) {
            var q = k[m];
            return "string" === typeof q
              ? q
              : "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice(-4);
          }) +
          '"'
      : '"' + h + '"';
  }
  function c(h, m) {
    var q = f,
      l = m[h];
    l &&
      "object" === typeof l &&
      "function" === typeof l.toJSON &&
      (l = l.toJSON(h));
    "function" === typeof n && (l = n.call(m, h, l));
    switch (typeof l) {
      case "string":
        return b(l);
      case "number":
        return isFinite(l) ? String(l) : "null";
      case "boolean":
      case "null":
        return String(l);
      case "object":
        if (!l) return "null";
        f += g;
        var r = [];
        if ("[object Array]" === Object.prototype.toString.apply(l)) {
          var t = l.length;
          for (h = 0; h < t; h += 1) r[h] = c(h, l) || "null";
          m =
            0 === r.length
              ? "[]"
              : f
              ? "[\n" + f + r.join(",\n" + f) + "\n" + q + "]"
              : "[" + r.join(",") + "]";
          f = q;
          return m;
        }
        if (n && "object" === typeof n)
          for (t = n.length, h = 0; h < t; h += 1) {
            var p = n[h];
            "string" === typeof p &&
              (m = c(p, l)) &&
              r.push(b(p) + (f ? ": " : ":") + m);
          }
        else
          for (p in l)
            Object.hasOwnProperty.call(l, p) &&
              (m = c(p, l)) &&
              r.push(b(p) + (f ? ": " : ":") + m);
        m =
          0 === r.length
            ? "{}"
            : f
            ? "{\n" + f + r.join(",\n" + f) + "\n" + q + "}"
            : "{" + r.join(",") + "}";
        f = q;
        return m;
    }
  }
  "function" !== typeof Date.prototype.toJSON &&
    ((Date.prototype.toJSON = function (h) {
      return (
        this.getUTCFullYear() +
        "-" +
        a(this.getUTCMonth() + 1) +
        "-" +
        a(this.getUTCDate()) +
        "T" +
        a(this.getUTCHours()) +
        ":" +
        a(this.getUTCMinutes()) +
        ":" +
        a(this.getUTCSeconds()) +
        "Z"
      );
    }),
    (String.prototype.toJSON =
      Number.prototype.toJSON =
      Boolean.prototype.toJSON =
        function (h) {
          return this.valueOf();
        }));
  var d =
      /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    e =
      /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    f,
    g,
    k = {
      "\b": "\\b",
      "\t": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      '"': '\\"',
      "\\": "\\\\",
    },
    n;
  "function" !== typeof EBGVT.JSON.stringify &&
    (EBGVT.JSON.stringify = function (h, m, q) {
      var l;
      g = f = "";
      if ("number" === typeof q) for (l = 0; l < q; l += 1) g += " ";
      else "string" === typeof q && (g = q);
      if (
        (n = m) &&
        "function" !== typeof m &&
        ("object" !== typeof m || "number" !== typeof m.length)
      )
        throw Error("EBGVT.JSON.stringify");
      return c("", { "": h });
    });
  "function" !== typeof EBGVT.JSON.parse &&
    (EBGVT.JSON.parse = function (h, m) {
      function q(l, r) {
        var t,
          p = l[r];
        if (p && "object" === typeof p)
          for (t in p)
            if (Object.hasOwnProperty.call(p, t)) {
              var u = q(p, t);
              void 0 !== u ? (p[t] = u) : delete p[t];
            }
        return m.call(l, r, p);
      }
      d.lastIndex = 0;
      d.test(h) &&
        (h = h.replace(d, function (l) {
          return "\\u" + ("0000" + l.charCodeAt(0).toString(16)).slice(-4);
        }));
      if (
        /^[\],:{}\s]*$/.test(
          h
            .replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
            .replace(
              /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
              "]"
            )
            .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
        )
      )
        return (
          (h = eval("(" + h + ")")),
          "function" === typeof m ? q({ "": h }, "") : h
        );
      throw new SyntaxError("EBGVT.JSON.parse");
    });
})();
EBG.Semi.EventName = { ALL_USER_ID_FOUND: "allUserIdFound" };
EBG.Semi.ServingState = {
  script: "SCRIPT",
  friendlyIframe: "FRIENDLY_IFRAME",
  unfriendlyIframe: "IFRAME",
};
EBG.Semi.Events = EBG.Semi.Events || {};
EBG.Semi.Events.EventManager = function () {};
EBG.Semi.Events.EventManager.prototype = {
  _subscriptions: {},
  subscribeToEvent: function (a, b, c, d) {
    this._subscriptions[a] || (this._subscriptions[a] = {});
    this._subscriptions[a][d] || (this._subscriptions[a][d] = []);
    d && this._subscriptions[a][d].push({ callback: b, bindingCallback: c });
  },
  dispatchEvent: function (a, b, c) {
    if (c)
      for (var d = this._subscriptions[a][c], e = 0; e < d.length; ++e) {
        var f = this._subscriptions[a][c][e],
          g = f.callback;
        g.apply(f.bindingCallback, [b]);
      }
    else
      for (c in ((a = this._subscriptions[a]), a))
        if (a[c])
          for (d = a[c], e = 0; e < d.length; ++e)
            (f = a[c][e]), (g = f.callback), g.apply(f.bindingCallback, [b]);
  },
};
EBG.Semi.Events.eventMgr =
  EBG.Semi.Events.eventMgr || new EBG.Semi.Events.EventManager();
EBG.Semi.WindowUtil = function () {};
EBG.Semi.WindowUtil.getTopWindow = function () {
  var a = window,
    b = a.location.origin || a.location.protocol + "//" + a.location.host;
  a.EBservingMode = EBG.Semi.ServingState.script;
  try {
    if (window.location.ancestorOrigins && window.URL)
      for (var c = 0; c < location.ancestorOrigins.length; c++)
        if (
          (0 == c && "null" == b && (b = location.ancestorOrigins[0]),
          location.ancestorOrigins[c] === b)
        )
          (a = a.parent),
            (a.EBservingMode = EBG.Semi.ServingState.friendlyIframe);
        else {
          a.EBservingMode = EBG.Semi.ServingState.unfriendlyIframe;
          break;
        }
    else
      for (; a !== a.parent; ) {
        b = null;
        c = a.location.origin || a.location.protocol + "//" + a.location.host;
        try {
          b =
            a.parent.location.origin ||
            a.parent.location.protocol + "//" + a.parent.location.host;
        } catch (d) {}
        if (b === c)
          (a = a.parent),
            (a.EBservingMode = EBG.Semi.ServingState.friendlyIframe);
        else {
          a.EBservingMode = EBG.Semi.ServingState.unfriendlyIframe;
          break;
        }
      }
  } catch (d) {}
  return a;
};
EBG = EBG || {};
EBG.Adaptors = EBG.Adaptors || {};
EBG.Adaptors.CMPDetector = function (a) {
  var b = this;
  a = a || { timeout: 300, accurateTimeout: 0 };
  window.__cmp && "function" == typeof __cmp
    ? (this.exists = !0)
    : this._detectCMPLocator();
  if (this.exists) {
    setTimeout(function () {
      var c = arguments.callee;
      b.cmpCheckTimedout = !0;
      b._timeoutActualTime = new Date().getTime() - b._startTime;
      if (
        a.accurateTimeout &&
        (a.accurateTimeout--, b._timeoutActualTime < a.timeout)
      ) {
        b._timeoutTimeGap ||
          (b._timeoutTimeGap = a.timeout - b._timeoutActualTime);
        setTimeout(function () {
          c.apply(b, []);
        }, Math.max(a.timeout - b._timeoutActualTime, 1));
        return;
      }
      "undefined" == typeof b.consentData &&
        (b._setReason(-1), b._setDefaultValue(), b._publishConsentData());
    }, a.timeout);
    this._startTime = new Date().getTime();
    try {
      (function () {
        var c = arguments.callee;
        __cmp("ping", null, function (d, e) {
          e && d.cmpLoaded
            ? ((b.initialized = !0),
              b._getConsentData(function (f) {
                b._time = new Date().getTime() - b._startTime;
                "undefined" == typeof this.consentData &&
                  (f &&
                    "number" == typeof f.gdprApplies &&
                    (f.gdprApplies += ""),
                  (b.consentData = f),
                  b._publishConsentData());
              }))
            : b.cmpCheckTimedout ||
              setTimeout(function () {
                c.apply(b, []);
              }, 5);
        });
      })();
    } catch (c) {
      b._setDefaultValue(), b._publishConsentData();
    }
  } else this._setReason(0), this._setDefaultValue();
};
EBG.Adaptors.CMPDetector.prototype = {
  exists: !1,
  initialized: !1,
  subscriptions: [],
  _time: -1,
  _detectCMPLocator: function () {
    for (var a = window, b; !b; ) {
      try {
        a.frames.__cmpLocator && (b = a);
      } catch (d) {}
      if (a === window.top) break;
      a = a.parent;
    }
    var c = {};
    b &&
      ((this.exists = !0),
      (window.__cmp = function (d, e, f) {
        var g = Math.random() + "";
        d = { __cmpCall: { command: d, parameter: e, callId: g } };
        c[g] = f;
        b.postMessage(d, "*");
      }),
      window.addEventListener(
        "message",
        function (d) {
          try {
            var e = "string" === typeof d.data ? JSON.parse(d.data) : d.data;
            if (e.__cmpReturn) {
              var f = e.__cmpReturn;
              c[f.callId](f.returnValue, f.success);
              delete c[f.callId];
            }
          } catch (g) {}
        },
        !1
      ));
  },
  _getConsentData: function (a) {
    var b = this;
    try {
      (function () {
        var c = arguments.callee;
        b.exists && b.initialized && !b.cmpCheckTimedout
          ? __cmp("getConsentData", null, function (d, e) {
              e
                ? (b._setReason(1), a.apply(b, [d]))
                : (b._setReason(2), a.apply(b, [null]));
            })
          : b.cmpCheckTimedout ||
            setTimeout(function () {
              c.apply(b, []);
            }, 5);
      })();
    } catch (c) {}
  },
  getConsentData: function (a, b) {
    "undefined" != typeof this.consentData
      ? a.apply(b, [this.consentData])
      : this.subscriptions.push({ callback: a, context: b || this });
  },
  _setDefaultValue: function () {
    this.initialized = !0;
    this.consentData = this.defaultConsentData;
  },
  _publishConsentData: function () {
    if ("undefined" != typeof this.consentData) {
      for (var a = 0; a < this.subscriptions.length; a++) {
        var b = this.subscriptions[a];
        try {
          b.callback.apply(b.context, [this.consentData]);
        } catch (c) {}
      }
      this.subscriptions = [];
    }
  },
  _setReason: function (a) {
    "undefined" == typeof this._reason && (this._reason = a);
  },
  defaultConsentData: null,
};
EBG = EBG || {};
EBG.Adaptors = EBG.Adaptors || {};
EBG.Adaptors.TCFDetector = function (a) {
  this.init(a);
};
EBG.Adaptors.TCFDetector.prototype = {
  exists: !1,
  initialized: !1,
  subscriptions: [],
  _time: -1,
  _timeoutActualTime: -1,
  __tcfapi: function () {
    window.__tcfapi.apply(window, arguments);
  },
  init: function (a) {
    var b = this;
    a = a || { timeout: 300, accurateTimeout: 0 };
    window.__tcfapi && "function" == typeof window.__tcfapi
      ? (this.exists = !0)
      : this._detectTCFLocator();
    if (this.exists) {
      setTimeout(function () {
        var c = arguments.callee;
        b._timeoutActualTime = new Date().getTime() - b._startTime;
        if (
          a.accurateTimeout &&
          (a.accurateTimeout--, b._timeoutActualTime < a.timeout)
        ) {
          b._timeoutTimeGap ||
            (b._timeoutTimeGap = a.timeout - b._timeoutActualTime);
          setTimeout(function () {
            c.apply(b, []);
          }, Math.max(a.timeout - b._timeoutActualTime, 1));
          return;
        }
        b.cmpCheckTimedout = !0;
        "undefined" == typeof b.consentData &&
          (b._setReason(-1), b._setDefaultValue(), b._publishConsentData());
      }, a.timeout);
      this._startTime = new Date().getTime();
      try {
        (function () {
          var c = arguments.callee;
          b.__tcfapi("ping", 2, function (d, e) {
            ("undefined" != typeof e ? e : 1) && d && d.cmpLoaded
              ? ((b.initialized = !0),
                b._getConsentData(function (f) {
                  b.handleConsentReceived(f);
                }))
              : b.cmpCheckTimedout ||
                setTimeout(function () {
                  c.apply(b, []);
                }, 5);
          });
        })();
      } catch (c) {
        b._setDefaultValue(), b._publishConsentData();
      }
    } else this._setReason(0), this._setDefaultValue();
  },
  _detectTCFLocator: function () {
    for (var a = window, b, c = {}; a; ) {
      try {
        if (a.frames.__tcfapiLocator) {
          b = a;
          break;
        }
      } catch (d) {}
      if (a === window.top) break;
      a = a.parent;
    }
    b &&
      ((this.exists = !0),
      (this.__tcfapi = function (d, e, f, g) {
        if (b) {
          var k = Math.random() + "",
            n = {
              __tcfapiCall: { command: d, parameter: g, version: e, callId: k },
            };
          c[k] = f;
          b.postMessage(n, "*");
          var h = setInterval(function () {
            c[k] ? b.postMessage(n, "*") : clearInterval(h);
          }, 20);
        } else f({ msg: "CMP not found" }, !1);
      }),
      window.addEventListener(
        "message",
        function (d) {
          var e = {};
          try {
            e = "string" === typeof d.data ? JSON.parse(d.data) : d.data;
          } catch (f) {}
          (d = e.__tcfapiReturn) &&
            "function" === typeof c[d.callId] &&
            (c[d.callId](d.returnValue, d.success), (c[d.callId] = null));
        },
        !1
      ));
  },
  handleConsentReceived: function (a) {
    this._time = new Date().getTime() - this._startTime;
    "undefined" == typeof this.consentData &&
      (a && "number" == typeof a.gdprApplies && (a.gdprApplies += ""),
      (this.consentData = {
        gdprApplies: a.gdprApplies,
        consentData: a.tcString,
      }),
      this._publishConsentData());
  },
  _getConsentData: function (a) {
    var b = this,
      c = !1,
      d = function (e) {
        c || ((c = !0), b._setReason(1), a.apply(b, [e]));
      };
    try {
      (function () {
        b.exists &&
          b.initialized &&
          !b.cmpCheckTimedout &&
          (b.__tcfapi("addEventListener", 2, function (e, f) {
            f &&
              e.tcString &&
              ("tcloaded" == e.eventStatus ||
                "useractioncomplete" == e.eventStatus) &&
              (d(e),
              e.listenerId &&
                b.__tcfapi(
                  "removeEventListener",
                  2,
                  function () {},
                  e.listenerId
                ));
          }),
          (function () {
            var e = arguments.callee;
            try {
              b.__tcfapi("getTCData", 2, function (f, g) {
                g && f.tcString
                  ? d(f)
                  : b.cmpCheckTimedout ||
                    setTimeout(function () {
                      e.apply(b, []);
                    }, 5);
              });
            } catch (f) {
              b.cmpCheckTimedout ||
                setTimeout(function () {
                  e.apply(b, []);
                }, 5);
            }
          })());
      })();
    } catch (e) {
      b._setReason(2), a.apply(b, [null]);
    }
  },
  getConsentData: function (a, b) {
    "undefined" != typeof this.consentData
      ? a.apply(b, [this.consentData])
      : this.subscriptions.push({ callback: a, context: b || this });
  },
  _setDefaultValue: function () {
    this.initialized = !0;
    this.consentData = this.defaultConsentData;
  },
  _publishConsentData: function () {
    if ("undefined" != typeof this.consentData) {
      for (var a = 0; a < this.subscriptions.length; a++) {
        var b = this.subscriptions[a];
        try {
          b.callback.apply(b.context, [this.consentData]);
        } catch (c) {}
      }
      this.subscriptions = [];
    }
  },
  _setReason: function (a) {
    "undefined" == typeof this._reason && (this._reason = a);
  },
  defaultConsentData: null,
};
EBG.Semi.BrowserDetector = function () {
  this.browserName = navigator.appName;
  this.fullVersion = "" + parseFloat(navigator.appVersion);
  this.majorVersion = parseInt(navigator.appVersion, 10);
  this._init();
};
EBG.Semi.BrowserDetector.Browser = {
  InternetExplorer: "InternetExplorer",
  Chrome: "Chrome",
  Firefox: "Firefox",
  Opera: "Opera",
  Safari: "Safari",
};
EBG.Semi.BrowserDetector.prototype = {
  _init: function () {
    var a = navigator.userAgent,
      b,
      c;
    -1 != (c = a.indexOf("Opera"))
      ? ((this.browserName = EBGVT.BrowserDetector.Browser.Opera),
        (this.fullVersion = a.substring(c + 6)),
        -1 != (c = a.indexOf("Version")) &&
          (this.fullVersion = a.substring(c + 8)))
      : -1 != (c = a.indexOf("MSIE"))
      ? ((this.browserName = EBGVT.BrowserDetector.Browser.InternetExplorer),
        (this.fullVersion = a.substring(c + 5)))
      : -1 != (c = a.indexOf("Chrome"))
      ? ((this.browserName = EBGVT.BrowserDetector.Browser.Chrome),
        (this.fullVersion = a.substring(c + 7)))
      : -1 != (c = a.indexOf("Safari"))
      ? ((this.browserName = EBGVT.BrowserDetector.Browser.Safari),
        (this.fullVersion = a.substring(c + 7)),
        -1 != (c = a.indexOf("Version")) &&
          (this.fullVersion = a.substring(c + 8)))
      : -1 != (c = a.indexOf("Firefox"))
      ? ((this.browserName = EBGVT.BrowserDetector.Browser.Firefox),
        (this.fullVersion = a.substring(c + 8)))
      : (b = a.lastIndexOf(" ") + 1) < (c = a.lastIndexOf("/")) &&
        ((this.browserName = a.substring(b, c)),
        (this.fullVersion = a.substring(c + 1)),
        this.browserName.toLowerCase() == this.browserName.toUpperCase() &&
          (this.browserName = navigator.appName));
    -1 != (a = this.fullVersion.indexOf(";")) &&
      (this.fullVersion = this.fullVersion.substring(0, a));
    -1 != (a = this.fullVersion.indexOf(" ")) &&
      (this.fullVersion = this.fullVersion.substring(0, a));
    this.majorVersion = parseInt("" + this.fullVersion, 10);
    isNaN(this.majorVersion) &&
      ((this.fullVersion = "" + parseFloat(navigator.appVersion)),
      (this.majorVersion = parseInt(navigator.appVersion, 10)));
  },
};
EBG.Semi.declareNamespace("Logging");
EBG.Semi.Logging.Logger = function (a) {
  this._level = a;
  this.startNestingGroupNames = [];
  this.endNestingGroupNames = [];
};
EBG.Semi.Logging.Logger.DebugMode = "mmdebug";
EBG.Semi.Logging.Logger.LoggerLevels = {
  NONE: 0,
  ERROR: 1,
  INFO: 2,
  WARN: 3,
  DEBUG: 4,
};
EBG.Semi.Logging.Logger.prototype = {
  setLevel: function (a) {
    this._level = a;
  },
  timestamp: !1,
  debug: function (a) {
    this._reportToLog(EBG.Semi.Logging.Logger.LoggerLevels.DEBUG, arguments);
  },
  info: function (a) {
    this._reportToLog(EBG.Semi.Logging.Logger.LoggerLevels.INFO, arguments);
  },
  warn: function (a) {
    this._reportToLog(EBG.Semi.Logging.Logger.LoggerLevels.WARN, arguments);
  },
  error: function (a) {
    this._reportToLog(EBG.Semi.Logging.Logger.LoggerLevels.ERROR, arguments);
  },
  exception: function (a, b) {
    a =
      "string" !== b
        ? this._format("Exception in {0}. message: {1}", a, b.message)
        : this._format("Exception in: {0}. message: {1}", a, b);
    b.stack && (a += this._format(" stack: {0}", b.stack));
    this._reportToLog(EBG.Semi.Logging.Logger.LoggerLevels.ERROR, [a]);
  },
  startGroup: function (a) {
    this._supportNesting() && this.startNestingGroupNames.push(a);
  },
  endGroup: function () {
    this._supportNesting() &&
      0 < this.endNestingGroupNames.length &&
      window.console.groupEnd(this.endNestingGroupNames.pop());
  },
  _consoleAvailable: function () {
    try {
      return void 0 !== window && void 0 !== window.console;
    } catch (a) {
      return !1;
    }
  },
  _supportNesting: function () {
    return this._consoleAvailable() ? void 0 !== window.console.group : !1;
  },
  _supportErrorMessage: function () {
    return void 0 !== window.console.error;
  },
  _supportInfoMessage: function () {
    return void 0 !== window.console.info || void 0 !== window.opera;
  },
  _supportWarnMessage: function () {
    return void 0 !== window.console.warn || void 0 !== window.opera;
  },
  _supportObjectView: function () {
    return void 0 !== window.console.dir || void 0 !== window.opera;
  },
  _callConsoleFunction: function (a, b) {
    var c = !1;
    switch (a) {
      case EBG.Semi.Logging.Logger.LoggerLevels.INFO:
        this._supportInfoMessage() && (window.console.info(b), (c = !0));
        break;
      case EBG.Semi.Logging.Logger.LoggerLevels.WARN:
        this._supportWarnMessage() && (window.console.warn(b), (c = !0));
        break;
      case EBG.Semi.Logging.Logger.LoggerLevels.ERROR:
        this._supportErrorMessage() &&
          ((consoleFunction = window.console.error(b)), (c = !0));
    }
    c || window.console.log(b);
  },
  _format: function (a) {
    for (var b = 1; b < arguments.length; b++)
      a = a.replace(
        new RegExp("\\{" + (b - 1) + "\\}", "gi"),
        "" + arguments[b]
      );
    return a;
  },
  _getTimestamp: function () {
    if (this.timestamp) return EBG.Semi.Infra.getTimestamp();
  },
  _reportToLog: function (a, b) {
    if (this._level >= a && this._consoleAvailable()) {
      var c = b[0];
      "[object String]" !== Object.prototype.toString.call(c)
        ? this._supportObjectView() || (c = c.toString())
        : (c = this._format.apply(null, b));
      this.timestamp &&
        "[object String]" === Object.prototype.toString.call(c) &&
        (c = this._getTimestamp() + ": " + c);
      if (void 0 === window.opera) {
        for (; this.startNestingGroupNames.length; )
          window.console.group(this.startNestingGroupNames[0]),
            this.endNestingGroupNames.push(this.startNestingGroupNames.shift());
        this._callConsoleFunction(a, c);
      } else opera.postError(c);
    }
  },
};
EBG.Semi.ServerCommunicator = function () {
  this._imgArr = [];
  for (i = 0; 10 > i; i++) this._imgArr.push(new Image());
};
EBG.Semi.ServerCommunicator.prototype = {
  reportUrlsList: function (a, b, c) {
    for (var d = 0; d < this._imgArr.length; d++)
      this.reportUrl(a, this._imgArr[d], b, c);
  },
  reportUrl: function (a, b, c, d) {
    if (0 < a.length) {
      var e = this;
      (function (f) {
        b.onload = function () {
          c &&
            d &&
            setTimeout(function () {
              c.apply(d, [null, f]);
            }, 1);
          e.reportUrl(a, b, c, d);
        };
        b.onerror = function () {
          c &&
            d &&
            setTimeout(function () {
              c.apply(d, ["failed loading url", f]);
            }, 1);
          e.reportUrl(a, b, c, d);
        };
        b.src = f;
      })(a.shift());
    }
  },
};
EBGVT.RuleManager = function (a, b, c, d, e) {
  EBGVT.Light.Infra.isDefined(a) &&
    ((this.versaTagObj = e),
    (this._sessionId = b),
    (this._diAppId = c || -1),
    (this._usercookie = d || ""),
    this._buildRulesArray(a));
};
EBGVT.RuleManager.prototype = {
  _rules: [],
  _rulesHitted: [],
  _buildRulesArray: function (a) {
    for (var b in a)
      this._rules.push(
        new EBGVT.Rule(a[b], { binding: this, func: this._onRuleHit })
      );
  },
  _onRuleHit: function (a) {
    if (this.versaTagObj) {
      -1 == EBGVT.Light.Infra.indexOfArray(this._rulesHitted, a) &&
        this._rulesHitted.push(a);
      this._timeoutHandler && clearTimeout(this._timeoutHandler);
      var b = this;
      this._timeoutHandler = setTimeout(function () {
        b.versaTagObj.generateRequest(
          null,
          {
            sessionId: b._sessionId,
            browserEvent: b._rulesHitted,
            diAppId: b._diAppId,
            usercookie: b._usercookie,
          },
          !0
        );
        b._rulesHitted = [];
      }, 1);
    }
  },
};
EBGVT.Events = EBGVT.Events || {};
EBGVT.Rule = function (a, b) {
  this._id = a.id;
  this._callback = b;
  this._createEvents(a);
  this._conditions = a.conditions || this._getDefaultConditionString();
};
EBGVT.Rule.prototype = {
  _createEvents: function (a) {
    this._events = {};
    var b = RegExp("e[0-9]", "i"),
      c;
    for (c in a)
      if (a.hasOwnProperty(c) && b.test(c))
        try {
          EBGVT.Events[a[c].type] &&
            (this._events[c] = new EBGVT.Events[a[c].type](c, a[c].data, {
              func: this._eventMatchHandler,
              binding: this,
            }));
        } catch (d) {}
  },
  _getDefaultConditionString: function () {
    var a = [],
      b;
    for (b in this._events) a.push(b);
    return "(" + a.join("|") + ")";
  },
  _eventMatchHandler: function () {
    this._checkRuleHit(this._conditions) &&
      this._callback.func.apply(this._callback.binding, [this._id]);
    this._resetEventStatus();
  },
  _resetEventStatus: function () {
    for (var a in this._events) this._events[a].reset();
  },
  _checkRuleHit: function (a) {
    try {
      var b = this._breakConditionString(a);
      for (a = 0; a < b.length; a++) if (!this._evaluateGroup(b[a])) return !1;
      return !0;
    } catch (c) {
      return !1;
    }
  },
  _evaluateGroup: function (a) {
    for (var b = 0; b < a.length; b++) if (this._evaluateEvent(a[b])) return !0;
    return !1;
  },
  _evaluateEvent: function (a) {
    a = this._events[a];
    return 1 * (a && a.applied);
  },
  _breakConditionString: function (a) {
    a = a.split("&");
    for (var b = 0; b < a.length; b++) {
      var c = a[b];
      a[b] = c.substr(1, c.length - 2).split("|");
    }
    return a;
  },
};
EBGVT.Events.ElementEvent = function (a, b, c) {
  (EBGVT.Light.Infra.isDefined(b) || EBGVT.Light.Infra.isDefined(c)) &&
    this.init(a, b, c);
};
EBGVT.Events.ElementEvent.prototype = {
  applied: !1,
  init: function (a, b, c) {
    var d = this;
    this._wins = this._getWindowsArray();
    var e = decodeURIComponent(b.selector);
    e = this._select(e);
    if ("loading" != document.readyState && e.length) {
      this._id = a;
      this._callback = c;
      for (var f = 0; f < e.length; f++)
        EBGVT.Light.Infra.addEventListener(e[f], b.eventName, function (g) {
          d.onEvent(g);
        });
    } else
      setTimeout(function () {
        d.init(a, b, c);
      }, 100);
  },
  onEvent: function () {
    this.applied = !0;
    this._callback.func.apply(this._callback.binding, [this._id]);
  },
  _select: function (a) {
    for (var b = [], c = 0; c < this._wins.length; c++) {
      var d = this._wins[c].document.querySelectorAll(a);
      if (d) for (var e = 0; e < d.length; e++) b.push(d[e]);
    }
    return b;
  },
  _getWindowsArray: function () {
    for (var a = window, b = [a]; a !== a.parent && a.self !== a.parent; )
      try {
        if (a.parent.document.domain) (a = a.parent), b.push(a);
        else return b;
      } catch (c) {
        break;
      }
    return b;
  },
  reset: function () {
    this.applied = !1;
  },
};
EBGVT.Events.TimeEvent = function (a, b, c) {
  (EBGVT.Light.Infra.isDefined(b) || EBGVT.Light.Infra.isDefined(c)) &&
    this.init(a, b, c);
};
EBGVT.Events.TimeEvent.prototype = {
  applied: !1,
  init: function (a, b, c) {
    this._id = a;
    this._callback = c;
    this._startCounting(b);
  },
  _startCounting: function (a) {
    var b = this;
    a &&
      (b._handler = setTimeout(function () {
        b.onEvent();
      }, a.threshold));
  },
  onEvent: function () {
    this.applied = !0;
    this._callback.func.apply(this._callback.binding, [this._id]);
  },
  _handler: null,
  reset: function () {},
};
EBGUIP = "undefined" != typeof EBGUIP ? EBGUIP : {};
EBGUIP.Events = EBGUIP.Events || {};
EBGUIP.Events.EventName = {
  USER_ID_FOUND: "userIdFound",
  DOC_LOADED: "documentLoaded",
  EBUID_LOADED: "ebuidLoaded",
};
EBGUIP.Events.eventMgr =
  EBGUIP.Events.eventMgr || new EBG.Semi.Events.EventManager();
EBGUIP = "undefined" != typeof EBGUIP ? EBGUIP : {};
EBGUIP.UserIdProvider = function () {
  "undefined" != typeof gEBMainWindow && gEBMainWindow.providersData
    ? (this._providersData = gEBMainWindow.providersData)
    : "undefined" != typeof gEBMainWindow &&
      ((this._providersData = {
        EBUidCache: { data: null, providerCalled: !1 },
      }),
      (gEBMainWindow.providersData = this._providersData));
};
EBGUIP.ProvidersReversed = { e2: "EBUidCache" };
EBGUIP.UserIdProvider.prototype = {
  _filter: null,
  _currTagData: null,
  _arrProvidersNamesUsed: null,
  _providers: { EBUidCache: { isUsed: !1, shouldSendData: !0 } },
  _providersData: null,
  getUserIds: function (a) {
    this._filter = a.filter;
    this._init();
    this._currTagData = a;
    this._currTagData.currDoc || (this._currTagData.currDoc = document);
    this._arrProvidersNamesUsed = this._getValidProviderNames(a.uip);
    for (a = 0; a < this._arrProvidersNamesUsed.length; a++)
      this._providers[this._arrProvidersNamesUsed[a]].isUsed = !0;
    this._loadProviders();
  },
  _init: function () {
    for (var a in this._providers) this._providers[a].isUsed = !1;
  },
  _loadProviders: function () {
    if (0 < this._arrProvidersNamesUsed.length) {
      var a = this._arrProvidersNamesUsed[0];
      if (this._providersData[a].providerCalled)
        this._getUserIdentification({ providerName: a });
      else {
        EBGUIP.Events.eventMgr.subscribeToEvent(
          EBGUIP.Events.EventName.USER_ID_FOUND,
          this._getUserIdentification,
          this,
          this._filter
        );
        var b = this._buildProviderURL(a);
        this._currTagData.isSync
          ? (EBGUIP.Events.eventMgr.subscribeToEvent(
              EBGUIP.Events.EventName.DOC_LOADED,
              this._providerLoaded,
              this,
              this._filter
            ),
            EBG.Semi.Infra.loadFileByScriptElem(
              this._currTagData.currDoc,
              b,
              null,
              !0
            ))
          : EBG.Semi.Infra.loadFileByScriptElem(
              this._currTagData.currDoc,
              b,
              this._providerLoaded,
              !1,
              this,
              { providerName: a }
            );
      }
    }
  },
  _buildProviderURL: function (a) {
    a =
      this._currTagData.scriptsPath +
      "UserProviders" +
      this._currTagData.uipv +
      "/" +
      a +
      ".js";
    -1 == this._currTagData.scriptsPath.indexOf("http") &&
      (a = this._getRequestProtocol(this._currTagData.ebPtcl) + a);
    return a;
  },
  _getRequestProtocol: function (a) {
    if (a) return a;
    a = "https://secure-";
    var b = location.protocol;
    if ("javascript:" == b)
      try {
        b = parent.location.protocol;
      } catch (c) {}
    "http:" == b && (a = b + "//");
    return a;
  },
  _providerLoaded: function (a) {
    a = a.providerName;
    -1 != EBG.Semi.Infra.indexOfArray(this._arrProvidersNamesUsed, a) &&
      new window.EBGUIP[a]().init(this._currTagData);
  },
  _getUserIdentification: function (a) {
    var b = EBG.Semi.Infra.indexOfArray(
      this._arrProvidersNamesUsed,
      a.providerName
    );
    -1 != b &&
      (a.tokenName &&
        a.id &&
        this._providers[a.providerName].shouldSendData &&
        !this._providersData[a.providerName].data &&
        (this._providersData[a.providerName].data =
          "&" + a.tokenName + "=" + a.id),
      (this._providersData[a.providerName].providerCalled = !0),
      this._arrProvidersNamesUsed.splice(b, 1),
      0 == this._arrProvidersNamesUsed.length
        ? ((a = { userIdStr: this._getProvidersData() }),
          EBG.Semi.Events.eventMgr.dispatchEvent(
            EBG.Semi.EventName.ALL_USER_ID_FOUND,
            a,
            this._filter
          ))
        : this._loadProviders());
  },
  _getProvidersData: function () {
    var a = "",
      b;
    for (b in this._providersData)
      this._providers[b].isUsed &&
        this._providers[b].shouldSendData &&
        (a += this._providersData[b].data);
    return a;
  },
  _getValidProviderNames: function (a) {
    a = this._cleanUIPList(a);
    for (var b = [], c = 0; c < a.length; c++) {
      var d = EBGUIP.ProvidersReversed["e" + a[c]];
      d && (b[b.length] = d);
    }
    return b;
  },
  _cleanUIPList: function (a) {
    var b = [];
    if (a)
      for (var c = 0; c < a.length; ++c)
        EBGUIP.ProvidersReversed["e" + a[c]] && b.push(a[c]);
    return b;
  },
};
EBG.Semi.AttributionEnum = function () {};
EBG.Semi.AttributionEnum.UrlParamNames = {
  ID: "onetagid",
  DISP_TYPE: "dispType",
  SYNC: "sync",
  ONETAG_URL: "ebOneTagURL",
  PAGE_URL: "pageurl",
  DEBUG_MODE: "debugmode",
  NO_SCRIPT: "ns",
  MOBILE: "mb",
  ACTIVITY_PARAMS: "activityValues",
  RETARGET_PARAMS: "retargetingValues",
  DYNAMIC_RETARGET_PARAMS: "dynamicRetargetingValues",
  CONDITIONAL_PARAMS: "acp",
  RANDOM: "rnd",
  SEC_CALL: "secCall",
  SESSION_ID: "sessionid",
  ORIG_URL_LENGTH: "origLength",
  SERVING_PIPE: "/Serving",
  PREV_SERVING_PIPE: "/BurstingPipe",
  BROWSER_EVENT: "tp_be",
  ADV_DEVICE_ID: "ebaddid",
  DI_APP_ID: "diappid",
  USER_COOKIE: "usercookie",
  POST_CLICK: "pstclk",
  UIN: "uinadv",
};
EBG.Semi.AttributionEnum.DisplayTypes = { IFRAME: "iframe", JAVASCRIPT: "js" };
EBG.Semi.AttributionEnum.HttpProtocol = { HTTP: "http", HTTPS: "https" };
EBGVT = "undefined" != typeof EBGVT ? EBGVT : {};
EBGVT.Light = EBGVT.Light || {};
EBGVT.Light.Infra = EBG.Semi.Infra;
EBGVT.Light.Logger = EBG.Semi.Logging.Logger;
EBGVT.EBGUIP = EBGUIP;
EBGVT.OneTagLogger = function () {};
EBGVT.OneTag = function (a) {
  a && a.$ && (this._onready = a.$);
  this.logNeeded = EBGVT.Light.Infra.getUrlParameter(
    EBGVT.Light.Logger.DebugMode
  )
    ? 1
    : 0;
  this.oneTagLogger = new EBGVT.Light.Logger(
    EBGVT.Light.Infra.getUrlParameter(EBGVT.Light.Logger.DebugMode)
  );
  this.uidProviders = new EBGVT.EBGUIP.UserIdProvider();
  this.oneTagLogger.timestamp = !0;
  this.serverCommunicator =
    this.serverCommunicator || new EBG.Semi.ServerCommunicator();
  a = new EBG.Adaptors.TCFDetector();
  var b = new EBG.Adaptors.CMPDetector();
  this.gdprDetector = a.exists ? a : b;
  this.pageUrl = null;
  this._init();
};
EBGVT.OneTag.prototype = {
  _userIdProvidersCalled: !1,
  _providers: null,
  _onpreready: [],
  _onready: [],
  isReady: !1,
  _scriptElement: null,
  _responseCount: 0,
  _isHandlingRequest: !1,
  _init: function () {
    (this._scriptElement = EBG.Semi.Infra.getCurrentScriptElement()) &&
      this._scriptElement.options &&
      (this.options = this._scriptElement.options);
    this._getServerConfiguration(function (a) {
      a && !a.empty
        ? (this._oneTagObj = a)
        : window.versaTag
        ? ((window.versaTag.sync = 0),
          (window.versaTag.ptcl = "https"),
          (this._oneTagObj = window.versaTag),
          (this._oneTagObj.uin = this._getDefaultUin("SizmekDataLayer")))
        : this.options &&
          this.options.id &&
          ((window.versaTag = {}),
          (versaTag.id = this.options.id),
          (versaTag.sync = 0),
          (versaTag.dispType = "js"),
          (versaTag.ptcl = this.options.ptcl || "https"),
          (versaTag.bsUrl = this.options.bsUrl || "bs.serving-sys.com/Serving"),
          (this._oneTagObj = window.versaTag));
      this._oneTagObj &&
        (this.onready(this.options && this.options.onready), this._ready());
    });
  },
  _getServerConfiguration: function (a) {
    try {
      var b = this._getConfigurationPath();
    } catch (d) {
      a.apply(c, [null, d]);
      return;
    }
    var c = this;
    EBG.Semi.Infra.ajax.get(
      b,
      {},
      function (d) {
        try {
          var e = JSON.parse(d);
          e.developerScripts && e.developerScripts.preScript
            ? c.runDeveloperScript(e.developerScripts.preScript, function () {
                a.apply(c, [c._parseConfig(e)]);
              })
            : a.apply(c, [c._parseConfig(e)]);
        } catch (f) {
          a.apply(c, [null, f]);
        }
      },
      !0
    );
  },
  _parseConfig: function (a) {
    var b = {};
    if (a.empty) return a;
    for (var c in a) "parameters" !== c && (b[c] = a[c]);
    var d = this.options || {};
    b.id = d.id || (window.versaTag && versaTag.id) || "unknown";
    b.sync = 0;
    b.dispType = d.dispType || a.dispType || "js";
    b.bsUrl = d.bsUrl || a.bsUrl || "bs.serving-sys.com/Serving";
    b.ptcl = d.ptcl || a.ptcl || this._detectProtocol();
    b.inactive = a.inactive;
    if (a && a.parameters) {
      if (d.parameters)
        for (var e in d.parameters) {
          var f = d.parameters[e];
          a.parameters[e] = a.parameters[e] || [];
          for (
            var g = this._getFieldsFromGroup(a.parameters[e]), k = 0;
            k < f.length;
            k++
          ) {
            var n = f[k],
              h = this._getObjField(n);
            h = g.indexOf(h);
            -1 == h ? a.parameters[e].push(n) : (a.parameters[e][h] = n);
          }
        }
      e = a.parameters;
      a.parameters.dataLayer = d.dataLayer || a.parameters.dataLayer;
      this.options && (this.options.dataLayer = a.parameters.dataLayer);
      b.dataLayer = a.parameters.dataLayer;
      b.activityParams = this._parameterParse(
        e.conversion,
        "conversion",
        a.parameters.dataLayer
      );
      b.dynamicRetargetParams = this._parameterParse(
        e.retargeting,
        "retargeting",
        a.parameters.dataLayer
      );
      b.conditionalParams = this._parameterParse(
        e.conditional,
        "conditional",
        a.parameters.dataLayer
      );
      if (window.versaTag)
        for (
          f = ["activityParams", "dynamicRetargetParams", "conditionalParams"],
            k = 0;
          k < f.length;
          k++
        )
          if ((e = versaTag[f[k]]))
            for (c in e)
              EBGVT.Light.Infra.isDefinedNotNull(e[c]) &&
                !EBGVT.Light.Infra.isDefined(b[f[k]][c]) &&
                (b[f[k]][c] = e[c]);
    }
    c = d.uparam || a.uparam;
    b.uin = c
      ? this._parameterParse(c, "uin", b.dataLayer || "SizmekDataLayer")
      : this._getDefaultUin(a.parameters.dataLayer || "SizmekDataLayer");
    return b;
  },
  _getDefaultUin: function (a) {
    return window[a] && window[a].uin;
  },
  _getFieldsFromGroup: function (a) {
    for (var b = [], c = 0; c < a.length; c++) for (var d in a[c]) b.push(d);
    return b;
  },
  _getObjField: function (a) {
    if (!a) return null;
    for (var b in a) return b;
  },
  _parameterParse: function (a, b, c) {
    var d = {};
    if (!a) return d;
    "object" == EBG.Semi.Infra.typeOf(a) && (a = [a]);
    for (var e = 0; e < a.length; e++) {
      var f = a[e],
        g;
      for (g in f) {
        var k = this._getValue(g, f[g], b, c);
        EBGVT.Light.Infra.isDefinedNotNull(k) && (d[g] = k);
      }
    }
    return d;
  },
  _getValue: function (a, b, c, d) {
    "object" == EBG.Semi.Infra.typeOf(b) && (b = [b]);
    for (var e, f, g = 0; g < b.length; g++)
      switch (((f = b[g]), f.type)) {
        case "JS":
          e = EBG.Semi.Infra.getValueFromPath(f.path);
          break;
        case "QS":
          e = EBG.Semi.Infra.getQuerystringParam(f.key || f.path);
          break;
        case "DL":
          d &&
            f.path &&
            (e = EBG.Semi.Infra.getValueFromPath(d + "." + f.path));
          break;
        case "CONST":
          e = f.value;
      }
    if (EBGVT.Light.Infra.isDefinedNotNull(e) && "" != e)
      return (
        this.OTTSend("variables", {
          category: c,
          variableName: a,
          type: f.type,
          path: f.path,
          value: e,
        }),
        e
      );
    for (g = b.length - 1; 0 <= g; g--)
      if (((f = b[g]), f.def))
        return (
          this.OTTSend("variables", {
            type: f.type,
            path: f.path,
            value: f.def + " (default)",
          }),
          f.def
        );
    return null;
  },
  _getConfigurationPath: function () {
    var a = this._extractDomainFromOneTagScript(),
      b =
        (this.options && this.options.id) ||
        (window.versaTag && window.versaTag.id),
      c = this._detectProtocol();
    "https:" !== c ||
      (0 != a.indexOf("ds.serving-sys.com") &&
        0 != a.indexOf("ds.serving-sys-int.com")) ||
      (a = "secure-" + a);
    "http:" !== c ||
      (0 != a.indexOf("secure-ds.serving-sys.com") &&
        0 != a.indexOf("secure-ds.serving-sys-int.com")) ||
      (a = a.replace("secure-", ""));
    return (
      c +
      "//" +
      a +
      "/adServingData/" +
      this._getEnv(a) +
      "/TMClient/" +
      b.substr(b.length - 1, 1) +
      "/" +
      b
    );
  },
  _extractDomainFromOneTagScript: function () {
    var a = this.getOneTagScript();
    if (!a || !a.src) return "ds.serving-sys.com";
    a = a.src;
    a = -1 < a.indexOf("//") ? a.split("/")[2] : a.split("/")[0];
    a = a.split(":")[0];
    return (a = a.split("?")[0]);
  },
  _getEnv: function (a) {
    if (!a) return "";
    switch (a.toLowerCase().replace("secure-", "")) {
      case "ds.serving-sys-dev4.com":
        return "DEV4";
      case "ds.serving-sys-int.com":
        return "UAT";
      default:
        return "PROD";
    }
  },
  _detectProtocol: function () {
    var a = this.options && this.options.ptcl;
    return (a ? a + ":" : "https:").toLowerCase();
  },
  onready: function (a, b) {
    if (a)
      if (this.isReady)
        try {
          a.apply(this);
        } catch (c) {}
      else b ? this._onpreready.push(a) : this._onready.push(a);
  },
  _ready: function () {
    if (!this.isReady) {
      this.isReady = !0;
      for (var a = 0; a < this._onpreready.length; a++)
        this._onready.unshift(this._onpreready[a]);
      for (a = 0; a < this._onready.length; a++)
        try {
          this._onready[a].apply(this);
        } catch (b) {}
    }
  },
  getQuerystringConfiguration: function (a) {
    try {
      var b = {},
        c = a.src.split("?")[1].split("&");
      for (a = 0; a < c.length; a++) {
        var d = c[a].split("=");
        b[d[0]] = d[1];
      }
      b.dispType = b.dispType || "js";
      b.sync = 0;
      return b;
    } catch (e) {
      return null;
    }
  },
  generateRequest: function (a, b, c) {
    var d = this;
    this.isOneTagTestToolActive() &&
      top.postMessage({ key: "OTT", command: "oneTagFound", data: {} }, "*");
    if (
      this.isOneTagTestToolActive() &&
      null == this.getOTTDataCollectionOption()
    )
      top.postMessage(
        { key: "OTT", command: "requestDataCollectionOption" },
        "*"
      ),
        (d = this),
        setTimeout(function () {
          d.generateRequest(a, b, c);
        }, 100);
    else if (this._isHandlingRequest)
      (d = this),
        setTimeout(function () {
          d.generateRequest(a, b, c);
        }, 100);
    else if (
      ((this._isHandlingRequest = !0),
      !this._oneTagObj || !this._oneTagObj.inactive)
    )
      if (this._oneTagObj) {
        this.oneTagLogger.info("One Tag Started");
        this.pageUrl = this._oneTagObj.overridePageUrl || a;
        b &&
          b.firstPartyServingDomain &&
          (this._oneTagObj.bsUrl =
            b.firstPartyServingDomain +
            EBG.Semi.AttributionEnum.UrlParamNames.SERVING_PIPE);
        var e = this._oneTagObj.id,
          f = b && b.sessionId ? b.sessionId : this.generateSessionId();
        this._oneTagObj.sessionId = f;
        var g =
            b && b.browserEvent ? "$$" + b.browserEvent.join("&") + "$$" : "",
          k = b && EBGVT.Light.Infra.isDefined(b.diAppId) ? b.diAppId : -1,
          n =
            b && EBGVT.Light.Infra.isDefined(b.usercookie) ? b.usercookie : "",
          h = this._generateBsURL(this._oneTagObj, this.pageUrl, c, f, g, k, n);
        this.gdprDetector.getConsentData(function (m) {
          this.consentData = m;
          h = this._addGdprConsent(h, m);
          this.oneTagLogger.info("Server URL: " + h);
          b &&
            b.preServingTasks &&
            0 < b.preServingTasks.length &&
            this._userIdProvidersCalled &&
            (h = this._addProviderUserId(h, b));
          this.fireRequest(e, f, h);
        }, this);
      } else
        a
          ? ((this._isHandlingRequest = !1),
            versaTagObj.onready(function () {
              this.generateRequest(a, b, c);
            }))
          : b &&
            c &&
            ((h = document.location.href),
            b &&
              b.firstPartyServingDomain &&
              ((g = document.domain),
              (k = g + location.pathname),
              g &&
                0 < g.length &&
                (h =
                  0 < h.indexOf(k)
                    ? h.replace(
                        k,
                        b.firstPartyServingDomain +
                          EBG.Semi.AttributionEnum.UrlParamNames.SERVING_PIPE
                      )
                    : h.replace(g, b.firstPartyServingDomain))),
            (h = h.replace(
              EBG.Semi.AttributionEnum.UrlParamNames.DISP_TYPE +
                "=" +
                EBG.Semi.AttributionEnum.DisplayTypes.IFRAME,
              EBG.Semi.AttributionEnum.UrlParamNames.DISP_TYPE +
                "=" +
                EBG.Semi.AttributionEnum.DisplayTypes.JAVASCRIPT
            )),
            (h = h.replace(
              "cn=ot",
              "cn=ot&" +
                EBG.Semi.AttributionEnum.UrlParamNames.SEC_CALL +
                "=1" +
                (b.sessionId ? "&sessionid=" + b.sessionId : "")
            )),
            (h = this._addProviderUserId(h, b)),
            (g = h.substr(
              h.indexOf(EBG.Semi.AttributionEnum.UrlParamNames.SYNC) +
                (EBG.Semi.AttributionEnum.UrlParamNames.SYNC + "=").length,
              1
            )),
            EBG.Semi.Infra.loadFileByScriptElem(
              document,
              h,
              function () {
                this._handleResponse({ sendTime: new Date().getTime() });
              },
              1 * g,
              this
            ));
  },
  runDeveloperScript: function (a, b) {
    var c = this;
    try {
      if (a) {
        var d = /[\s\S]*<script.*?>([\s\S]*)<\/script>[\s\S]*/g;
        if (a.match(d)) {
          var e = d.exec(a);
          0 < e.length &&
            EBG.Semi.Infra.executeTextByScriptElem(document, e[1]);
          b && b.apply(c);
        } else
          (c = this),
            EBG.Semi.Infra.loadFileByScriptElem(
              document,
              a,
              function () {
                b && b.apply(c);
              },
              0,
              this
            );
      } else b && b.apply(c);
    } catch (f) {
      b && b.apply(c);
    }
  },
  fireRequest: function (a, b, c) {
    var d = this;
    this._oneTagObj.dispType.toLowerCase() ==
    EBG.Semi.AttributionEnum.DisplayTypes.IFRAME
      ? ((c += "&st=" + new Date().getTime()),
        (this._isHandlingRequest = !1),
        EBGVT.Light.Infra.createUnfriendlyIframe(c, this._oneTagObj.sync))
      : EBG.Semi.Infra.loadFileByScriptElem(
          document,
          c,
          (function (e, f, g) {
            return function () {
              d._handleResponse({ sessionId: e, id: f, sendTime: g });
            };
          })(b, a, new Date().getTime()),
          1 * this._oneTagObj.sync,
          this
        );
  },
  hasStorage: function () {
    try {
      return (
        localStorage.setItem("eyeTesting", "eyeTesting"),
        localStorage.removeItem("eyeTesting"),
        !0
      );
    } catch (a) {
      return !1;
    }
  },
  getSessionId: function () {
    if (!this.hasStorage()) return this.generateSessionId();
    var a = null,
      b = new Date(),
      c = localStorage.getItem("SZMKSessionId");
    if (c)
      try {
        (c = JSON.parse(c)), 18e5 >= b.getTime() - c.time && (a = c.id);
      } catch (d) {}
    a = a || this.generateSessionId();
    localStorage.setItem(
      "SZMKSessionId",
      JSON.stringify({ time: b.getTime(), id: a })
    );
    return a;
  },
  generateSessionId: function () {
    var a = "12345678";
    var b = "" + a.charAt(Math.floor(Math.random() * a.length));
    a = "0123456789";
    for (var c = 0; 18 > c; c++)
      b += a.charAt(Math.floor(Math.random() * a.length));
    return b;
  },
  setActivityParam: function (a, b) {
    this._oneTagObj.activityParams || (this._oneTagObj.activityParams = {});
    this._oneTagObj.activityParams[a] = b;
  },
  getActivityParam: function (a) {
    var b = null;
    this._oneTagObj.activityParams &&
      this._oneTagObj.activityParams[a] &&
      (b = this._oneTagObj.activityParams[a]);
    return b;
  },
  clearActivityParam: function () {
    this._oneTagObj.activityParams = {};
  },
  setRetargetParam: function (a, b) {
    this._oneTagObj.retargetParams || (this._oneTagObj.retargetParams = {});
    this._oneTagObj.retargetParams[a] = b;
  },
  getRetargetParam: function (a) {
    var b = null;
    this._oneTagObj.retargetParams &&
      this._oneTagObj.retargetParams[a] &&
      (b = this._oneTagObj.retargetParams[a]);
    return b;
  },
  clearRetargetParam: function () {
    this._oneTagObj.retargetParams = {};
  },
  setDynamicRetargetParam: function (a, b) {
    this._oneTagObj.dynamicRetargetParams ||
      (this._oneTagObj.dynamicRetargetParams = {});
    this._oneTagObj.dynamicRetargetParams[a] = b;
  },
  getDynamicRetargetParam: function (a) {
    var b = null;
    this._oneTagObj.dynamicRetargetParams &&
      this._oneTagObj.dynamicRetargetParams[a] &&
      (b = this._oneTagObj.dynamicRetargetParams[a]);
    return b;
  },
  clearDynamicRetargetParam: function () {
    this._oneTagObj.dynamicRetargetParams = {};
  },
  setConditionalParam: function (a, b) {
    this._oneTagObj.conditionalParams ||
      (this._oneTagObj.conditionalParams = {});
    this._oneTagObj.conditionalParams[a] = b;
  },
  getConditionalParam: function (a) {
    var b = null;
    this._oneTagObj.conditionalParams &&
      this._oneTagObj.conditionalParams[a] &&
      (b = this._oneTagObj.conditionalParams[a]);
    return b;
  },
  clearConditionalParam: function () {
    this._oneTagObj.conditionalParams = {};
  },
  _generateBsURL: function (a, b, c, d, e, f, g) {
    a.bsUrl = a.bsUrl || "bs.serving-sys.com/Serving";
    a.bsUrl = a.bsUrl.replace(
      EBG.Semi.AttributionEnum.UrlParamNames.PREV_SERVING_PIPE,
      EBG.Semi.AttributionEnum.UrlParamNames.SERVING_PIPE
    );
    var k = this._getProtocol(a.ptcl) + a.bsUrl + "?";
    k = this.isOneTagTestToolActive() ? k + "cn=ottp" : k + "cn=ot";
    k +=
      "&" +
      EBG.Semi.AttributionEnum.UrlParamNames.ID +
      "=" +
      a.id +
      "&" +
      EBG.Semi.AttributionEnum.UrlParamNames.DISP_TYPE +
      "=" +
      a.dispType +
      "&" +
      EBG.Semi.AttributionEnum.UrlParamNames.SYNC +
      "=" +
      a.sync;
    c && (k += "&" + EBG.Semi.AttributionEnum.UrlParamNames.SEC_CALL + "=1");
    "0" != d &&
      (k += "&" + EBG.Semi.AttributionEnum.UrlParamNames.SESSION_ID + "=" + d);
    a.mobile &&
      (k +=
        "&" + EBG.Semi.AttributionEnum.UrlParamNames.MOBILE + "=" + a.mobile);
    e &&
      (k +=
        "&" + EBG.Semi.AttributionEnum.UrlParamNames.BROWSER_EVENT + "=" + e);
    0 <= f &&
      (k += "&" + EBG.Semi.AttributionEnum.UrlParamNames.DI_APP_ID + "=" + f);
    g &&
      (k += "&" + EBG.Semi.AttributionEnum.UrlParamNames.USER_COOKIE + "=" + g);
    a.advertiserDeviceId &&
      (k +=
        "&" +
        EBG.Semi.AttributionEnum.UrlParamNames.ADV_DEVICE_ID +
        "=" +
        a.advertiserDeviceId);
    b = b || EBGVT.Light.Infra.getWindowLocation();
    k +=
      "&" +
      EBG.Semi.AttributionEnum.UrlParamNames.PAGE_URL +
      "=$$" +
      encodeURIComponent(b) +
      "$$";
    a.activityParams = a.activityParams || {};
    a.activityParams.Session =
      (a.activityParams && a.activityParams.Session) || this.getSessionId();
    k += this._prepareParamUrl(
      a.activityParams,
      EBG.Semi.AttributionEnum.UrlParamNames.ACTIVITY_PARAMS
    );
    k += this._prepareParamUrl(
      a.retargetParams,
      EBG.Semi.AttributionEnum.UrlParamNames.RETARGET_PARAMS
    );
    k += this._prepareParamUrl(
      a.conditionalParams,
      EBG.Semi.AttributionEnum.UrlParamNames.CONDITIONAL_PARAMS
    );
    k += this._prepareParamUrl(
      a.dynamicRetargetParams,
      EBG.Semi.AttributionEnum.UrlParamNames.DYNAMIC_RETARGET_PARAMS
    );
    this.isOneTagTestToolActive() &&
      (k += "&tagsrunningmode=" + this.getOTTDataCollectionOption());
    a.dispType.toLowerCase() == EBG.Semi.AttributionEnum.DisplayTypes.IFRAME &&
      (b = document.getElementById("ebOneTagUrlId")) &&
      (k +=
        "&" +
        EBG.Semi.AttributionEnum.UrlParamNames.ONETAG_URL +
        "=$$" +
        encodeURIComponent(b.src) +
        "$$");
    this.logNeeded &&
      (k += "&" + EBGVT.Light.Logger.DebugMode + "=" + this.logNeeded);
    k += "&" + EBG.Semi.AttributionEnum.UrlParamNames.NO_SCRIPT + "=0";
    k +=
      "&" +
      EBG.Semi.AttributionEnum.UrlParamNames.RANDOM +
      "=" +
      EBGVT.Light.Infra.getRandomNumber();
    a.debugData && (k += "&" + a.debugData);
    if ((b = EBGVT.Light.Infra.getTopLevelReferrer(window)))
      (d = EBGVT.Light.Infra.getTokenValueFromURL("ebReferrer", b)),
        g ||
          ((g = EBGVT.Light.Infra.getTokenValueFromURL(
            EBG.Semi.AttributionEnum.UrlParamNames.USER_COOKIE,
            b
          )) &&
            (k += "&usercookie=u2=" + g)),
        (g = d ? d : b),
        a.referralOnlyDomain &&
          ((b = document.createElement("a")),
          b.setAttribute("href", g),
          b.search && (g = b.toString().replace(b.search, ""))),
        (b = EBGVT.Light.Infra.urlAvailableLength(k) - 48),
        0 < b &&
          (g.length > b && (g = g.substr(0, b)),
          (k += "&referrer=$$" + g + "$$"));
    if (!c)
      for (g = ["gclid", "msclkid", "tmdata"], b = 0; b < g.length; b++)
        if ((c = EBG.Semi.Infra.getQuerystringParam(g[b]))) {
          "tmdata" != g[b] && (c = '{"clkid":"' + c + '"}');
          k +=
            "&" +
            EBG.Semi.AttributionEnum.UrlParamNames.POST_CLICK +
            "=" +
            encodeURIComponent(c);
          break;
        }
    if (a.uin && this._getObjField(a.uin))
      try {
        k +=
          "&" +
          EBG.Semi.AttributionEnum.UrlParamNames.UIN +
          "=" +
          encodeURIComponent(JSON.stringify(a.uin));
      } catch (n) {}
    return k;
  },
  _prepareParamUrl: function (a, b) {
    var c = !0,
      d = "",
      e;
    for (e in a)
      if (
        a.hasOwnProperty(e) &&
        ((null != a[e] &&
          b != EBG.Semi.AttributionEnum.UrlParamNames.CONDITIONAL_PARAMS &&
          "" != a[e]) ||
          b == EBG.Semi.AttributionEnum.UrlParamNames.CONDITIONAL_PARAMS)
      ) {
        var f = encodeURIComponent(e + "=" + a[e]);
        c
          ? ((d += "&" + b + "=$$" + f), (c = !1))
          : (d += encodeURIComponent("&") + f);
      }
    c || (d += "$$");
    return d;
  },
  _getProtocol: function (a) {
    ptclString = "https://";
    if (
      (a && a.toLowerCase() == EBG.Semi.AttributionEnum.HttpProtocol.HTTP) ||
      a.toLowerCase() == EBG.Semi.AttributionEnum.HttpProtocol.HTTP + ":"
    )
      ptclString = "http://";
    return ptclString;
  },
  _getBsResponseContent: function (a) {
    a = a || this._oneTagObj;
    return bsResponseObj[
      a && a.id && a.sessionId
        ? "ot" + a.id + "-" + a.sessionId
        : Object.keys(bsResponseObj)[0]
    ];
  },
  _handleResponse: function (a, b) {
    var c = this._getBsResponseContent(a);
    c &&
      c.extensionData &&
      (a ||
        ((a = {}),
        (a.id = EBG.Semi.Infra.getQuerystringParam("onetagid")),
        (a.sendTime = EBG.Semi.Infra.getQuerystringParam("st")),
        (this.isOneTagTestToolActive = function () {
          return !0;
        })),
      this.OTTHandleExtensionData(
        a.id,
        c.extensionData,
        new Date().getTime(),
        a && a.sendTime
      ));
    if (!c && 10 > b)
      (b = b || 0),
        b++,
        setTimeout(function () {
          this._handleResponse.apply($this, [a, b]);
        }, 20);
    else {
      this.oneTagLogger.info("Server response: " + c);
      if ((c = this._deserializeResponse(c)))
        if (c.preServingTasks && 0 < c.preServingTasks.length) {
          var d = {};
          d.uip = c.preServingTasks;
          d.uipv = c.uipv;
          d.scriptsPath = c.scriptsPath;
          d.filter = c.sessionId;
          this._oneTagObj
            ? ((d.bs = this._oneTagObj.bsUrl),
              (d.ebPtcl = this._getProtocol(this._oneTagObj.ptcl)))
            : ((d.bs = document.domain),
              (d.ebPtcl = this._getProtocol("https:")));
          EBG.Semi.Events.eventMgr.subscribeToEvent(
            EBG.Semi.EventName.ALL_USER_ID_FOUND,
            this._getUserIdProviders,
            this,
            d.filter
          );
          this.uidProviders.getUserIds(d);
        } else
          c.firstPartyServingDomain
            ? this.generateRequest(this.pageUrl, c, !0)
            : (this._handleScriptTags(c.scripts),
              this._handleUrlTags(c.urls),
              c.customScript
                ? this._handleCustomScript(c.customScript)
                : this._oneTagObj &&
                  this._oneTagObj.developerScripts &&
                  this._oneTagObj.developerScripts.postScript &&
                  (this.runDeveloperScript(
                    this._oneTagObj.developerScripts.postScript
                  ),
                  (this._oneTagObj.developerScripts.postScript = null)),
              this._handleServerMessages(c.logMessages),
              this._handleClientRules(
                c.clientRules ||
                  (this._oneTagObj && this._oneTagObj.clientRules),
                c.sessionId,
                c.diAppId,
                c.usercookie
              ));
      this._isHandlingRequest = !1;
    }
  },
  _getUserIdProviders: function (a) {
    if (!this._userIdProvidersCalled) {
      this._userIdProvidersCalled = !0;
      if (a) {
        var b = this._deserializeResponse(this._getBsResponseContent());
        b.targetUrl = a.userIdStr;
      }
      this._oneTagObj && (this._oneTagObj.sync = 0);
      this.generateRequest(this.pageUrl, b, !0);
    }
  },
  _handleClientRules: function (a, b, c, d) {
    this.ruleManager ||
      (this.ruleManager = new EBGVT.RuleManager(a, b, c, d, this));
  },
  _deserializeResponse: function (a) {
    if ("object" == EBGVT.Light.Infra.typeOf(a)) var b = a;
    else
      try {
        this.logNeeded &&
          -1 != a.indexOf("/*") &&
          (a = a.substring(0, a.lastIndexOf("/*"))),
          (b = EBGVT.JSON.parse(unescape(a)));
      } catch (c) {
        this.oneTagLogger.exception("OneTag._deserializeResponse", c);
      }
    return b;
  },
  _handleCustomScript: function (a) {
    if (
      a &&
      ("http:" == a.substring(0, 5).toLowerCase() ||
        "https:" == a.substring(0, 6).toLowerCase())
    ) {
      var b = document.createElement("script");
      b.type = "text/javascript";
      b.src = a;
      EBGVT.Light.Infra.addScriptElement(b);
    }
  },
  _handleServerMessages: function (a) {
    if (a && 0 < a.length) {
      this.oneTagLogger.timestamp = !1;
      this.oneTagLogger.info("Server Messages:");
      for (var b = 0; b < a.length; b++)
        a[b] && this.oneTagLogger.info("  " + a[b]);
      this.oneTagLogger.timestamp = !0;
    }
  },
  _handleScriptTags: function (a) {
    if (a)
      for (var b = 0; b < a.length; b++)
        a[b] && EBG.Semi.Infra.injectScript(unescape(a[b]));
  },
  _handleUrlTags: function (a) {
    (a = this._replaceTokens(a)) &&
      function (b) {
        this.serverCommunicator.reportUrlsList(
          a,
          function (c, d) {
            this.OTTSend("timelines", {
              id: this._oneTagObj && this._oneTagObj.id,
              name: d,
              type: "3rd Party URL",
              receiveTime: new Date().getTime(),
              sendTime: b,
            });
          },
          this
        );
      }.apply(this, [new Date().getTime()]);
  },
  _replaceTokens: function (a) {
    a = a || [];
    if (this.consentData)
      for (var b = 0; b < a.length; b++) {
        var c = a[b];
        this.consentData.gdprApplies &&
          ((c = c.replace(/\[%gdpr%\]/gi, this.consentData.gdprApplies)),
          (c = c.replace(/\${gdpr}/gi, this.consentData.gdprApplies)),
          (c = c.replace(/{gdpr}/gi, this.consentData.gdprApplies)));
        if (this.consentData.consentData) {
          c = c.replace(/\[%gdpr_consent%\]/gi, this.consentData.consentData);
          c = c.replace(/{gdpr_consent}/gi, this.consentData.consentData);
          var d = [
            1, 2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 21, 22, 23,
            24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 36, 37, 39, 40, 41, 42,
            44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 56, 57, 58, 59, 60, 61, 62,
            63, 65, 66, 67, 68, 69, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 82,
            83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 97, 98, 100,
            101, 102, 104, 108, 109, 110, 111, 114, 115, 119, 120, 122, 124,
            126, 127, 128, 129, 130, 131, 132, 133, 134, 136, 137, 138, 139,
            140, 141, 142, 143, 144, 145, 147, 148, 149, 150, 151, 152, 153,
            154, 155, 157, 158, 159, 160, 161, 162, 163, 164, 165, 167, 168,
            170, 173, 174, 177, 178, 179, 183, 184, 185, 190, 192, 193, 194,
            195, 196, 198, 199, 200, 202, 203, 205, 206, 208, 209, 210, 211,
            212, 213, 215, 216, 217, 218, 223, 224, 226, 227, 228, 230, 231,
            234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 246, 248,
            249, 250, 251, 252, 253, 254, 255, 256, 259, 261, 262, 263, 264,
            265, 266, 270, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281,
            282, 284, 285, 289, 290, 293, 294, 295, 297, 298, 299, 301, 302,
            303, 304, 308, 310, 311, 312, 314, 315, 316, 317, 318, 319, 321,
            323, 325, 328, 329, 331, 333, 334, 335, 336, 337, 343, 345, 347,
            349, 350, 351, 354, 358, 359, 360, 361, 365, 368, 371, 373, 374,
            375, 377, 378, 380, 381, 382, 384, 385, 387, 388, 394, 397, 402,
            408, 409, 410, 412, 413, 415, 416, 418, 422, 423, 424, 427, 428,
            429, 431, 434, 435, 436, 438, 439, 440, 444, 447, 448, 450, 452,
            455, 458, 459, 461, 462, 466, 467, 468, 469, 471, 473, 475, 479,
            482, 484, 486, 488, 490, 491, 493, 495, 496, 497, 498, 501, 502,
            505, 506, 507, 508, 509, 511, 512, 516, 517, 519, 520, 521, 524,
            527, 528, 530, 531, 535, 536, 539, 541, 543, 544, 545, 546, 547,
            549, 550, 553, 554, 556, 559, 561, 565, 568, 569, 570, 571, 573,
            574, 577, 578, 579, 580, 581, 584, 587, 590, 591, 593, 596, 597,
            598, 599, 601, 602, 606, 607, 609, 610, 612, 613, 614, 615, 617,
            618, 620, 621, 624, 625, 626, 628, 630, 631, 638, 639, 644, 645,
            646, 647, 648, 649, 650, 652, 653, 654, 655, 656, 657, 658, 659,
            662, 663, 664, 665, 666, 667, 668, 670, 671, 672, 674, 675, 676,
            678, 681, 682, 683, 684, 685, 686, 687, 688, 690, 691, 694, 697,
            699, 702, 703, 706, 707, 708, 709, 711, 712, 713, 714, 715, 716,
            717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729,
            730, 731, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742,
            743, 744, 745, 746, 747, 748, 749, 750, 751, 753, 754, 755, 756,
            757, 758, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 769,
            770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782,
            783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795,
            796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808,
            809, 810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821,
            822, 823, 824, 825, 826, 827, 828, 829, 830, 831, 832, 833, 834,
            835, 836, 837, 838, 839, 840, 841, 842, 843, 844, 845, 846, 847,
            848, 849, 850, 851, 852, 853, 854, 855, 856, 857, 858, 859, 860,
            861, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 873,
            874, 875, 876, 877, 878, 879, 880, 881, 882, 883, 884, 885, 886,
            887, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899,
            900, 901, 902, 903, 905, 906, 907, 908, 909, 910, 911, 912, 913,
            914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926,
            927, 928, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 940,
            941, 942, 943, 944, 945, 946, 947, 948, 949, 950, 951, 952, 953,
            954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966,
            967, 968, 969, 970, 971, 972, 973, 974, 975, 976, 977, 978, 979,
            980, 981, 982, 983, 984, 985, 986, 987, 988, 989, 990, 991, 992,
            993, 994, 995, 996, 997, 998, 999, 1e3, 1001, 1002, 1003, 1004,
            1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015,
            1016, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027,
            1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038,
            1039, 1040, 1041, 1042, 1043, 1044,
          ];
          if (/\${gdpr_consent_(.*?)}/gi.test(c))
            try {
              var e = c.match(/\${gdpr_consent_(.*?)}/gi);
              for (b = 0; b < e.length; b++) {
                var f = e[b].match(/\d+/);
                f &&
                  -1 != d.indexOf(1 * f[0]) &&
                  (c = c.replace(
                    new RegExp("\\${gdpr_consent_" + f[0] + "}", "i"),
                    this.consentData.consentData
                  ));
              }
            } catch (g) {}
        }
        a[b] = c;
      }
    return a;
  },
  _addProviderUserId: function (a, b) {
    var c = EBGVT.Light.Infra.urlAvailableLength(a) - 48;
    b.targetUrl &&
      (a =
        c > b.targetUrl.length
          ? a + b.targetUrl
          : a +
            ("&" +
              EEBG.Semi.AttributionEnum.UrlParamNames.ORIG_URL_LENGTH +
              "=" +
              (a.length + b.targetUrl.length + 2)));
    return a;
  },
  _addGdprConsent: function (a, b) {
    b &&
      (b.gdprApplies && (a += "&gdpr=" + b.gdprApplies),
      b.consentData && (a += "&gdpr_consent=" + b.consentData));
    return a;
  },
  isOneTagTestToolActive: (function () {
    var a = !1;
    try {
      a = !(!document.querySelector("#ott_flag") && !top.frames.ott_flag);
    } catch (b) {
      a = !1;
    }
    return function () {
      return a;
    };
  })(),
  getOTTDataCollectionOption: (function () {
    var a = null;
    window.addEventListener("message", function (b) {
      if ((b.target || b.srcElement).location.href === window.location.href)
        try {
          var c = b.data;
          "OTT" == c.key &&
            "setDataCollectionOption" == c.command &&
            (a =
              "undefined" !== typeof c.data.dataCollectionOption
                ? c.data.dataCollectionOption
                : 1);
        } catch (d) {}
    });
    return function () {
      return a;
    };
  })(),
  OTTSend: function (a, b) {
    this.isOneTagTestToolActive() &&
      ((b.category = a),
      top.postMessage(
        { key: "OTT", command: "addRows", category: a, data: b },
        "*"
      ));
  },
  OTTHandleExtensionData: function (a, b, c, d) {
    this.isOneTagTestToolActive() &&
      b &&
      ((b.sendTime = d),
      (b.receiveTime = c),
      (b.tagManagerId = a),
      top.postMessage(
        { key: "OTT", command: "parseServerResponse", data: b },
        "*"
      ));
  },
  getOneTagScript: (function () {
    if (document.currentScript) var a = document.currentScript;
    else {
      var b = document.getElementsByTagName("script");
      a = b[b.length - 1];
    }
    return function () {
      return a;
    };
  })(),
};
gEBMainWindow = window.gEBMainWindow || EBG.Semi.WindowUtil.getTopWindow();
var versaTagObj = new EBGVT.OneTag(window.versaTagObj);
versaTagObj.onready(function () {
  this.generateRequest();
}, !0);
