/**
 * Akash Kumar Yadav — Portfolio  v2
 * script.js
 * ─────────────────────────────────
 * Sections:
 *  1. Theme (dark / light) with localStorage
 *  2. Scroll progress bar
 *  3. Navbar — scroll class + active link highlight
 *  4. Scroll reveal (IntersectionObserver)
 *  5. Hero typing effect
 *  6. Metric counter animation
 *  7. Hamburger / mobile menu
 *  8. Contact form
 *  9. Smooth anchor scroll
 * 10. Subtle card tilt (desktop only)
 */

(function () {
  'use strict';

  /* ═══════════════════════════════
     1. THEME — DARK / LIGHT TOGGLE
  ═══════════════════════════════ */
  const html        = document.documentElement;
  const toggleBtns  = document.querySelectorAll('#themeToggle, #themeToggleMob');
  const THEME_KEY   = 'aky-theme';

  /** Apply a theme: 'dark' | 'light' */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  /** Toggle between dark and light */
  function toggleTheme() {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // Restore saved preference, fall back to dark
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved === 'light' ? 'light' : 'dark');

  toggleBtns.forEach(btn => btn.addEventListener('click', toggleTheme));


  /* ═══════════════════════════════
     2. SCROLL PROGRESS BAR
  ═══════════════════════════════ */
  const progressBar = document.getElementById('scrollProgress');

  function updateProgress() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });


  /* ═══════════════════════════════
     3. NAVBAR
  ═══════════════════════════════ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Add scrolled class for glassmorphism effect
  function handleNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
    highlightActiveLink();
  }

  // Highlight nav link whose section is currently in view
  function highlightActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 3;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      navLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + id) {
          link.classList.toggle('active', scrollMid >= top && scrollMid < bottom);
        }
      });
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();


  /* ═══════════════════════════════
     4. SCROLL REVEAL
  ═══════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.11, rootMargin: '0px 0px -36px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ═══════════════════════════════
     5. HERO TYPING EFFECT
  ═══════════════════════════════ */
  const typedEl  = document.getElementById('typedRole');
  const cursor   = document.querySelector('.type-cursor');
  const phrases  = [
    'Senior Software Engineer',
    '.NET Specialist',
    'Fintech Backend Engineer',
    'ASP.NET · C# · SQL Server',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let typingTimer;

  function typeStep() {
    const phrase = phrases[phraseIdx];

    if (isDeleting) {
      typedEl.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
    } else {
      typedEl.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 40 : 60;

    if (!isDeleting && charIdx === phrase.length) {
      // pause at end of phrase
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      delay = 320;
    }

    typingTimer = setTimeout(typeStep, delay);
  }

  // Start typing after hero animation settles
  setTimeout(typeStep, 1100);


  /* ═══════════════════════════════
     6. METRIC COUNTER ANIMATION
  ═══════════════════════════════ */
  const metricEls = document.querySelectorAll('.metric-num[data-target]');

  /**
   * Animate a single metric element from 0 to its target value.
   * Reads data-target (number) and data-suffix (string).
   */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;

    const duration = 1200; // ms
    const steps    = 48;
    const interval = duration / steps;
    let   step     = 0;

    clearInterval(el._counterTimer);
    el._counterTimer = setInterval(() => {
      step++;
      const value = target * (step / steps);
      el.textContent = (Number.isInteger(target) ? Math.floor(value) : value.toFixed(1)) + suffix;
      if (step >= steps) {
        el.textContent = target + suffix;   // ensure exact final value
        clearInterval(el._counterTimer);
      }
    }, interval);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  metricEls.forEach(el => counterObserver.observe(el));


  /* ═══════════════════════════════
     7. HAMBURGER / MOBILE MENU
  ═══════════════════════════════ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobLinks   = document.querySelectorAll('.mob-link');
  let   menuOpen   = false;

  function openMenu() {
    menuOpen = true;
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Animate → X
    const [s1, , s3] = hamburger.querySelectorAll('span');
    hamburger.querySelectorAll('span')[0].style.transform = 'translateY(7px) rotate(45deg)';
    hamburger.querySelectorAll('span')[1].style.opacity  = '0';
    hamburger.querySelectorAll('span')[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.querySelectorAll('span')[0].style.transform = '';
    hamburger.querySelectorAll('span')[1].style.opacity  = '';
    hamburger.querySelectorAll('span')[2].style.transform = '';
  }

  hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  mobLinks.forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });


  /* ═══════════════════════════════
     8. CONTACT FORM
  ═══════════════════════════════ */
  window.handleFormSubmit = function (e) {
    e.preventDefault();
    const successEl = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    // Simulate async send (replace with real endpoint / EmailJS etc.)
    setTimeout(() => {
      successEl.classList.add('show');
      e.target.reset();
      submitBtn.textContent = 'Send Message →';
      submitBtn.disabled    = false;
      setTimeout(() => successEl.classList.remove('show'), 5000);
    }, 900);
  };


  /* ═══════════════════════════════
     9. SMOOTH ANCHOR SCROLL
  ═══════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 74; // nav height
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });


  /* ═══════════════════════════════
     10. SUBTLE CARD TILT (desktop)
  ═══════════════════════════════ */
  if (window.matchMedia('(hover: hover) and (min-width: 920px)').matches) {
    const tiltCards = document.querySelectorAll('.why-card, .project-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2;  // -1 … 1
        const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;  // -1 … 1
        card.style.transform    = `translateY(-4px) rotateX(${-dy * 2.5}deg) rotateY(${dx * 2.5}deg)`;
        card.style.transition   = 'transform 0.08s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform  = '';
        card.style.transition = 'transform 0.4s ease, border-color 0.28s, box-shadow 0.28s';
      });
    });
  }

})();