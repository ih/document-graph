Package.describe({
  summary: "A module for searching and displaying the results of search"
});

Package.on_use(function (api, where) {
  api.use(
	  ['templating', 'less', 'reactive-dict','search-api', 'graph-api'],
	  ['client']);

  api.add_files(
	  ['search-interface.html', 'search-interface.js'], 'client');

  if (api.export) {
	  api.export('SearchInterface');
  }
});
