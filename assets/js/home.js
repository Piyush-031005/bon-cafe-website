/* ================================================================
   BON CAFÉ — HOME PAGE SPECIFIC JAVASCRIPT
   Handles: GSAP ScrollTrigger parallax, gallery preview hover
   ================================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── GSAP SCROLL TRIGGER PARALLAX ────────────────────────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero content parallax on scroll
    gsap.to('.hero-text-block', {
      y: 80,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    gsap.to('.burger-stage', {
      y: 60,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Section titles pan in on scroll
    gsap.utils.toArray('.section-title').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          }
        }
      );
    });

    // Stagger food cards
    gsap.utils.toArray('.food-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6,
          delay: i * 0.08,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          }
        }
      );
    });

    // Stats counter section
    gsap.fromTo('.stats-grid',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
          once: true,
        }
      }
    );
  }

  // ── GALLERY PREVIEW HOVER EFFECTS ───────────────────────────────
  document.querySelectorAll('.gallery-prev-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const overlay = item.querySelector('.gallery-item-overlay');
      if (overlay) overlay.style.opacity = '1';
    });
    item.addEventListener('mouseleave', () => {
      const overlay = item.querySelector('.gallery-item-overlay');
      if (overlay) overlay.style.opacity = '0';
    });
  });

  // ── FEATURE PILLS STAGGER ───────────────────────────────────────
  const pills = document.querySelectorAll('.feature-pill');
  pills.forEach((pill, i) => {
    pill.style.transitionDelay = `${i * 0.1}s`;
  });

  // ── BIRTHDAY FLOATING EMOJI RANDOM ANIMATION ────────────────────
  document.querySelectorAll('.float-emoji').forEach((emoji, i) => {
    const delay = Math.random() * 2;
    const dur   = 2.5 + Math.random() * 1.5;
    emoji.style.animationDuration  = dur + 's';
    emoji.style.animationDelay     = delay + 's';
  });

});
