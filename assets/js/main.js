/* Contact details - used by the email links and the contact form. */
var CONTACT = {
  email: "hamidraza2048@gmail.com",
  github: "https://github.com/Hamid2048",
  linkedin: "https://www.linkedin.com/in/hamid-razaa"
};

(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Loader */
  var loader = document.getElementById("loader");
  function hideLoader(){ loader.classList.add("done"); }
  window.addEventListener("load", function(){ setTimeout(hideLoader, reduced ? 0 : 650); });
  setTimeout(hideLoader, 2600);

  /* Contact links */
  document.querySelectorAll("[data-contact-link]").forEach(function (el) {
    var kind = el.getAttribute("data-contact-link");
    if (kind === "email") { el.setAttribute("href", "mailto:" + CONTACT.email); el.removeAttribute("title"); }
    if (kind === "github") { el.setAttribute("href", CONTACT.github); el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener"); el.removeAttribute("title"); }
    if (kind === "linkedin") { el.setAttribute("href", CONTACT.linkedin); el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener"); el.removeAttribute("title"); }
  });

  /* Header state */
  var header = document.getElementById("siteHeader");
  function onScroll(){ header.classList.toggle("scrolled", window.scrollY > 24); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Mobile menu */
  var menuBtn = document.getElementById("menuBtn");
  var mobileMenu = document.getElementById("mobileMenu");
  menuBtn.addEventListener("click", function () {
    var open = mobileMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobileMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  /* Scrollspy */
  var navLinks = document.querySelectorAll("[data-nav]");
  var navAnimating = false;
  var spy = new IntersectionObserver(function (entries) {
    if (navAnimating) return;
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        navLinks.forEach(function (l) { l.classList.toggle("active", l.getAttribute("data-nav") === e.target.id); });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["home","about","skills","projects","journey","contact"].forEach(function (id) {
    var s = document.getElementById(id); if (s) spy.observe(s);
  });

  /* Smooth scrolling */
  var NAV_OFFSET = 86; /* Header height + spacing */
  var progressBar = document.getElementById("scrollProgress");

  function setActiveNav(id) {
    navLinks.forEach(function (l) { l.classList.toggle("active", l.getAttribute("data-nav") === id); });
  }
  function targetYFor(sec) {
    return Math.max(0, sec.getBoundingClientRect().top + window.scrollY - NAV_OFFSET);
  }
  function arriveAt(sec) {
    sec.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    sec.classList.remove("just-arrived");
    void sec.offsetWidth; /* Restart the animation */
    sec.classList.add("just-arrived");
    setTimeout(function () { sec.classList.remove("just-arrived"); }, 1300);
  }

  function maxScrollY() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }
  function clampY(y) { return Math.min(Math.max(0, y), maxScrollY()); }

  var sTarget = window.scrollY;
  var sPos = window.scrollY;
  var sRunning = false;
  var sRaf = null;
  var onArrive = null;

  function engineStep() {
    var diff = sTarget - sPos;
    var step = diff * 0.082;
    var MAX_STEP = 160; /* Max step per frame */
    if (step > MAX_STEP) step = MAX_STEP;
    else if (step < -MAX_STEP) step = -MAX_STEP;
    sPos += step;
    if (Math.abs(diff) < 0.6) sPos = sTarget;
    window.scrollTo(0, sPos);
    updateProgress();
    if (sPos !== sTarget) {
      sRaf = requestAnimationFrame(engineStep);
    } else {
      sRunning = false; sRaf = null;
      if (onArrive) { var cb = onArrive; onArrive = null; cb(); }
    }
  }
  function engineGo() {
    if (!sRunning) { sRunning = true; sRaf = requestAnimationFrame(engineStep); }
  }
  function engineTakeover() {
    onArrive = null;
    navAnimating = false;
  }
  function smoothGoTo(y, after) {
    sTarget = clampY(y);
    onArrive = after || null;
    engineGo();
  }

  if (!reduced) {
    document.documentElement.classList.add("smooth-on");

    /* Sync with native scrolling */
    window.addEventListener("scroll", function () {
      if (!sRunning) { sPos = window.scrollY; sTarget = window.scrollY; }
    }, { passive: true });
    window.addEventListener("resize", function () { sTarget = clampY(sTarget); });
    window.addEventListener("touchstart", function () {
      if (sRunning) {
        cancelAnimationFrame(sRaf); sRunning = false; sRaf = null;
        engineTakeover();
        sPos = window.scrollY; sTarget = window.scrollY;
      }
    }, { passive: true });
  }

  if (!reduced && finePointer) {
    /* Wheel smoothing */
    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey) return; /* Keep pinch-zoom native */
      if (document.body.style.overflow === "hidden") return; /* Modal is open */
      e.preventDefault();
      engineTakeover();
      var delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 33; /* Firefox line mode */
      else if (e.deltaMode === 2) delta *= window.innerHeight; /* Page mode */
      sTarget = clampY(sTarget + delta);
      engineGo();
    }, { passive: false });

    /* Keyboard scrolling */
    window.addEventListener("keydown", function (e) {
      if (document.body.style.overflow === "hidden") return; /* Modal open */
      var t = e.target;
      var tag = (t && t.tagName ? t.tagName : "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || tag === "a" || tag === "button" || (t && t.isContentEditable)) return;
      var y = null;
      if (e.key === "ArrowDown") y = sTarget + 120;
      else if (e.key === "ArrowUp") y = sTarget - 120;
      else if (e.key === "PageDown") y = sTarget + window.innerHeight * 0.92;
      else if (e.key === "PageUp") y = sTarget - window.innerHeight * 0.92;
      else if (e.key === " ") y = sTarget + (e.shiftKey ? -1 : 1) * window.innerHeight * 0.92;
      else if (e.key === "Home") y = 0;
      else if (e.key === "End") y = maxScrollY();
      if (y !== null) { e.preventDefault(); engineTakeover(); sTarget = clampY(y); engineGo(); }
    });
  }

  function navigateTo(sec) {
    setActiveNav(sec.id);
    try { history.pushState(null, "", "#" + sec.id); } catch (err) { /* Hash update is optional */ }
    var toY = targetYFor(sec);
    if (reduced) { window.scrollTo(0, toY); arriveAt(sec); return; }
    navAnimating = true;
    smoothGoTo(toY, function () { arriveAt(sec); navAnimating = false; });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1);
      if (!id) return;
      var sec = document.getElementById(id);
      if (!sec) return;
      e.preventDefault();
      mobileMenu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      navigateTo(sec);
    });
  });

  /* Scroll progress */
  var progTick = false;
  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    progressBar.style.transform = "scaleX(" + p.toFixed(4) + ")";
    progTick = false;
  }
  window.addEventListener("scroll", function () {
    if (!progTick) { progTick = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();

  /* Reveal on scroll */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { revealIO.observe(el); });

  /* Typing effect */
  var roles = ["Full Stack Developer", "ASP.NET Core Developer", "SQL Server Developer", "ERP Developer"];
  var typedEl = document.getElementById("typed");
  if (reduced) {
    typedEl.textContent = roles[0];
  } else {
    var ri = 0, ci = 0, deleting = false;
    (function type() {
      var word = roles[ri];
      typedEl.textContent = word.slice(0, ci);
      var delay = deleting ? 34 : 74;
      if (!deleting && ci === word.length) { delay = 1900; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 420; }
      else ci += deleting ? -1 : 1;
      setTimeout(type, delay);
    })();
  }

  /* Animated counters */
  var counted = false;
  var statsEl = document.querySelector(".stats");
  if (statsEl) {
    var cIO = new IntersectionObserver(function (entries) {
      if (counted || !entries[0].isIntersecting) return;
      counted = true;
      document.querySelectorAll("[data-count]").forEach(function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10);
        if (reduced) { el.textContent = target; return; }
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1500, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
      cIO.disconnect();
    }, { threshold: 0.4 });
    cIO.observe(statsEl);
  }

  /* Particles */
  if (!reduced) {
    var canvas = document.getElementById("particles");
    var ctx = canvas.getContext("2d");
    var W, H, pts = [], raf = null;
    var COLORS = ["79,124,255", "139,92,246", "34,211,238"];
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      var n = Math.min(52, Math.floor(W * H / 34000));
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
          r: Math.random() * 1.6 + 0.5, c: COLORS[i % 3]
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.c + ",0.42)"; ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < 11000) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(79,124,255," + (0.07 * (1 - d / 11000)) + ")"; ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    resize(); draw();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) draw();
    });
  }

  /* Custom cursor and magnetic buttons */
  if (finePointer && !reduced) {
    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
    });
    (function follow() {
      rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(follow);
    })();
    document.querySelectorAll("a, button, .chip, .proj").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("grow"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("grow"); });
    });
    document.querySelectorAll(".magnetic").forEach(function (el) {
      var tx = 0, ty = 0, cx = 0, cy = 0, rafId = null;
      function easeStep() {
        cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14;
        el.style.transform = "translate(" + cx.toFixed(2) + "px," + cy.toFixed(2) + "px)";
        if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) { rafId = requestAnimationFrame(easeStep); }
        else { rafId = null; if (tx === 0 && ty === 0) el.style.transform = ""; }
      }
      function kick() { if (!rafId) rafId = requestAnimationFrame(easeStep); }
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        tx = x * 0.12; ty = y * 0.15;
        kick();
      });
      el.addEventListener("mouseleave", function () { tx = 0; ty = 0; kick(); });
    });
  }

  /* 3D tilt on project cards */
  if (finePointer && !reduced) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      var tRX = 0, tRY = 0, cRX = 0, cRY = 0, hovering = false, rafId = null;
      function easeStep() {
        cRX += (tRX - cRX) * 0.1; cRY += (tRY - cRY) * 0.1;
        card.style.transform = "perspective(1100px) rotateY(" + cRY.toFixed(3) + "deg) rotateX(" + cRX.toFixed(3) + "deg) translateY(" + (hovering ? -3 : 0) + "px)";
        if (Math.abs(tRX - cRX) > 0.01 || Math.abs(tRY - cRY) > 0.01) { rafId = requestAnimationFrame(easeStep); }
        else { rafId = null; if (!hovering) card.style.transform = ""; }
      }
      function kick() { if (!rafId) rafId = requestAnimationFrame(easeStep); }
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        hovering = true;
        tRY = px * 4.5; tRX = -py * 4.5;
        kick();
      });
      card.addEventListener("mouseleave", function () { hovering = false; tRX = 0; tRY = 0; kick(); });
    });
  }

  /* Project modal */
  var PROJECTS = {
    erp: {
      cat: "Enterprise Software - Private Project",
      title: "Enterprise ERP System",
      desc: "A complete business management platform built on ASP.NET Core MVC with a layered Controller → Service → Repository architecture. It centralizes the modules a growing business runs on every day, with SQL Server handling the data layer through stored procedures and views.",
      features: ["Business management modules", "Inventory & stock management", "Sales & purchase management", "Financial reporting", "Role-based access & permissions", "Branch-wise data handling", "Voucher-based workflows"],
      tags: ["ASP.NET Core MVC", "C#", ".NET 7", "SQL Server", "DevExtreme", "Bootstrap"],
      note: "Private enterprise project - source code and live demo are not public. Happy to walk through the architecture in a call."
    },
    dashboard: {
      cat: "Dashboards & Analytics - Private Project",
      title: "Interactive ERP Dashboard",
      desc: "A dynamic dashboard layer on top of the ERP that gives each user a personalized, permission-aware view of the business. Widgets load per user rights and respond instantly to branch filters.",
      features: ["Dynamic dashboard widgets", "Branch-wise filtering", "User-based dashboard permissions", "Inventory valuation", "Bank & cash summaries", "Aging analysis", "Interactive charts & grids"],
      tags: ["JavaScript", "DevExtreme", "Charts", "SQL Server", "C#"],
      note: "Private enterprise project - screenshots contain live business data, so they are shared only on request."
    },
    fbr: {
      cat: "API Integration - Private Project",
      title: "FBR Digital Invoice Integration",
      desc: "Integration between the ERP sales module and Pakistan's FBR Digital Invoicing system. Invoices are converted into the FBR payload format, pushed through the API, and stamped with a QR code once accepted - with full visibility of every push attempt.",
      features: ["FBR Digital Invoicing", "API integration", "Invoice payload generation", "QR code generation", "Invoice push status monitoring", "Error handling & retry visibility"],
      tags: ["REST API", "C#", "JSON", "QR Code", "SQL Server"],
      note: "Private enterprise project - built against the official FBR Digital Invoicing API specification."
    },
    inventory: {
      cat: "Inventory & Stock - Private Project",
      title: "Advanced Inventory Management",
      desc: "The stock engine of the ERP: adjustment and transfer vouchers, barcode-driven picking, and batch/lot-level traceability. Current stock is computed from validated movements, so reports always match the warehouse floor.",
      features: ["Stock Adjustment", "Stock Transfer", "Barcode management", "Batch & lot tracking", "Current stock calculations", "Data validation at every step"],
      tags: ["ASP.NET Core", "C#", "SQL Server", "Barcode", "DevExtreme"],
      note: "Private enterprise project - includes the voucher copy workflow and print-ready stock documents."
    },
    reporting: {
      cat: "Reporting - Private Project",
      title: "Business Reporting System",
      desc: "A flexible reporting system where one screen serves many reports: stored procedures return the data, C# maps it, and the grid reshapes itself per report - with grouping, summaries and print output.",
      features: ["SQL Server stored procedures", "Complex SQL queries", "CTE-based reports", "Financial reports", "Aging reports", "Crystal Reports printing"],
      tags: ["Stored Procedures", "CTEs", "Crystal Reports", "SQL Server", "DevExtreme"],
      note: "Private enterprise project - report definitions are data-driven, so new reports plug in without new screens."
    },
    mobile: {
      cat: "Mobile Development - Learning Project",
      title: "Mobile App Development Journey",
      desc: "My ongoing path into cross-platform mobile development. I'm learning Flutter and Dart by building real, small apps - starting with an Employee Salary Calculator - while studying mobile architecture, state management and platform differences.",
      features: ["Flutter & Dart fundamentals", "Android & iOS from one codebase", "Employee Salary Calculator app", "Mobile application architecture", "UI widgets & navigation patterns"],
      tags: ["Flutter", "Dart", "Android", "iOS"],
      note: "Learning project - in progress. This is where my next skill chapter is being written."
    }
  };
  var backdrop = document.getElementById("modalBackdrop");
  var lastFocus = null;
  function openProject(key) {
    var p = PROJECTS[key]; if (!p) return;
    lastFocus = document.activeElement;
    document.getElementById("modalCat").textContent = p.cat;
    document.getElementById("modalTitle").textContent = p.title;
    document.getElementById("modalDesc").textContent = p.desc;
    var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    document.getElementById("modalList").innerHTML = p.features.map(function (f) { return "<li>" + check + "<span>" + f + "</span></li>"; }).join("");
    document.getElementById("modalTags").innerHTML = p.tags.map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("");
    document.getElementById("modalNote").textContent = p.note;
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    document.getElementById("modalClose").focus();
  }
  function closeProject() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll("[data-open]").forEach(function (btn) {
    btn.addEventListener("click", function () { openProject(btn.getAttribute("data-open")); });
  });
  document.getElementById("modalClose").addEventListener("click", closeProject);
  backdrop.addEventListener("click", function (e) { if (e.target === backdrop) closeProject(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeProject(); mobileMenu.classList.remove("open"); } });

  /* Contact form */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("fName").value.trim();
    var email = document.getElementById("fEmail").value.trim();
    var subject = document.getElementById("fSubject").value.trim();
    var message = document.getElementById("fMessage").value.trim();
    note.className = "form-note show";
    if (!name || !email || !subject || !message) {
      note.classList.add("err");
      note.textContent = "Please fill in all fields before sending.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.classList.add("err");
      note.textContent = "That email address doesn't look right - please check it.";
      return;
    }
    note.classList.remove("err");
    var body = "Hi,\n\n" + message + "\n\n- " + name + " (" + email + ")";
    window.location.href = "mailto:" + CONTACT.email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    note.textContent = "Opening your email app with the message ready to send…";
  });
})();
