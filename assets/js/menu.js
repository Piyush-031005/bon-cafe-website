/* ================================================================
   BON CAFÉ — MENU PAGE JAVASCRIPT
   Tab filtering with smooth fade transitions
   ================================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const tabs     = document.querySelectorAll('.cat-tab');
  const sections = document.querySelectorAll('.menu-category-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.cat;

      sections.forEach(sec => {
        if (cat === 'all' || sec.dataset.category === cat) {
          sec.style.display = 'block';
          sec.style.opacity = '0';
          sec.style.transform = 'translateY(20px)';
          // Animate in
          requestAnimationFrame(() => {
            sec.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            sec.style.opacity = '1';
            sec.style.transform = 'translateY(0)';
          });

          // Scroll to section if single category
          if (cat !== 'all') {
            setTimeout(() => {
              sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });

  // Hover 3D tilt on food cards
  document.querySelectorAll('.food-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-10px) perspective(600px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Add to order toast
  document.querySelectorAll('.food-card-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.showToast) showToast('🎉 Added!', 'Item noted in your order.');
      btn.style.transform = 'scale(1.5) rotate(90deg)';
      setTimeout(() => { btn.style.transform = ''; }, 350);
    });
  });
});
