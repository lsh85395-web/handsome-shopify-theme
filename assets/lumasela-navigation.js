(() => {
  if (window.lumaselaNavigationReady) return;
  window.lumaselaNavigationReady = true;
  const initialize = (scope = document) => {
    scope.querySelectorAll('[data-lumasela-navigation]').forEach((root) => {
      if (root.dataset.initialized) return;
      const dialog = root.querySelector('dialog');
      const opener = root.querySelector('[data-lumasela-menu-open]');
      const closer = root.querySelector('[data-lumasela-menu-close]');
      if (!dialog || !opener || !closer) return;
      root.dataset.initialized = 'true';
      let previousOverflow = '';
      let previousPadding = '';
      let previousHtmlOverflow = '';
      let locked = false;
      const unlock = () => {
        if (!locked) return;
        document.body.style.overflow = previousOverflow;
        document.body.style.paddingRight = previousPadding;
        document.documentElement.style.overflow = previousHtmlOverflow;
        locked = false;
        opener.setAttribute('aria-expanded', 'false');
        if (opener.isConnected) opener.focus({ preventScroll: true });
      };
      opener.addEventListener('click', () => {
        if (dialog.open) return;
        previousOverflow = document.body.style.overflow;
        previousPadding = document.body.style.paddingRight;
        previousHtmlOverflow = document.documentElement.style.overflow;
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        dialog.showModal();
        locked = true;
        if (scrollbar > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        opener.setAttribute('aria-expanded', 'true');
        closer.focus({ preventScroll: true });
      });
      closer.addEventListener('click', () => dialog.close());
      dialog.addEventListener('close', unlock);
      dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        dialog.close();
      });
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      });
      dialog.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => dialog.close()));
      dialog.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        const items = [...dialog.querySelectorAll('a[href],button:not([disabled])')].filter((item) => item.getClientRects().length);
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
      const unload = (event) => {
        if (!event.target.contains(root)) return;
        if (dialog.open) dialog.close();
        unlock();
        document.removeEventListener('shopify:section:unload', unload);
      };
      document.addEventListener('shopify:section:unload', unload);
    });
  };
  initialize();
  document.addEventListener('shopify:section:load', (event) => initialize(event.target));
})();
