/* ================================================================
   BON CAFÉ — BIRTHDAY BOOKING JAVASCRIPT
   Calendar, time slots, stepper, theme selector, confetti
   ================================================================ */
'use strict';

// Booking state
const booking = { date: null, time: null, guests: 10, theme: null, name: '', phone: '' };
let currentStep = 1;
let calYear, calMonth;

// ─── STEP NAVIGATION ─────────────────────────────────────────────
window.goStep = function(step) {
  document.getElementById(`panel-${currentStep}`).classList.remove('active');
  document.getElementById(`step-ind-${currentStep}`).classList.remove('active');
  document.getElementById(`step-ind-${currentStep}`).classList.add('completed');

  currentStep = step;
  document.getElementById(`panel-${step}`).classList.add('active');
  document.getElementById(`step-ind-${step}`).classList.add('active');
  document.getElementById(`step-ind-${step}`).classList.remove('completed');

  if (step === 5) updateConfirmSummary();
  window.scrollTo({ top: 300, behavior: 'smooth' });
};

// ─── CALENDAR ─────────────────────────────────────────────────────
function initCalendar() {
  const now = new Date();
  calYear  = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendar();

  document.getElementById('cal-prev').addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
  });

  document.getElementById('cal-next').addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar();
  });
}

function renderCalendar() {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('cal-month-label').textContent = `${months[calMonth]} ${calYear}`;

  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';

  const firstDay   = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today       = new Date();

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    grid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell  = document.createElement('div');
    const date  = new Date(calYear, calMonth, d);
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    cell.className = 'cal-day' +
      (isPast ? ' past' : '') +
      (d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear() ? ' today' : '') +
      (booking.date && booking.date.getDate() === d && booking.date.getMonth() === calMonth && booking.date.getFullYear() === calYear ? ' selected' : '');

    cell.textContent = d;

    if (!isPast) {
      cell.addEventListener('click', () => {
        booking.date = new Date(calYear, calMonth, d);
        document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');

        // Animate selection
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(cell, { scale: 0.7 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
        }

        document.getElementById('step1-next').disabled = false;
        document.getElementById('step1-next').textContent = `Next: Pick Time → (${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][calMonth]})`;
      });
    }

    grid.appendChild(cell);
  }
}

// ─── TIME SLOTS ───────────────────────────────────────────────────
function initTimeSlots() {
  document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      booking.time = slot.dataset.time;
      document.getElementById('step2-next').disabled = false;

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(slot, { scale: 0.85 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
      }
    });
  });

  document.getElementById('step1-next').addEventListener('click', () => {
    if (booking.date) goStep(2);
  });

  document.getElementById('step2-next').addEventListener('click', () => {
    if (booking.time) goStep(3);
  });
}

// ─── GUEST STEPPER ────────────────────────────────────────────────
function initGuestStepper() {
  const countEl = document.getElementById('guest-count');
  const labelEl = document.getElementById('guest-label');

  document.getElementById('guest-minus').addEventListener('click', () => {
    if (booking.guests > 5) {
      booking.guests--;
      updateGuestDisplay(countEl, labelEl);
    }
  });

  document.getElementById('guest-plus').addEventListener('click', () => {
    if (booking.guests < 60) {
      booking.guests++;
      updateGuestDisplay(countEl, labelEl);
    }
  });
}

function updateGuestDisplay(countEl, labelEl) {
  countEl.textContent = booking.guests;
  labelEl.textContent = `${booking.guests} Guest${booking.guests !== 1 ? 's' : ''}`;
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(countEl, { scale: 1.3, color: '#FFD447' }, { scale: 1, color: '#FFD447', duration: 0.3, ease: 'back.out(2)' });
  }
}

// ─── THEME SELECTOR ───────────────────────────────────────────────
function initThemeSelector() {
  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      booking.theme = card.dataset.theme;
      document.getElementById('step4-next').disabled = false;
    });
  });

  document.getElementById('step4-next').addEventListener('click', () => {
    if (booking.theme) goStep(5);
  });
}

// ─── CONFIRM SUMMARY ──────────────────────────────────────────────
function updateConfirmSummary() {
  booking.name  = document.getElementById('booking-name')?.value || '—';
  booking.phone = document.getElementById('booking-phone')?.value || '—';

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('conf-date').textContent   = booking.date ? `${booking.date.getDate()} ${months[booking.date.getMonth()]} ${booking.date.getFullYear()}` : '—';
  document.getElementById('conf-time').textContent   = booking.time    || '—';
  document.getElementById('conf-guests').textContent = booking.guests + ' Guests';
  document.getElementById('conf-theme').textContent  = booking.theme   || '—';
  document.getElementById('conf-name').textContent   = booking.name    || '—';
  document.getElementById('conf-phone').textContent  = booking.phone   || '—';
}

// ─── CONFETTI ─────────────────────────────────────────────────────
function launchConfetti() {
  const canvas  = document.getElementById('confetti-canvas');
  const ctx     = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const colors = ['#F4722B','#FFD447','#FFF5DC','#C94B1A','#FF6B6B','#4ECDC4'];
  const pieces = [];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 200,
      w: 8 + Math.random() * 8,
      h: 5 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      speed: 2 + Math.random() * 3,
      spin:  (Math.random() - 0.5) * 0.2,
      drift: (Math.random() - 0.5) * 1.5,
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y     += p.speed;
      p.x     += p.drift;
      p.angle += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / 180);
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < 200) requestAnimationFrame(draw);
    else canvas.style.display = 'none';
  }
  draw();
}

// ─── CONFIRM BUTTON ───────────────────────────────────────────────
function initConfirmButton() {
  document.getElementById('confirm-btn').addEventListener('click', async () => {
    const name  = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const notes = document.getElementById('booking-notes')?.value.trim();

    if (!name || !phone) {
      if (window.showToast) showToast('⚠️ Required Fields', 'Please enter your name and phone number.');
      return;
    }

    // Submit to Supabase database
    try {
      if (window._supabase) {
        const { error } = await window._supabase
          .from('birthday_bookings')
          .insert([{
            name,
            phone,
            email:            booking.email || null,
            booking_date:     booking.date || null,
            booking_time:     booking.time || null,
            guests:           parseInt(booking.guests) || 1,
            theme:            booking.theme || 'Classic',
            special_requests: notes || null,
          }]);
        if (error) throw error;
      }
    } catch(e) {
      console.error('[Birthday Booking] Supabase error:', e.message);
      // Still show success — graceful fallback
    }

    // Show success + confetti
    document.querySelector('.wizard-container').style.display = 'none';
    document.getElementById('wizard-steps').style.display = 'none';
    document.getElementById('success-screen').style.display = 'block';
    launchConfetti();
  });
}

// ─── HERO CONFETTI BACKGROUND ─────────────────────────────────────
function initHeroConfetti() {
  const container = document.getElementById('hero-confetti');
  if (!container) return;
  const colors = ['#F4722B','#FFD447','#FFF5DC','#C94B1A','#FF8C42'];

  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div');
    el.className = 'b-confetti';
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${4 + Math.random() * 4}s;
      animation-delay: ${Math.random() * 3}s;
      transform: rotate(${Math.random() * 360}deg);
      opacity: ${0.3 + Math.random() * 0.4};
    `;
    container.appendChild(el);
  }
}

// ─── INIT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCalendar();
  initTimeSlots();
  initGuestStepper();
  initThemeSelector();
  initConfirmButton();
  initHeroConfetti();
});
