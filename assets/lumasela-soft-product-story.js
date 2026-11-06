(() => {
  'use strict';
  function initialize(root) {
    if (root.dataset.lsInitialized) return;
    root.dataset.lsInitialized = 'true';
    const all = selector => [...root.querySelectorAll(selector)];
    const one = selector => root.querySelector(selector);
    const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const hotspots = all('[data-ls-hotspot]');
    const detailPanels = all('[data-ls-detail]');
    function showDetail(value) {
      if (!detailPanels.some(panel => panel.dataset.lsDetail === value)) return;
      hotspots.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lsHotspot === value)));
      detailPanels.forEach(panel => { panel.hidden = panel.dataset.lsDetail !== value; });
    }
    hotspots.forEach(button => {
      if (!detailPanels.some(panel => panel.dataset.lsDetail === button.dataset.lsHotspot)) return;
      button.disabled = false;
      button.addEventListener('click', () => showDetail(button.dataset.lsHotspot));
    });
    if (hotspots.length) showDetail(hotspots[0].dataset.lsHotspot);
    const track = one('[data-ls-life-track]');
    if (track) {
      function scrollTrack(direction) {
        const card = track.querySelector('figure');
        const gap = parseFloat(getComputedStyle(track).gap) || 20;
        const distance = (card?.getBoundingClientRect().width || track.clientWidth * .85) + gap;
        track.scrollBy({ left:direction * distance, behavior:reducedMotion() ? 'auto' : 'smooth' });
      }
      all('[data-ls-scroll]').forEach(button => {
        button.disabled = false;
        button.addEventListener('click', () => scrollTrack(Number(button.dataset.lsScroll)));
      });
      track.addEventListener('keydown', event => {
        if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        scrollTrack(event.key === 'ArrowLeft' ? -1 : 1);
      });
    }
    all('[data-ls-return]').forEach(link => link.addEventListener('click', event => {
      const productRoot = root.closest('[data-lumasela-product]');
      const name = productRoot?.querySelector('[data-name]');
      const target = productRoot?.querySelector('#personalise');
      if (!name || !target) return;
      event.preventDefault();
      target.scrollIntoView({ block:'start', behavior:reducedMotion() ? 'auto' : 'smooth' });
      name.focus({ preventScroll:true });
    }));
  }
  document.querySelectorAll('[data-ls-story]').forEach(initialize);
  document.addEventListener('shopify:section:load', event => {
    if (event.target.matches?.('[data-ls-story]')) initialize(event.target);
    event.target.querySelectorAll('[data-ls-story]').forEach(initialize);
  });
})();
