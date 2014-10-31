Package.describe({
  summary: "A module for creating and editing documents"
});

Package.on_use(function (api, where) {
  api.use(['templating', 'reactive-dict', 'showdown', 'less', 'graph-api',
		   'bootstrap-switch', 'groups-api', 'permissions-api', 'mrt:jquery-ui',
		   'mrt:jquery-ui-bootstrap'], ['client', 'server']);

  api.add_files(
	  ['editor.html', 'editor.js', 'editor.less', 'autogrow.js', 'tag-it.js',
	   'jquery.tagit.css'], 'client');

  if (api.export) {
	  api.export('Editor');
  }
});
