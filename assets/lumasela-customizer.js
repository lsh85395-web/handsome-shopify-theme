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
    this.querySelectorAll('[data-customizer-style-choices], [data-customizer-color-choices], [data-customizer-position-choices]').forEach((group) => {
      group.addEventListener('click', (event) => this.chooseOption(event, group));
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

  chooseOption(event, group) {
    const button = event.target.closest('button[data-style-value], button[data-color-value], button[data-position-value]');
    if (!button || !group.contains(button)) return;
    group.querySelectorAll('button').forEach((choice) => {
      const selected = choice === button;
      choice.classList.toggle('is-active', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });
    const field = group.querySelector('input[type="hidden"]');
    if (field) field.value = button.dataset.styleLabel || button.dataset.colorLabel || button.dataset.positionLabel || '';
    this.updatePreview();
  }

  updatePreview() {
    if (!this.signature) return;
    const name = this.nameInput?.value.trim().slice(0, 20) || this.nameInput?.placeholder || '';
    this.signature.textContent = name;
    this.signature.dataset.style = this.querySelector('[data-customizer-style-choices] .is-active')?.dataset.styleValue || 'allura';
    this.signature.dataset.position = this.querySelector('[data-customizer-position-choices] .is-active')?.dataset.positionValue || 'center';
    this.signature.style.setProperty('--signature-color', this.querySelector('[data-customizer-color-choices] .is-active')?.dataset.colorValue || '#ffffff');
    if (this.count) this.count.textContent = `${this.nameInput?.value.length || 0} / 20`;
    this.fitSignature();
  }

  fitSignature() {
    const media = this.signature.closest('.lumasela-customizer__media');
    if (!media) return;
    this.signature.style.fontSize = '';
    const availableWidth = media.clientWidth * 0.30;
    const naturalWidth = this.signature.scrollWidth;
    if (naturalWidth > availableWidth) {
      const fontSize = parseFloat(getComputedStyle(this.signature).fontSize);
      this.signature.style.fontSize = `${Math.max(8, fontSize * availableWidth / naturalWidth)}px`;
    }
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

}

if (!customElements.get('lumasela-customizer')) {
  customElements.define('lumasela-customizer', LumaselaCustomizer);
}
