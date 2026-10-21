document.addEventListener('input', (event) => {
  if (!event.target.matches('[data-hs-comparison] input[type="range"]')) return;
  event.target.closest('[data-hs-comparison]').style.setProperty('--compare', event.target.value + '%');
});
