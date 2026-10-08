/* Minimal file:// runtime. Normal hosting uses the ES-module runtime in main.js. */
(() => {
  if (location.protocol !== 'file:') return;
  const root = document.querySelector('#app');
  const manifest = window.APP_DECK_FILE_MANIFEST;
  if (!manifest) return;
  const icons = { 'document-search': '⌕', image: '▧', code: '{}' };
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);

  function launcher() {
    const apps = manifest.apps.filter((app) => app.enabled !== false);
    root.innerHTML = `<main class="shell"><header class="hero"><p class="eyebrow">STATIC APP LAUNCHER</p><h1>${esc(manifest.launcher.title)}</h1><p>${esc(manifest.launcher.subtitle)}</p></header><section class="app-grid" aria-label="アプリ一覧">${apps.map((app) => `<a class="app-card" href="${app.type === 'top-level' ? esc(app.entry) : `#/app/${encodeURIComponent(app.id)}`}"><span class="app-icon" aria-hidden="true">${icons[app.icon] || '◌'}</span><span class="app-category">${esc(app.category || 'アプリ')}</span><h2>${esc(app.name)}</h2><p>${esc(app.description || '')}</p><span class="open">開く <b>→</b></span></a>`).join('')}</section></main>`;
  }
  function app(id) {
    const item = manifest.apps.find((candidate) => candidate.id === id && candidate.enabled !== false);
    if (!item) { root.innerHTML = '<main class="error"><h1>アプリが見つかりません</h1><a href="#/">ランチャーへ戻る</a></main>'; return; }
    location.assign(item.entry);
  }
  function resolve() {
    const match = (location.hash.slice(1) || '/').match(/^\/app\/([^/]+)$/);
    match ? app(decodeURIComponent(match[1])) : launcher();
  }
  addEventListener('hashchange', resolve);
  resolve();
})();
