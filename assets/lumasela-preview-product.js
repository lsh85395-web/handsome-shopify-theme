(() => {
  const root = document.querySelector('[data-lumasela-product]');
  if (!root) return;
  const one = (selector) => root.querySelector(selector);
  const all = (selector) => [...root.querySelectorAll(selector)];
  const form = one('#LumaselaPreviewProductForm');
  const errorMessage = one('[data-product-error]');
  const mobileReview = one('[data-mobile-review]');
  const storageKey = `lumasela:design:v1:${root.dataset.productId}`;
  let restoring = false;
  const reportError = (message = '') => {
    if (errorMessage) { errorMessage.textContent = message; errorMessage.hidden = !message; }
  };
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
    all('[data-gallery-src]').forEach((item) => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    galleryMain.src = button.dataset.gallerySrc;
    galleryMain.alt = button.dataset.galleryAlt || button.querySelector('img')?.alt || '';
    previewWrap?.classList.toggle('is-personalisation-preview', button === previewThumb);
    const index = all('[data-gallery-src]').indexOf(button);
    const count = one('[data-gallery-count]');
    if (count) count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(all('[data-gallery-src]').length).padStart(2, '0')}`;
    all('[data-gallery-dot]').forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
      dot.setAttribute('aria-pressed', String(dotIndex === index));
    });
  };
  one('[data-product-gallery]')?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-gallery-src]');
    if (button) selectGallery(button);
  });
  const galleryButtons = all('[data-gallery-src]');
  const moveGallery = (direction) => {
    const index = Math.max(0, galleryButtons.findIndex((button) => button.classList.contains('is-active')));
    selectGallery(galleryButtons[(index + direction + galleryButtons.length) % galleryButtons.length]);
  };
  const dots = one('[data-gallery-dots]');
  galleryButtons.forEach((button, index) => {
    if (!dots) return;
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.dataset.galleryDot = String(index);
    dot.setAttribute('aria-label', button.querySelector('span')?.textContent || button.querySelector('img')?.alt || String(index + 1));
    dot.addEventListener('click', () => selectGallery(button));
    dots.append(dot);
  });
  one('[data-gallery-previous]')?.addEventListener('click', () => moveGallery(-1));
  one('[data-gallery-next]')?.addEventListener('click', () => moveGallery(1));
  previewWrap?.addEventListener('keydown', (event) => {
    if (event.target !== previewWrap || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    moveGallery(event.key === 'ArrowLeft' ? -1 : 1);
  });
  let touchStart;
  previewWrap?.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    touchStart = touch ? { x: touch.clientX, y: touch.clientY } : null;
  }, { passive: true });
  previewWrap?.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    if (!touch || !touchStart) return;
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) moveGallery(dx < 0 ? 1 : -1);
    touchStart = null;
  }, { passive: true });
  if (galleryButtons.length) selectGallery(galleryButtons[0]);
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
  one('.lumasela-comparison-disclosure')?.addEventListener('toggle', () => requestAnimationFrame(fitSignature));
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
  nameInput?.addEventListener('input', () => { nameInput.setCustomValidity(''); nameInput.removeAttribute('aria-invalid'); reportError(); showPreview(); syncName(); });
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
    // Refresh even when this thumbnail was already selected.
    if (previewThumb) selectGallery(previewThumb);
  });
  one('[data-quantity-control]')?.addEventListener('click', (event) => {
    const input = one('[data-qty-input]');
    if (!input) return;
    const value = Math.max(1, parseInt(input.value, 10) || 1);
    if (event.target.closest('[data-qty-minus]')) input.value = String(Math.max(1, value - 1));
    if (event.target.closest('[data-qty-plus]')) input.value = String(value + 1);
  });
  const updateVariant = (showVariantImage = false) => {
    const selected = all('[data-variant-option]').map((group) => active(group)?.dataset.optionValue || '');
    const variant = all('[data-variant-data] option').find((item) => selected.every((value, index) => item.dataset[`option${index + 1}`] === value));
    const summary = one('[data-configuration-summary]');
    if (summary) summary.textContent = selected.filter(Boolean).join(' · ');
    const input = one('[data-variant-id]');
    const button = one('[data-add-to-cart]');
    if (input) input.value = variant?.value || '';
    const available = variant?.dataset.available === 'true';
    if (button) { button.disabled = !available; button.textContent = !variant ? button.dataset.labelUnavailable : available ? button.dataset.labelAdd : button.dataset.labelSoldOut; }
    if (variant) {
      const price = one('[data-product-price]'); if (price) price.textContent = variant.dataset.price;
      const mobilePrice = one('[data-mobile-price]'); if (mobilePrice) mobilePrice.textContent = variant.dataset.price;
      if (showVariantImage && variant.dataset.image && galleryMain && root.dataset.conceptProduct !== 'true') {
        const matchingImage = galleryButtons.find((item) => item.dataset.gallerySrc.split('?')[0] === variant.dataset.image.split('?')[0]);
        if (matchingImage) selectGallery(matchingImage);
        else {
          galleryMain.src = variant.dataset.image;
          all('[data-gallery-src], [data-gallery-dot]').forEach((item) => { item.classList.remove('is-active'); item.setAttribute('aria-pressed', 'false'); });
          const count = one('[data-gallery-count]');
          if (count) count.textContent = '';
        }
        previewWrap?.classList.remove('is-personalisation-preview');
      }
    }
    return { variant, available };
  };
  all('[data-variant-option]').forEach((group) => group.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-option-value]');
    if (button) { activate(group, button); updateVariant(true); reportError(); }
  }));
  const groups = [
    ['[data-inline-style-options]', 'style'],
    ['[data-inline-position-options]', 'position'],
    ['[data-signature-size-options]', 'signatureSize'],
    ['[data-inline-color-options]', 'color'],
    ['[data-phone-colour-options]', 'phoneLabel']
  ];
  const saveDesign = () => {
    if (restoring) return;
    const state = { version: 1, name: nameInput?.value || '', quantity: one('[data-qty-input]')?.value || '1', choices: {}, variants: all('[data-variant-option]').map((group) => active(group)?.dataset.optionValue) };
    groups.forEach(([selector, key]) => { state.choices[key] = active(one(selector))?.dataset[key]; });
    try { sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) {}
  };
  const restoreDesign = () => {
    let saved;
    try { saved = JSON.parse(sessionStorage.getItem(storageKey)); } catch (_) { return; }
    if (!saved || saved.version !== 1 || typeof saved.name !== 'string') return;
    restoring = true;
    if (nameInput) nameInput.value = [...saved.name].slice(0, 20).join('');
    groups.forEach(([selector, key]) => {
      const group = one(selector);
      const button = [...(group?.querySelectorAll('button') || [])].find((item) => item.dataset[key] === saved.choices?.[key]);
      button?.click();
    });
    let staleVariant = false;
    all('[data-variant-option]').forEach((group, index) => {
      const value = saved.variants?.[index];
      if (typeof value !== 'string') return;
      const button = [...group.querySelectorAll('button')].find((item) => item.dataset.optionValue === value);
      if (button) activate(group, button); else staleVariant = true;
    });
    const quantity = one('[data-qty-input]');
    if (quantity) quantity.value = String(Math.max(1, parseInt(saved.quantity, 10) || 1));
    if (staleVariant) reportError(root.dataset.savedOptionsMessage || 'Some saved product options have changed. Review the available options before continuing.');
    restoring = false;
  };
  root.addEventListener('input', saveDesign);
  root.addEventListener('change', saveDesign);
  root.addEventListener('click', (event) => { if (event.target.closest('button')) saveDesign(); });
  form?.addEventListener('submit', (event) => {
    const { variant, available } = updateVariant();
    if (!variant || !available) {
      event.preventDefault();
      reportError(one('[data-add-to-cart]')?.textContent || 'Unavailable');
      one('[data-variant-option] button')?.focus();
      return;
    }
    if (!nameInput?.value.trim()) {
      event.preventDefault();
      const message = nameInput?.dataset.emptyMessage || 'Enter your name or initials.';
      reportError(message);
      nameInput?.setAttribute('aria-invalid', 'true');
      nameInput?.setCustomValidity(message);
      nameInput?.focus();
      nameInput?.reportValidity();
      return;
    }
    const quantity = one('[data-qty-input]');
    if (quantity && (!Number.isInteger(Number(quantity.value)) || Number(quantity.value) < 1)) {
      event.preventDefault(); quantity.focus(); quantity.reportValidity(); return;
    }
    saveDesign();
  });
  const dialog = one('[data-gallery-dialog]');
  const zoomButton = one('[data-gallery-zoom]');
  let oldOverflow = '';
  zoomButton?.addEventListener('click', () => {
    if (!dialog || !previewWrap) return;
    const clone = previewWrap.cloneNode(true);
    clone.querySelector('[data-gallery-zoom]')?.remove();
    clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
    clone.querySelectorAll('[aria-live]').forEach((node) => node.removeAttribute('aria-live'));
    one('[data-gallery-zoom-content]').replaceChildren(clone);
    oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    const sourceZone = previewWrap.querySelector('.signature-safe-zone');
    const cloneZone = clone.querySelector('.signature-safe-zone');
    const signature = cloneZone?.querySelector('[data-signature-live]');
    if (sourceZone && cloneZone && signature) {
      const ratio = cloneZone.clientWidth / sourceZone.clientWidth;
      ['left', 'top', 'fontSize'].forEach((key) => { signature.style[key] = `${parseFloat(signature.style[key]) * ratio}px`; });
    }
  });
  one('[data-gallery-close]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  dialog?.addEventListener('close', () => { document.body.style.overflow = oldOverflow; zoomButton?.focus(); });
  const updateMobileReview = () => {
    if (!mobileReview) return;
    const editing = document.activeElement?.matches('input, textarea, select, [contenteditable="true"]');
    const keyboard = window.visualViewport && window.innerHeight - window.visualViewport.height > 150;
    mobileReview.hidden = Boolean(editing || keyboard);
  };
  document.addEventListener('focusin', updateMobileReview);
  document.addEventListener('focusout', () => requestAnimationFrame(updateMobileReview));
  window.visualViewport?.addEventListener('resize', updateMobileReview);
  restoreDesign();
  window.addEventListener('resize', () => requestAnimationFrame(fitSignature));
  window.addEventListener('scroll', updateSubnav, { passive: true });
  window.addEventListener('resize', updateSubnav);
  updateSubnav();
  syncName();
  updateVariant();
  updateMobileReview();
  document.fonts?.ready.then(() => requestAnimationFrame(fitSignature));
})();
