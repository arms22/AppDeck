import { createRouter } from './router.js';
import { loadPlugins } from './plugins.js';

const root = document.querySelector('#app');

async function bootstrap() {
  try {
    const response = await fetch('./apps.json');
    if (!response.ok) throw new Error('apps.json を読み込めませんでした。');
    const manifest = await response.json();
    const plugins = await loadPlugins(manifest.apps);
    createRouter({ root, manifest, plugins }).start();
  } catch (error) {
    root.innerHTML = `<main class="error"><h1>App Deck を開始できません</h1><p>${error.message}</p><p>静的サーバー経由で開いているか確認してください。</p></main>`;
  }
}

// `file://` では fetch と module import がブラウザごとに制限されるため、
// index.html が読み込む standalone.js に処理を委ねる。
if (location.protocol !== 'file:') bootstrap();
