// main.js
// FAMEIQ – shared behavior for all pages
// Clean, conflict-free, responsive-safe

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ===============================
     DOM READY HELPER
  =============================== */
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /* ===============================
     PAGE FADE-IN
  =============================== */
  function initPageTransition() {
    document.documentElement.classList.add("page-is-ready");
  }

  /* ===============================
     SCROLL REVEAL
  =============================== */
  function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal-up, .reveal-fade");
    if (!elements.length) return;

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -60px 0px"
        }
      );

      elements.forEach(el => observer.observe(el));
    } else {
      elements.forEach(el => el.classList.add("reveal-visible"));
    }
  }

  

  /* ===============================
     BACKGROUND PARTICLES
  =============================== */
  function initParticles() {
    const canvas = document.getElementById("bgCanvas");
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let lastTime = 0;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count =
  window.innerWidth < 640 ? 38 :     // mobile
  window.innerWidth < 1024 ? 42 :    // tablet
  70;                                // desktop


      particles = Array.from({ length: count }).map(() => ({
        x:
  window.innerWidth / 2 +
  (Math.random() - 0.5) *
    window.innerWidth *
    (window.innerWidth < 640 ? 0.7 : 0.85),

y:
  window.innerHeight / 2 +
  (Math.random() - 0.5) *
    window.innerHeight *
    (window.innerWidth < 640 ? 0.7 : 0.85),

        r:
  window.innerWidth < 640   //radius
    ? Math.random() * 2.2 + 1.0 // mobile
    : window.innerWidth < 1024
    ? Math.random() * 2.2 + 1.0   // tablet
    : Math.random() * 2 + 1.2,  // desktop

     vx:
  (Math.random() - 0.5) *
  (window.innerWidth < 640 ? 0.26 : window.innerWidth < 1024 ? 0.32 : 0.38),

vy:
  (Math.random() - 0.5) *
  (window.innerWidth < 640 ? 0.22 : window.innerWidth < 1024 ? 0.28 : 0.32),

        a: Math.random() * 0.45 + 0.20
      }));
    }

    function render(time) {
      const delta = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
      const speedFactor = window.innerWidth < 640 ? 0.016 : 0.02;

p.x += p.vx * delta * speedFactor;
p.y += p.vy * delta * speedFactor;


        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(render);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(render);
  }

  /* ===============================
     METRIC COUNT UP
  =============================== */
  function initMetricCountUp() {
    const metrics = document.querySelectorAll(".metric-value[data-target]");
    if (!metrics.length) return;

    function animate(el) {
      const target = Number(el.dataset.target);
      if (!target) return;

      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased);

        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }

      requestAnimationFrame(tick);
    }

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animate(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );

      metrics.forEach(el => observer.observe(el));
    } else {
      metrics.forEach(el => (el.textContent = el.dataset.target));
    }
  }

  /* ===============================
     FAQ TOGGLE
  =============================== */
  function initFaq() {
    const items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach(item => {
      item.addEventListener("click", () => {
        item.classList.toggle("is-open");
      });
    });
  }

  /* ===============================
     YELLOW BOX ROLLOUT (AKIO STYLE)
  =============================== */
  function initHighlightRollout() {
    const highlights = document.querySelectorAll(".highlight-inline");
    if (!highlights.length) return;

    if (prefersReducedMotion) {
      highlights.forEach(el => el.classList.add("is-active"));
      return;
    }

    highlights.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("is-active");
      }, 150 + index * 160);
    });
  }

  /* ===============================
     FOOTER YEAR
  =============================== */
  function initFooterYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }




/* =========================================
   ADVANCED WEB — SMOOTH BACK & FORTH LOOP
========================================= */
function initAdvancedWebBubble() {
  const wrapper = document.querySelector(".highlight-rollout");
  if (!wrapper) return;

  const textEl = wrapper.querySelector("span");
  const words = wrapper.dataset.words
    .split(",")
    .map(w => w.trim());

  let index = 0;
  let direction = true; // true = right, false = left

  const INTERVAL = 2600;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    textEl.textContent = words[0];
    return;
  }

  setInterval(() => {
    // text out
    wrapper.classList.add("is-text-out");

    setTimeout(() => {
      index = (index + 1) % words.length;
      textEl.textContent = words[index];

      // bubble direction
      wrapper.classList.toggle("is-right", direction);
      wrapper.classList.toggle("is-left", !direction);
      direction = !direction;

      // text in
      wrapper.classList.remove("is-text-out");
      wrapper.classList.add("is-text-in");

    }, 360);

  }, INTERVAL);
}



/* =========================================
   ADVANCED WEB — PREMIUM BUBBLE WORD ROTATION
========================================= */
function initAdvancedWebBubble() {
  const wrapper = document.querySelector(".highlight-rollout");
  if (!wrapper) return;

  // Ensure inner span exists
  let textEl = wrapper.querySelector(".roll-text");
  if (!textEl) {
    textEl = document.createElement("span");
    textEl.className = "roll-text roll-in";
    textEl.textContent = wrapper.textContent.trim();
    wrapper.textContent = "";
    wrapper.appendChild(textEl);
  }

  const words = wrapper.dataset.words
    .split(",")
    .map(w => w.trim());

  let index = 0;
  let direction = true; // true = LTR, false = RTL
  const INTERVAL = 2600;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    textEl.textContent = words[0];
    return;
  }

  setInterval(() => {
    // TEXT EXIT
    textEl.classList.remove("roll-in");
    textEl.classList.add("roll-out");

    // BUBBLE retreats
    wrapper.style.transformOrigin = direction ? "right center" : "left center";
    wrapper.style.transform = "scaleX(0.92)";

    setTimeout(() => {
      // CHANGE WORD
      index = (index + 1) % words.length;
      textEl.textContent = words[index];

      // SWITCH DIRECTION
      direction = !direction;

      // BUBBLE rolls in opposite direction
      wrapper.style.transformOrigin = direction ? "left center" : "right center";
      wrapper.style.transform = "scaleX(1)";

      // TEXT ENTER
      textEl.classList.remove("roll-out");
      textEl.classList.add("roll-in");
    }, 420);

  }, INTERVAL);
}



// FAB Navigation Toggle
function initFabNav() {
  const container = document.querySelector('.fab-nav-container');
  if (!container) return;
  
  const btn = container.querySelector('.fab-nav-btn');
  
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isOpen);
  });
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFabNav);
} else {
  initFabNav();
}


// ChatGPT-style Plus Menu
(() => {
  const root = document.getElementById("plusMenuRoot");
  const toggle = document.getElementById("plusToggle");

  if (!root || !toggle) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    root.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      root.classList.remove("open");
    }
  });
})();






  /* ===============================
     INIT
  =============================== */
  onReady(() => {
    initPageTransition();
    initScrollReveal();
    initParticles();
    initMetricCountUp();
    initFaq();
    initHighlightRollout();
    initFooterYear();
    initAdvancedWebBubble();

  });

})();
