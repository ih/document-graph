Package.describe({
  summary: "A module for creating and editing documents"
});

Package.on_use(function (api, where) {
  api.use(['templating', 'reactive-dict', 'marked', 'less', 'graph-api'],
		  ['client', 'server']);

  api.add_files(['editor.html', 'editor.js', 'editor.less'], 'client');

  if (api.export) {
	  api.export('Editor');
  }
});
