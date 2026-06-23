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

  // Set initial scales for splash elements using direct SVG attributes to ensure cross-browser compatibility
  const splatEl = document.getElementById('organic-splat');
  if (splatEl) {
    splatEl.setAttribute('transform', 'translate(400, 300) scale(0) translate(-400, -300)');
  }

  // Make sure layers are stacked initially
  Object.values(L).forEach(layer => {
    if (layer) anime.set(layer, { translateY: 0, translateX: 0, rotate: 0, scale: 1 });
  });

  /* ── Audio Synthesizer (Zero-Weight Procedural Audio) ──── */
  const AudioSynth = {
    ctx: null,
    init() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    playWhoosh() {
      try {
        this.init();
        const ctx = this.ctx;
        if (!ctx) return;
        
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(100, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);
        filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.2);
        filter.Q.setValueAtTime(2.0, ctx.currentTime);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.3); // 5% volume
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noise.start();
        noise.stop(ctx.currentTime + 1.2);
      } catch(e) { console.log('Audio error:', e); }
    },
    playSplat() {
      try {
        this.init();
        const ctx = this.ctx;
        if (!ctx) return;
        
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.4);
        
        oscGain.gain.setValueAtTime(0.1, ctx.currentTime); // 10% volume
        oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        
        const thudOsc = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thudOsc.type = 'triangle';
        thudOsc.frequency.setValueAtTime(70, ctx.currentTime);
        thudOsc.frequency.linearRampToValueAtTime(15, ctx.currentTime + 0.12);
        thudGain.gain.setValueAtTime(0.18, ctx.currentTime);
        thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        thudOsc.connect(thudGain);
        thudGain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        thudOsc.start();
        thudOsc.stop(ctx.currentTime + 0.12);
      } catch(e) { console.log('Audio error:', e); }
    },
    playTick() {
      try {
        this.init();
        const ctx = this.ctx;
        if (!ctx) return;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2800, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.015, ctx.currentTime); // 1.5% volume
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch(e) { console.log('Audio error:', e); }
    }
  };
  window.AudioSynth = AudioSynth;

  // Add click listener to document to resume audio context if blocked
  document.addEventListener('click', () => AudioSynth.init(), { once: true });

  /* ── Global Sauce Splash Hook ────────────────────────── */
  window.startSauceSplash = function() {
    document.body.style.overflow = 'hidden';

    // Play initial Whoosh sound
    AudioSynth.playWhoosh();

    const splashTimeline = anime.timeline({
      easing: 'easeOutQuad'
    });

    // 1. Bottle enters from top center
    splashTimeline.add({
      targets: '#sauce-bottle-wrapper',
      translateY: ['-240px', '20px'],
      duration: 850,
      easing: 'easeOutBack'
    });

    // 2. Bottle shakes 2-3 times (pressure builds)
    splashTimeline.add({
      targets: '#sauce-bottle',
      rotate: [0, 10, -10, 10, -10, 8, -8, 0],
      duration: 700,
      easing: 'easeInOutQuad'
    }, '+=100');

    // Bottle squeeze compression effect
    splashTimeline.add({
      targets: '#sauce-bottle',
      scaleX: [1, 0.82, 1.05, 1],
      scaleY: [1, 1.1, 0.95, 1],
      duration: 500,
      easing: 'easeOutQuad'
    }, '-=400');

    // 3. Sauce bursts out & Splat impact
    splashTimeline.add({
      targets: '#sauce-burst-stream',
      strokeWidth: [0, 18],
      opacity: [0, 1, 0],
      duration: 300,
      easing: 'easeOutQuad',
      changeBegin: () => {
        // Play Splat sound
        AudioSynth.playSplat();
      }
    }, '+=100');

    // Splat scales up rapidly on impact — covers the full screen
    const splatTarget = { scale: 0 };
    splashTimeline.add({
      targets: splatTarget,
      scale: 4.5,
      duration: 900,
      easing: 'spring(1, 80, 10, 0)',
      update: () => {
        const el = document.getElementById('organic-splat');
        if (el) {
          el.setAttribute('transform', `translate(400, 300) scale(${splatTarget.scale}) translate(-400, -300)`);
        }
      }
    }, '-=200');

    // Bottle exits back off-screen
    splashTimeline.add({
      targets: '#sauce-bottle-wrapper',
      translateY: '-240px',
      duration: 450,
      easing: 'easeInQuad'
    }, '-=350');

    // 4. Entire sauce layer overlay slides off downward to reveal homepage
    splashTimeline.add({
      targets: '#sauce-splash-overlay',
      translateY: ['0vh', '100vh'],
      duration: 1100,
      easing: 'cubicBezier(0.76, 0, 0.24, 1)',
      begin: () => {
        revealHeroContent();
      },
      complete: () => {
        document.body.style.overflow = '';
        const overlay = document.getElementById('sauce-splash-overlay');
        if (overlay) overlay.remove();
        
        // Initialize GSAP Exploding Burger Scroll animation
        initGSAPScrollExploder();
      }
    }, '+=800'); // hold splat for 800ms so it fully registers
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

  /* ── GSAP ScrollTrigger Exploding Burger ────────────────── */
  function initGSAPScrollExploder() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Initial setup: hide HUD elements and reset offsets
    gsap.set(".hud-circle-container", { opacity: 0, scale: 0.85 });
    gsap.set(".hud-label", { opacity: 0, scale: 0.85 });
    
    // Stagger slide positions
    gsap.set(".hud-label.left", { x: -40 });
    gsap.set(".hud-label.right", { x: 40 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "+=130%",
        scrub: 1.2, // smooth scroll scrubbing
        pin: true, // pin the hero section
        anticipatePin: 1
      }
    });

    // 1. Explode burger layers vertically with slight rotation & scaling
    tl.to(L.bunTop, { y: -190, rotate: 6, scale: 1.05, ease: "power1.out" }, 0)
      .to(L.lettuce, { y: -110, rotate: -4, scale: 1.03, ease: "power1.out" }, 0.05)
      .to(L.tomato, { y: -40, rotate: 4, ease: "power1.out" }, 0.1)
      .to(L.cheese, { y: 30, rotate: -2, ease: "power1.out" }, 0.12)
      .to(L.patty, { y: 100, rotate: 2, ease: "power1.out" }, 0.15)
      .to(L.bunBottom, { y: 170, ease: "power1.out" }, 0.18);

    // 2. HUD Rings reveal
    tl.to(".hud-circle-container", { opacity: 0.35, scale: 1.05, ease: "power1.out" }, 0.1);

    // 3. Technical ingredient label text boxes slide-in & fade-in
    tl.to("#hud-label-bun-top", { opacity: 1, x: 0, scale: 1, ease: "back.out(1.2)" }, 0.25)
      .to("#hud-label-lettuce", { opacity: 1, x: 0, scale: 1, ease: "back.out(1.2)" }, 0.3)
      .to("#hud-label-tomato", { opacity: 1, x: 0, scale: 1, ease: "back.out(1.2)" }, 0.35)
      .to("#hud-label-cheese", { opacity: 1, x: 0, scale: 1, ease: "back.out(1.2)" }, 0.4)
      .to("#hud-label-patty", { opacity: 1, x: 0, scale: 1, ease: "back.out(1.2)" }, 0.45)
      .to("#hud-label-bun-bottom", { opacity: 1, x: 0, scale: 1, ease: "back.out(1.2)" }, 0.5);

    // 4. Parallax watermark movement
    tl.to(".hero-bg-watermark", { y: -60, ease: "none" }, 0);
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
