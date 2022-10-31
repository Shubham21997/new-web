"use strict";
function c(e, t) {
  return a(e) || o(e, t) || l(e, t) || n();
}
function n() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}
function o(e, t) {
  if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) {
    var n = [],
      o = !0,
      a = !1,
      i = void 0;
    try {
      for (
        var r, l = e[Symbol.iterator]();
        !(o = (r = l.next()).done) && (n.push(r.value), !t || n.length !== t);
        o = !0
      );
    } catch (e) {
      (a = !0), (i = e);
    } finally {
      try {
        o || null == l.return || l.return();
      } finally {
        if (a) throw i;
      }
    }
    return n;
  }
}
function a(e) {
  if (Array.isArray(e)) return e;
}
function d(e, t) {
  var n;
  if ("undefined" == typeof Symbol || null == e[Symbol.iterator]) {
    if (
      Array.isArray(e) ||
      (n = l(e)) ||
      (t && e && "number" == typeof e.length)
    ) {
      n && (e = n);
      var o = 0,
        t = function () {};
      return {
        s: t,
        n: function () {
          return o >= e.length ? { done: !0 } : { done: !1, value: e[o++] };
        },
        e: function (e) {
          throw e;
        },
        f: t,
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var a,
    i = !0,
    r = !1;
  return {
    s: function () {
      n = e[Symbol.iterator]();
    },
    n: function () {
      var e = n.next();
      return (i = e.done), e;
    },
    e: function (e) {
      (r = !0), (a = e);
    },
    f: function () {
      try {
        i || null == n.return || n.return();
      } finally {
        if (r) throw a;
      }
    },
  };
}
function l(e, t) {
  if (e) {
    if ("string" == typeof e) return i(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    return "Map" ===
      (n = "Object" === n && e.constructor ? e.constructor.name : n) ||
      "Set" === n
      ? Array.from(e)
      : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
      ? i(e, t)
      : void 0;
  }
}
function i(e, t) {
  (null == t || t > e.length) && (t = e.length);
  for (var n = 0, o = new Array(t); n < t; n++) o[n] = e[n];
  return o;
}
var e,
  r,
  k,
  t,
  j = jQuery,
  _ = [],
  s = j(".js-single-page-header"),
  C = j(".site-header"),
  A = "/wp-content/themes/baderrutter/",
  u = document.querySelectorAll("[data-src]"),
  h = window.innerWidth,
  f = window.innerHeight,
  v = document.documentElement.scrollHeight - f,
  L = document.querySelectorAll('*[class*="reveal"]'),
  S = [],
  E = 5e3,
  m = f - f / 6;
function T() {
  return (
    (t = k),
    void 0 !== window.pageYOffset
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body)
          .scrollTop
  );
}
function g(e) {
  var t = document.body.getBoundingClientRect();
  return e.getBoundingClientRect().top - t.top;
}
function p() {
  for (var e = 0; e < S.length; e++) {
    var t = S[e];
    k + m >= t.topOf && (t.self.classList.add("active"), S.splice(e, 1), e--);
  }
}
function x(e) {
  for (var t = 0; t < u.length; t++) {
    var n = u[t],
      o = n.getAttribute("data-src"),
      a = g(n);
    (!(!!e && k <= a && a < k + f) && e) ||
      (!n.classList.contains("loaded") &&
        0 < o.length &&
        ("IMG" == n.tagName
          ? n.setAttribute("src", o)
          : (n.style.backgroundImage = "url(" + o + ")"),
        n.classList.add("loaded")));
  }
}
function y(e, t, n) {
  e.pause(),
    e.parentElement.classList.add("loading"),
    t.removeAttribute("src"),
    t.setAttribute("src", n),
    e.load(),
    (e.onloadeddata = function () {
      e.parentElement.classList.remove("loading"), e.play();
    });
}
function w() {
  for (var e = 0; e < Y.length; e++) {
    var t = Y[e],
      n = t.querySelector("source"),
      o = n.getAttribute("src"),
      a = Number(t.dataset.breakpoint) || 768;
    (h = window.innerWidth) <= a &&
      o != t.dataset.mobile &&
      y(t, n, t.dataset.mobile),
      a < h && o != t.dataset.desktop && y(t, n, t.dataset.desktop);
  }
}
function I(e, t, n, o) {
  (t = t || "script"), (o = o || {});
  var a = window.document.getElementsByTagName("script")[0],
    i = window.document.createElement(t),
    o = Object.entries(o);
  if (0 < o.length) {
    var r = d(o);
    try {
      for (r.s(); !(s = r.n()).done; ) {
        var l = c(s.value, 2),
          s = l[0],
          l = l[1];
        i.setAttribute(s, l);
      }
    } catch (e) {
      r.e(e);
    } finally {
      r.f();
    }
  }
  return (
    "link" === t && ((i.rel = "stylesheet"), (i.href = e)),
    "script" === t && ((i.src = e), (i.async = !0), (i.defer = !0)),
    (i.onload = function () {
      "function" == typeof n && n();
    }),
    a.parentNode.insertBefore(i, a),
    i
  );
}
function b() {
  var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 767;
  return j(window).width() < e;
}
function O(e) {
  e.hasClass("active") && e.removeClass("active");
}
function q(e, t) {
  (t = t || "active"), e.addClass(t);
}
function H(e, t, n) {
  var o =
    3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : "active";
  (
    !(4 < arguments.length && void 0 !== arguments[4]) || arguments[4]
      ? t < n
      : n < t
  )
    ? e.hasClass(o) || e.addClass(o)
    : e.hasClass(o) && e.removeClass(o);
}
function B(e) {
  var t;
  j(".primary-navigation").hasClass("active") ||
    ((t = j(".site-header-mobile")),
    Math.abs(r - e) <= 5 || (H(t, e, r, "pull-down"), (r = e)));
}
function N(n) {
  var o = j(".js-site-header__navigation, .site-header__logo__graphic");
  j.each(_, function (e, t) {
    n > t.offset &&
      n < t.offset + t.heighth &&
      (o.hasClass(t.bg) || o.removeClass("light dark").addClass(t.bg));
  });
}
function z(e, t) {
  setTimeout(function () {
    e.text(t);
  }, t * (10 - t / 100));
}
function R(e, t) {
  if (e.length) for (var n = 0; n <= t; n++) z(e, n);
  return !1;
}
function M(e, t) {
  (t = t || "active"), e.classList.add(t);
}
function W(e) {
  e.classList.remove("active");
}
function D(t) {
  var n;
  return (
    (t =
      t ||
      function () {
        console.log("resized to,", window.innerWidth);
      }),
    function (e) {
      n && clearTimeout(n), (n = setTimeout(t, 100, e));
    }
  );
}
window.addEventListener("scroll", function () {
  e = !0;
}),
  setInterval(function () {
    e &&
      ((k = T()),
      p(),
      b(1e3)
        ? (j(
            ".js-site-header__navigation, .site-header__logo__graphic"
          ).removeClass("light dark"),
          H(s, k, 5),
          H(j(".site-header-mobile"), k, 5, "initial-position"),
          B(k))
        : N(k),
      (e = !1));
  }, 100),
  window.addEventListener("resize", D(w));
var Y = document.querySelectorAll("[data-adaptive-video]"),
  G = Y.length;
0 < G && w(),
  j(function () {
    (k = T()), I(A + "fonts.css", "link");
    var e = document.querySelector(".js-home-hero-animation");
    e &&
      (((c = window.document.createElement("iframe")).src = "".concat(
        A,
        "media/animated-logo/br-logo-animated2.html"
      )),
      (c.title = "Bader Rutter, Assoc logo"),
      c.setAttribute("scrolling", "no"),
      (c.style.border = "none"),
      e.append(c)),
      L.forEach(function (e) {
        e = {
          self: e,
          heightOf: e.clientHeight,
          topOf: e.getBoundingClientRect().top,
        };
        S.push(e);
      });
    for (
      var t = document.querySelectorAll("[data-menu-btn]"),
        n = t.length,
        o = document.querySelector(".primary-navigation"),
        a = document.querySelector(".site-header__logo__graphic"),
        i = 0;
      i < n;
      i++
    )
      t[i].addEventListener(
        "click",
        function () {
          this.classList.toggle("active"),
            o.classList.toggle("active"),
            a.classList.toggle("active"),
            o.classList.contains("active") || q(C, "initial-position");
        },
        { passive: !0 }
      );
    j(".js-show-contacts").click(function (e) {
      e.preventDefault(),
        q(
          j(
            ".menu-primary-menu-container, .primary-navigation__contact, .primary-navigation__contact__link"
          )
        );
    });
    var r,
      l = j(".hero-video");
    l.length &&
      ((r = j(".js-hero-video-container")),
      j(".js-watch-video").click(function (e) {
        e.preventDefault();
        e = {
          id: j(this).attr("href"),
          acct: "828123804001",
          player: "mjHC7Kyd6",
        };
        e.id &&
          ((e = '<iframe src="//players.brightcove.net/'
            .concat(e.acct, "/")
            .concat(e.player, "_default/index.html?videoId=")
            .concat(
              e.id,
              '" allowfullscreen webkitallowfullscreen mozallowfullscreen allow="encrypted-media" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; width: 100%; height: 100%; z-index: 999999; border: none;"></iframe>'
            )),
          j(".js-hero-video-container").append(e),
          setTimeout(q(l), 100));
      }),
      j(".js-hero-video-dismiss").click(function () {
        O(l), setTimeout(r.empty(), 400);
      })),
      j(document).keyup(function (e) {
        27 === e.keyCode && O(j(".js-component-contact-modal"));
      }),
      x(!0);
    var s = setTimeout(function () {
        x(!1);
      }, E),
      c = function e() {
        console.log("scroll"),
          window.removeEventListener("scroll", e),
          clearTimeout(s),
          x(!1);
      };
    window.addEventListener("scroll", c, { passive: !0 });
    var d = j(".owl-carousel"),
      u = !1;
    d.length &&
      (I(A + "assets/css/vendor/vendor.owl.theme.default.min.css", "link", !1),
      I(A + "assets/css/vendor/vendor.owl.carousel.min.css", "link", !1),
      u ||
        I(
          "https://cdn.jsdelivr.net/npm/owl.carousel@2.2.0/dist/owl.carousel.min.js",
          "script",
          function () {
            (u = !0),
              d.each(function () {
                var e = j(this),
                  t = {};
                e.hasClass("component-vertical-carousel__carousel") &&
                  ((t.dots = !0),
                  (t.autoplay = !0),
                  (t.nav = !1),
                  (t.autoplayHoverPause = !0),
                  (t.autoplaySpeed = 400),
                  (t.loop = !0)),
                  (t.items = t.items || 1),
                  (t.margin = t.margin || 80),
                  (t.autoHeight = t.autoHeight || !1),
                  (t.nav = t.nav || !0),
                  (t.loop = t.loop || !1),
                  (t.dots = t.dots || !1),
                  e.owlCarousel(t);
              });
          }
        )),
      (j(".light-background").length || j(".dark-background").length) &&
        (j(".light-background, .dark-background").each(function () {
          var e = j(this),
            t = e.offset().top,
            n = e.height(),
            e = e.hasClass("light-background") ? "light" : "dark";
          _.push({ offset: t, heighth: n, bg: e });
        }),
        setTimeout(function () {
          N(j(document).scrollTop());
        }, 500));
    var h,
      f,
      v,
      m,
      g,
      p,
      y = j(".js-parallax-image");
    y.length &&
      j(window).scroll(function () {
        var e = j(document).scrollTop() / 10;
        e <= 180 && ((e = e - 2 * e), y.css({ top: e }));
      }),
      j(".home__hero").length &&
        ((h = j(".js-home-hero")),
        (f = j(".js-home-hero-message")),
        (v = j(".js-home-hero-animation, .js-home-hero-bbn-logo")),
        (m = j(".js-header-logo")),
        (g = j(".js-home-hero-scroll-tab")),
        (p = j(".js-home-hero-scroll-indicator")),
        j(window).scroll(function () {
          var e = j(document).scrollTop(),
            t = e / 8;
          H(g, e, 10, "away", !1),
            H(v, e, 100, "fade-out", !1),
            H(m, e, 100, "invisible"),
            H(f, e, 250, "revealed", !1),
            H(h, e, 800, "unfix", !1),
            p.css("height", t + "%");
        }));
    var w,
      b = j(".js-v-collection-link");
    b.length &&
      ((w = j(".js-v-collection-article")),
      b.click(function (e) {
        var t = j(this),
          n = t.data("article"),
          n = j(".article-" + n);
        w.removeClass("active"),
          b.removeClass("active"),
          n.length && (t.addClass("active"), n.addClass("active"));
      })),
      j("body").on("click", ".owl-prev", function () {
        window.dataLayer.push({
          event: "slideshow",
          action: "left",
          label: "",
        });
      }),
      j("body").on("click", ".owl-next", function () {
        window.dataLayer.push({
          event: "slideshow",
          action: "right",
          label: "",
        });
      }),
      j("audio.wp-audio-shortcode").on("play", function () {
        var e = j(this).attr("src").split("/"),
          e = e[e.length - 1];
        window.dataLayer.push({ event: "audio", action: "play", label: e });
      }),
      j(".js-v-collection-link").click(function () {
        var e = j(this)
          .find(".component-vertical-content-collection--tile-header")
          .text();
        window.dataLayer.push({
          event: "content collection",
          action: "opened",
          label: e,
        });
      });
  });
//# sourceMappingURL=main.js.map
