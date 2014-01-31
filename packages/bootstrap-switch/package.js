Package.describe({
  summary: "A wrapper for bootstrap-switch http://www.bootstrap-switch.org/"
});

Package.on_use(function (api, where) {
  api.use(['jquery'], ['client']);

  api.add_files(['bootstrap-switch.js', 'bootstrap-switch.css'], 'client');
});
