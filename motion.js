/* =========================================================
   Tread Health — motion.js
   ---------------------------------------------------------
   Small and dependency-free. It does two things:
     1. "Pop in" card groups the first time they scroll into view.
     2. Count numbers up (e.g. 120K+) the first time they appear.
   Everything is visible by default. If this file fails to load,
   or the visitor has "reduce motion" turned on, the page simply
   shows up fully built with no animation.
   The hero's page-load animation and all hover effects are pure
   CSS in theme.css, so they don't depend on this file.
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var root = document.documentElement;
  root.classList.add('motion-on');

  /* 1. Pick what should pop in. Add the class "reveal" to any element
        in the HTML to opt it in, or add a container selector below to
        pop in all of its children one after another. */
  var GROUPS = [
    '.quick-actions__grid',
    '.specialty-grid',
    '.stats-grid',
    '.doc-strip',
    '.doctor-grid',
    '.location-grid',
    '.content-grid',
    '.treat-grid',
    '.hub-grid',
    '.story-grid',
    '.insurer-grid',
    '.role-grid',
    '.team-strip',
    '.where-list',
    '.note-wall',
    '.fact-cards',
    '.mini-grid',
    '.steps',
    '.values-grid'
  ];

  GROUPS.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.classList.add('reveal');
        child.style.setProperty('--i', (i * 0.08).toFixed(2) + 's');
      });
    });
  });

  var targets = document.querySelectorAll('.reveal');
  var counters = document.querySelectorAll('[data-count]');

  /* Very old browsers: skip the effect, show everything. */
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(function (el) { revealObserver.observe(el); });

  /* 2. Count-ups. Markup: <span data-count="120" data-suffix="K+">120K+</span>
        Optional: data-decimals="1" for numbers like 4.9 */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1200;
    var start = null;

    function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      runCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  counters.forEach(function (el) { counterObserver.observe(el); });
})();
