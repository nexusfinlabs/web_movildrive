(() => {
  'use strict';

  // Ajustes visuales: duración de cada imagen y radio del foco, en píxeles.
  const SETTINGS = {
    slideDuration: 6500,
    spotlightRadius: 340,
    mobileSpotlightRadius: 235,
    cursorSmoothing: 0.11,
  };

  const experience = document.querySelector('#experience');
  const scenes = [...document.querySelectorAll('.scene')];
  const selectors = [...document.querySelectorAll('.slide-selector')];
  const progressBars = selectors.map((selector) => selector.querySelector('.selector-progress'));
  const number = document.querySelector('#scene-number');
  const name = document.querySelector('#scene-name');
  const announcement = document.querySelector('#gallery-announcement');
  const cursor = document.querySelector('#cursor');
  const pause = document.querySelector('#pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(pointer: coarse)');

  let current = 0;
  let elapsed = 0;
  let paused = reducedMotion.matches;
  let exploring = false;
  let touching = false;
  let focusWithinControls = false;
  let lastFrame = 0;
  let frameId = 0;
  let x = innerWidth * 0.5;
  let y = innerHeight * 0.57;
  let targetX = x;
  let targetY = y;
  let ambientTime = 0;
  let sceneRequest = 0;
  const failedImages = new Set();

  function updatePause() {
    experience.classList.toggle('is-paused', paused);
    pause.setAttribute('aria-label', paused ? 'Reanudar carrusel' : 'Pausar carrusel');
    pause.setAttribute('aria-pressed', String(paused));
  }

  async function goTo(index, manual = false) {
    const next = (index + scenes.length) % scenes.length;
    const request = ++sceneRequest;
    const img = scenes[next].querySelector('img');
    try {
      await img.decode();
    } catch {
      failedImages.add(next);
      if (manual) announcement.textContent = 'No se ha podido cargar esta imagen.';
      if (failedImages.size === scenes.length) { paused = true; updatePause(); }
      return;
    }
    if (request !== sceneRequest) return;
    current = next;
    elapsed = 0;
    scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === current));
    selectors.forEach((selector, i) => {
      if (i === current) selector.setAttribute('aria-current', 'true');
      else selector.removeAttribute('aria-current');
      progressBars[i].style.transform = `scaleX(${i === current && paused ? 1 : 0})`;
    });
    number.textContent = String(current + 1).padStart(2, '0');
    name.textContent = scenes[current].dataset.name;
    if (manual) {
      announcement.textContent = `Imagen ${current + 1} de ${scenes.length}: ${scenes[current].dataset.name}. ${scenes[current].dataset.caption}`;
    }
  }

  function adjacent(direction, manual = false) {
    let next = current;
    for (let count = 0; count < scenes.length; count += 1) {
      next = (next + direction + scenes.length) % scenes.length;
      if (!failedImages.has(next)) break;
    }
    goTo(next, manual);
  }

  function resize() {
    const mobile = innerWidth <= 700;
    experience.style.setProperty('--spot-radius', `${mobile ? SETTINGS.mobileSpotlightRadius : SETTINGS.spotlightRadius}px`);
    experience.classList.toggle('is-touch', coarsePointer.matches);
    targetX = Math.min(targetX, innerWidth);
    targetY = Math.min(targetY, innerHeight);
  }

  function updateSpotlight(dt) {
    if (coarsePointer.matches && !touching && !reducedMotion.matches) {
      ambientTime += dt;
      targetX = innerWidth * (0.5 + Math.sin(ambientTime / 4200) * 0.22);
      targetY = innerHeight * (0.51 + Math.cos(ambientTime / 5100) * 0.14);
    }
    const smoothing = reducedMotion.matches ? 1 : 1 - Math.pow(1 - SETTINGS.cursorSmoothing, dt / 16.67);
    x += (targetX - x) * smoothing;
    y += (targetY - y) * smoothing;
    const top = experience.getBoundingClientRect().top;
    experience.style.setProperty('--spot-x', `${x.toFixed(1)}px`);
    experience.style.setProperty('--spot-y', `${(y - top).toFixed(1)}px`);
    cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
  }

  function tick(now) {
    const dt = lastFrame ? Math.min(now - lastFrame, 100) : 16.67;
    lastFrame = now;
    if (!paused && !focusWithinControls) {
      elapsed += dt;
      progressBars[current].style.transform = `scaleX(${Math.min(elapsed / SETTINGS.slideDuration, 1)})`;
      if (elapsed >= SETTINGS.slideDuration) {
        elapsed = 0;
        adjacent(1);
      }
    }
    if (exploring || coarsePointer.matches) updateSpotlight(dt);
    frameId = requestAnimationFrame(tick);
  }

  experience.addEventListener('pointermove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    exploring = true;
    if (event.pointerType === 'touch') touching = true;
    experience.classList.add('is-exploring');
    cursor.classList.toggle('is-over-control', Boolean(event.target.closest('button, a')));
  }, { passive: true });

  experience.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch') return;
    touching = true;
    targetX = event.clientX;
    targetY = event.clientY;
  }, { passive: true });

  function stopTouch() { touching = false; }
  experience.addEventListener('pointerup', stopTouch, { passive: true });
  experience.addEventListener('pointercancel', stopTouch, { passive: true });
  experience.addEventListener('pointerleave', () => {
    exploring = false;
    touching = false;
    experience.classList.remove('is-exploring');
  });

  selectors.forEach((selector) => selector.addEventListener('click', () => goTo(Number(selector.dataset.slide), true)));
  document.querySelector('#previous').addEventListener('click', () => adjacent(-1, true));
  document.querySelector('#next').addEventListener('click', () => adjacent(1, true));
  pause.addEventListener('click', () => {
    paused = !paused;
    updatePause();
  });

  // Detener el avance durante la navegación de los controles con teclado.
  const galleryControls = document.querySelector('.gallery-controls');
  galleryControls.addEventListener('focusin', () => {
    focusWithinControls = galleryControls.matches(':has(:focus-visible)');
  });
  galleryControls.addEventListener('focusout', (event) => {
    if (!galleryControls.contains(event.relatedTarget)) focusWithinControls = false;
  });

  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      adjacent(event.key === 'ArrowRight' ? 1 : -1, true);
    }
  });

  reducedMotion.addEventListener('change', () => {
    paused = reducedMotion.matches;
    updatePause();
  });
  coarsePointer.addEventListener('change', resize);
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(frameId);
    lastFrame = 0;
    if (!document.hidden) frameId = requestAnimationFrame(tick);
  });

  document.querySelector('#year').textContent = new Date().getFullYear();
  scenes[0].classList.add('is-active');
  experience.classList.add('is-ready');
  resize();
  updatePause();
  if (paused) progressBars[0].style.transform = 'scaleX(1)';
  frameId = requestAnimationFrame(tick);
})();
