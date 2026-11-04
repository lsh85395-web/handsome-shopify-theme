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
  const subnav = one('[data-product-subnav]');
  const productMain = one('[data-product-main]');
  const updateSubnav = () => {
    if (!subnav || !productMain) return;
    const visible = productMain.getBoundingClientRect().bottom <= 0;
    subnav.classList.toggle('is-visible', visible);
    subnav.inert = !visible;
    subnav.setAttribute('aria-hidden', String(!visible));
  };
  const styleNames = ['allura', 'dancing-script', 'great-vibes', 'sacramento', 'kaushan-script', 'knewave'];
  const positions = ['bottom-right-vertical', 'bottom-center', 'below-logo', 'bottom-right-diagonal'];
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
    const size = Number(active(one('[data-signature-size-options]'))?.dataset.sizeMm) || 50;
    const rotation = position === 'bottom-right-vertical' ? -90 : position === 'bottom-right-diagonal' ? -22 : 0;
    const angle = Math.abs(rotation) * Math.PI / 180;
    liveText.forEach((node) => {
      node.style.setProperty('--signature-fit', '1');
      const zone = node.closest('.signature-safe-zone');
      if (!zone || !zone.clientWidth || !zone.clientHeight) return;
      // The four placement anchors stay fixed on the phone image. The 68 mm
      // reference is a visual estimate until a supplier print template exists.
      const width = zone.clientWidth;
      const height = zone.clientHeight;
      node.style.fontSize = `${width * .25}px`;
      const naturalWidth = Math.max(1, node.offsetWidth);
      const naturalHeight = Math.max(1, node.offsetHeight);
      const targetWidth = width * size / 68;
      let scale = targetWidth / naturalWidth;
      const rotatedWidth = naturalWidth * Math.cos(angle) + naturalHeight * Math.sin(angle);
      const rotatedHeight = naturalWidth * Math.sin(angle) + naturalHeight * Math.cos(angle);
      const maxWidth = position === 'bottom-right-diagonal' ? width * .97 : width * .98;
      const maxHeight = position === 'bottom-right-vertical' ? height * .68 : position === 'below-logo' ? height * .46 : height * .53;
      scale = Math.min(scale, maxWidth / rotatedWidth, maxHeight / rotatedHeight);
      const shownWidth = rotatedWidth * scale;
      const shownHeight = rotatedHeight * scale;
      let x = width * .5;
      let y = height * .98 - shownHeight / 2;
      if (position === 'bottom-right-vertical') {
        x = width * .97 - shownWidth / 2;
      } else if (position === 'below-logo') {
        y = height * .46 + shownHeight / 2;
      } else if (position === 'bottom-right-diagonal') {
        x = width * .985 - shownWidth / 2;
        y = height * .96 - shownHeight / 2;
      }
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.setProperty('--signature-fit', Math.max(.001, scale).toFixed(4));
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
    setProperty('[data-property-size]', `${button.querySelector('strong')?.textContent?.trim() || button.dataset.signatureSize} (${button.dataset.sizeMm} mm)`);
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
  window.addEventListener('scroll', updateSubnav, { passive: true });
  window.addEventListener('resize', updateSubnav);
  updateSubnav();
  syncName();
  updateVariant();
  document.fonts?.ready.then(() => requestAnimationFrame(fitSignature));
})();
