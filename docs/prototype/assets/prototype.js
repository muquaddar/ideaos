/* IdeaOS prototype — interaction layer.
   Injects shared chrome (rail, topbar, capture modal, FAB), drives the theme
   toggle, renders the SVG graph, and wires capture/state/journey helpers.
   Pure DOM + vanilla JS, no dependencies — opens from file:// anywhere. */
(function () {
  "use strict";

  // ----------------------------------------------------------- Theme
  var THEME_KEY = "ideaos-theme";
  function initTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  }
  function toggleTheme() {
    var cur = document.documentElement.getAttribute("data-theme");
    var next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    syncThemeLabels();
  }
  function syncThemeLabels() {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    [].forEach.call(document.querySelectorAll("[data-theme-label]"), function (el) {
      el.textContent = dark ? "☀  Light" : "☾  Dark";
    });
  }
  initTheme();

  // ----------------------------------------------------------- Nav model
  var NAV = [
    { screen: "home",      href: "home.html",      ic: "◉", label: "Graph Home" },
    { screen: "dashboard", href: "dashboard.html", ic: "▤", label: "Dashboard" },
    { screen: "search",    href: "search.html",    ic: "⌕", label: "Search" },
    { screen: "alerts",    href: "alerts.html",    ic: "◔", label: "Activation Alerts" },
    { screen: "timeline",  href: "timeline.html",  ic: "⟲", label: "Time Machine" },
    { screen: "settings",  href: "export.html",    ic: "⚙", label: "Settings" }
  ];

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html != null) n.innerHTML = html;
    return n;
  }

  // ----------------------------------------------------------- Chrome injection
  function buildChrome() {
    var body = document.body;
    if (!body.classList.contains("app")) return;
    var screen = body.getAttribute("data-screen") || "";
    var crumbs = body.getAttribute("data-crumbs") || "";
    var isAuth = body.classList.contains("app--auth");

    // wrap existing <main> if present
    var main = body.querySelector("main.content");

    if (!isAuth) {
      // Rail
      var rail = el("aside", { class: "rail" });
      rail.appendChild(el("a", { class: "brand", href: "index.html", title: "Prototype map" },
        '<span class="logo">◉</span><span><b>IdeaOS</b><small>prototype · L1</small></span>'));
      var settingsScreens = { settings: 1, export: 1, delete: 1 };
      NAV.forEach(function (item) {
        var active = (item.screen === screen) || (item.screen === "settings" && settingsScreens[screen]);
        rail.appendChild(el("a", { class: "nav-link" + (active ? " active" : ""), href: item.href },
          '<span class="ic">' + item.ic + '</span>' + item.label));
      });
      rail.appendChild(el("div", { class: "spacer" }));
      rail.appendChild(el("a", { class: "nav-link", href: "index.html" }, '<span class="ic">⊞</span>Prototype map'));
      var tt = el("button", { class: "theme-toggle", type: "button", "aria-label": "Toggle light or dark theme" },
        '<span>Theme</span><span data-theme-label></span>');
      tt.addEventListener("click", toggleTheme);
      rail.appendChild(tt);
      body.insertBefore(rail, body.firstChild);
    }

    // Content column wrapper
    var col = el("div", { class: "col" });
    if (!isAuth) {
      var topbar = el("header", { class: "topbar" });
      topbar.appendChild(el("nav", { class: "crumbs", "aria-label": "Breadcrumb" }, crumbs || "<b>IdeaOS</b>"));
      topbar.appendChild(el("div", { class: "grow" }));
      var sm = el("a", { class: "search-mini", href: "search.html" },
        '<span>⌕</span><span>Search ideas</span><span class="kbd">/</span>');
      topbar.appendChild(sm);
      col.appendChild(topbar);
    }
    // move main into col
    if (main) { col.appendChild(main); }
    body.appendChild(col);

    if (!isAuth) {
      // FAB + capture modal
      var fab = el("button", { class: "fab", type: "button" }, "✦ Capture");
      fab.addEventListener("click", openCapture);
      body.appendChild(fab);
      body.appendChild(buildCaptureModal());
    }
    syncThemeLabels();
  }

  // ----------------------------------------------------------- Capture modal
  function buildCaptureModal() {
    var back = el("div", { class: "modal-backdrop", id: "captureModal" });
    back.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-label="Capture an idea">' +
        '<div style="padding:18px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px">' +
          '<span class="eyebrow">Capture</span><span class="dim" style="font-size:12.5px">zero required fields · ⌘/Ctrl+Enter to save</span>' +
        '</div>' +
        '<div style="padding:18px 20px">' +
          '<textarea class="input" id="captureText" placeholder="What\'s on your mind?" autofocus></textarea>' +
          '<div style="display:flex;align-items:center;gap:10px;margin-top:12px">' +
            '<button class="btn" type="button" id="micBtn" aria-pressed="false">🎤 Voice</button>' +
            '<div class="grow" style="flex:1"></div>' +
            '<button class="btn ghost" type="button" id="captureCancel">Cancel</button>' +
            '<button class="btn primary" type="button" id="captureSave">Save idea</button>' +
          '</div>' +
          '<p class="hint" id="micHint" hidden>Listening… (prototype: this fills sample text)</p>' +
        '</div>' +
      '</div>';
    back.addEventListener("click", function (e) { if (e.target === back) closeCapture(); });
    setTimeout(function () {
      var save = document.getElementById("captureSave");
      var cancel = document.getElementById("captureCancel");
      var mic = document.getElementById("micBtn");
      var ta = document.getElementById("captureText");
      if (save) save.addEventListener("click", function () {
        // Demo: a new capture becomes the seeded "Custom cache for IdeaOS" (n9) so downstream links resolve.
        toast("Idea saved — analyzing…");
        setTimeout(function () { location.href = "interview.html?id=n9"; }, 650);
      });
      if (cancel) cancel.addEventListener("click", closeCapture);
      if (mic) mic.addEventListener("click", function () {
        var on = mic.getAttribute("aria-pressed") === "true";
        mic.setAttribute("aria-pressed", String(!on));
        document.getElementById("micHint").hidden = on;
        if (!on && ta) ta.value = "A custom cache to speed up graph reads in IdeaOS";
      });
      if (ta) ta.addEventListener("keydown", function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") save.click();
      });
    }, 0);
    return back;
  }
  function openCapture() { var m = document.getElementById("captureModal"); if (m) { m.classList.add("open"); var t = document.getElementById("captureText"); if (t) t.focus(); } }
  function closeCapture() { var m = document.getElementById("captureModal"); if (m) m.classList.remove("open"); }

  // ----------------------------------------------------------- Toast
  function toast(msg) {
    var t = el("div", { class: "toast" }, msg);
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 250); }, 1800);
  }

  // ----------------------------------------------------------- Graph renderer
  function statusColor(status) {
    var map = window.IDEAOS.STATUS[status];
    return map ? map.color : "var(--text-3)";
  }
  function renderGraph(containerId, opts) {
    opts = opts || {};
    var host = document.getElementById(containerId);
    if (!host || !window.IDEAOS) return;
    var D = window.IDEAOS, W = 1000, H = 620;
    var nodes = D.nodes, edges = D.edges;
    var pos = {}; nodes.forEach(function (n) { pos[n.id] = n; });

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Idea graph">';
    // edges
    edges.forEach(function (e) {
      var a = pos[e.s], b = pos[e.t]; if (!a || !b) return;
      var et = D.EDGE_TYPES[e.type] || {};
      var cls = "g-edge" + (e.confirmed ? "" : " proposed");
      svg += '<path class="' + cls + '" data-edge="' + e.id + '" data-s="' + e.s + '" data-t="' + e.t + '" ' +
             'd="M ' + a.x + ' ' + a.y + ' L ' + b.x + ' ' + b.y + '" ' +
             'stroke="' + (et.color || 'var(--text-3)') + '" stroke-dasharray="' + (et.dash || '0') + '"></path>';
    });
    // nodes
    nodes.forEach(function (n) {
      var r = n.id === "n7" || n.id === "n1" ? 22 : 16;
      svg += '<g class="g-node" data-node="' + n.id + '" tabindex="0" role="button" aria-label="' + n.title + '" transform="translate(' + n.x + ',' + n.y + ')">' +
               '<circle r="' + r + '" fill="' + statusColor(n.status) + '"></circle>' +
               '<text x="0" y="' + (r + 15) + '" text-anchor="middle">' + n.title + '</text>' +
               '<text class="sub" x="0" y="' + (r + 28) + '" text-anchor="middle">' + (D.STATUS[n.status] ? D.STATUS[n.status].label : n.status) + '</text>' +
             '</g>';
    });
    svg += '</svg>';
    host.innerHTML = svg;

    // interactions — relationship highlighting (US-012) + navigate (US-008/009)
    var svgEl = host.querySelector("svg");
    function neighbors(id) {
      var set = {}; set[id] = 1;
      edges.forEach(function (e) { if (e.s === id) set[e.t] = 1; if (e.t === id) set[e.s] = 1; });
      return set;
    }
    function highlight(id) {
      var keep = neighbors(id);
      [].forEach.call(svgEl.querySelectorAll(".g-node"), function (g) {
        g.classList.toggle("dim", !keep[g.getAttribute("data-node")]);
        g.classList.toggle("sel", g.getAttribute("data-node") === id);
      });
      [].forEach.call(svgEl.querySelectorAll(".g-edge"), function (p) {
        var on = p.getAttribute("data-s") === id || p.getAttribute("data-t") === id;
        p.classList.toggle("dim", !on);
      });
    }
    function reset() {
      [].forEach.call(svgEl.querySelectorAll(".g-node"), function (g) { g.classList.remove("dim", "sel"); });
      [].forEach.call(svgEl.querySelectorAll(".g-edge"), function (p) { p.classList.remove("dim"); });
    }
    [].forEach.call(svgEl.querySelectorAll(".g-node"), function (g) {
      var id = g.getAttribute("data-node");
      g.addEventListener("mouseenter", function () { highlight(id); });
      g.addEventListener("mouseleave", reset);
      g.addEventListener("click", function () { location.href = "idea.html?id=" + id; });
      g.addEventListener("keydown", function (e) { if (e.key === "Enter") location.href = "idea.html?id=" + id; });
    });
    svgEl.addEventListener("click", function (e) { if (e.target === svgEl) reset(); });
  }

  // ----------------------------------------------------------- State toggle (spec_05 §9 matrix)
  function wireStateToggle() {
    [].forEach.call(document.querySelectorAll("[data-stateset]"), function (group) {
      var bar = group.querySelector(".state-toggle");
      if (!bar) return;
      bar.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-state]"); if (!btn) return;
        var state = btn.getAttribute("data-state");
        [].forEach.call(bar.querySelectorAll("button"), function (b) { b.classList.toggle("on", b === btn); });
        [].forEach.call(group.querySelectorAll("[data-statepanel]"), function (p) {
          p.hidden = p.getAttribute("data-statepanel") !== state;
        });
      });
    });
  }

  // ----------------------------------------------------------- helpers exposed to pages
  window.PROTO = {
    qs: function (k) { return new URLSearchParams(location.search).get(k); },
    node: function (id) { return window.IDEAOS.byId(id); },
    statusBadge: function (status) {
      var s = window.IDEAOS.STATUS[status] || { label: status, color: "var(--text-3)", icon: "•" };
      return '<span class="badge"><span class="status-dot" style="background:' + s.color + '"></span>' + s.icon + " " + s.label + "</span>";
    },
    provenance: function (label, href) {
      return '<a class="provenance" href="' + (href || "#") + '">' + label + "</a>";
    },
    confidence: function (level) {
      return '<span class="confidence" data-c="' + level + '"><span class="bar"><i></i></span>' + level + " confidence</span>";
    },
    renderGraph: renderGraph,
    toast: toast,
    openCapture: openCapture
  };

  // ----------------------------------------------------------- boot
  document.addEventListener("DOMContentLoaded", function () {
    buildChrome();
    wireStateToggle();
    // global shortcuts
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openCapture(); }
      if (e.key === "Escape") closeCapture();
      if (e.key === "/" && document.activeElement.tagName !== "TEXTAREA" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault(); location.href = "search.html";
      }
    });
    // auto-render any graph host
    if (document.getElementById("graph")) renderGraph("graph");
  });
})();
