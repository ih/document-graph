Package.describe({
  summary:  "A module for viewing documents"
});

Package.on_use(function (api, where) {
  api.use(['templating', 'reactive-dict', 'reactive-var', 'graph-api', 'less',
           'mondrian', 'utility', 'tracker', 'underscore', 'selection-rendering',
           'search-api', 'ratings-api'],        ['client']);
  api.use(['ratings-interface', 'tags-interface', 'tags-api',
           'permissions-api'], ['client', 'server']);

  api.add_files(['viewer.html', 'viewer.js', 'viewer.less'], 'client');

  if (api.export) {
    api.export('Viewer');
  }
});
