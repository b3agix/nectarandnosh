// Nectar & Nosh - entrance, reveals, nav state, hero slider
(function () {
  window.addEventListener('load', function () { document.body.classList.add('loaded'); });
  setTimeout(function () { document.body.classList.add('loaded'); }, 1200);

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  var nav = document.getElementById('nav');
  if (nav && !nav.classList.contains('solid')) {
    var navState = function () { nav.classList.toggle('solid', window.scrollY > 24); };
    window.addEventListener('scroll', navState, { passive: true });
    navState();
  }

  // hero slider
  var slider = document.querySelector('.hero-slider');
  if (!slider) return;
  var slides = slider.querySelectorAll('.slide');
  var dots = slider.querySelectorAll('.dot');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var idx = 0, timer = null;

  function goTo(n) {
    idx = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
    dots.forEach(function (d, i) {
      d.classList.toggle('is-active', i === idx);
      i === idx ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current');
    });
  }
  function play() {
    if (reduced || slides.length < 2) return;
    stop();
    timer = setInterval(function () { goTo(idx + 1); }, 6500);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); play(); });
  });

  var x0 = null;
  slider.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { goTo(idx + (dx < 0 ? 1 : -1)); play(); }
    x0 = null;
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : play();
  });
  play();
})();
