(function(){
  // Lenis smooth scroll
  var lenis = new Lenis({ autoRaf: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function(t){ lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);

  // progress + nav
  window.addEventListener('scroll', function(){
    var pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    document.getElementById('sp').style.width = pct + '%';
    document.getElementById('nav').classList.toggle('stuck', window.scrollY > 60);
  }, { passive: true });

  // cursor
  var c = document.getElementById('cur');
  var r = document.getElementById('cur-r');
  var mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', function(e){
    mx = e.clientX; my = e.clientY;
    c.style.left = mx + 'px'; c.style.top = my + 'px';
  });
  (function loop(){
    rx += (mx - rx) * .1; ry += (my - ry) * .1;
    r.style.left = rx + 'px'; r.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button').forEach(function(el){
    el.addEventListener('mouseenter', function(){ document.body.classList.add('ch'); });
    el.addEventListener('mouseleave', function(){ document.body.classList.remove('ch'); });
  });

  // GSAP
  gsap.registerPlugin(ScrollTrigger);

  // hero entry
  window.addEventListener('load', function(){
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('#heyebrow', { opacity: 1, duration: .6, delay: .2 })
      .to('#htitle .wd', { y: 0, duration: 1.05, stagger: .13 }, '<+0.05')
      .to('#hdesc', { opacity: 1, y: 0, duration: .7 }, '<+0.45')
      .to('#hctas', { opacity: 1, y: 0, duration: .6 }, '<+0.15');
  });

  // clip-reveal
  gsap.utils.toArray('.rv').forEach(function(el){
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
      { scrollTrigger: { trigger: el, start: 'top 87%' },
        clipPath: 'inset(0 0% 0 0)', duration: .95, ease: 'power3.inOut' });
  });

  // what items stagger
  gsap.utils.toArray('.what-item').forEach(function(el, i){
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, y: 24, duration: .75, delay: i * .12, ease: 'power3.out'
    });
  });

  // split parallax
  gsap.from('#simg img', {
    scrollTrigger: { trigger: '#simg', start: 'top bottom', end: 'bottom top', scrub: true },
    y: -60, ease: 'none'
  });
  gsap.from('#stxt', {
    x: 30, opacity: 0,
    scrollTrigger: { trigger: '#stxt', start: 'top 85%' },
    duration: .9, delay: .12, ease: 'power3.out'
  });

  // counter
  gsap.utils.toArray('.stat-n[data-count]').forEach(function(el){
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: function(){
        var t = parseInt(el.getAttribute('data-count'));
        var s = el.getAttribute('data-s') || '';
        var obj = { v: 0 };
        gsap.to(obj, {
          v: t, duration: 2, ease: 'power2.out',
          onUpdate: function(){ el.textContent = Math.round(obj.v) + s; }
        });
      }
    });
  });

  // section dots active state
  var dots = document.querySelectorAll('.s-dot');
  dots.forEach(function(dot){
    var sel = dot.getAttribute('data-target');
    var target = document.querySelector(sel);
    if (!target) return;
    ScrollTrigger.create({
      trigger: target, start: 'top 55%', end: 'bottom 45%',
      onToggle: function(self){
        if (self.isActive){
          dots.forEach(function(d){ d.classList.remove('active'); });
          dot.classList.add('active');
        }
      }
    });
    dot.addEventListener('click', function(){ lenis.scrollTo(target, { offset: -40 }); });
  });

  // bg numbers parallax
  gsap.utils.toArray('.bg-num').forEach(function(el){
    gsap.to(el, {
      y: -80, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // ── VIDEO embed lazy (YouTube, autoplay al click) ──
  var vw = document.getElementById('vidwrap');
  if (vw) {
    var playYT = function(){
      if (vw.dataset.loaded === '1') return;
      vw.dataset.loaded = '1';
      var id = vw.dataset.yt;
      vw.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id +
        '?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="Movildrive" ' +
        'allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    };
    vw.addEventListener('click', playYT);
    vw.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playYT(); }
    });
  }
})();
