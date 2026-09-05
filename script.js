/**
 * EduNova International School – script.js
 * All interactive features for the school portfolio website.
 */

'use strict';

/* ================================================
   1. UTILITY FUNCTIONS
   ================================================ */

/**
 * Select a single DOM element (shorthand for querySelector).
 * @param {string} selector
 * @param {Element} [parent=document]
 */
const $ = (selector, parent = document) => parent.querySelector(selector);

/**
 * Select all matching DOM elements (shorthand for querySelectorAll).
 * @param {string} selector
 * @param {Element} [parent=document]
 */
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/**
 * Wait for the DOM to be fully loaded, then run a callback.
 * @param {Function} fn
 */
const onReady = (fn) => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

/* ================================================
   2. NAVBAR – SCROLL BEHAVIOUR & ACTIVE LINK
   ================================================ */
const initNavbar = () => {
  const navbar    = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  const overlay   = $('#mobileOverlay');
  const allLinks  = $$('.nav-link');
  const sections  = $$('section[id]');

  if (!navbar) return;

  /* --- Scroll: change navbar background --- */
  const handleScroll = () => {
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);

    /* Back-to-top button visibility */
    const backToTop = $('#backToTop');
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }

    /* Active nav link based on scroll position */
    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) currentId = sec.id;
    });

    allLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  /* --- Mobile hamburger menu --- */
  const openMenu = () => {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    overlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  /* Close menu when a nav link is clicked */
  allLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  /* Close menu on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
};


/* ================================================
   4. SMOOTH SCROLLING
   ================================================ */
const initSmoothScroll = () => {
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
};

/* ================================================
   5. SCROLL REVEAL ANIMATIONS
   ================================================ */
const initScrollReveal = () => {
  const items = $$('.reveal-up, .reveal-left, .reveal-right');

  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
};

/* ================================================
   6. ANIMATED STATISTICS COUNTERS
   ================================================ */
const initCounters = () => {
  const counters = $$('.stat-number[data-target]');
  if (!counters.length) return;

  /**
   * Animate a single counter from 0 to target value.
   * @param {HTMLElement} el
   */
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
};

/* ================================================
   7. ACHIEVEMENTS FILTER
   ================================================ */
const initAchievementsFilter = () => {
  const achSection = document.getElementById('achievements');
  if (!achSection) return;

  const btns  = achSection.querySelectorAll('.filter-btn');
  const cards = achSection.querySelectorAll('.ach-card');

  if (!btns.length || !cards.length) return;

  btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Update active state
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const match = (filter === 'all' || card.getAttribute('data-category') === filter);
        if (match) {
          card.classList.remove('hidden');
          card.style.display = ''; // Reset to default CSS display
          card.style.animation = 'none';
          card.offsetHeight; /* trigger reflow */
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
    });
  });
};


/* ================================================
   8. GALLERY FILTER
   ================================================ */
const initGalleryFilter = () => {
  const galSection = $('#gallery');
  if (!galSection) return;

  const btns  = $$('.filter-btn', galSection);
  const items = $$('.gallery-item', galSection);

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      items.forEach((item) => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });
};

/* ================================================
   9. GALLERY LIGHTBOX
   ================================================ */
const initLightbox = () => {
  const lightbox  = $('#lightbox');
  const lbImg     = $('#lightboxImg');
  const lbCaption = $('#lightboxCaption');
  const lbClose   = $('#lightboxClose');
  const lbPrev    = $('#lightboxPrev');
  const lbNext    = $('#lightboxNext');
  const backdrop  = $('#lightboxBackdrop');

  if (!lightbox) return;

  const galleryBtns = $$('.gallery-btn');
  let currentIndex  = 0;
  let visibleBtns   = [];

  /** Return the current list of visible gallery buttons */
  const getVisible = () => $$('.gallery-item:not(.hidden) .gallery-btn');

  /** Open lightbox at a given index */
  const openLightbox = (index) => {
    visibleBtns = getVisible();
    currentIndex = index;
    const btn = visibleBtns[currentIndex];
    if (!btn) return;

    lbImg.src     = btn.dataset.img;
    lbImg.alt     = btn.querySelector('img')?.alt || '';
    lbCaption.textContent = btn.dataset.caption || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    // If opened from gallery modal, reopen it
    const galleryModal = document.getElementById('galleryModal');
    if (lightbox.dataset.fromGalleryModal === 'true' && galleryModal) {
      lightbox.dataset.fromGalleryModal = '';
      galleryModal.classList.add('active');
      galleryModal.setAttribute('aria-hidden', 'false');
      // keep body scroll locked while modal is open
    } else {
      document.body.style.overflow = '';
    }
  };

  const showPrev = () => {
    visibleBtns = getVisible();
    currentIndex = (currentIndex - 1 + visibleBtns.length) % visibleBtns.length;
    const btn = visibleBtns[currentIndex];
    lbImg.src = btn.dataset.img;
    lbImg.alt = btn.querySelector('img')?.alt || '';
    lbCaption.textContent = btn.dataset.caption || '';
  };

  const showNext = () => {
    visibleBtns = getVisible();
    currentIndex = (currentIndex + 1) % visibleBtns.length;
    const btn = visibleBtns[currentIndex];
    lbImg.src = btn.dataset.img;
    lbImg.alt = btn.querySelector('img')?.alt || '';
    lbCaption.textContent = btn.dataset.caption || '';
  };

  /* Attach click events to gallery buttons */
  galleryBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      visibleBtns = getVisible();
      const vIdx = visibleBtns.indexOf(btn);
      openLightbox(vIdx !== -1 ? vIdx : 0);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  /* Keyboard navigation */
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });
};

/* ================================================
   10. TESTIMONIALS TABS + SLIDER
   ================================================ */
const initTestimonials = () => {
  const tabs    = $$('.testi-tab');
  const panels  = $$('.testi-panel');
  const prevBtn = $('#sliderPrev');
  const nextBtn = $('#sliderNext');
  const dotsWrap = $('#sliderDots');

  if (!tabs.length) return;

  let currentTab = 0;

  /** Switch to a tab by index */
  const switchTab = (index) => {
    currentTab = index;
    tabs.forEach((t, i) => {
      t.classList.toggle('active', i === index);
      t.setAttribute('aria-selected', String(i === index));
    });
    panels.forEach((p, i) => {
      p.classList.toggle('active', i === index);
    });
    updateDots();
  };

  /** Build dots */
  const buildDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    tabs.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => switchTab(i));
      dotsWrap.appendChild(dot);
    });
  };

  const updateDots = () => {
    $$('.slider-dot', dotsWrap).forEach((d, i) => {
      d.classList.toggle('active', i === currentTab);
    });
  };

  /* Tab click */
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => switchTab(i));
  });

  /* Prev / Next */
  if (prevBtn) prevBtn.addEventListener('click', () => switchTab((currentTab - 1 + tabs.length) % tabs.length));
  if (nextBtn) nextBtn.addEventListener('click', () => switchTab((currentTab + 1) % tabs.length));

  buildDots();

  /* Auto-advance every 6 seconds */
  let autoplay = setInterval(() => {
    switchTab((currentTab + 1) % tabs.length);
  }, 6000);

  /* Pause autoplay on hover */
  const wrap = $('.testimonial-slider-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(autoplay));
    wrap.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => switchTab((currentTab + 1) % tabs.length), 6000);
    });
  }
};

/* ================================================
   11. CONTACT FORM VALIDATION
   ================================================ */
const initContactForm = () => {
  const form       = $('#contactForm');
  const successMsg = $('#formSuccess');

  if (!form) return;

  /**
   * Show an error message for a field.
   * @param {HTMLElement} field
   * @param {string} message
   */
  const showError = (field, message) => {
    const errorEl = $(`#${field.id}-error`);
    field.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message;
    }
  };

  /**
   * Clear an error for a field.
   * @param {HTMLElement} field
   */
  const clearError = (field) => {
    const errorEl = $(`#${field.id}-error`);
    field.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  };

  /**
   * Validate all form fields.
   * @returns {boolean} isValid
   */
  const validate = () => {
    let isValid = true;

    const name    = $('#contact-name');
    const email   = $('#contact-email');
    const subject = $('#contact-subject');
    const message = $('#contact-message');

    /* Name */
    clearError(name);
    if (!name.value.trim()) {
      showError(name, 'Please enter your full name.');
      isValid = false;
    } else if (name.value.trim().length < 2) {
      showError(name, 'Name must be at least 2 characters long.');
      isValid = false;
    }

    /* Email */
    clearError(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showError(email, 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    /* Subject */
    clearError(subject);
    if (!subject.value) {
      showError(subject, 'Please select a subject.');
      isValid = false;
    }

    /* Message */
    clearError(message);
    if (!message.value.trim()) {
      showError(message, 'Please enter your message.');
      isValid = false;
    } else if (message.value.trim().length < 10) {
      showError(message, 'Message must be at least 10 characters long.');
      isValid = false;
    }

    return isValid;
  };

  /* Live validation: clear errors as user types */
  $$('input, select, textarea', form).forEach((field) => {
    field.addEventListener('input', () => clearError(field));
    field.addEventListener('change', () => clearError(field));
  });

  /* Form submission */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validate()) return;

    /* Simulate form submission */
    const submitBtn = $('#submit-contact');
    const btnText   = $('.btn-text', submitBtn);
    const btnIcon   = $('.btn-icon', submitBtn);

    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending…';
    if (btnIcon) btnIcon.textContent = '⏳';

    setTimeout(() => {
      /* Show success message */
      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.setAttribute('aria-hidden', 'false');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      /* Reset form */
      form.reset();
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message';
      if (btnIcon) btnIcon.textContent = '📤';

      /* Hide success message after 6 seconds */
      setTimeout(() => {
        if (successMsg) {
          successMsg.style.display = 'none';
          successMsg.setAttribute('aria-hidden', 'true');
        }
      }, 6000);
    }, 1500);
  });
};

/* ================================================
   12. BACK TO TOP BUTTON
   ================================================ */
const initBackToTop = () => {
  const btn = $('#backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

/* ================================================
   13. NAVBAR SCROLL — ENSURE LOGO COLOR
        (works together with initNavbar)
   ================================================ */

/* ================================================
   14. MICRO-ANIMATIONS: CARD HOVER PARALLAX
   ================================================ */
const initCardTilt = () => {
  $$('.acad-card, .stat-card, .teacher-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width - 0.5;
      const y      = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX  = y * 6;
      const tiltY  = -x * 6;
      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

/* ================================================
   15. FOOTER CURRENT YEAR (safety)
   ================================================ */
const initFooterYear = () => {
  const year = new Date().getFullYear();
  $$('.footer-bottom p').forEach((el) => {
    el.innerHTML = el.innerHTML.replace('2026', year.toString());
  });
};

/* ================================================
   16. KEYBOARD ACCESSIBILITY ENHANCEMENTS
   ================================================ */
const initA11y = () => {
  /* Allow filter buttons to be activated with Enter/Space */
  $$('.filter-btn, .testi-tab').forEach((btn) => {
    btn.setAttribute('role', 'button');
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
};

/* ================================================
   INIT — RUN ALL FEATURES ON DOM READY
   ================================================ */
onReady(() => {
  initNavbar();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initAchievementsFilter();
  initFanCarousel();
  initLightbox();
  initTestimonials();
  initContactForm();
  initBackToTop();
  initCardTilt();
  initA11y();

  /* Add CSS keyframe for achievement card filter animation */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  console.log('🎓 EduNova International School – All systems initialized!');
});

/* ================================================
   INTRO SPLASH LOGIC
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const introSplash = document.getElementById('intro-splash');
  const enterBtn = document.getElementById('enter-btn');
  
  if (introSplash && enterBtn) {
    enterBtn.addEventListener('click', () => {
      introSplash.classList.add('fade-out');
      document.body.classList.remove('no-scroll');
      
      // Remove element from DOM after transition (1s) to free resources
      setTimeout(() => {
        introSplash.remove();
      }, 1000);
    });
  }
});

/* ================================================
   HERO PARALLAX
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const heroBg = document.querySelector('.hero-parallax-bg');
  
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    });
  }
});

/* ================================================
   INTERACTIVE CAMPUS & TOUR MODE
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const mapPins = document.querySelectorAll('.map-pin');
  const modals = document.querySelectorAll('.map-modal');
  const closeBtns = document.querySelectorAll('.close-modal');
  const tourBtn = document.getElementById('tour-btn');
  const themeDay = document.getElementById('theme-day');
  const themeNight = document.getElementById('theme-night');
  const campusSection = document.getElementById('campus');
  
  let tourInterval = null;
  let currentTourIndex = 0;
  let isTouring = false;

  function closeAllModals() {
    modals.forEach(m => m.classList.remove('show'));
    mapPins.forEach(p => p.classList.remove('tour-active'));
  }

  function openModal(modalId, pinElement) {
    closeAllModals();
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.add('show');
    if(pinElement) pinElement.classList.add('tour-active');
  }

  // Pin Click Events
  mapPins.forEach(pin => {
    pin.addEventListener('click', () => {
      if(isTouring) stopTour();
      openModal(pin.dataset.target, pin);
    });
  });

  // Close Modals
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.parentElement.classList.remove('show');
      mapPins.forEach(p => p.classList.remove('tour-active'));
    });
  });

  // Tour Mode
  function startTour() {
    isTouring = true;
    tourBtn.innerHTML = '🛑 STOP TOUR';
    tourBtn.classList.replace('btn-outline', 'btn-primary');
    
    // Smooth scroll to campus section
    campusSection.scrollIntoView({ behavior: 'smooth' });

    function nextTourStep() {
      if(!isTouring) return;
      if(currentTourIndex >= mapPins.length) currentTourIndex = 0; // loop
      
      const pin = mapPins[currentTourIndex];
      openModal(pin.dataset.target, pin);
      
      currentTourIndex++;
      tourInterval = setTimeout(nextTourStep, 3500);
    }
    
    currentTourIndex = 0;
    nextTourStep();
  }

  function stopTour() {
    isTouring = false;
    clearTimeout(tourInterval);
    tourBtn.innerHTML = '🚀 START CAMPUS TOUR';
    tourBtn.classList.replace('btn-primary', 'btn-outline');
    closeAllModals();
  }

  if (tourBtn) {
    tourBtn.addEventListener('click', () => {
      if(isTouring) { stopTour(); } else { startTour(); }
    });
  }

  // Day/Night Toggle
  if(themeDay && themeNight && campusSection) {
    themeDay.addEventListener('click', () => {
      themeDay.classList.add('active');
      themeNight.classList.remove('active');
      campusSection.classList.remove('night-mode');
    });
    
    themeNight.addEventListener('click', () => {
      themeNight.classList.add('active');
      themeDay.classList.remove('active');
      campusSection.classList.add('night-mode');
    });
  }
});

/* ================================================
   FAN CAROUSEL GALLERY
   ================================================ */
const initFanCarousel = () => {
  const carousel = document.getElementById('fanCarousel');
  if (!carousel) return;

  const cards = Array.from(carousel.querySelectorAll('.fan-card'));
  const prevBtn = document.getElementById('fanPrev');
  const nextBtn = document.getElementById('fanNext');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  let activeIndex = cards.findIndex(c => c.classList.contains('active'));
  if (activeIndex < 0) activeIndex = Math.floor(cards.length / 2);

  const positionCards = () => {
    const total = cards.length;
    cards.forEach((card, i) => {
      const offset = i - activeIndex;
      const absOffset = Math.abs(offset);
      const maxVisible = 3;

      if (absOffset > maxVisible) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.zIndex = '0';
        return;
      }

      const rotateY = offset * 35;
      const translateX = offset * 160;
      const translateZ = -absOffset * 80;
      const scale = offset === 0 ? 1.1 : Math.max(0.65, 1 - absOffset * 0.12);
      const opacity = Math.max(0.3, 1 - absOffset * 0.2);

      card.style.transform = `translateX(${translateX}px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = 10 - absOffset;
      card.style.pointerEvents = 'auto';

      card.classList.toggle('active', offset === 0);
    });
  };

  const goTo = (idx) => {
    activeIndex = (idx + cards.length) % cards.length;
    positionCards();
  };

  // Click on card to activate or open lightbox
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (i === activeIndex) {
        // Open lightbox
        if (lightbox && lightboxImg) {
          lightboxImg.src = card.dataset.img || card.querySelector('img').src;
          if (lightboxCaption) lightboxCaption.textContent = card.dataset.caption || '';
          lightbox.classList.add('active');
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      } else {
        goTo(i);
      }
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(activeIndex + 1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('gallery')) return;
    if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
    if (e.key === 'ArrowRight') goTo(activeIndex + 1);
  });

  positionCards();
};

/* ================================================
   FULL-SCREEN GALLERY MODAL
   ================================================ */
(function() {
  const openBtn = document.querySelector('.gallery-strip-btn');
  const modal   = document.getElementById('galleryModal');
  const closeBtn = document.getElementById('galleryModalClose');

  if (!openBtn || !modal) return;

  const open = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  };

  const close = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    openBtn.focus();
  };

  openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });

  // Click on a photo in the modal → open in lightbox
  const grid = modal.querySelector('.gallery-modal-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  if (grid && lightbox && lightboxImg) {
    grid.querySelectorAll('.gm-card').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const caption = card.querySelector('p');
        lightboxImg.src = img ? img.src.replace('w=700', 'w=1200') : '';
        if (lightboxCaption) lightboxCaption.textContent = caption ? caption.textContent : '';
        // Mark that lightbox was opened from gallery modal
        lightbox.dataset.fromGalleryModal = 'true';
        close(); // close the gallery modal
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
  }

})();



/* ================================================
   SCROLL ANIMATION OBSERVER
   ================================================ */
(function() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
})();

/* ================================================
   MOBILE MENU TOGGLE
   ================================================ */
(function() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });
  }
})();


