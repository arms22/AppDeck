export function renderApp(root, app) {
  if (!app) {
    root.innerHTML = '<main class="error"><h1>アプリが見つかりません</h1><a href="#/">ランチャーへ戻る</a></main>';
    return;
  }
  app.render?.(root, app);
}
