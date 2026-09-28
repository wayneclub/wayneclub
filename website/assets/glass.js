'use strict';
(() => {
  const object = document.querySelector('.glass-object');
  if (!object) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  object.addEventListener('pointermove', event => {
    if (reduce.matches || !pointer.matches) return;
    const r = object.getBoundingClientRect();
    const x = (event.clientX-r.left)/r.width, y = (event.clientY-r.top)/r.height;
    object.style.setProperty('--rx', (8-y*24)+'deg');
    object.style.setProperty('--ry', (-18+x*36)+'deg');
    object.style.setProperty('--gx', x*100+'%');
    object.style.setProperty('--gy', y*100+'%');
  });
  const reset = () => ['--rx','--ry','--gx','--gy'].forEach(key => object.style.removeProperty(key));
  object.addEventListener('pointerleave', reset);
  reduce.addEventListener('change', reset);
  object.addEventListener('click', () => {
    object.dataset.light = String((Number(object.dataset.light || 0)+1)%3);
  });
})();
