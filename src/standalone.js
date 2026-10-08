/* Minimal file:// runtime. Normal hosting uses the ES-module runtime in main.js. */
(() => {
  if (location.protocol !== 'file:') return;
  const root = document.querySelector('#app');
  const manifest = window.APP_DECK_FILE_MANIFEST;
  if (!manifest) return;

  function launcher() {
    const apps = manifest.apps.filter((app) => app.enabled !== false);
    window.renderAppDeckLauncher(root, manifest, apps);
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
