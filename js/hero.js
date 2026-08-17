// Nectar & Nosh hero - three modes:
//  mobile (any page): portrait still, gentle ken burns, no scrub, single screen
//  desktop scrub (index): ambient locked-camera clip scrubbed by scroll
//  desktop parallax (parallax.html): still image, subtle scroll parallax
(function () {
  var body = document.body;
  var mode = body.getAttribute('data-hero') || 'scrub';
  var video = document.getElementById('heroFilm');
  var img = document.getElementById('heroImg');
  var track = document.querySelector('.hero-track');
  var stage = document.querySelector('.hero-stage');
  var startOv = document.querySelector('.ho-start');
  var endOv = document.querySelector('.ho-end');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;

  function showImage(src, kenburns) {
    if (video) video.remove();
    img.hidden = false;
    if (src) img.src = src;
    if (kenburns && !reduced) img.classList.add('kenburns');
  }

  if (mobile) {
    body.classList.add('hero-static');
    showImage('assets/img/hero-portrait.jpg', true);
    endOv.remove();
    return;
  }

  if (mode === 'parallax' || reduced) {
    body.classList.add('hero-static');
    showImage('assets/img/hero-arrival.jpg', false);
    endOv.remove();
    if (reduced) return;
    var pTicking = false;
    window.addEventListener('scroll', function () {
      if (pTicking) return;
      pTicking = true;
      requestAnimationFrame(function () {
        pTicking = false;
        var y = window.scrollY;
        if (y < window.innerHeight * 1.4) {
          img.style.transform = 'translateY(' + y * 0.22 + 'px) scale(' + (1 + y * 0.00006) + ')';
        }
      });
    }, { passive: true });
    return;
  }

  // ---- desktop scrub (ambient locked-camera clip) ----
  img.remove();
  fetch('assets/vid/hero.mp4')
    .then(function (r) { return r.blob(); })
    .then(function (b) { video.src = URL.createObjectURL(b); video.load(); });

  var duration = 0;
  video.addEventListener('loadedmetadata', function () { duration = video.duration; });

  var target = 0, seeking = false, pending = false;
  video.addEventListener('seeked', function () {
    seeking = false;
    if (pending) { pending = false; apply(); }
  });
  function apply() {
    if (!duration) return;
    if (seeking) { pending = true; return; }
    seeking = true;
    video.currentTime = target;
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var total = track.offsetHeight - window.innerHeight;
      var progress = Math.min(Math.max(-track.getBoundingClientRect().top / total, 0), 1);
      if (duration) { target = progress * (duration - 0.05); apply(); }
      startOv.style.opacity = Math.max(1 - progress / 0.35, 0);
      endOv.style.opacity = Math.min(Math.max((progress - 0.6) / 0.25, 0), 1);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
