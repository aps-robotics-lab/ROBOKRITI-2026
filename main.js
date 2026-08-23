/* RoboKriti 2026 — global UI, navigation, motion and countdown.
   Shared layer: page-specific scripts remain untouched and are loaded separately. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const finePointer = window.matchMedia?.("(pointer: fine)").matches ?? false;
  document.documentElement.classList.add("js");

  // Mobile menu: accessible, focus-friendly and closed on navigation.
  const menu = $("[data-menu]");
  const mobile = $("[data-mobile-menu]");
  if (menu && mobile) {
    const setMenu = (open) => {
      mobile.classList.toggle("open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", open);
    };
    menu.addEventListener("click", () => setMenu(!mobile.classList.contains("open")));
    $$('a', mobile).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
  }

  // Active navigation item, including GitHub Pages paths.
  const normalize = (path) => {
    const clean = (path || "/").replace(/\/+/g, "/").replace(/\/$/, "") || "/";
    return clean.endsWith("/index.html") ? clean.slice(0, -10) || "/" : clean;
  };
  const current = normalize(location.pathname);
  $$('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || /^https?:/i.test(href)) return;
    try {
      const target = normalize(new URL(href, location.href).pathname);
      if (target === current) anchor.classList.add("active");
    } catch (_) {}
  });

  // Reveal system. Existing .reveal classes remain supported.
  const revealTargets = new Set($$(".reveal"));
  $$("section:not(.hero), .page-hero, .page-content > .container > *, .form-card, .form-section, .success-box, .author-shell, .author-grid > *, .stat-grid > *")
    .forEach((el) => revealTargets.add(el));
  $$(".events-grid, .why-grid, .journey, .team-grid, .rules-grid, .achievement-grid, .cards-3, .info-grid, .field-grid")
    .forEach((el) => el.classList.add("rk-stagger"));
  $$(".rk-stagger").forEach((el) => revealTargets.add(el));

  const show = (el) => el.classList.add("visible", "rk-visible");
  if (!reduced && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach(show);
  }

  // Hero typewriter, only where the marker exists.
  const typeEl = $("[data-type]");
  if (typeEl && !reduced) {
    const lines = [
      "Built to Compete...",
      "Programmed to Win...",
      "Engineered at APS LBS Marg Tinkering Lab..."
    ];
    let line = 0, index = 0, deleting = false;
    const loop = () => {
      const text = lines[line];
      typeEl.textContent = text.slice(0, index);
      if (!deleting) {
        index += 1;
        if (index > text.length) {
          deleting = true;
          window.setTimeout(loop, 1100);
          return;
        }
      } else {
        index -= 1;
        if (index < 0) {
          index = 0;
          deleting = false;
          line = (line + 1) % lines.length;
        }
      }
      window.setTimeout(loop, deleting ? 28 : 52);
    };
    loop();
  }

  // Registration countdown. Use an explicit data target when supplied.
  const countdown = $("[data-countdown], #countdown");
  if (countdown) {
    const targetText = countdown.dataset.countdownTarget || "2026-08-31T23:59:59+05:30";
    const target = Date.parse(targetText);
    const parts = [
      $("[data-days]", countdown),
      $("[data-hours]", countdown),
      $("[data-minutes]", countdown),
      $("[data-seconds]", countdown)
    ];
    const timer = $(".timer", countdown);
    const deadline = $(".deadline", countdown);
    let last = [null, null, null, null];
    let intervalId = 0;

    const close = () => {
      countdown.classList.add("closed");
      if (timer) timer.innerHTML = '<div class="closed-message"><strong>REGISTRATION CLOSED</strong><span>The registration deadline has passed.</span></div>';
      if (deadline) deadline.textContent = "REGISTRATION IS NOW CLOSED";
      if (intervalId) window.clearInterval(intervalId);
    };

    const tick = () => {
      if (!Number.isFinite(target)) {
        console.error("RoboKriti countdown: invalid target", targetText);
        return;
      }
      const remaining = target - Date.now();
      if (remaining <= 0) return close();
      const values = [
        Math.floor(remaining / 86400000),
        Math.floor(remaining / 3600000) % 24,
        Math.floor(remaining / 60000) % 60,
        Math.floor(remaining / 1000) % 60
      ];
      parts.forEach((el, i) => {
        if (!el) return;
        const value = String(values[i]).padStart(2, "0");
        if (last[i] !== value) {
          el.textContent = value;
          const box = el.closest(".time");
          if (box && !reduced) {
            box.classList.remove("tick");
            void box.offsetWidth;
            box.classList.add("tick");
          }
          last[i] = value;
        }
      });
    };
    if (Number.isFinite(target)) {
      tick();
      intervalId = window.setInterval(tick, 250);
    }
  }

  // Scroll progress + smart navigation + top button.
  const nav = $("[data-nav]");
  const progress = document.createElement("div");
  progress.id = "rk-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  const topButton = document.createElement("button");
  topButton.className = "rk-top";
  topButton.type = "button";
  topButton.setAttribute("aria-label", "Back to top");
  topButton.textContent = "↑";
  document.body.appendChild(topButton);
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

  let previousY = window.scrollY;
  let scheduled = false;
  const updateScroll = () => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    progress.style.width = `${Math.min(100, Math.max(0, window.scrollY / max * 100))}%`;
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 18);
      nav.classList.toggle("nav-hidden", !reduced && window.scrollY > 140 && window.scrollY > previousY);
    }
    topButton.classList.toggle("show", window.scrollY > 500);
    previousY = window.scrollY;
    scheduled = false;
  };
  window.addEventListener("scroll", () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateScroll);
    }
  }, { passive: true });
  updateScroll();

  // Desktop pointer halo. No touch impact and disabled for reduced motion.
  if (finePointer && !reduced) {
    const cursor = document.createElement("div");
    cursor.className = "rk-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);
    document.body.classList.add("rk-pointer");
    let x = -100, y = -100, tx = -100, ty = -100;
    const animate = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    window.addEventListener("pointermove", (event) => {
      tx = event.clientX;
      ty = event.clientY;
    }, { passive: true });
    $$('a, button, .event-card, .why-card, .team-card, .rule-card, .achievement-card, .panel, .info-card')
      .forEach((el) => {
        el.addEventListener("mouseenter", () => document.body.classList.add("rk-hover"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("rk-hover"));
      });
    $$(".btn.primary, .nav-cta").forEach((el) => {
      el.addEventListener("pointermove", (event) => {
        const rect = el.getBoundingClientRect();
        const dx = (event.clientX - rect.left - rect.width / 2) * 0.045;
        const dy = (event.clientY - rect.top - rect.height / 2) * 0.045;
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  // Loader never blocks the page indefinitely.
  const loader = $("#rk-loader");
  if (loader) {
    const hide = () => window.setTimeout(() => loader.classList.add("hide"), 140);
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });
    window.setTimeout(() => loader.classList.add("hide"), 2500);
  }

  // Confirmation pages can render the registration/enquiry ID from the URL.
  const params = new URLSearchParams(location.search);
  const ticket = $("#ticket");
  if (ticket) ticket.textContent = params.get("id") || "—";
})();
