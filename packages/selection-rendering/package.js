Package.describe({
  summary: "Some utility functions for displaying selections/links in " +
    "node content.  Used by packages like the editor and viewer."
});

Package.on_use(function (api, where) {
  api.use(['underscore', 'reactive-dict', 'utility'], ['client']);
  api.add_files('selection-rendering.js', ['client']);

  if (api.export) {
    api.export('SelectionRendering');
  }
});
