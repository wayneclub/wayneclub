'use strict';
(() => {
  const trigger = document.querySelector('.language-button');
  const dialog = document.getElementById('language-sheet');
  const sync = () => {
    const lang = document.documentElement.lang;
    document.querySelector('.language-code').textContent = {en:'EN','zh-Hant':'繁','zh-Hans':'简'}[lang];
    dialog.querySelectorAll('[data-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === lang));
    });
  };
  trigger.addEventListener('click', () => {
    sync();
    dialog.showModal();
    document.body.classList.add('sheet-open');
  });
  dialog.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => {
      const select = document.getElementById('language-select');
      select.value = button.dataset.language;
      select.dispatchEvent(new Event('change', {bubbles:true}));
      sync();
      dialog.close();
    });
  });
  window.addEventListener('wayne:language', sync);
  sync();
})();
