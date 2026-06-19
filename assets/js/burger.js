/* ================================================================
   BON CAFÉ — ANIME.JS CINEMATIC BURGER & SPLASH OVERHAUL
   
   Philosophy: Awwwards-grade conceptual design
   - Sauce Splash Intro: Liquid SVG morphing drippage
   - Jarvis HUD: Concentric technical rings rotating
   - Monospace CAD labels explaining burger anatomy
   - Physical spring-physics dismantle and reassemble loops
   ================================================================ */

'use strict';

(function initCinematicEngine() {

  /* Ensure Anime.js is loaded */
  if (typeof anime === 'undefined') {
    window.addEventListener('load', initCinematicEngine);
    return;
  }

  /* ── Elements ─────────────────────────────────────────── */
  const wrapper      = document.getElementById('burger-wrapper');
  const stage        = document.getElementById('burger-stage');
  const heroTitle    = document.getElementById('hero-title');
  const heroTag      = document.querySelector('.hero-tag');
  const heroTagline  = document.getElementById('hero-tagline');
  const heroSub      = document.querySelector('.hero-sub');
  const heroActions  = document.querySelector('.hero-actions');
  const featurePills = document.querySelector('.feature-pills');

  const hudContainer = document.querySelector('.hud-circle-container');
  const hudLabels    = document.querySelectorAll('.hud-label');

  if (!wrapper || !stage) return;

  /* Layer elements */
  const L = {
    bunTop:    document.getElementById('layer-bun-top'),
    lettuce:   document.getElementById('layer-lettuce'),
    tomato:    document.getElementById('layer-tomato'),
    cheese:    document.getElementById('layer-cheese'),
    patty:     document.getElementById('layer-patty'),
    bunBottom: document.getElementById('layer-bun-bottom'),
  };

  /* SVG morph paths for sauce splash */
  const paths = {
    start: 'M -10 -10 L 1450 -10 L 1450 0 C 1200 0, 900 0, 720 0 C 500 0, 200 0, -10 0 Z',
    drip:  'M -10 -10 L 1450 -10 L 1450 150 C 1300 480, 1150 100, 1050 600 C 920 220, 780 750, 680 320 C 550 650, 420 120, 320 580 C 180 200, 80 700, -10 240 Z',
    cover: 'M -10 -10 L 1450 -10 L 1450 910 C 1200 910, 900 910, 720 910 C 500 910, 200 910, -10 910 Z'
  };

  /* ── Initial Setup States ─────────────────────────────── */
  // Hide all hero text elements before entry reveal
  anime.set([heroTag, heroTitle, heroTagline, heroSub, heroActions, featurePills], {
    opacity: 0,
    translateY: 30
  });

  // Center burger and keep it initially assembled
  anime.set(wrapper, { opacity: 0, scale: 0.95 });

  // Make sure layers are stacked initially
  Object.values(L).forEach(layer => {
    if (layer) anime.set(layer, { translateY: 0, translateX: 0, rotate: 0, scale: 1 });
  });

  /* ── Global Sauce Splash Hook ────────────────────────── */
  window.startSauceSplash = function() {
    document.body.style.overflow = 'hidden';

    const splashTimeline = anime.timeline({
      easing: 'easeOutQuad',
      complete: () => {
        // Once full cover is reached, sweep the overlay down to reveal the page
        anime({
          targets: '#sauce-splash-overlay',
          translateY: '100vh',
          duration: 1000,
          easing: 'cubicBezier(0.76, 0, 0.24, 1)',
          complete: () => {
            document.body.style.overflow = '';
            const overlay = document.getElementById('sauce-splash-overlay');
            if (overlay) overlay.remove();
            
            // Start the main loop after page elements have settled
            setTimeout(startMainDismantleLoop, 800);
          }
        });

        // Staggered reveal of hero content as screen is wiped
        revealHeroContent();
      }
    });

    splashTimeline
      .add({
        targets: '#sauce-path',
        d: [
          { value: paths.start },
          { value: paths.drip }
        ],
        duration: 1100,
        easing: 'easeOutQuint'
      })
      .add({
        targets: '#sauce-path',
        d: [
          { value: paths.cover }
        ],
        duration: 800,
        easing: 'easeInQuad'
      });
  };

  /* ── Reveal Hero Content ──────────────────────────────── */
  function revealHeroContent() {
    // Reveal burger wrapper
    anime({
      targets: wrapper,
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 1000,
      easing: 'easeOutBack'
    });

    // Stagger text lines
    anime({
      targets: [heroTag, heroTitle, heroTagline, heroSub, heroActions, featurePills],
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(120),
      duration: 900,
      easing: 'easeOutQuad'
    });
  }

  /* ── Main Dismantle and Reassemble Loop ───────────────── */
  function startMainDismantleLoop() {
    const loopTimeline = anime.timeline({
      loop: true
    });

    // 1. DISMANTLE STAGE
    loopTimeline
      // Lift top bun high (spring physics)
      .add({
        targets: L.bunTop,
        translateY: -150,
        rotate: 6,
        scale: 1.02,
        duration: 1400,
        easing: 'spring(1, 85, 12, 0)'
      }, 0)
      // Lettuce flutter
      .add({
        targets: L.lettuce,
        translateY: -70,
        translateX: -25,
        rotate: -3,
        scale: 1.04,
        duration: 1300,
        easing: 'spring(1, 80, 11, 0)'
      }, 100)
      // Tomato slide
      .add({
        targets: L.tomato,
        translateY: -20,
        translateX: 20,
        rotate: 4,
        duration: 1200,
        easing: 'spring(1, 80, 11, 0)'
      }, 150)
      // Cheese drip/hover
      .add({
        targets: L.cheese,
        translateY: 20,
        translateX: -10,
        rotate: -2,
        duration: 1200,
        easing: 'spring(1, 75, 10, 0)'
      }, 200)
      // Patty sink
      .add({
        targets: L.patty,
        translateY: 60,
        translateX: 5,
        rotate: 1,
        duration: 1400,
        easing: 'spring(1, 85, 12, 0)'
      }, 250)
      // Bottom bun drop
      .add({
        targets: L.bunBottom,
        translateY: 100,
        duration: 1100,
        easing: 'spring(1, 90, 13, 0)'
      }, 200)
      
      // Reveal Jarvis HUD circles & rotating lines
      .add({
        targets: hudContainer,
        opacity: [0, 1],
        scale: [0.85, 1],
        duration: 800,
        easing: 'easeOutQuad'
      }, 100)

      // Stagger reveal CAD technical labels
      .add({
        targets: Array.from(hudLabels),
        opacity: [0, 1],
        scale: [0.9, 1],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutQuad'
      }, 300)

      // Spawn flying spices particle burst
      .add({
        duration: 10,
        changeBegin: () => spawnSpices()
      }, 400)

      // suspended pause hold
      .add({
        duration: 3500 // hang-time duration
      })

      // 2. REASSEMBLE STAGE
      // Hide HUD elements first
      .add({
        targets: Array.from(hudLabels),
        opacity: 0,
        scale: 0.9,
        duration: 400,
        easing: 'easeInQuad'
      })
      .add({
        targets: hudContainer,
        opacity: 0,
        scale: 0.85,
        duration: 500,
        easing: 'easeInQuad'
      }, '-=300')

      // Slam layers back together bottom-to-top with nice spring bounce
      .add({
        targets: [L.bunBottom, L.patty, L.cheese, L.tomato, L.lettuce, L.bunTop],
        translateY: 0,
        translateX: 0,
        rotate: 0,
        scale: 1,
        delay: anime.stagger(100), // stack bottom-up
        duration: 1000,
        easing: 'spring(1, 90, 12, 0)'
      }, '-=200')

      // Pause briefly in assembled state before repeating
      .add({
        duration: 2500
      });
  }

  /* ── Mouse Parallax 3D Perspective Tilt ───────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);

      anime({
        targets: wrapper,
        rotateY: dx * 12,
        rotateX: -dy * 8,
        duration: 600,
        easing: 'easeOutQuad',
        overwrite: true
      });
    });

    stage.addEventListener('mouseleave', () => {
      anime({
        targets: wrapper,
        rotateY: 0,
        rotateX: 0,
        duration: 1000,
        easing: 'easeOutElastic(1, .8)',
        overwrite: true
      });
    });
  }

  /* ── Spice Particles Burst ────────────────────────────── */
  function spawnSpices() {
    const colors = ['#FFD447', '#FF5500', '#FFFDF6', '#F4A460', '#A0522D'];
    const sizes  = [3, 4, 5, 6];

    for (let i = 0; i < 18; i++) {
      const el = document.createElement('div');
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      el.className = 'spice-particle';
      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size * (Math.random() > 0.6 ? 1.6 : 1)}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: 50%;
        top: 50%;
        z-index: 10;
        transform: translate(-50%, -50%);
      `;
      stage.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 160;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 50;
      const rotation = Math.random() * 360;

      anime({
        targets: el,
        translateX: tx,
        translateY: ty,
        rotate: rotation,
        opacity: [1, 0],
        scale: [1, 0.2],
        duration: 1000 + Math.random() * 800,
        easing: 'easeOutExpo',
        complete: () => el.remove()
      });
    }
  }

})();
