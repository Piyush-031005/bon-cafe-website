/* ================================================================
   BON CAFÉ — MAIN GLOBAL JAVASCRIPT v2
   Handles: cursor, navbar, scroll reveals, stats counter, toast,
            hamburger menu, page transitions
   NOTE: Three.js particles REMOVED — not needed, was causing
         the "glowy AI-generated" look
   ================================================================ */

'use strict';

// ─── PAGE LOADER ────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.remove();
        if (typeof window.startSauceSplash === 'function') {
          window.startSauceSplash();
        }
      }, 500);
    } else {
      if (typeof window.startSauceSplash === 'function') {
        window.startSauceSplash();
      }
    }
    initAll();
  }, 1000); //snappier initial wait
});

function initAll() {
  initCursor();
  initNavbar();
  initHamburger();
  initScrollReveal();
  initCounters();
  initAddToOrder();
  // No Three.js particles — clean design
}

// ─── CUSTOM CURSOR ───────────────────────────────────────────────
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Hide on touch devices
  if ('ontouchstart' in window) {
    dot.style.display  = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Bigger ring on interactive elements
  const hoverEls = document.querySelectorAll(
    'a, button, .food-card, .cat-tab, .gallery-item, .gallery-prev-item'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width   = '52px';
      ring.style.height  = '52px';
      ring.style.opacity = '0.4';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width   = '32px';
      ring.style.height  = '32px';
      ring.style.opacity = '0.6';
    });
  });
}

// ─── NAVBAR ──────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mark active link
  const links = navbar.querySelectorAll('.nav-links a');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
}

// ─── HAMBURGER MENU ───────────────────────────────────────────────
function initHamburger() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn   = document.getElementById('mobile-close');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function close() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', close);

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', close);
  });

  window.closeMobileMenu = close;
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

// ─── STAT COUNTERS ────────────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.count);
  const suffix   = el.dataset.suffix || '';
  const duration = 2000;
  const start    = Date.now();

  function tick() {
    const elapsed  = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(ease * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  tick();
}

// ─── ADD TO ORDER TOAST ───────────────────────────────────────────
function initAddToOrder() {
  document.querySelectorAll('.food-card-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showToast('Added to Order!', 'Your item has been noted.');
      btn.style.transform = 'scale(1.35) rotate(90deg)';
      btn.style.background = 'var(--gold)';
      setTimeout(() => {
        btn.style.transform = '';
        btn.style.background = '';
      }, 320);
    });
  });
}

function showToast(title, msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const titleEl = toast.querySelector('.toast-title');
  const msgEl   = toast.querySelectorAll('div')[1];
  if (titleEl) titleEl.textContent = '🎉 ' + title;
  if (msgEl)   msgEl.textContent   = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

window.showToast = showToast;

// ─── SUBTLE FOOD CARD TILT ────────────────────────────────────────
// Very gentle 3D depth on hover — no glow, just perspective
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.food-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      /* Max 6deg tilt — subtle, not dramatic */
      card.style.transform = `
        perspective(600px)
        rotateX(${-dy * 4}deg)
        rotateY(${dx  * 4}deg)
        translateY(-6px)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});
