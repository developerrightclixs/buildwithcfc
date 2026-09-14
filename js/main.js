/* ==========================================================================
   Better Build SC — site behaviour
   Vanilla JS, no dependencies. Each module bails out quietly when the
   markup it needs is not on the current page.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------------------------------------------------------------- header */

  function initHeader() {
    var header = $('.site-header');
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------- mobile drawer -- */

  function initDrawer() {
    var toggle = $('.nav-toggle');
    var drawer = $('.drawer');
    var backdrop = $('.backdrop');
    if (!toggle || !drawer || !backdrop) return;

    var close = $('.drawer-close', drawer);
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      drawer.classList.add('is-open');
      backdrop.classList.add('is-visible');
      toggle.setAttribute('aria-expanded', 'true');
      drawer.removeAttribute('inert');
      document.body.classList.add('is-locked');
      if (close) close.focus();
    }

    function shut() {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-visible');
      toggle.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('inert', '');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    }

    toggle.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? shut() : open();
    });

    backdrop.addEventListener('click', shut);
    if (close) close.addEventListener('click', shut);

    $$('a', drawer).forEach(function (a) { a.addEventListener('click', shut); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) shut();
    });

    // Trap focus inside the open drawer.
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = $$('a[href], button:not([disabled])', drawer);
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    drawer.setAttribute('inert', '');
  }

  /* --------------------------------------------------------- hero slider -- */

  function initHero() {
    var hero = $('.hero');
    if (!hero) return;

    var slides = $$('.hero-slide', hero);
    var panels = $$('.hero-panel', hero);
    var dots = $$('.hero-dots button', hero);
    var prev = $('.hero-prev', hero);
    var next = $('.hero-next', hero);
    var current = $('.hero-count .current', hero);
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;
    var DURATION = 7000;
    hero.style.setProperty('--hero-duration', DURATION + 'ms');

    function show(i) {
      index = (i + slides.length) % slides.length;

      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === index); });
      panels.forEach(function (p, n) { p.classList.toggle('is-active', n === index); });
      dots.forEach(function (d, n) {
        d.setAttribute('aria-selected', n === index ? 'true' : 'false');
        // restart the progress animation
        d.style.animation = 'none';
        void d.offsetWidth;
        d.style.animation = '';
      });
      if (current) current.textContent = String(index + 1).padStart(2, '0');
    }

    function start() {
      if (reduceMotion) return;
      stop();
      timer = setInterval(function () { show(index + 1); }, DURATION);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function go(i) { show(i); start(); }

    if (next) next.addEventListener('click', function () { go(index + 1); });
    if (prev) prev.addEventListener('click', function () { go(index - 1); });

    dots.forEach(function (d, n) {
      d.addEventListener('click', function () { go(n); });
    });

    hero.addEventListener('mouseenter', function () { hero.classList.add('is-paused'); stop(); });
    hero.addEventListener('mouseleave', function () { hero.classList.remove('is-paused'); start(); });

    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    // Keyboard support when the slider region has focus.
    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    });

    // Touch swipe.
    var startX = 0;
    var startY = 0;
    hero.addEventListener('touchstart', function (e) {
      startX = e.changedTouches[0].clientX;
      startY = e.changedTouches[0].clientY;
      stop();
    }, { passive: true });

    hero.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? index + 1 : index - 1);
      else start();
    }, { passive: true });

    show(0);
    start();
  }

  /* ------------------------------------------------------- scroll reveal -- */

  function initReveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    function show(el, delay) {
      if (delay) setTimeout(function () { el.classList.add('is-in'); }, delay);
      else el.classList.add('is-in');
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { show(el, 0); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        show(el, parseInt(el.getAttribute('data-delay') || '0', 10));
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });

    items.forEach(function (el) { io.observe(el); });

    // Fail-safe: anything already on screen after load gets shown even if the
    // observer never delivers. Content must never be left stuck at opacity 0.
    function sweep() {
      var h = window.innerHeight || document.documentElement.clientHeight;
      items.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < h && r.bottom > 0) { show(el, 0); io.unobserve(el); }
      });
    }

    window.addEventListener('load', function () { setTimeout(sweep, 200); });
    setTimeout(sweep, 2500);
  }

  /* ------------------------------------------------------------ counters -- */

  function initCounters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;

    // The count-up plays the first time the numbers scroll into view and then
    // holds. A flag in sessionStorage remembers that it has already played, so
    // scrolling back, reloading, or moving between pages in the same visit
    // shows the final values immediately instead of counting up again.
    var KEY = 'bbsc-counted';
    function hasPlayed() {
      try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
    }
    function markPlayed() {
      try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* storage unavailable */ }
    }

    function finalText(el) {
      return el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    }

    function run(el) {
      if (el.hasAttribute('data-counted')) return;
      el.setAttribute('data-counted', '');

      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var final = finalText(el);
      if (reduceMotion) { el.textContent = final; return; }

      var startedAt = null;
      var dur = 1500;

      function tick(ts) {
        if (!startedAt) startedAt = ts;
        var p = Math.min((ts - startedAt) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = p < 1 ? Math.round(target * eased) + suffix : final;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    // Already played this session: show the final numbers, no animation.
    if (hasPlayed()) {
      nums.forEach(function (el) {
        el.setAttribute('data-counted', '');
        el.textContent = finalText(el);
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      markPlayed();
      nums.forEach(run);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        markPlayed();
        run(entry.target);
      });
    }, { threshold: 0.5 });

    nums.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------- gallery + lightbox --- */

  function initGallery() {
    var grid = $('.gal-grid');
    var lightbox = $('.lightbox');
    if (!grid || !lightbox) return;

    var items = $$('.gal-item', grid);
    var filters = $$('.filters button');
    var stageImg = $('.lightbox-stage img', lightbox);
    var capTitle = $('.lightbox-caption strong', lightbox);
    var capMeta = $('.lightbox-caption span', lightbox);
    var counter = $('.lightbox-index', lightbox);
    var btnClose = $('.lightbox-close', lightbox);
    var btnPrev = $('.lightbox-prev', lightbox);
    var btnNext = $('.lightbox-next', lightbox);

    var visible = items.slice();
    var index = 0;
    var lastFocus = null;

    /* -- filtering -- */
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-filter');
        filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });

        items.forEach(function (item) {
          var match = key === 'all' || item.getAttribute('data-category') === key;
          item.classList.toggle('is-hidden', !match);
        });

        visible = items.filter(function (i) { return !i.classList.contains('is-hidden'); });

        var count = $('.gal-count');
        if (count) count.textContent = visible.length;
      });
    });

    /* -- lightbox -- */
    function render() {
      var item = visible[index];
      if (!item) return;
      stageImg.src = item.getAttribute('data-full');
      stageImg.alt = item.getAttribute('data-title') || '';
      if (capTitle) capTitle.textContent = item.getAttribute('data-title') || '';
      if (capMeta) capMeta.textContent = item.getAttribute('data-meta') || '';
      if (counter) counter.textContent = (index + 1) + ' / ' + visible.length;

      // Nudge the entry animation on each change.
      stageImg.style.animation = 'none';
      void stageImg.offsetWidth;
      stageImg.style.animation = '';
    }

    function open(item) {
      visible = items.filter(function (i) { return !i.classList.contains('is-hidden'); });
      index = visible.indexOf(item);
      if (index < 0) index = 0;
      lastFocus = document.activeElement;
      render();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      if (btnClose) btnClose.focus();
    }

    function shut() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    }

    function step(dir) {
      index = (index + dir + visible.length) % visible.length;
      render();
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () { open(item); });
    });

    if (btnClose) btnClose.addEventListener('click', shut);
    if (btnNext) btnNext.addEventListener('click', function () { step(1); });
    if (btnPrev) btnPrev.addEventListener('click', function () { step(-1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) shut();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') shut();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });

    // Swipe inside the lightbox.
    var sx = 0;
    lightbox.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- form -- */

  function initForm() {
    var form = $('#contact-form');
    if (!form) return;

    var status = $('.form-status', form);

    function fieldOf(input) { return input.closest('.field'); }

    function validate(input) {
      var wrap = fieldOf(input);
      if (!wrap) return true;
      var value = (input.value || '').trim();
      var ok = true;
      var msg = '';

      if (input.hasAttribute('required') && !value) {
        ok = false;
        msg = 'This field is required.';
      } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        ok = false;
        msg = 'Please enter a valid email address.';
      } else if (input.type === 'tel' && value && value.replace(/[^\d]/g, '').length < 7) {
        ok = false;
        msg = 'Please enter a valid phone number.';
      }

      wrap.classList.toggle('has-error', !ok);
      var err = $('.err', wrap);
      if (err) err.textContent = msg;
      return ok;
    }

    var inputs = $$('input, select, textarea', form);

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        var wrap = fieldOf(input);
        if (wrap && wrap.classList.contains('has-error')) validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      inputs.forEach(function (input) { if (!validate(input)) valid = false; });

      if (!valid) {
        var firstBad = $('.field.has-error input, .field.has-error select, .field.has-error textarea', form);
        if (firstBad) firstBad.focus();
        return;
      }

      // No back end on a static site — surface a confirmation and reset.
      // Wire this up to your mail handler (Formspree, Netlify Forms, PHP, etc.).
      if (status) {
        status.classList.add('is-visible');
        status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
      form.reset();
    });
  }

  /* ------------------------------------------------------------- to top -- */

  function initToTop() {
    var btn = $('.to-top');
    if (!btn) return;

    var onScroll = function () {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* --------------------------------------------------------------- misc -- */

  function initYear() {
    $$('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  function initTicker() {
    // Duplicate the ticker contents so the marquee loop is seamless.
    var track = $('.ticker-track');
    if (!track) return;
    var group = $('.ticker-group', track);
    if (!group) return;
    track.appendChild(group.cloneNode(true));
  }

  /* ---------------------------------------------------------------- boot -- */

  function boot() {
    initHeader();
    initDrawer();
    initTicker();
    initHero();
    initReveal();
    initCounters();
    initGallery();
    initForm();
    initToTop();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
