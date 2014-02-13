Package.describe({
	summary:  "A module for viewing documents"
});

Package.on_use(function (api, where) {
	api.use(['templating', 'reactive-dict', 'graph-api'], ['client']);

	api.add_files(['viewer.html', 'viewer.js'], 'client');

	if (api.export) {
		api.export('Viewer');
	}
});
