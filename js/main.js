// Nectar & Nosh - scroll life: reveals + gentle hero parallax
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // hero jar parallax
  var jar = document.getElementById('heroJar');
  if (jar && !reduced) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          jar.style.transform = 'translateY(' + y * 0.18 + 'px) scale(' + Math.max(1 - y / 4000, 0.92) + ')';
        }
        ticking = false;
      });
    }, { passive: true });
  }
})();
