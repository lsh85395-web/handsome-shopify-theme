/* Homepage inspiration only. This module does not access storage, the cart,
   the customizer state, product data, checkout, or any network endpoint. */
(() => {
  'use strict';
  document.querySelectorAll('[data-hc-inspiration]').forEach(root => {
    const controls = root.querySelector('[data-hc-controls]');
    const fontSelect = root.querySelector('[data-hc-font]');
    const families = {'allura':'Lumasela Allura','dancing-script':'Lumasela Dancing Script','great-vibes':'Lumasela Great Vibes','sacramento':'Lumasela Sacramento','kaushan-script':'Lumasela Kaushan Script','knewave':'Lumasela Knewave'};
    const phone = root.querySelector('[data-hc-phone]');
    const signature = root.querySelector('[data-hc-signature]');
    const colorLabel = root.querySelector('[data-hc-color-label]');
    const status = root.querySelector('[data-hc-status]');
    if (!fontSelect || !controls || !phone || !signature || !colorLabel || !status) return;
    const colors = Array.from(root.querySelectorAll('[data-hc-color]'));
    const placements = Array.from(root.querySelectorAll('[data-hc-placement]'));
    let selectedColor = colors.find(button => button.getAttribute('aria-pressed') === 'true');
    let selectedPlacement = placements.find(button => button.getAttribute('aria-pressed') === 'true');
    if (!selectedColor || !selectedPlacement) return;
    function fit() {
      const width=phone.clientWidth, height=phone.clientHeight;
      if(!width || !height) return;
      signature.style.fontSize = `${width*.18}px`;
      const naturalWidth=Math.max(1,signature.offsetWidth), naturalHeight=Math.max(1,signature.offsetHeight);
      const pos=selectedPlacement.dataset.hcPlacement;
      const angle=(pos==='bottom-right-vertical'?90:pos==='bottom-right-diagonal'?22:0)*Math.PI/180;
      const x=pos==='bottom-right-vertical'?.74:pos==='bottom-right-diagonal'?.66:.5;
      const y=pos==='bottom-right-vertical'?.75:pos==='below-logo'?.64:.83;
      const rw=naturalWidth*Math.cos(angle)+naturalHeight*Math.sin(angle), rh=naturalWidth*Math.sin(angle)+naturalHeight*Math.cos(angle);
      const maxW=width*2*Math.min(x-.17,.84-x), maxH=height*2*Math.min(y-.57,.9-y);
      signature.style.setProperty('--hc-fit',String(Math.min(width*.34/naturalWidth,maxW/rw,maxH/rh,1.6)));
    }
    function render() {
      colors.forEach(button => button.setAttribute('aria-pressed', String(button === selectedColor)));
      placements.forEach(button => button.setAttribute('aria-pressed', String(button === selectedPlacement)));
      signature.style.color = selectedColor.dataset.hcColor;
      signature.style.fontFamily = `'${families[fontSelect.value] || families.allura}', cursive`;
      phone.dataset.hcPosition = selectedPlacement.dataset.hcPlacement;
      colorLabel.textContent = selectedColor.dataset.hcLabel;
      status.textContent = `Aina · ${fontSelect.options[fontSelect.selectedIndex].text} · ${selectedColor.dataset.hcLabel} · ${selectedPlacement.dataset.hcLabel}`;
      fit();
      document.fonts?.ready.then(fit);
    }
    function connect(buttons, select) {
      buttons.forEach((button, index) => {
        button.addEventListener('click', () => { select(button); render(); });
        // All choices remain ordinary, tab-reachable pressed buttons. Arrow keys
        // are an extra convenience, not a substitute for native Enter / Space.
        button.addEventListener('keydown', event => {
          let next;
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
          else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + buttons.length - 1) % buttons.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = buttons.length - 1;
          else return;
          event.preventDefault();
          select(buttons[next]);
          render();
          buttons[next].focus();
        });
      });
    }
    connect(colors, button => { selectedColor = button; });
    connect(placements, button => { selectedPlacement = button; });
    fontSelect.addEventListener('change', render);
    window.addEventListener('resize', fit);
    document.fonts?.addEventListener('loadingdone', fit);
    render();
    controls.hidden = false;
  });
})();
