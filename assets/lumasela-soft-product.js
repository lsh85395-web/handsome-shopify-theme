(() => {
  'use strict';
  const root = document.querySelector('[data-lumasela-product]');
  if (!root) return;
  const $ = selector => root.querySelector(selector);
  const $$ = selector => [...root.querySelectorAll(selector)];
  if (root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';
  const config = JSON.parse(root.querySelector('[data-product-config]').textContent);
  if (String(config.productId) === '15562989830432') {
    config.variants = config.variants.filter(item => !item.options.includes('iPhone Air'));
    config.options = config.options.map(option => ({ ...option, values:option.values.filter(value => value !== 'iPhone Air') }));
  }
  const t = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), config.strings[key] || key);
  const storageKey = `lumasela:shopify:product:${config.productId}:design:v2`;
  const designForm = root.querySelector('.soft-design-form');
  let submitting = false;
  let purchaseIntent = 'bag';
  let summaryAdded = false;
  const fonts = [ ['allura', 'Allura'], ['dancing-script', 'Dancing Script'], ['great-vibes', 'Great Vibes'], ['sacramento', 'Sacramento'], ['kaushan-script', 'Kaushan Script'], ['knewave', 'Knewave'] ];
  const phoneColors = [ ['black',t('black'),'#282a2b'], ['silver',t('silver'),'#c9ccce'], ['ice-blue',t('ice_blue'),'#bdcfda'], ['burgundy',t('burgundy'),'#743e49'], ['midnight-blue',t('midnight_blue'),'#3a475e'], ['orange',t('orange'),'#dc8d4f'] ];
  // Align visible casing height and center while preserving each source image's proportions.
  const phonePreviewGeometry = {
    'midnight-blue': { scale:1.004, x:'-0.05%', y:'-1.55%' },
    orange: { scale:1.011, x:'-0.09%', y:'-1.91%' }
  };
  const textColors = [ ['#ffffff',t('white')], ['#111111',t('black')], ['#3e5d8d',t('blue')], ['#a63b32',t('coral')] ];
  const positions = [ ['bottom-right-vertical',t('bottom_vertical')], ['bottom-center',t('bottom_center')], ['below-logo',t('below_logo')], ['bottom-right-diagonal',t('bottom_diagonal')] ];
  const sizes = [ ['small',t('small'),35], ['medium',t('medium'),50], ['large',t('large'),65] ];
  const fallbackGallery = [
    { label: t('your_design'), eyebrow: t('live_preview'), caption: t('live_caption'), src: '', alt: '' },
    { label: t('clear_overview'), eyebrow: t('clear_eyebrow'), caption: t('clear_caption'), src: config.assets['lumasela-p02-gallery-clear-overview.webp'], alt: t('clear_alt') },
    { label: t('signature_detail'), eyebrow: t('signature_eyebrow'), caption: t('signature_caption'), src: config.assets['lumasela-p03-gallery-signature-closeup.webp'], alt: t('signature_alt') },
    { label: t('camera_detail'), eyebrow: t('camera_eyebrow'), caption: t('camera_caption'), src: config.assets['lumasela-p04-gallery-camera-overview.webp'], alt: t('camera_alt') },
    { label: t('personalisation'), eyebrow: t('personalisation_eyebrow'), caption: t('personalisation_caption'), src: config.assets['lumasela-p05-gallery-customization.webp'], alt: t('personalisation_alt') },
    { label: t('everyday'), eyebrow: t('everyday_eyebrow'), caption: t('everyday_caption'), src: config.assets['lumasela-p06-gallery-everyday.webp'], alt: t('everyday_alt') }
  ];
  let gallery = fallbackGallery;
  let galleryKey = null;
  const initialVariant = config.variants.find(item => String(item.id) === String(config.selectedVariantId)) || config.variants[0];
  const defaults = { version:2, name:[...String(config.defaultName || '')].slice(0,20).join(''), quantity:1, options:initialVariant?.options.slice() || [], phoneColor:'silver', style:'allura', position:'bottom-center', size:'medium', textColor:'#ffffff', gallery:0, compare:false, comparison:50 };
  let state = { ...defaults };
  const productData = config;
  let variant = null;
  const ready = config.variants.length > 0;
  let renderFrame = 0;
  const labelFor = (items, value) => items.find(item => item[0] === value)?.[1] || '';
  const phoneImage = () => config.phoneImages[state.phoneColor];
  function updatePhonePreviewGeometry() {
    const geometry = phonePreviewGeometry[state.phoneColor] || { scale:1, x:'0%', y:'0%' };
    root.style.setProperty('--phone-preview-scale',String(geometry.scale));
    root.style.setProperty('--phone-preview-x',geometry.x);
    root.style.setProperty('--phone-preview-y',geometry.y);
  }
  const formatMoney = value => new Intl.NumberFormat(config.locale, { style:'currency', currency:config.currency }).format(Number(value) / 100);
  function readSaved() {
    let saved;
    try { saved = JSON.parse(sessionStorage.getItem(storageKey)); } catch (_) { return; }
    if (!saved || saved.version !== 2) return;
    if (typeof saved.name === 'string') state.name = [...saved.name].slice(0,20).join('');
    if (Number.isInteger(Number(saved.quantity)) && Number(saved.quantity) >= 1 && Number(saved.quantity) <= 99) state.quantity = Number(saved.quantity);
    if (Array.isArray(saved.options) && productData.variants.some(item => item.options.length === saved.options.length && item.options.every((value, index) => value === saved.options[index]))) state.options = saved.options.slice();
    const allowed = { style: fonts, phoneColor: phoneColors, position: positions, size: sizes, textColor: textColors };
    for (const [key, values] of Object.entries(allowed)) if (values.some(item => item[0] === saved[key])) state[key] = saved[key];
    if (Number.isInteger(saved.gallery) && saved.gallery >= 0 && saved.gallery <= 8) state.gallery = saved.gallery;
    if (typeof saved.compare === 'boolean') state.compare = saved.compare;
    if (Number.isFinite(saved.comparison)) state.comparison = Math.min(100, Math.max(0,saved.comparison));
  }
  function save() {
    try { sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) {  }
    $('[data-saved-notice]').hidden = true;
    root.dispatchEvent(new CustomEvent('lumasela:designchange', { bubbles:true, detail:{ name:state.name, style:state.style, quantity:state.quantity } }));
  }
  readSaved();
  $('[data-saved-notice]').hidden = true;
  const url = new URL(location.href);
  const queryVariant = url.searchParams.get('variant');
  if (url.searchParams.has('variant')) {
    const explicitVariant = config.variants.find(item => String(item.id) === queryVariant) || initialVariant;
    state.options = explicitVariant?.options.slice() || [];
  }
  const queryStyle = url.searchParams.get('style');
  const hasQueryStyle = fonts.some(item => item[0] === queryStyle);
  if (hasQueryStyle) {
    state.style = queryStyle;
    url.searchParams.delete('style');
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
  }
  if (hasQueryStyle || url.searchParams.has('variant')) save();
  function button(value, text, key, className = '') {
    const node = document.createElement('button');
    node.type = 'button'; node.dataset.choice = key; node.dataset.value = value; node.className = className; node.textContent = text;
    node.setAttribute('aria-pressed', String(state[key] === value));
    return node;
  }
  function buildSwatches(selector, items, key) {
    const container = $(selector);
    items.forEach(([value,label,color]) => {
      const node = button(value,'',key);
      node.setAttribute('aria-label',label); node.title = label;
      node.style.setProperty('--swatch',color || value);
      if (['silver','ice-blue','#ffffff'].includes(value)) node.style.setProperty('--check','#3f5966');
      const dot = document.createElement('i'); dot.setAttribute('aria-hidden','true'); node.append(dot); container.append(node);
    });
  }
  buildSwatches('[data-phone-colors]',phoneColors,'phoneColor');
  buildSwatches('[data-text-colors]',textColors,'textColor');
  fonts.forEach(([value,label]) => {
    const node = button(value,'','style'); node.setAttribute('aria-label',label);
    const wrap = document.createElement('span'); wrap.className = 'font-sample-wrap';
    const sample = document.createElement('span'); sample.className = `font-sample font-${value}`; sample.dataset.fontSample = ''; sample.textContent = state.name;
    const caption = document.createElement('small'); caption.textContent = label;
    wrap.append(sample); node.append(wrap,caption); $('[data-font-options]').append(node);
  });
  positions.forEach(([value,label]) => {
    const node = button(value,'','position'); const icon = document.createElement('i'); icon.className = `placement-icon position-${value}`; icon.setAttribute('aria-hidden','true');
    const caption = document.createElement('span'); caption.textContent = label; node.append(icon,caption); $('[data-position-options]').append(node);
  });
  sizes.forEach(([value,label,mm]) => {
    const node = button(value,'','size'); const title = document.createElement('strong'); title.textContent = label;
    const caption = document.createElement('small'); caption.textContent = `${mm} mm`; node.append(title,caption); $('[data-size-options]').append(node);
  });
  function buildGalleryControls() {
    $('[data-gallery-thumbs]').replaceChildren();
    $('[data-gallery-dots]').replaceChildren();
    gallery.forEach((item,index) => {
      const thumb = document.createElement('button'); thumb.type = 'button'; thumb.dataset.galleryIndex = index; thumb.title = item.label; thumb.setAttribute('aria-label',item.label);
      const img = document.createElement('img'); img.src = index === 0 ? phoneImage() : item.src; img.alt = ''; img.width = 100; img.height = 100; img.loading = 'lazy';
      if (index === 0) {
        const art = document.createElement('div'); art.className = 'phone-thumb-art';
        const plane = document.createElement('div'); plane.className = 'phone-render-plane'; plane.append(img); art.append(plane); thumb.append(art);
      } else thumb.append(img);
      $('[data-gallery-thumbs]').append(thumb);
      const dot = document.createElement('button'); dot.type = 'button'; dot.dataset.galleryIndex = index; dot.setAttribute('aria-label',t('view_image', {label:item.label})); $('[data-gallery-dots]').append(dot);
    });
  }
  function syncCaseGallery() {
    const sets = Array.isArray(config.caseGalleries) ? config.caseGalleries : [];
    const candidates = sets.filter(set => set.verified === true && set.caseType === state.options[0] &&
      Array.isArray(set.images) && set.images.length === 8 && set.images.every(image => typeof image.src === 'string' && /^(https?:)?\/\//.test(image.src)));
    const selected = candidates.find(set => set.phoneModel && set.phoneModel === state.options[1]) || candidates.find(set => !set.phoneModel);
    const key = selected ? `${selected.caseType}|${selected.phoneModel || ''}|${selected.images.map(image => image.src).join('|')}` : 'shared';
    if (key === galleryKey) return;
    const hadGallery = galleryKey !== null;
    galleryKey = key;
    $('.product-gallery').classList.toggle('has-case-gallery',Boolean(selected));
    gallery = selected ? [fallbackGallery[0], ...selected.images.map(image => ({
      label:image.alt || selected.caseType,
      eyebrow:selected.caseType,
      caption:image.alt || '',
      src:image.src,
      alt:image.alt || selected.caseType,
      focalPoint:image.focalPoint || '50% 50%',
      casePhoto:true
    }))] : fallbackGallery;
    if (hadGallery || state.gallery >= gallery.length) state.gallery = 0;
    buildGalleryControls();
  }
  function updateCaseCards() {
    $$('[data-case-card]').forEach(card => {
      const value = card.dataset.caseValue;
      const options = state.options.slice(); options[0] = value;
      const candidate = productData.variants.find(item => item.options.every((option, index) => option === options[index]));
      const selected = state.options[0] === value;
      const status = candidate ? candidate.available ? t('in_stock') : t('sold_out') : t('unavailable');
      card.classList.toggle('is-selected', selected);
      const price = card.querySelector('[data-case-price]');
      const availability = card.querySelector('[data-case-availability]');
      const model = card.querySelector('[data-case-model]');
      const select = card.querySelector('[data-case-select]');
      if (price) price.textContent = candidate ? formatMoney(candidate.price) : t('price_unavailable');
      if (availability) availability.textContent = status;
      if (model) model.textContent = state.options[1] ? t('case_model_template', {model:state.options[1]}) : t('case_select_model');
      if (select) {
        select.disabled = !candidate || submitting;
        select.setAttribute('aria-pressed', String(selected));
        select.setAttribute('aria-label', `${t('case_choose_template', {case_type:value})}, ${status}`);
        select.textContent = selected ? t('case_selected') : t('case_choose_template', {case_type:value});
      }
    });
    const announcement = $('[data-case-announcement]');
    if (announcement?.textContent) announcement.textContent = t('case_selected_announcement', {case_type:state.options[0] || '', model:state.options[1] || ''});
  }
  function buildVariantOptions() {
    $$('[data-variant-options]').forEach(container => {
      const index = Number(container.dataset.optionIndex);
      const choices = productData.options[index]?.values || [];
      container.replaceChildren(...choices.map(value => {
        const node = button(value, '', `option${index}`); node.dataset.optionIndex = String(index);
        const label = document.createElement('span'); label.textContent = value; node.append(label);
        const status = document.createElement('small'); status.dataset.optionAvailability = ''; node.append(status);
        return node;
      }));
    });
  }
  function updateVariant() {
    variant = productData.variants.find(item => item.options.every((value, index) => value === state.options[index])) || null;
    updateCaseCards();
    const available = Boolean(variant?.available);
    const availabilityText = variant ? available ? t('in_stock') : t('sold_out') : t('unavailable');
    $('[data-product-price]').textContent = variant ? formatMoney(variant.price) : t('price_unavailable');
    $('[data-availability]').textContent = availabilityText;
    $('[data-availability]').classList.toggle('is-unavailable', !available);
    $('[data-mobile-price]').textContent = variant ? formatMoney(variant.price * state.quantity) : config.title;
    $('[data-mobile-status]').textContent = `${availabilityText} · ${t('preview')}`;
    $('[data-selection-summary]').textContent = state.options.join(' · ');
    $$('[data-option-index][data-choice]').forEach(node => {
      const index = Number(node.dataset.optionIndex);
      const candidate = state.options.slice(); candidate[index] = node.dataset.value;
      const option = productData.variants.find(item => item.options.every((value, i) => value === candidate[i]));
      const unavailable = !option?.available;
      node.classList.toggle('is-unavailable', unavailable);
      node.classList.toggle('is-active', state.options[index] === node.dataset.value);
      node.setAttribute('aria-pressed', String(state.options[index] === node.dataset.value));
      node.querySelector('[data-option-availability]').textContent = unavailable ? option ? t('sold_out') : t('unavailable') : '';
      node.setAttribute('aria-label', `${node.dataset.value}, ${unavailable ? t('preview_only') : t('in_stock')}`);
    });
    $('[data-quantity-minus]').disabled = state.quantity <= 1 || submitting;
    $('[data-quantity-plus]').disabled = state.quantity >= 99 || submitting;
    $$('[data-review], [data-mobile-review-button]').forEach(node => { node.disabled = !ready || !variant || submitting; });
    const variantInput = $('[data-variant-id]'); variantInput.value = variant ? String(variant.id) : ''; variantInput.disabled = !available;
    $$('[data-purchase-intent]').forEach(node => { node.disabled = !available || submitting; });
     $('[data-purchase-status]').textContent = submitting ? t('adding') : summaryAdded ? t('purchase_added') : available ? t('purchase_available') : variant ? t('purchase_sold_out') : t('purchase_unavailable');
    $('[data-purchase-cart]').hidden = !summaryAdded;
    $('[data-purchase-status]').classList.toggle('is-unavailable', !available);
    $('[data-add-to-cart]').disabled = !available || submitting || summaryAdded;
    $('[data-add-to-cart]').textContent = submitting ? t('adding') : summaryAdded ? t('added_to_bag') : available ? t(purchaseIntent === 'checkout' ? 'confirm_checkout' : 'confirm_add') : variant ? t('sold_out') : t('unavailable');
    const size = sizes.find(item => item[0] === state.size);
    $('[data-property-font]').value = labelFor(fonts, state.style);
    $('[data-property-color]').value = labelFor(textColors, state.textColor);
    $('[data-property-size]').value = `${size[1]} · ${size[2]} mm`;
    $('[data-property-position]').value = labelFor(positions, state.position);
    $('[data-property-phone]').value = labelFor(phoneColors, state.phoneColor);
  }
  function paintSignatures(scope = root) {
    scope.querySelectorAll('[data-signature-live]').forEach(node => {
      node.textContent = state.name;
      node.className = `live-signature font-${state.style}`;
      node.style.color = state.textColor;
      node.closest('.signature-safe-zone').dataset.position = state.position;
      node.style.setProperty('--signature-rotation', state.position === 'bottom-right-vertical' ? '-90deg' : state.position === 'bottom-right-diagonal' ? '-45deg' : '0deg');
    });
  }
  function fitSignature() {
    const rotation = state.position === 'bottom-right-vertical' ? -90 : state.position === 'bottom-right-diagonal' ? -45 : 0;
    const angle = Math.abs(rotation) * Math.PI / 180;
    const mm = sizes.find(item => item[0] === state.size)[2];
    $$('[data-signature-live]').forEach(node => {
      const zone = node.closest('.signature-safe-zone');
      const width = zone?.clientWidth || 0, height = zone?.clientHeight || 0;
      if (!width || !height) return;
      node.style.setProperty('--signature-fit','1');
      node.style.fontSize = `${width * .25}px`;
      const naturalWidth = Math.max(1,node.offsetWidth), naturalHeight = Math.max(1,node.offsetHeight);
      const rotatedWidth = naturalWidth*Math.cos(angle) + naturalHeight*Math.sin(angle);
      const rotatedHeight = naturalWidth*Math.sin(angle) + naturalHeight*Math.cos(angle);
      const maxWidth = width * (state.position === 'bottom-right-diagonal' ? .97 : .98);
      const maxHeight = height * (state.position === 'bottom-right-vertical' ? .68 : state.position === 'below-logo' ? .46 : .53);
      const scale = Math.max(.001,Math.min(width * mm / 68 / naturalWidth,maxWidth/rotatedWidth,maxHeight/rotatedHeight));
      const shownWidth = rotatedWidth*scale, shownHeight = rotatedHeight*scale;
      let x = width*.5, y = height*.98-shownHeight/2;
      if (state.position === 'bottom-right-vertical') x = width*.97-shownWidth/2;
      else if (state.position === 'below-logo') y = height*.46+shownHeight/2;
      else if (state.position === 'bottom-right-diagonal') {
        const inset = width*.04;
        x = width-inset-shownWidth/2; y = height-inset-shownHeight/2;
      }
      node.style.left = `${x}px`; node.style.top = `${y}px`; node.style.setProperty('--signature-fit',scale.toFixed(4));
    });
    $$('[data-font-sample]').forEach(node => {
      node.style.setProperty('--sample-fit','1');
      const width = node.parentElement.clientWidth;
      if (width > 0 && node.offsetWidth > 0) node.style.setProperty('--sample-fit',Math.min(1,(width - 6)/node.offsetWidth).toFixed(4));
    });
  }
  function scheduleFit() { cancelAnimationFrame(renderFrame); renderFrame = requestAnimationFrame(fitSignature); }
  function updateComparison() {
    const visible = state.compare && state.gallery === 0;
    $('[data-gallery-before]').hidden = !visible;
    $('[data-comparison-divider]').hidden = !visible;
    $('[data-comparison-control]').hidden = !visible;
    $('[data-before-image]').src = phoneImage();
    $('[data-gallery-before]').style.clipPath = `inset(0 ${100-state.comparison}% 0 0)`;
    $('[data-comparison-divider]').style.left = `${state.comparison}%`;
    $('[data-compare-range]').value = state.comparison;
    $('[data-compare-range]').setAttribute('aria-valuetext',t('comparison_percent', {percent:state.comparison}));
    $('[data-compare-toggle]').setAttribute('aria-pressed',String(state.compare));
  }
  function updateGallery() {
    syncCaseGallery();
    updatePhonePreviewGeometry();
    const item = gallery[state.gallery], live = state.gallery === 0;
    const img = $('[data-gallery-image]'); const src = live ? phoneImage() : item.src;
    if (img.getAttribute('src') !== src) img.src = src;
    img.alt = live ? t('live_image', {color:labelFor(phoneColors,state.phoneColor), font:labelFor(fonts,state.style)}) : item.alt;
    $('[data-gallery-stage]').classList.toggle('is-live',live);
    $('[data-gallery-stage]').classList.toggle('is-case-photo',Boolean(item.casePhoto));
    img.style.objectPosition = live ? '' : item.focalPoint || '50% 50%';
    $('[data-gallery-label]').textContent = item.eyebrow;
    $('[data-gallery-caption]').textContent = item.caption;
    $$('[data-gallery-index]').forEach(node => {
      const selected = Number(node.dataset.galleryIndex) === state.gallery;
      node.classList.toggle('is-active',selected); node.setAttribute('aria-pressed',String(selected));
      if (Number(node.dataset.galleryIndex) === 0 && node.querySelector('img')) node.querySelector('img').src = phoneImage();
    });
    updateComparison();
  }
  function render({ syncInputs = false } = {}) {
    $$('[data-choice]').forEach(node => { const selected = state[node.dataset.choice] === node.dataset.value; node.classList.toggle('is-active',selected); node.setAttribute('aria-pressed',String(selected)); });
    if (syncInputs) { $('[data-name]').value = state.name; $('[data-quantity]').value = state.quantity; }
    $('[data-name-count]').textContent = `${[...state.name].length} / 20`;
    $('[data-phone-color-label]').textContent = labelFor(phoneColors,state.phoneColor);
    $('[data-text-color-label]').textContent = labelFor(textColors,state.textColor);
    $$('[data-font-sample]').forEach(node => { node.textContent = state.name || config.defaultName; });
    updateVariant(); updateGallery(); paintSignatures(); scheduleFit(); updateMobileReview();
  }
  function change(key, value) {
    if (submitting) return;
    $('[data-cart-success]').hidden = true;
    $('[data-cart-error]').hidden = true;
    $('[data-cart-check]').hidden = true;
    const previousValue = key.startsWith('option') ? state.options[Number(key.slice(6))] : state[key];
    if (previousValue !== value) summaryAdded = false;
    if (key.startsWith('option')) { state.options[Number(key.slice(6))] = value; } else { state[key] = value; }
    if (['phoneColor','style','position','size','textColor','name'].includes(key)) state.gallery = 0;
    render(); save();
  }
  root.addEventListener('click', event => {
    const choice = event.target.closest('[data-choice]');
    if (choice && root.contains(choice)) change(choice.dataset.choice,choice.dataset.value);
    const caseSelect = event.target.closest('[data-case-select]');
    if (caseSelect && root.contains(caseSelect) && !caseSelect.disabled && !submitting && productData.options[0]?.values.includes(caseSelect.dataset.caseValue)) {
      change('option0',caseSelect.dataset.caseValue);
      const announcement = $('[data-case-announcement]');
      if (announcement) announcement.textContent = t('case_selected_announcement', {case_type:caseSelect.dataset.caseValue, model:state.options[1] || ''});
    }
    const galleryButton = event.target.closest('[data-gallery-index]');
    if (galleryButton && root.contains(galleryButton)) { state.gallery = Math.max(0,Math.min(gallery.length-1,Number(galleryButton.dataset.galleryIndex)||0)); updateGallery(); save(); }
  });
  const moveGallery = direction => { state.gallery = (state.gallery + direction + gallery.length) % gallery.length; updateGallery(); save(); };
  $('[data-gallery-previous]').addEventListener('click',() => moveGallery(-1));
  $('[data-gallery-next]').addEventListener('click',() => moveGallery(1));
  $('[data-gallery-stage]').addEventListener('keydown',event => {
    if (event.target !== event.currentTarget || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault(); moveGallery(event.key === 'ArrowLeft' ? -1 : 1);
  });
  let touchStart = null;
  $('[data-gallery-stage]').addEventListener('touchstart',event => {
    if (event.target.closest('button,input')) { touchStart = null; return; }
    const touch = event.touches[0]; touchStart = touch ? { x:touch.clientX, y:touch.clientY } : null;
  },{passive:true});
  $('[data-gallery-stage]').addEventListener('touchend',event => {
    const touch = event.changedTouches[0]; if (!touch || !touchStart) return;
    const dx = touch.clientX-touchStart.x, dy = touch.clientY-touchStart.y;
    if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.3) moveGallery(dx<0 ? 1 : -1);
    touchStart = null;
  },{passive:true});
  $('[data-compare-toggle]').addEventListener('click',() => { state.compare = !state.compare; state.gallery = 0; updateGallery(); save(); });
  $('[data-compare-range]').addEventListener('input',event => { state.comparison = Number(event.target.value); updateComparison(); save(); });
  function clearNameError() { $('[data-name-error]').hidden = true; $('[data-name-error]').textContent = ''; $('[data-name]').removeAttribute('aria-invalid'); $('[data-name]').setCustomValidity(''); }
  $('[data-name]').addEventListener('input',event => {
    const value = [...event.target.value].slice(0,20).join('');
    if (value !== event.target.value) event.target.value = value;
    clearNameError(); change('name',value);
  });
  function quantityValid() { const value = Number($('[data-quantity]').value); return Number.isInteger(value) && value>=1 && value<=99; }
  function updateQuantity(value) { if (submitting) return; if (Number(value) !== state.quantity) summaryAdded = false; state.quantity = Math.max(1,Math.min(99,Number(value)||1)); $('[data-quantity]').value = state.quantity; $('[data-quantity]').removeAttribute('aria-invalid'); $('[data-product-error]').hidden = true; render(); save(); }
  $('[data-quantity-minus]').addEventListener('click',() => updateQuantity(state.quantity-1));
  $('[data-quantity-plus]').addEventListener('click',() => updateQuantity(state.quantity+1));
  $('[data-quantity]').addEventListener('input',() => { if (quantityValid()) updateQuantity(Number($('[data-quantity]').value)); });
  $('[data-quantity]').addEventListener('change',() => { if (quantityValid()) updateQuantity(Number($('[data-quantity]').value)); });
  let activeDialog = null;
  let previousFocus = null;
  let previousOverflow = '';
  function openDialog(dialog,trigger) {
    if (dialog.open) return;
    if (activeDialog?.open) activeDialog.close();
    previousFocus = trigger || document.activeElement;
    previousOverflow = document.body.style.overflow;
    activeDialog = dialog;
    document.body.style.overflow = 'hidden';
    dialog.showModal(); dialog.scrollTop = 0;
    dialog.querySelector('[data-close-dialog]')?.focus({preventScroll:true});
    updateMobileReview(); scheduleFit();
  }
  function createPreview(liveOnly = false) {
    const live = liveOnly || state.gallery === 0;
    const art = document.createElement('div'); art.className = `zoom-art${live ? ' is-live' : ''}`;
    const plane = live ? document.createElement('div') : art;
    if (live) { plane.className = 'phone-render-plane'; art.append(plane); }
    const img = document.createElement('img'); img.src = live ? phoneImage() : gallery[state.gallery].src; img.alt = live ? t('zoom_image', {color:labelFor(phoneColors,state.phoneColor)}) : gallery[state.gallery].alt; img.width = 1254; img.height = 1254;
    if (!live && gallery[state.gallery].casePhoto) { img.style.objectFit = 'contain'; img.style.objectPosition = gallery[state.gallery].focalPoint; }
    plane.append(img);
    if (live) { const zone = document.createElement('div'); zone.className = 'signature-safe-zone'; const signature = document.createElement('span'); signature.dataset.signatureLive = ''; zone.append(signature); plane.append(zone); paintSignatures(art); }
    if (live && !liveOnly && state.compare) {
      const before = document.createElement('div'); before.className = 'gallery-before'; before.setAttribute('aria-hidden','true');
      before.style.clipPath = `inset(0 ${100-state.comparison}% 0 0)`;
      const beforePlane = document.createElement('div'); beforePlane.className = 'phone-render-plane';
      const beforeImage = document.createElement('img'); beforeImage.src = phoneImage(); beforeImage.alt = ''; beforeImage.width = 1254; beforeImage.height = 1254; beforePlane.append(beforeImage); before.append(beforePlane);
      const divider = document.createElement('div'); divider.className = 'comparison-divider'; divider.setAttribute('aria-hidden','true'); divider.style.left = `${state.comparison}%`;
      const handle = $('[data-comparison-divider] span').cloneNode(true); divider.append(handle); art.append(before,divider);
    }
    return art;
  }
  $('[data-zoom]').addEventListener('click',event => { $('[data-zoom-content]').replaceChildren(createPreview()); openDialog($('[data-zoom-dialog]'),event.currentTarget); });
  $$('dialog').forEach(dialog => {
    dialog.querySelectorAll('[data-close-dialog]').forEach(node => node.addEventListener('click',() => dialog.close()));
    dialog.addEventListener('cancel',event => { event.preventDefault(); dialog.close(); });
    dialog.addEventListener('keydown',event => {
      if (event.key === 'Escape') { event.preventDefault(); dialog.close(); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])')].filter(node => !node.hidden && !node.closest('[hidden]'));
      const first = focusable[0], last = focusable[focusable.length-1];
      if (!first) { event.preventDefault(); dialog.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    });
    dialog.addEventListener('click',event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom) dialog.close();
    });
    dialog.addEventListener('close',() => {
      if (activeDialog !== dialog) return;
      document.body.style.overflow = previousOverflow;
      activeDialog = null;
      if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
      updateMobileReview();
    });
  });
  function review(trigger, intent = 'bag') {
    if (submitting) return;
    purchaseIntent = intent;
    $('[data-checkout-form]').hidden = !summaryAdded;
    if (!state.name.trim()) {
      const input = $('[data-name]'); input.setAttribute('aria-invalid','true'); input.setCustomValidity(t('name_required'));
      $('[data-name-error]').textContent = t('name_error'); $('[data-name-error]').hidden = false;
      input.focus(); input.scrollIntoView({block:'center',behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); return;
    }
    if (!quantityValid()) {
      $('[data-product-error]').textContent = t('quantity_error'); $('[data-product-error]').hidden = false;
      $('[data-quantity]').setAttribute('aria-invalid','true'); $('[data-quantity]').focus(); return;
    }
    if (!variant) { $('[data-product-error]').textContent = t('product_unavailable'); $('[data-product-error]').hidden = false; return; }
    state.quantity = Number($('[data-quantity]').value); save();
    $('[data-summary-name]').textContent = state.name;
    $('[data-summary-intent]').textContent = t(variant.available ? purchaseIntent === 'checkout' ? 'summary_checkout_intent' : 'summary_bag_intent' : 'purchase_sold_out');
    const size = sizes.find(item => item[0] === state.size);
    const rows = [ ...productData.options.map((option,index) => [option.name,state.options[index]]), [t('phone_visualization'),labelFor(phoneColors,state.phoneColor)], [t('font'),labelFor(fonts,state.style)], [t('placement'),labelFor(positions,state.position)], [t('signature_size'),`${size[1]} · ${size[2]} mm`], [t('signature_colour'),labelFor(textColors,state.textColor)], [t('quantity'),String(state.quantity)], [t('unit_price'),formatMoney(variant.price)], [t('availability'),variant.available ? t('in_stock') : t('sold_out')] ];
    $('[data-design-summary]').replaceChildren(...rows.map(([title,value]) => { const row = document.createElement('div'); const term = document.createElement('dt'), detail = document.createElement('dd'); term.textContent = title; detail.textContent = value; row.append(term,detail); return row; }));
    $('[data-summary-quantity]').textContent = t('quantity_price', {quantity:state.quantity, price:formatMoney(variant.price)});
    $('[data-summary-total]').textContent = formatMoney(variant.price*state.quantity);
    $('[data-summary-preview]').replaceChildren(createPreview(true));
    $('[data-cart-error]').hidden = true;
    $('[data-cart-check]').hidden = true;
    $('[data-cart-success]').hidden = !summaryAdded;
    updateVariant();
    openDialog($('[data-review-dialog]'),trigger);
  }
  designForm.addEventListener('submit',event => { event.preventDefault(); review(event.submitter || $('[data-review]')); });
  $('[data-mobile-review-button]').addEventListener('click',event => review(event.currentTarget));
  $$('[data-purchase-intent]').forEach(node => node.addEventListener('click', event => {
    if (!variant?.available || submitting) return;
    review(event.currentTarget, node.dataset.purchaseIntent);
  }));
  function updateMobileReview() {
    const editing = Boolean(document.activeElement?.matches('input,textarea,select,[contenteditable="true"]'));
    const keyboard = window.visualViewport && window.innerHeight-window.visualViewport.height>150;
    $('[data-mobile-review]').hidden = Boolean(editing || keyboard || activeDialog?.open || document.querySelector('dialog[open]'));
  }
  document.addEventListener('focusin',updateMobileReview);
  document.addEventListener('focusout',() => requestAnimationFrame(updateMobileReview));
  window.visualViewport?.addEventListener('resize',updateMobileReview);
  window.addEventListener('resize',() => { scheduleFit(); updateMobileReview(); });
  window.addEventListener('pageshow',event => {
    if (!event.persisted) return;
    readSaved();
    buildVariantOptions();
    render({syncInputs:true});
  });
  document.fonts?.ready.then(scheduleFit);
  if (window.ResizeObserver) new ResizeObserver(scheduleFit).observe($('[data-gallery-stage]'));
  $('[data-add-to-cart]').addEventListener('click', async () => {
    if (submitting || summaryAdded || !variant?.available) return;
    if (!state.name.trim() || !quantityValid()) { $('[data-review-dialog]').close(); review($('[data-review]'), purchaseIntent); return; }
    submitting = true;
    $('[data-cart-error]').hidden = true;
    $('[data-cart-check]').hidden = true;
    $('[data-cart-success]').hidden = true;
    updateVariant();
    const payload = new FormData(designForm);
    const submittedVariantId = String(variant.id);
    const checkoutAfterAdd = purchaseIntent === 'checkout';
    $$('[data-choice], [data-name], [data-quantity]').forEach(node => { node.disabled = true; });
    try {
      const response = await fetch(config.cartAddUrl, {method:'POST', credentials:'same-origin', headers:{Accept:'application/json'}, body:payload});
      let result;
      try { result = await response.json(); } catch (_) { throw new Error(t('cart_uncertain')); }
      if (!response.ok) throw new Error(typeof result.description === 'string' ? result.description : typeof result.message === 'string' ? result.message : t('cart_error'));
      if (!result || String(result.variant_id || result.id) !== submittedVariantId) throw new Error(t('cart_uncertain'));
      summaryAdded = true;
      $('[data-checkout-form]').hidden = false;
      $('[data-cart-success]').hidden = false;
      root.dispatchEvent(new CustomEvent('lumasela:cartchange', {bubbles:true, detail:{item:result}}));
      if (checkoutAfterAdd) {
        try {
          $('[data-checkout-form]').requestSubmit($('[data-checkout-submit]'));
        } catch (_) {
          $('[data-cart-error]').textContent = t('checkout_ready');
          $('[data-cart-error]').hidden = false;
        }
      }
    } catch (error) {
      $('[data-cart-error]').textContent = error instanceof TypeError ? t('cart_uncertain') : error.message || t('cart_error');
      $('[data-cart-error]').hidden = false;
      $('[data-cart-check]').hidden = false;
    } finally {
      submitting = false;
      $$('[data-choice], [data-name], [data-quantity]').forEach(node => { node.disabled = false; });
      updateVariant();
    }
  });
  buildVariantOptions();
  render({syncInputs:true});
})();
