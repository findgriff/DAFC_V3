/* ===================================================
   DARLEY ABBEY FC — script.js
   Minimal, progressive enhancement
   =================================================== */

'use strict';

/* ===== COOKIE BANNER ===== */
(function () {
  const KEY = 'dafc-cookie-ok';
  if (localStorage.getItem(KEY)) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-banner__content">
      <span>We use cookies to improve your experience. By using this site, you agree to our use of cookies.</span>
      <button class="cookie-banner__cta" type="button">OK</button>
    </div>
  `;

  const btn = banner.querySelector('.cookie-banner__cta');
  btn.addEventListener('click', function () {
    localStorage.setItem(KEY, 'true');
    banner.remove();
  });

  document.body.appendChild(banner);
})();

/* ===== STICKY HEADER ===== */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;

  const THRESHOLD = 10;

  function onScroll() {
    if (window.scrollY > THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Use IntersectionObserver for performance if available
  if ('IntersectionObserver' in window) {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:' + (THRESHOLD + 1) + 'px;height:1px;pointer-events:none;';
    document.body.prepend(sentinel);
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    }).observe(sentinel);
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();

/* ===== MOBILE NAV ===== */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !navLinks) return;

  let overlay = null;

  function openNav() {
    if (overlay) overlay.remove();
    navLinks.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Create overlay
    overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = [
      'position:fixed', 'top:var(--header-h)', 'left:0', 'right:0', 'bottom:0',
      'background:rgba(0,0,0,0.25)',
      'z-index:98'
    ].join(';');
    overlay.addEventListener('click', closeNav);
    document.body.appendChild(overlay);
  }

  function closeNav() {
    navLinks.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  toggle.addEventListener('click', function () {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeNav() : openNav();
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
      closeNav();
      toggle.focus();
    }
  });

  // Close on nav link click (mobile)
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (navLinks.classList.contains('is-open')) closeNav();
    });
  });

  // Close on resize to desktop
  const mq = window.matchMedia('(min-width: 769px)');
  function onMqChange(e) {
    if (e.matches && navLinks.classList.contains('is-open')) closeNav();
  }
  if (mq.addEventListener) {
    mq.addEventListener('change', onMqChange);
  } else {
    mq.addListener(onMqChange); // Safari fallback
  }
})();

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

/* ===== CONTACT FORM ===== */
(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const API_URL = 'https://forms.aressentinel.com/submit';
  const API_KEY = '8a3019080f00ea13bd77076152e6ae7bb5c6d2ecb938a9c7';
  const SITE_ID = 'dafc';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    const name = form.querySelector('input[name="name"]')?.value || '';
    const email = form.querySelector('input[name="email"]')?.value || '';
    const topic = form.querySelector('select[name="topic"]')?.value || '';
    const message = form.querySelector('textarea[name="message"]')?.value || '';

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        site_id: SITE_ID,
        name: name,
        email: email,
        topic: topic,
        message: message,
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        btn.textContent = 'Message sent!';
        form.reset();
      })
      .catch(function () {
        btn.textContent = 'Failed — try again';
      })
      .finally(function () {
        setTimeout(function () {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2500);
      });
  });
})();

/* ===== NEWSLETTER FORMS ===== */
(function () {
  document.querySelectorAll('.newsletter-form, .sidebar-newsletter form, form[aria-label="Newsletter signup"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const input = form.querySelector('input[type="email"]');
      const originalText = btn.textContent;

      btn.textContent = 'Subscribing…';
      btn.disabled = true;

      // Replace with your newsletter service (Mailchimp, ConvertKit, etc.)
      setTimeout(function () {
        btn.textContent = 'Subscribed!';
        if (input) input.value = '';
        setTimeout(function () {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 3000);
      }, 800);
    });
  });
})();

/* ===== BLOG CATEGORY FILTER ===== */
(function () {
  const catBtns = document.querySelectorAll('.cat-btn');
  if (!catBtns.length) return;

  catBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      catBtns.forEach(function (b) {
        b.classList.remove('cat-btn--active');
        b.removeAttribute('aria-current');
      });
      this.classList.add('cat-btn--active');
      this.setAttribute('aria-current', 'true');
      // In a real implementation, filter articles here
    });
  });
})();

/* ===== GALLERY DRAG SCROLL ===== */
(function () {
  const track = document.getElementById('gallery-track');
  if (!track) return;

  let isDown = false;
  let startX, scrollLeft;

  track.addEventListener('mousedown', function (e) {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', function () { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup', function () { isDown = false; track.style.cursor = 'grab'; });

  track.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
})();

/* ===== ANIMATE ON SCROLL ===== */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const animatables = document.querySelectorAll(
    '.value-card, .blog-card, .stat-item, .timeline-item, .blog-list-item'
  );

  const style = document.createElement('style');
  style.textContent = `
    .anim-ready {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .anim-ready.anim-visible {
      opacity: 1;
      transform: none;
    }
  `;
  document.head.appendChild(style);

  animatables.forEach(function (el, i) {
    el.classList.add('anim-ready');
    // Stagger delay for grid items
    const delay = (i % 3) * 80;
    el.style.transitionDelay = delay + 'ms';
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  animatables.forEach(function (el) { observer.observe(el); });
})();
