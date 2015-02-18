Package.describe({
  summary: "General utility functions."
});

Package.on_use(function (api, when) {
  api.use(['underscore', 'reactive-dict'], ['client', 'server']);
  api.add_files(['utility.js'], ['client', 'server']);

  if (api.export) {
    api.export('Utility');
  }
});
