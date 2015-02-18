Package.describe({
  summary: "A module wrapping the links collection.  The layer beneath the" +
    " api modules"
});

Package.on_use(function (api, where) {
  api.use(['permissions-api'], ['server']);
  api.add_files(['links-server.js'], ['server']);
  api.add_files(['links-client.js'], ['client']);

  if (api.export) {
    api.export('Links');
  }
});
