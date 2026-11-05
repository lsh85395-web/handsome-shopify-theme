(() => {
  'use strict';
  function initialize(root) {
    if (root.dataset.lsInitialized) return;
    root.dataset.lsInitialized = 'true';
    const all = selector => [...root.querySelectorAll(selector)];
    const one = selector => root.querySelector(selector);
    const sample = one('[data-ls-sample-name]');
    all('[data-ls-sample]').forEach(button => {
      button.disabled = false;
      button.addEventListener('click', () => {
        const group = button.dataset.lsSample;
        const value = button.dataset.lsValue;
        all('[data-ls-sample]').filter(node => node.dataset.lsSample === group).forEach(node => node.setAttribute('aria-pressed', String(node === button)));
        if (group === 'font') sample.className = `ls-sample-name font-${value}`;
        if (group === 'ink') sample.style.color = value;
        if (group === 'placement') sample.dataset.placement = value;
      });
    });
    const hotspots = all('[data-ls-hotspot]');
    const detailPanels = all('[data-ls-detail]');
    function showDetail(index) {
      hotspots.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      detailPanels.forEach((panel, i) => { panel.hidden = i !== index; });
    }
    hotspots.forEach((button, index) => {
      button.disabled = false;
      button.addEventListener('click', () => showDetail(index));
    });
    showDetail(0);
    const tabs = all('[data-ls-tab]');
    const panels = all('[data-ls-step]');
    let currentStep = 0;
    one('[data-ls-tablist]').setAttribute('role', 'tablist');
    function showStep(index, focus = false) {
      currentStep = (index + tabs.length) % tabs.length;
      tabs.forEach((button, i) => {
        button.setAttribute('aria-selected', String(i === currentStep));
        button.tabIndex = i === currentStep ? 0 : -1;
      });
      panels.forEach((panel, i) => { panel.hidden = i !== currentStep; });
      if (focus) tabs[currentStep].focus();
    }
    tabs.forEach((button, index) => {
      button.disabled = false;
      button.setAttribute('role', 'tab');
      button.addEventListener('click', () => showStep(index));
      button.addEventListener('keydown', event => {
        const direction = getComputedStyle(button).direction === 'rtl' ? -1 : 1;
        const target = { ArrowRight:index + direction, ArrowLeft:index - direction, Home:0, End:tabs.length - 1 }[event.key];
        if (target === undefined) return;
        event.preventDefault();
        showStep(target, true);
      });
    });
    panels.forEach(panel => { panel.setAttribute('role', 'tabpanel'); panel.tabIndex = 0; });
    const next = one('[data-ls-step-next]');
    next.disabled = false;
    next.addEventListener('click', () => showStep(currentStep + 1, true));
    showStep(0);
    const track = one('[data-ls-life-track]');
    const scrollButtons = all('[data-ls-scroll]');
    const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    function scrollTrack(direction) {
      const card = track.querySelector('figure');
      const gap = parseFloat(getComputedStyle(track).gap) || 20;
      const distance = (card?.getBoundingClientRect().width || track.clientWidth * .85) + gap;
      track.scrollBy({ left:direction * distance, behavior:reducedMotion() ? 'auto' : 'smooth' });
    }
    scrollButtons.forEach(button => {
      button.disabled = false;
      button.addEventListener('click', () => scrollTrack(Number(button.dataset.lsScroll)));
    });
    track.addEventListener('keydown', event => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      scrollTrack(event.key === 'ArrowLeft' ? -1 : 1);
    });
    one('[data-ls-return]').addEventListener('click', event => {
      const productRoot = root.closest('[data-lumasela-product]');
      const name = productRoot?.querySelector('[data-name]');
      const target = productRoot?.querySelector('#personalise');
      if (!name || !target) return;
      event.preventDefault();
      target.scrollIntoView({ block:'start', behavior:reducedMotion() ? 'auto' : 'smooth' });
      name.focus({ preventScroll:true });
    });
  }
  document.querySelectorAll('[data-ls-story]').forEach(initialize);
  document.addEventListener('shopify:section:load', event => event.target.querySelectorAll('[data-ls-story]').forEach(initialize));
})();
