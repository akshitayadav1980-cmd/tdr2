'use strict';

/* ---- Loader ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hidden');
    // trigger hero entry animations
    document.querySelectorAll('.hero-eyebrow,.hero-headline,.hero-desc,.hero-actions')
      .forEach(el => el.classList.add('in'));
  }, 1800);
});

/* ---- Particles ---- */
(function () {
  const c = document.getElementById('particles');
  if (!c) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'ptcl';
    const s = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${s}px;height:${s}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 14 + 8}s;
      animation-delay:${Math.random() * 12}s;
      opacity:${Math.random() * 0.5 + 0.15};
    `;
    c.appendChild(p);
  }
})();

/* ---- Header scroll + spy ---- */
const header = document.getElementById('header');
const goTop  = document.getElementById('goTop');
const navLks = document.querySelectorAll('.nav-link');
const sects  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 50);
  goTop?.classList.toggle('show', y > 400);

  let cur = '';
  sects.forEach(s => { if (y >= s.offsetTop - 130) cur = s.id; });
  navLks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
}, { passive: true });

goTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- Mobile nav ---- */
const hamburger     = document.getElementById('hamburger');
const navLinksEl    = document.getElementById('navLinks');
const mobileOverlay = document.getElementById('mobileOverlay');

function setMenu(open) {
  hamburger.classList.toggle('open', open);
  navLinksEl.classList.toggle('open', open);
  mobileOverlay.classList.toggle('active', open);
  document.body.classList.toggle('lock', open);
}
hamburger?.addEventListener('click', () => setMenu(!hamburger.classList.contains('open')));
mobileOverlay?.addEventListener('click', () => setMenu(false));
navLinksEl?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

/* ---- Smooth scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === '#') {
      e.preventDefault();
      return;
    }
    const t = document.querySelector(href);
    if (t) {
      e.preventDefault();
      window.scrollTo({ top: t.offsetTop - (header?.offsetHeight || 0) - 8, behavior: 'smooth' });
    }
  });
});

/* ---- Reveal on scroll ---- */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ---- Animated counters ---- */
function count(el, target, dur = 2000) {
  let start;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(step); else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(el => count(el, +el.dataset.target));
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
const statsEl = document.getElementById('stats');
if (statsEl) statObs.observe(statsEl);

/* ---- Gallery Filter Tabs ---- */
const galTabs = document.querySelectorAll('.gal-tab');
const allGalItems = [...document.querySelectorAll('.gal-item')];

galTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    galTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    allGalItems.forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ---- Gallery Lightbox ---- */
const items   = [...document.querySelectorAll('.gal-item')];
const lb      = document.getElementById('lightbox');
const lbImg   = document.getElementById('lbImg');
const lbCap   = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');
const lbPrev  = document.getElementById('lbPrev');
const lbNext  = document.getElementById('lbNext');
let cur = 0;

const openLb = i => {
  cur = i;
  lbImg.src = items[i].dataset.src;
  lbImg.alt = items[i].querySelector('img').alt;
  lbCap.textContent = items[i].dataset.caption || '';
  lb.classList.add('active');
  document.body.classList.add('lock');
};
const closeLb = () => { lb.classList.remove('active'); document.body.classList.remove('lock'); };
const navLb = d => {
  const visible = items.filter(i => !i.classList.contains('hidden'));
  if (!visible.length) return;
  const visIdx = visible.indexOf(items[cur]);
  const nextVis = (visIdx + d + visible.length) % visible.length;
  cur = items.indexOf(visible[nextVis]);
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = items[cur].dataset.src;
    lbImg.alt = items[cur].querySelector('img').alt;
    lbCap.textContent = items[cur].dataset.caption || '';
    lbImg.style.opacity = '1';
  }, 180);
};
items.forEach((el, i) => el.addEventListener('click', () => openLb(i)));
lbClose?.addEventListener('click', closeLb);
lbPrev?.addEventListener('click', () => navLb(-1));
lbNext?.addEventListener('click', () => navLb(1));
lb?.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lb?.classList.contains('active')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') navLb(-1);
  if (e.key === 'ArrowRight') navLb(1);
});
let lbTx = 0;
lb?.addEventListener('touchstart', e => lbTx = e.touches[0].clientX, { passive: true });
lb?.addEventListener('touchend', e => { const d = lbTx - e.changedTouches[0].clientX; if (Math.abs(d) > 50) navLb(d > 0 ? 1 : -1); }, { passive: true });

/* ---- Testimonial slider ---- */
const track = document.getElementById('testiTrack');
const dotsEl = document.getElementById('testiDots');
const cards = track ? [...track.querySelectorAll('.testi-card')] : [];
let slide = 0, autoT;

const buildDots = () => cards.forEach((_, i) => {
  const d = document.createElement('button');
  d.className = 't-dot' + (i === 0 ? ' on' : '');
  d.setAttribute('aria-label', `Slide ${i + 1}`);
  d.addEventListener('click', () => go(i));
  dotsEl?.appendChild(d);
});

const go = i => {
  slide = ((i % cards.length) + cards.length) % cards.length;
  if (track) track.style.transform = `translateX(-${slide * 100}%)`;
  document.querySelectorAll('.t-dot').forEach((d, j) => d.classList.toggle('on', j === slide));
};

const startAuto = () => { autoT = setInterval(() => go(slide + 1), 5000); };
const stopAuto  = () => clearInterval(autoT);

if (track && cards.length) {
  buildDots();
  document.getElementById('testiNext')?.addEventListener('click', () => { go(slide + 1); stopAuto(); startAuto(); });
  document.getElementById('testiPrev')?.addEventListener('click', () => { go(slide - 1); stopAuto(); startAuto(); });
  startAuto();
  let tx = 0;
  track.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => { const d = tx - e.changedTouches[0].clientX; if (Math.abs(d) > 40) { go(slide + (d > 0 ? 1 : -1)); stopAuto(); startAuto(); } }, { passive: true });
}


/* ---- Partners Infinite Slider — Touch Swipe Support ---- */
(function () {
  const slider = document.getElementById('partnersSlider');
  const track  = document.getElementById('psliderTrack');
  if (!slider || !track) return;

  let touchStartX = 0;
  let touchStartTime = 0;
  let isDragging = false;
  let dragOffset = 0;
  let animOffset = 0; // current CSS translate X at drag start

  // Get computed translateX from running animation
  function getLiveX() {
    const style = window.getComputedStyle(track);
    const mat   = new DOMMatrix(style.transform);
    return mat.m41;
  }

  // Pause animation and lock position
  function pauseAt(x) {
    track.style.animationPlayState = 'paused';
    track.style.transform = `translateX(${x}px)`;
    track.style.animation = 'none';
  }

  // Resume animation seamlessly from current offset
  function resumeFrom(x) {
    // Calculate how far through the loop we are (0–1)
    const trackW    = track.scrollWidth / 2; // half = one set
    const progress  = ((-x) % trackW) / trackW;
    const remaining = (1 - progress) * 32; // 32s total duration
    track.style.animation = '';
    track.style.transform = `translateX(${x}px)`;
    // Re-apply animation with adjusted duration to avoid jump
    track.style.animation = `pInfiniteScroll ${remaining}s linear 1 forwards`;
    track.addEventListener('animationend', function onEnd() {
      track.removeEventListener('animationend', onEnd);
      track.style.animation = 'pInfiniteScroll 32s linear infinite';
      track.style.transform = '';
    }, { once: true });
  }

  // Touch events
  slider.addEventListener('touchstart', e => {
    touchStartX    = e.touches[0].clientX;
    touchStartTime = Date.now();
    animOffset     = getLiveX();
    pauseAt(animOffset);
    isDragging = true;
  }, { passive: true });

  slider.addEventListener('touchmove', e => {
    if (!isDragging) return;
    dragOffset = e.touches[0].clientX - touchStartX;
    track.style.transform = `translateX(${animOffset + dragOffset}px)`;
  }, { passive: true });

  slider.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    const elapsed = Date.now() - touchStartTime;
    const velocity = dragOffset / elapsed; // px/ms
    // Add momentum nudge
    const finalX = animOffset + dragOffset + (velocity * 120);
    resumeFrom(finalX);
  }, { passive: true });
})();



/* ---- Blog Newsletter Subscription ---- */
(function () {
  const form    = document.getElementById('nlForm');
  const input   = document.getElementById('nlEmail');
  const success = document.getElementById('nlSuccess');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const val = input.value.trim();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(val)) {
      input.style.borderColor = '#ff4d4d';
      input.focus();
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
      return;
    }
    // Show success
    form.querySelector('.nl-input-wrap').style.opacity = '0.4';
    form.querySelector('.nl-input-wrap').style.pointerEvents = 'none';
    success.classList.add('show');
    input.value = '';
  });
})();
