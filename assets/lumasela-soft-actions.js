/* Decorative light tracking only. No click, navigation, form or data handlers. */
(() => {
  'use strict';
  const eligible = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const selector = '.home-button, .product-primary:not(.summary-edit)';
  const disabled = el => el.matches(':disabled, [aria-disabled="true"]');
  let current = null;
  const reset = () => {
    if (current) current.style.removeProperty('--action-light-x');
    current = null;
  };
  document.addEventListener('pointermove', event => {
    if (!eligible.matches || event.pointerType === 'touch') { reset(); return; }
    const action = event.target instanceof Element ? event.target.closest(selector) : null;
    if (!action || disabled(action)) { reset(); return; }
    if (current !== action) { reset(); current = action; }
    const rect = action.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100));
    action.style.setProperty('--action-light-x', `${x.toFixed(1)}%`);
  }, { passive: true });
  document.addEventListener('pointerout', event => {
    if (current && (!(event.relatedTarget instanceof Node) || !current.contains(event.relatedTarget))) reset();
  }, { passive: true });
  window.addEventListener('blur', reset);
  eligible.addEventListener('change', reset);
})();
