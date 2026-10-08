/**
 * APIs such as showDirectoryPicker() require a top-level browsing context.
 * This renderer replaces the launcher URL with the app's own static page.
 */
export function render(_container, app) {
  location.assign(app.entry);
}
