export function renderLauncher(root, manifest, plugins) {
  window.renderAppDeckLauncher(root, manifest, [...plugins.values()]);
}
