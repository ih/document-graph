Package.describe({
  summary: "A module for creating and editing documents"
});

Package.on_use(function (api, where) {
  api.use(['templating', 'reactive-dict', 'showdown', 'less', 'graph-api', 
		   'tag-editor', 'tags-api'],
		  ['client', 'server']);

  api.add_files(
	  ['editor.html', 'editor.js', 'editor.less', 'autogrow.js'], 'client');

  if (api.export) {
	  api.export('Editor');
  }
});
