/* Shared renderer for HTTP hosting and direct-file operation. */
(() => {
  const storageKey = 'app-deck-app-order';
  const icons = { 'document-search': '⌕', image: '▧', code: '{}' };
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);

  window.renderAppDeckLauncher = (root, manifest, apps) => {
    let saved = [];
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(value)) saved = [...new Set(value.filter((id) => typeof id === 'string'))];
    } catch { /* A blocked or invalid store must not prevent launching apps. */ }
    const rank = (app) => saved.includes(app.id) ? saved.indexOf(app.id) : saved.length;
    const ordered = [...apps].sort((a, b) => rank(a) - rank(b));
    root.innerHTML = `<main class="shell"><header class="hero"><p class="eyebrow">STATIC APP LAUNCHER</p><h1>${esc(manifest.launcher.title)}</h1><p>${esc(manifest.launcher.subtitle)}</p><p class="reorder-help" id="reorder-help">カードをドラッグして並べ替え。順番は自動保存されます。</p></header><section class="app-grid" aria-label="アプリ一覧">${ordered.map((app) => `<a class="app-card" draggable="true" data-app-id="${esc(app.id)}" aria-describedby="reorder-help" href="${esc(app.entry)}"><span class="app-icon" aria-hidden="true">${icons[app.icon] || '◌'}</span><span class="app-category">${esc(app.category || 'アプリ')}</span><h2>${esc(app.name)}</h2><p>${esc(app.description || '')}</p><span class="open">開く <b>→</b></span></a>`).join('')}</section><p class="reorder-status" role="status" aria-live="polite"></p></main>`;
    const grid = root.querySelector('.app-grid');
    const status = root.querySelector('.reorder-status');
    let dragged = null;
    let suppressClick = false;
    const cards = () => [...grid.children];
    const clearDrop = () => cards().forEach((card) => card.classList.remove('drop-target'));
    const save = (card) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(cards().map((item) => item.dataset.appId)));
        status.textContent = `${card.querySelector('h2').textContent}を${cards().indexOf(card) + 1}番目に移動しました。`;
      } catch {
        status.textContent = '並べ替えましたが、ブラウザに保存できませんでした。';
      }
    };
    const move = (card, target) => {
      const list = cards();
      if (list.indexOf(card) < list.indexOf(target)) target.after(card);
      else target.before(card);
      save(card);
    };
    cards().forEach((card) => {
      card.addEventListener('dragstart', (event) => {
        dragged = card;
        suppressClick = true;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', card.dataset.appId);
        card.classList.add('dragging');
      });
      card.addEventListener('dragover', (event) => {
        if (!dragged || dragged === card) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        clearDrop();
        card.classList.add('drop-target');
      });
      card.addEventListener('dragleave', () => card.classList.remove('drop-target'));
      card.addEventListener('drop', (event) => {
        if (!dragged) return;
        event.preventDefault();
        if (dragged !== card) move(dragged, card);
        dragged.focus();
        clearDrop();
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        clearDrop();
        dragged = null;
        setTimeout(() => { suppressClick = false; }, 0);
      });
      card.addEventListener('click', (event) => {
        if (suppressClick) event.preventDefault();
      });
    });
  };
})();
