// Run: NODE_PATH=/path/to/node_modules node scripts/test-product-interactions.cjs
// Dev-only dependencies: liquidjs and jsdom. No requests or cart writes are made.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { Liquid } = require('liquidjs');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const locale = JSON.parse(read('locales/en.default.json'));
const engine = new Liquid();
engine.registerFilter('asset_url', value => `/assets/${value}`);
engine.registerFilter('stylesheet_tag', value => `<link rel="stylesheet" href="${value}">`);
engine.registerFilter('image_url', value => value.url);
engine.registerFilter('money_with_currency', value => `MYR ${(value / 100).toFixed(2)}`);
engine.registerFilter('t', (key, ...args) => {
  let value = key.split('.').reduce((obj, k) => obj?.[k], locale) || key;
  for (const arg of args) if (Array.isArray(arg)) value = value.replace(`{{ ${arg[0]} }}`, arg[1]);
  return value;
});
const variants = [
  { id: '1', title: 'Hard PC / iPhone 17', option1: 'Hard PC', option2: 'iPhone 17', available: true, price: 5900 },
  { id: '2', title: 'Soft TPU / iPhone 17', option1: 'Soft TPU', option2: 'iPhone 17', available: false, price: 6000 },
  { id: '3', title: 'Hard PC / iPhone Air', option1: 'Hard PC', option2: 'iPhone Air', available: true, price: 6100 }
];
const product = { id: 'qa-product', title: 'Signature Clear', tags: ['demo-product'], description: 'Fixture only', featured_media: { id: 1, preview_image: { url: '/original.webp' }, alt: 'Original image' }, media: [], variants, selected_or_first_available_variant: variants[0], options_with_values: [
  { name: 'Case Type', position: 1, selected_value: 'Hard PC', values: ['Hard PC', 'Soft TPU'] },
  { name: 'Phone Model', position: 2, selected_value: 'iPhone 17', values: ['iPhone 17', 'iPhone Air'] }
] };
const check = (label, fn) => { fn(); console.log(`PASS ${label}`); };
(async () => {
  let liquid = read('sections/lumasela-preview-product.liquid').split('{% schema %}')[0];
  // Emulate Shopify's native product-form wrapper; Shopify validates the real tag separately.
  liquid = liquid.replace(/{%- form 'product'[^%]*-%}/, '<form id="LumaselaPreviewProductForm" action="/cart/add" method="post">').replace(/{%- endform -%}/, '</form>');
  liquid = liquid.replace(/{% render 'lumasela-preview-personalisation', demo: (false|true) %}/g, (_, demo) => `{% assign demo = ${demo} %}` + read('snippets/lumasela-preview-personalisation.liquid').replace(/{% doc %}[\s\S]*?{% enddoc %}/, ''));
  const html = await engine.parseAndRender(liquid, { product, section: { settings: {} } });
  const storageKey = 'lumasela:design:v1:qa-product';
  const open = saved => {
    const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://example.com/products/signature-clear' });
    const w = dom.window;
    w.requestAnimationFrame = cb => { cb(); return 1; };
    // jsdom does not implement native dialog; preserve open/close event semantics.
    w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event('close')); };
    if (saved) w.sessionStorage.setItem(storageKey, saved);
    w.eval(read('assets/lumasela-preview-product.js'));
    return { dom, w, q: s => w.document.querySelector(s), all: s => [...w.document.querySelectorAll(s)] };
  };
  let a = open();
  const click = s => a.q(s).click();
  const name = value => { a.q('[data-inline-name-input]').value = value; a.q('[data-inline-name-input]').dispatchEvent(new a.w.Event('input', { bubbles: true })); };
  const submit = () => { const event = new a.w.Event('submit', { cancelable: true, bubbles: true }); a.q('form').dispatchEvent(event); return event.defaultPrevented; };
  check('six fonts, four positions, three sizes, and 20-character field retained', () => {
    assert.equal(a.all('[data-style]').length, 6); assert.equal(a.all('[data-position]').length, 4); assert.equal(a.all('[data-signature-size]').length, 3); assert.equal(a.q('[data-inline-name-input]').maxLength, 20);
    name('abcdefghijklmnopqrstuv'); assert.equal(a.q('[data-inline-name-input]').value, 'abcdefghijklmnopqrst'); assert.equal(a.q('[data-name-count]').textContent, '20 / 20');
  });
  check('original image plus five explicitly labelled concept images', () => {
    assert.equal(a.all('[data-gallery-src]').length, 6); assert.equal(a.q('[data-gallery-main]').getAttribute('src'), '/original.webp');
    assert(a.all('[data-gallery-src]').slice(1).every(node => /Illustrative case concept [1-5]/.test(node.dataset.galleryAlt)));
  });
  check('active phone preview refreshes repeatedly and never changes selected variant', () => {
    click('[data-phone-label="Black"]'); assert(a.q('[data-gallery-main]').src.endsWith('black-base.webp'));
    click('[data-phone-label="Orange"]'); assert(a.q('[data-gallery-main]').src.endsWith('orange-base.webp')); assert.equal(a.q('[data-variant-id]').value, '1');
  });
  check('all six fonts and four positions update preview and native properties', () => {
    for (const button of a.all('[data-style]')) { button.click(); assert(a.q('[data-signature-live]').classList.contains(`signature-${button.dataset.style}`)); assert.equal(a.q('[data-property-style]').value, button.querySelector('small').textContent); }
    for (const button of a.all('[data-position]')) { button.click(); assert(a.q('[data-signature-live]').classList.contains(`position-${button.dataset.position}`)); }
  });
  check('all signature sizes preserve labelled millimetre widths', () => {
    for (const button of a.all('[data-signature-size]')) { button.click(); assert(a.q('[data-signature-live]').classList.contains(`signature-size-${button.dataset.signatureSize}`)); assert(a.q('[data-property-size]').value.includes(`${button.dataset.sizeMm} mm`)); }
  });
  name('Maya'); click('[data-style="sacramento"]'); click('[data-position="below-logo"]'); click('[data-signature-size="large"]'); click('[data-color="#3e5d8d"]'); click('[data-option-value="iPhone Air"]'); click('[data-qty-plus]'); click('[data-qty-plus]');
  const saved = a.w.sessionStorage.getItem(storageKey);
  a.dom.window.close(); a = open(saved);
  check('return navigation restores all design choices, variant, quantity, and submitted properties', () => {
    assert.equal(a.q('[data-inline-name-input]').value, 'Maya');
    assert.equal(a.q('[data-property-style]').value, 'Sacramento'); assert.equal(a.q('[data-property-position]').value, 'Below logo'); assert.equal(a.q('[data-property-size]').value, 'Large (65 mm)'); assert.equal(a.q('[data-property-colour]').value, 'Blue'); assert.equal(a.q('[data-property-phone]').value, 'Orange');
    assert.equal(a.q('[data-qty-input]').value, '3'); assert.equal(a.q('[data-variant-id]').value, '3'); assert(a.q('[data-gallery-main]').src.endsWith('orange-base.webp'));
    assert.equal(submit(), false);
    const fields = Object.fromEntries(new a.w.FormData(a.q('form')));
    assert.deepEqual(fields, { id: '3', 'properties[Signature name]': 'Maya', 'properties[Signature style]': 'Sacramento', 'properties[Signature position]': 'Below logo', 'properties[Signature size]': 'Large (65 mm)', 'properties[Text colour]': 'Blue', 'properties[Preview phone colour]': 'Orange', quantity: '3' });
  });
  check('zoom opens, closes, restores body scroll and focus', () => {
    a.w.document.body.style.overflow = 'auto'; click('[data-gallery-zoom]'); assert(a.q('dialog').open); assert.equal(a.w.document.body.style.overflow, 'hidden'); assert.equal(a.all('[data-gallery-zoom-content] [data-gallery-zoom]').length, 0);
    click('[data-gallery-close]'); assert(!a.q('dialog').open); assert.equal(a.w.document.body.style.overflow, 'auto'); assert.equal(a.w.document.activeElement, a.q('[data-gallery-zoom]'));
  });
  check('empty and whitespace names are blocked with useful guidance, then clear on input', () => {
    for (const value of ['', '   ']) { name(value); assert(submit()); assert.equal(a.q('[data-product-error]').hidden, false); assert.match(a.q('[data-product-error]').textContent, /Enter a name/); }
    name('Aina'); assert(!a.q('[data-inline-name-input]').validationMessage); assert(!submit());
  });
  check('invalid quantities cannot submit', () => {
    for (const value of ['0', '-1', '1.5', '']) { a.q('[data-qty-input]').value = value; assert(submit()); }
    a.q('[data-qty-input]').value = '1'; assert(!submit());
  });
  check('sold-out and nonexistent variant combinations cannot submit', () => {
    click('[data-option-value="iPhone 17"]'); click('[data-option-value="Soft TPU"]'); assert(a.q('[data-add-to-cart]').disabled); assert.match(a.q('[data-add-to-cart]').textContent, /Sold out/i); assert(submit());
    click('[data-option-value="iPhone Air"]'); assert.equal(a.q('[data-variant-id]').value, ''); assert.match(a.q('[data-add-to-cart]').textContent, /Unavailable/i); assert(submit());
  });
  check('invalid stored data does not crash and removed variant choices warn', () => {
    const bad = open('{'); assert.equal(bad.q('[data-inline-name-input]').value, 'Aina'); bad.dom.window.close();
    const stale = open(JSON.stringify({ version: 1, name: 'Saved', variants: ['Removed material'], quantity: '-2' })); assert.equal(stale.q('[data-product-error]').hidden, false); assert.equal(stale.q('[data-qty-input]').value, '1'); stale.dom.window.close();
  });
  a.dom.window.close(); a = open();
  check('gallery arrows and dots stay in sync and wrap', () => {
    assert.equal(a.all('[data-gallery-dot]').length, 6);
    assert.equal(a.q('[data-gallery-count]').textContent, '01 / 06');
    click('[data-gallery-previous]'); assert.equal(a.q('[data-gallery-count]').textContent, '06 / 06');
    click('[data-gallery-next]'); assert.equal(a.q('[data-gallery-count]').textContent, '01 / 06');
    click('[data-gallery-dot="3"]'); assert.equal(a.q('[data-gallery-count]').textContent, '04 / 06');
    assert.equal(a.q('[data-gallery-dot="3"]').getAttribute('aria-pressed'), 'true');
    assert.equal(a.all('[data-gallery-dot][aria-pressed="true"]').length, 1);
  });
  check('gallery keyboard and horizontal swipe navigate; vertical and short gestures do not', () => {
    const wrap = a.q('[data-gallery-main-wrap]');
    wrap.dispatchEvent(new a.w.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    assert.equal(a.q('[data-gallery-count]').textContent, '05 / 06');
    const gesture = (dx,dy) => {
      const start = new a.w.Event('touchstart'); Object.defineProperty(start, 'touches', { value: [{ clientX: 100, clientY: 100 }] }); wrap.dispatchEvent(start);
      const end = new a.w.Event('touchend'); Object.defineProperty(end, 'changedTouches', { value: [{ clientX: 100 + dx, clientY: 100 + dy }] }); wrap.dispatchEvent(end);
    };
    gesture(-60, 5); assert.equal(a.q('[data-gallery-count]').textContent, '06 / 06');
    gesture(60, 5); assert.equal(a.q('[data-gallery-count]').textContent, '05 / 06');
    gesture(5, 60); gesture(20, 0); assert.equal(a.q('[data-gallery-count]').textContent, '05 / 06');
  });
  check('configuration summary uses selected real options', () => {
    assert.equal(a.q('[data-configuration-summary]').textContent, 'Hard PC · iPhone 17');
    click('[data-option-value="iPhone Air"]');
    assert.equal(a.q('[data-configuration-summary]').textContent, 'Hard PC · iPhone Air');
  });
  check('comparison refits immediately on opening', () => {
    const details = a.q('.lumasela-comparison-disclosure');
    const zone = details.querySelector('.signature-safe-zone');
    const text = zone.querySelector('[data-signature-live]');
    Object.defineProperty(zone, 'clientWidth', { get: () => details.open ? 100 : 0 });
    Object.defineProperty(zone, 'clientHeight', { get: () => details.open ? 160 : 0 });
    Object.defineProperty(text, 'offsetWidth', { get: () => 250 });
    Object.defineProperty(text, 'offsetHeight', { get: () => 25 });
    name('abcdefghijklmnopqrst');
    assert.equal(text.style.getPropertyValue('--signature-fit'), '1');
    details.open = true; details.dispatchEvent(new a.w.Event('toggle'));
    assert.equal(text.style.getPropertyValue('--signature-fit'), '0.2941');
    name('abcdefghijklmnopqrst');
    assert.notEqual(text.style.getPropertyValue('--signature-fit'), '1');
    console.log('Verified fit after open and edit =', text.style.getPropertyValue('--signature-fit'));
  });
  a.dom.window.close();
  console.log('DOM regression complete. Visual geometry, native browser validation, and Escape dialog behavior require browser QA.');
})().catch(error => { console.error(error); process.exitCode = 1; });
