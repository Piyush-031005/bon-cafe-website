/* ================================================================
   BON CAFÉ — GALLERY JAVASCRIPT
   ================================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── FILTER ────────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.gal-filter-btn');
  const items      = document.querySelectorAll('.gal-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        if (show) {
          item.style.display  = 'block';
          item.style.opacity  = '0';
          item.style.transform = 'scale(0.92)';
          requestAnimationFrame(() => {
            item.style.opacity   = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity   = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 350);
        }
      });
    });
  });

  // ── LIGHTBOX ──────────────────────────────────────────────────
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lightbox-img');
  const lbClose     = document.getElementById('lightbox-close');
  const lbPrev      = document.getElementById('lightbox-prev');
  const lbNext      = document.getElementById('lightbox-next');

  let imageList = [];
  let currentIdx = 0;

  function buildImageList() {
    imageList = [];
    document.querySelectorAll('.gal-item:not([style*="display: none"])').forEach(item => {
      const img   = item.querySelector('img');
      const label = item.querySelector('.gal-label')?.textContent || '';
      if (img) imageList.push({ src: img.src, alt: img.alt, label });
    });
  }

  function openLightbox(idx) {
    buildImageList();
    currentIdx = idx;
    showImage(currentIdx);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showImage(idx) {
    const img = imageList[idx];
    if (!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
  }

  // Click items to open
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      const realImgItems = document.querySelectorAll('.gal-item img');
      if (item.querySelector('img')) openLightbox(i);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  lbPrev.addEventListener('click', () => {
    currentIdx = (currentIdx - 1 + imageList.length) % imageList.length;
    showImage(currentIdx);
  });

  lbNext.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % imageList.length;
    showImage(currentIdx);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  { currentIdx = (currentIdx - 1 + imageList.length) % imageList.length; showImage(currentIdx); }
    if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % imageList.length; showImage(currentIdx); }
  });

  // ── SCROLL REVEAL ─────────────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(item => {
    item.style.opacity   = '0';
    item.style.transform = 'translateY(30px) scale(0.95)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
  });

});
