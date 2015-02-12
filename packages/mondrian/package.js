Package.describe({
  summary:  "A module for viewing multiple things at the same time."
});

Package.on_use(function (api, where) {
  api.use(['templating', 'reactive-dict', 'less', 'documentation', 'graph-api'],
          ['client']);

  api.add_files([
    'mondrian.html', 'mondrian.js', 'mondrian.less'], 'client');

  if (api.export) {
    api.export('Mondrian');
  }
});
