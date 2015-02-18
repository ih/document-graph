Package.describe({
  summary: "A module wrapping the permissions collection.  The layer beneath" +
    " the api modules"
});

Package.on_use(function (api, where) {
  api.use(['groups-api'], ['server']);
  api.add_files(['permissions-server.js'], ['server']);
  api.add_files(['permissions-client.js'], ['client']);

  if (api.export) {
    api.export('Permissions');
  }
});
