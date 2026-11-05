if (!customElements.get('lumasela-home-steps')) {
  customElements.define('lumasela-home-steps', class extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      this.tabs = [...this.querySelectorAll('[data-step-tab]')];
      this.panels = [...this.querySelectorAll('[data-step-panel]')];
      this.tablist = this.querySelector('.lumasela-home-steps__tabs');
      this.selected = 0;
      this.mobile = window.matchMedia('(max-width: 749px)');
      this.update = () => {
        this.tablist.hidden = this.mobile.matches;
        this.tablist.setAttribute('role', 'tablist');
        this.tabs.forEach((tab, index) => {
          tab.setAttribute('role', 'tab');
          tab.setAttribute('aria-selected', String(index === this.selected));
          tab.tabIndex = index === this.selected ? 0 : -1;
          this.panels[index].hidden = !this.mobile.matches && index !== this.selected;
          if (this.mobile.matches) {
            this.panels[index].removeAttribute('role');
            this.panels[index].removeAttribute('aria-labelledby');
            this.panels[index].removeAttribute('tabindex');
          } else {
            this.panels[index].setAttribute('role', 'tabpanel');
            this.panels[index].setAttribute('aria-labelledby', tab.id);
            this.panels[index].tabIndex = 0;
          }
        });
      };
      this.tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => { this.selected = index; this.update(); });
        tab.addEventListener('keydown', event => {
          let next = index;
          if (event.key === 'ArrowRight') next = (index + 1) % this.tabs.length;
          else if (event.key === 'ArrowLeft') next = (index + this.tabs.length - 1) % this.tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = this.tabs.length - 1;
          else return;
          event.preventDefault();
          this.selected = next;
          this.update();
          this.tabs[next].focus();
        });
      });
      this.mobile.addEventListener('change', this.update);
      this.update();
    }
    disconnectedCallback() {
      this.mobile?.removeEventListener('change', this.update);
      this.initialized = false;
    }
  });
}
if (!customElements.get('lumasela-home-rail')) {
  customElements.define('lumasela-home-rail', class extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      this.track = this.querySelector('[data-home-track]');
      this.counter = this.querySelector('[data-home-position]');
      if (!this.track || !this.counter) return;
      this.update = () => {
        const bounds = this.track.getBoundingClientRect();
        const items = [...this.track.children];
        let nearest = 0;
        let distance = Infinity;
        items.forEach((item, index) => {
          const current = Math.abs(item.getBoundingClientRect().left - bounds.left);
          if (current < distance) { distance = current; nearest = index; }
        });
        this.counter.textContent = `${nearest + 1} / ${items.length}`;
      };
      this.track.addEventListener('scroll', this.update, { passive: true });
      this.update();
    }
    disconnectedCallback() {
      this.track?.removeEventListener('scroll', this.update);
      this.initialized = false;
    }
  });
}
