class LumaselaCustomizer extends HTMLElement {
  connectedCallback() {
    if (this.dataset.bound === 'true') return;
    this.dataset.bound = 'true';
    this.signature = this.querySelector('[data-customizer-signature]');
    this.nameInput = this.querySelector('[data-customizer-name]');
    this.count = this.querySelector('[data-customizer-count]');
    this.styleSelect = this.querySelector('[data-customizer-style]');
    this.colorSelect = this.querySelector('[data-customizer-color]');
    this.positionSelect = this.querySelector('[data-customizer-position]');
    this.variantSelect = this.querySelector('[data-customizer-variant]');
    this.price = this.querySelector('[data-customizer-price]');
    this.submit = this.querySelector('[data-customizer-submit]');
    this.addEventListener('input', this.onControlChange.bind(this));
    this.addEventListener('change', this.onControlChange.bind(this));
    this.querySelectorAll('[data-customizer-tone]').forEach((button) => {
      button.addEventListener('click', () => this.setTone(button.dataset.customizerTone));
    });
    this.updatePreview();
    this.updateVariant();
  }

  onControlChange(event) {
    if (event.target === this.variantSelect) {
      this.updateVariant();
      return;
    }
    if (
      event.target === this.nameInput ||
      event.target === this.styleSelect ||
      event.target === this.colorSelect ||
      event.target === this.positionSelect
    ) {
      this.updatePreview();
    }
  }

  updatePreview() {
    if (!this.signature) return;
    const name = this.nameInput?.value.trim().slice(0, 20) || this.nameInput?.placeholder || '';
    this.signature.textContent = name;
    this.signature.dataset.style = this.styleSelect?.value || 'allura';
    this.signature.dataset.position = this.positionSelect?.value || 'lower_right';
    this.signature.style.setProperty('--signature-color', this.colorSelect?.value || '#111111');
    if (this.count) this.count.textContent = `${this.nameInput?.value.length || 0} / 20`;
  }

  updateVariant() {
    if (!this.variantSelect) return;
    const option = this.variantSelect.selectedOptions[0];
    if (this.price && option?.dataset.price) this.price.textContent = option.dataset.price;
    if (!this.submit) return;
    const available = option?.dataset.available === 'true';
    this.submit.disabled = !available;
    this.submit.textContent = available ? this.submit.dataset.addLabel : this.submit.dataset.soldLabel;
  }

  setTone(tone) {
    this.dataset.tone = tone;
    this.querySelectorAll('[data-customizer-tone]').forEach((button) => {
      const active = button.dataset.customizerTone === tone;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
}

if (!customElements.get('lumasela-customizer')) {
  customElements.define('lumasela-customizer', LumaselaCustomizer);
}
