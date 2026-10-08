(() => {
  const storageKey = 'app-deck-theme';
  const allowed = new Set(['dark', 'light']);
  const root = document.documentElement;
  let current = 'dark';
  try { current = localStorage.getItem(storageKey) || current; } catch { /* private mode */ }
  if (!allowed.has(current)) current = 'dark';
  const apply = (theme) => { root.dataset.theme = theme === 'dark' ? '' : theme; try { localStorage.setItem(storageKey, theme); } catch { /* private mode */ } };
  apply(current);
  const title = document.body.dataset.appTitle || document.title.replace(' | App Deck', '');
  const bar = document.createElement('nav');
  bar.className = 'app-topbar';
  bar.setAttribute('aria-label', 'アプリ操作');
  bar.innerHTML = `<a class="app-topbar__brand" href="../../index.html#/">← App Deck</a><span class="app-topbar__title"></span><span class="app-topbar__spacer"></span><label class="app-topbar__label" for="app-theme">テーマ</label><select id="app-theme" aria-label="カラーテーマ"><option value="dark">ダーク</option><option value="light">ライト</option></select>`;
  bar.querySelector('.app-topbar__title').textContent = title;
  const select = bar.querySelector('#app-theme'); select.value = current;
  select.addEventListener('change', () => apply(select.value));
  document.body.prepend(bar);
})();
