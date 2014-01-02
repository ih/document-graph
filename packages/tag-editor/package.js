Package.describe({
  summary: "A module for creating and editing tags"
});

Package.on_use(function (api, where) {
  api.use(['templating', 'reactive-dict', 'less', 'jqueryui'],
		  ['client', 'server']);

  api.add_files(['tag-editor.html', 'tag-editor.js', 'tag-editor.less',
				 'tag-it.js', 'jquery.tagit.css'], 'client');

  if (api.export) {
	  api.export('TagEditor');
  }
});
