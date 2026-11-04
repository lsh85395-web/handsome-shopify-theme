(() => {
  const root = document.querySelector('[data-lumasela-product]');
  if (!root) return;
  const one = (selector) => root.querySelector(selector);
  const all = (selector) => [...root.querySelectorAll(selector)];
  const form = one('#LumaselaPreviewProductForm');
  const liveText = all('[data-signature-live]');
  const positioned = all('[data-signature-positioned]');
  const galleryMain = one('[data-gallery-main]');
  const previewThumb = one('[data-personalisation-preview]');
  const previewWrap = one('[data-gallery-main-wrap]');
  const nameInput = one('[data-inline-name-input]');
  const styleNames = ['allura', 'dancing-script', 'great-vibes', 'sacramento', 'kaushan-script', 'knewave'];
  const positions = ['bottom-right-vertical', 'bottom-center', 'below-logo', 'bottom-right-diagonal', 'horizontal-line', 'diagonal-line'];
  const sizes = ['small', 'medium', 'large'];
  const active = (group) => group?.querySelector('.is-active');
  const activate = (group, button) => {
    group.querySelectorAll('button').forEach((item) => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
  };
  const setProperty = (selector, value) => {
    const field = one(selector);
    if (field) field.value = value;
  };
  const selectGallery = (button) => {
    if (!button || !galleryMain) return;
    all('[data-gallery-src]').forEach((item) => item.classList.toggle('is-active', item === button));
    galleryMain.src = button.dataset.gallerySrc;
    galleryMain.alt = button.dataset.galleryAlt || button.querySelector('img')?.alt || '';
    previewWrap?.classList.toggle('is-personalisation-preview', button === previewThumb);
  };
  one('[data-product-gallery]')?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-gallery-src]');
    if (button) selectGallery(button);
  });
  const showPreview = () => { if (previewThumb && !previewThumb.classList.contains('is-active')) selectGallery(previewThumb); };
  const fitSignature = () => {
    const position = active(one('[data-inline-position-options]'))?.dataset.position || 'bottom-center';
    const rotation = position === 'bottom-right-vertical' ? 90 : ['bottom-right-diagonal', 'diagonal-line'].includes(position) ? 18 : 0;
    const angle = rotation * Math.PI / 180;
    liveText.forEach((node) => {
      node.style.setProperty('--signature-fit', '1');
      const zone = node.closest('.signature-safe-zone');
      if (!zone || !zone.clientWidth || !zone.clientHeight) return;
      const style = getComputedStyle(node);
      const coordinate = (raw, length) => raw.endsWith('%') ? parseFloat(raw) * length / 100 : parseFloat(raw);
      const x = coordinate(style.left, zone.clientWidth);
      const y = coordinate(style.top, zone.clientHeight);
      const width = node.offsetWidth;
      const height = node.offsetHeight;
      const rotatedWidth = Math.abs(width * Math.cos(angle)) + Math.abs(height * Math.sin(angle));
      const rotatedHeight = Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle));
      const availableWidth = Math.max(0, 2 * Math.min(x, zone.clientWidth - x) - 8);
      const availableHeight = Math.max(0, 2 * Math.min(y, zone.clientHeight - y) - 8);
      const scale = Math.min(1, availableWidth / Math.max(1, rotatedWidth), availableHeight / Math.max(1, rotatedHeight));
      node.style.setProperty('--signature-fit', Math.max(.08, scale).toFixed(3));
    });
  };
  const syncName = () => {
    if (!nameInput) return;
    const limited = [...nameInput.value].slice(0, 20).join('');
    if (nameInput.value !== limited) nameInput.value = limited;
    const display = limited.trim() || 'Aina';
    liveText.forEach((node) => { node.textContent = display; });
    all('[data-inline-style-options] button span').forEach((node) => { node.textContent = display; });
    const count = one('[data-name-count]');
    if (count) count.textContent = `${[...limited].length} / 20`;
    requestAnimationFrame(fitSignature);
  };
  nameInput?.addEventListener('input', () => { showPreview(); syncName(); });
  one('[data-inline-style-options]')?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-style]');
    if (!button) return;
    activate(event.currentTarget, button);
    showPreview();
    liveText.forEach((node) => { node.classList.remove(...styleNames.map((item) => `signature-${item}`)); node.classList.add(`signature-${button.dataset.style}`); });
    setProperty('[data-property-style]', button.querySelector('small')?.textContent?.trim() || button.dataset.style);
    document.fonts?.ready.then(() => requestAnimationFrame(fitSignature));
  });
  one('[data-inline-position-options]')?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-position]');
    if (!button) return;
    activate(event.currentTarget, button);
    showPreview();
    positioned.forEach((node) => { node.classList.remove(...positions.map((item) => `position-${item}`)); node.classList.add(`position-${button.dataset.position}`); });
    setProperty('[data-property-position]', button.querySelector('small')?.textContent?.trim() || button.dataset.position);
    requestAnimationFrame(fitSignature);
  });
  one('[data-signature-size-options]')?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-signature-size]');
    if (!button) return;
    activate(event.currentTarget, button);
    positioned.forEach((node) => { node.classList.remove(...sizes.map((item) => `signature-size-${item}`)); node.classList.add(`signature-size-${button.dataset.signatureSize}`); });
    setProperty('[data-property-size]', button.querySelector('strong')?.textContent?.trim() || button.dataset.signatureSize);
    requestAnimationFrame(fitSignature);
  });
  one('[data-inline-color-options]')?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-color]');
    if (!button) return;
    activate(event.currentTarget, button);
    liveText.forEach((node) => { node.style.color = button.dataset.color; });
    setProperty('[data-property-colour]', button.getAttribute('aria-label') || button.dataset.color);
    showPreview();
  });
  one('[data-phone-colour-options]')?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-phone-src]');
    if (!button) return;
    activate(event.currentTarget, button);
    const label = button.dataset.phoneLabel;
    all('[data-phone-finish-preview]').forEach((image) => { image.src = button.dataset.phoneSrc; image.alt = `${label} phone beneath a transparent clear case`; });
    all('[data-phone-colour-label]').forEach((node) => { node.textContent = `${label} phone`; });
    if (previewThumb) { previewThumb.dataset.gallerySrc = button.dataset.phoneSrc; previewThumb.dataset.galleryAlt = `${label} phone beneath a transparent clear case`; const image = previewThumb.querySelector('img'); if (image) image.src = button.dataset.phoneSrc; }
    setProperty('[data-property-phone]', label);
    showPreview();
  });
  one('[data-quantity-control]')?.addEventListener('click', (event) => {
    const input = one('[data-qty-input]');
    if (!input) return;
    const value = Math.max(1, parseInt(input.value, 10) || 1);
    if (event.target.closest('[data-qty-minus]')) input.value = String(Math.max(1, value - 1));
    if (event.target.closest('[data-qty-plus]')) input.value = String(value + 1);
  });
  const updateVariant = () => {
    const selected = all('[data-variant-option]').map((group) => active(group)?.dataset.optionValue || '');
    const variant = all('[data-variant-data] option').find((item) => selected.every((value, index) => item.dataset[`option${index + 1}`] === value));
    const input = one('[data-variant-id]');
    const button = one('[data-add-to-cart]');
    if (input) input.value = variant?.value || '';
    const available = variant?.dataset.available === 'true';
    if (button) { button.disabled = !available; button.textContent = !variant ? 'Unavailable' : available ? 'Add to cart' : 'Sold out'; }
    if (variant) { const price = one('[data-product-price]'); if (price) price.textContent = variant.dataset.price; }
  };
  all('[data-variant-option]').forEach((group) => group.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-option-value]');
    if (button) { activate(group, button); updateVariant(); }
  }));
  form?.addEventListener('submit', (event) => {
    updateVariant();
    if (!one('[data-variant-id]')?.value || !nameInput?.value.trim()) event.preventDefault();
  });
  window.addEventListener('resize', () => requestAnimationFrame(fitSignature));
  syncName();
  updateVariant();
  document.fonts?.ready.then(() => requestAnimationFrame(fitSignature));
})();
