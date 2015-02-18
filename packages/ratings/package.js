Package.describe({
  summary: "A module wrapping the ratings collection.  The layer beneath the" +
    " api modules"
});

Package.on_use(function (api, where) {
  api.use(['permissions-api'], ['server']);
  api.add_files(['ratings-server.js'], ['server']);
  api.add_files(['ratings-client.js'], ['client']);

  if (api.export) {
    api.export('Ratings');
  }
});
