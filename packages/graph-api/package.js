Package.describe({
  summary: "An interface for creating and performing operations on node data"
});

Package.on_use(function (api, where) {
  api.use(['nodes', 'links', 'records-api', 'search-api', 'permissions-api',
           'tags-api', 'utility'],
          ['client', 'server']);
  api.add_files(['graph-api.js'], ['client', 'server']);
  if (api.export) {
    api.export('GraphAPI');
  }
});
