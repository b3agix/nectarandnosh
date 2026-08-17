// Nectar & Nosh - entrance, reveals, nav state
(function () {
  // hero entrance
  window.addEventListener('load', function () { document.body.classList.add('loaded'); });
  // fallback if load hangs on slow connections
  setTimeout(function () { document.body.classList.add('loaded'); }, 1200);

  // reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // nav shadow after leaving the top
  var nav = document.getElementById('nav');
  function navState() { nav.classList.toggle('solid', window.scrollY > 24); }
  window.addEventListener('scroll', navState, { passive: true });
  navState();
})();
