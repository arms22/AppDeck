const icons = {
  'document-search': '⌕',
  image: '▧',
};

export function renderLauncher(root, manifest, plugins) {
  const apps = [...plugins.values()];
  root.innerHTML = `<main class="shell"><header class="hero"><p class="eyebrow">STATIC APP LAUNCHER</p><h1>${manifest.launcher.title}</h1><p>${manifest.launcher.subtitle}</p></header><section class="app-grid" aria-label="アプリ一覧">${apps.map((app) => `<a class="app-card" href="${app.type === 'top-level' ? app.entry : `#/app/${encodeURIComponent(app.id)}`}"><span class="app-icon" aria-hidden="true">${icons[app.icon] || '◌'}</span><span class="app-category">${app.category || 'アプリ'}</span><h2>${app.name}</h2><p>${app.description || ''}</p><span class="open">開く <b>→</b></span></a>`).join('')}</section></main>`;
}
