/* Runs before paint; only reads device-local display preferences. */
(() => {
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const resolveLanguage = languages => {
    for (const raw of languages || []) {
      const code = raw.toLowerCase().replaceAll('_', '-');
      if (/^zh(?:-|$)/.test(code)) {
        if (code.includes('hant')) return 'zh-Hant';
        if (code.includes('hans')) return 'zh-Hans';
        return /-(tw|hk|mo)(-|$)/.test(code) ? 'zh-Hant' : 'zh-Hans';
      }
      if (/^en(?:-|$)/.test(code)) return 'en';
    }
    return 'en';
  };
  const routeLanguage = {'/en/':'en','/zh-hant/':'zh-Hant','/zh-hans/':'zh-Hans'}[location.pathname];
  const language = routeLanguage || read('wayne-language');
  const appearance = read('wayne-appearance');
  window.waynePreferences = {read, resolveLanguage, routeLanguage};
  document.documentElement.lang = ['en', 'zh-Hant', 'zh-Hans'].includes(language) ? language : resolveLanguage(navigator.languages || [navigator.language]);
  document.documentElement.dataset.appearance = ['light','dark'].includes(appearance) ? appearance : 'auto';
})();
