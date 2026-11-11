/* Optional reduced effects; game files are still opened directly. */
(() => {
  'use strict';
  const key = 'friv_light_mode';
  let saved;
  try { saved = localStorage.getItem(key); } catch {}
  let light = saved === null || saved === undefined ? Boolean(navigator.connection?.saveData || navigator.deviceMemory <= 4 || navigator.hardwareConcurrency <= 4 || matchMedia('(prefers-reduced-motion: reduce)').matches) : saved === '1';
  const apply = () => {
    document.documentElement.dataset.performance = light ? 'light' : 'normal';
    document.querySelectorAll('[data-light-mode]').forEach(b => { b.setAttribute('aria-pressed', String(light)); b.textContent = `Modo leve: ${light ? 'ligado' : 'desligado'}`; });
  };
  window.FrivPerformance = { get light() { return light; } };
  apply();
  const setup = () => {
    const area = document.querySelector('.discovery-actions, .pn-game-tool-actions, .game-bar');
    if (!area || document.querySelector('[data-light-mode]')) return;
    const button = document.createElement('button'); button.type = 'button'; button.dataset.lightMode = '';
    button.className = 'secondary-button'; button.onclick = () => { light = !light; try { localStorage.setItem(key, light ? '1' : '0'); } catch {} apply(); };
    area.append(button); apply();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, {once:true}); else setup();
})();
