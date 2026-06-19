/* ================================================================
   BON CAFÉ — ROOMS PAGE JAVASCRIPT
   ================================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Set min date on date picker
  const dateInput = document.getElementById('room-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // Smooth scroll on room card buttons
  document.querySelectorAll('a[href="#booking-form"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Room booking form submit
  document.getElementById('room-submit')?.addEventListener('click', async () => {
    const name   = document.getElementById('room-name')?.value.trim();
    const phone  = document.getElementById('room-phone')?.value.trim();
    const date   = document.getElementById('room-date')?.value;
    const time   = document.getElementById('room-time')?.value;
    const guests = document.getElementById('room-guests')?.value;
    const room   = document.getElementById('room-type')?.value;
    const event  = document.getElementById('room-event')?.value;
    const notes  = document.getElementById('room-notes')?.value;

    if (!name || !phone || !date || !time || !room) {
      const t = document.getElementById('toast');
      if (t) {
        document.getElementById('toast-title').textContent = '⚠️ Required Fields';
        document.getElementById('toast-msg').textContent = 'Please fill all required fields.';
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3500);
      }
      return;
    }

    try {
      await fetch('http://localhost:3001/api/bookings/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, date, time, guests, room, event, notes, type: 'room', timestamp: new Date().toISOString() }),
      });
    } catch(e) { /* backend may be offline */ }

    // Success feedback
    const btn = document.getElementById('room-submit');
    btn.textContent = '✅ Booking Confirmed! We\'ll call you shortly.';
    btn.style.background = 'linear-gradient(135deg, #2E7D32, #4CAF50)';
    btn.disabled = true;

    // Confetti
    launchMiniConfetti();

    const t = document.getElementById('toast');
    if (t) {
      document.getElementById('toast-title').textContent = '🎉 Room Booked!';
      document.getElementById('toast-msg').textContent = 'We\'ll contact you shortly to confirm.';
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 4000);
    }
  });

  function launchMiniConfetti() {
    const colors = ['#F4722B','#FFD447','#FFF5DC','#C94B1A'];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        width: ${6 + Math.random()*6}px;
        height: ${4 + Math.random()*4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 2px;
        left: ${30 + Math.random()*40}%;
        top: ${40 + Math.random()*20}%;
        z-index: 9999;
        pointer-events: none;
        animation: confettiFall ${2 + Math.random()*2}s linear forwards;
        transform: rotate(${Math.random()*360}deg);
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
  }

  // Animate capacity bars on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.style.width;
        fill.style.width = '0';
        setTimeout(() => { fill.style.width = width; }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.capacity-fill').forEach(el => observer.observe(el));
});
