Package.describe({
  summary: "A module for searching and displaying the results of search"
});

Package.on_use(function (api, where) {
  api.use(
	  ['templating', 'less', 'reactive-dict', 'reactive-var', 'search-api', 
	   'graph-api', 'mondrian'], ['client']);

  api.add_files(
	  ['search-interface.html', 'search-interface.js', 'search-interface.less'],
	  'client');

  if (api.export) {
	  api.export('SearchInterface');
  }
});
