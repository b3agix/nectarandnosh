// Scroll-scrubbed hero film: scroll position drives video time.
(function () {
  var video = document.getElementById('heroFilm');
  if (!video) return;
  var track = document.querySelector('.hero-track');
  var startOv = document.querySelector('.ho-start');
  var endOv = document.querySelector('.ho-end');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    // Poster only, both overlays static and readable.
    endOv.style.opacity = 1;
    endOv.style.display = 'none';
    return;
  }

  // Blob-load: guarantees seekability regardless of host byte-range support.
  fetch('assets/vid/hero.mp4')
    .then(function (r) { return r.blob(); })
    .then(function (b) {
      video.src = URL.createObjectURL(b);
      video.load();
    });

  var duration = 0;
  video.addEventListener('loadedmetadata', function () { duration = video.duration; });
  // iOS: a muted video that never played won't paint seeked frames.
  var primed = false;
  function prime() {
    if (primed) return;
    primed = true;
    var p = video.play();
    if (p && p.then) p.then(function () { video.pause(); }).catch(function () { primed = false; });
  }
  window.addEventListener('touchstart', prime, { once: true, passive: true });

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
      var rect = track.getBoundingClientRect();
      var total = track.offsetHeight - window.innerHeight;
      var progress = Math.min(Math.max(-rect.top / total, 0), 1);
      if (duration) {
        target = progress * (duration - 0.05);
        apply();
      }
      // overlay choreography
      startOv.style.opacity = Math.max(1 - progress / 0.22, 0);
      endOv.style.opacity = Math.min(Math.max((progress - 0.72) / 0.2, 0), 1);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
