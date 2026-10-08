/** App manifest entries become plugins here. Add a renderer module per `type`. */
const renderers = {
  'top-level': () => import('./plugins/top-level-plugin.js'),
};

export async function loadPlugins(apps) {
  const enabledApps = apps.filter((app) => app.enabled !== false);
  const plugins = await Promise.all(enabledApps.map(async (app) => {
    const loader = renderers[app.type];
    if (!loader) return [app.id, { ...app, error: `未対応の plugin type: ${app.type}` }];
    const module = await loader();
    return [app.id, { ...app, render: module.render }];
  }));
  return new Map(plugins);
}
