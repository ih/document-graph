Package.describe({
	summary: "A module for creating and editing tags"
});

Package.on_use(function (api, where) {
	api.use(['templating', 'less', 'jqueryui'],
			['client', 'server']);
	// refactor tag-it to be in its own package and have tag-editor depend on it
	api.add_files(['tag-editor.html', 'tag-editor.js', 'tag-editor.less',
				   'tag-it.js', 'jquery.tagit.css'], 'client');

	if (api.export) {
		api.export('TagEditor');
	}
});

