Package.describe({
  summary: "A module for coordinating other ui modules." +
    "The highest level module. "
});

Package.on_use(function (api, where) {
  api.use(['templating', 'less', 'editor', 'accounts-base', 'groups-api',
           'accounts-password', 'search-interface', 'iron:router',
           'viewer', 'graph-api', 'mondrian', 'node-list-panel',
           'permissions-api', 'tags-api', 'documentation', 'product-tour'],
          ['client']);
  api.use(['viewer', 'editor','accounts-base', 'accounts-password','groups-api',
           'underscore', 'graph-api', 'search-api', 'permissions-api',
           'documentation'],
          ['server']);

  api.add_files(['conductor-server.js'], ['server']);
  api.add_files(
    ['router.js', 'conductor.html', 'conductor-client.js', 'conductor.less'],
    ['client']);

  if (api.export) {
    api.export('Conductor');
  }
});
