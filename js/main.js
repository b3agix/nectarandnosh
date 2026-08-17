// Nectar & Nosh - reveals + nav state
(function () {
  // reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // nav turns solid once the film hands off to the shelf
  var nav = document.getElementById('nav');
  var track = document.querySelector('.hero-track');
  if (!nav) return;
  function navState() {
    var threshold = track
      ? track.offsetTop + track.offsetHeight - window.innerHeight * 0.6
      : 40;
    nav.classList.toggle('solid', window.scrollY > threshold);
  }
  window.addEventListener('scroll', navState, { passive: true });
  window.addEventListener('resize', navState);
  navState();
})();
