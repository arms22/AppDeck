import { renderLauncher } from './views/launcher.js';
import { renderApp } from './views/app.js';

export function createRouter({ root, manifest, plugins }) {
  const routes = {
    '/': () => renderLauncher(root, manifest, plugins),
    '/app/:id': (id) => renderApp(root, plugins.get(id)),
  };

  function resolve() {
    const hash = location.hash.slice(1) || '/';
    const appMatch = hash.match(/^\/app\/([^/]+)$/);
    if (appMatch) return routes['/app/:id'](decodeURIComponent(appMatch[1]));
    return routes['/']();
  }

  return { start() { addEventListener('hashchange', resolve); resolve(); } };
}
