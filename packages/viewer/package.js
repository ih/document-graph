Package.describe({
	summary:  "A module for viewing documents"
});

Package.on_use(function (api, where) {
	api.use(['templating', 'reactive-dict', 'graph-api', 'less'],
			['client']);
	api.use(['ratings-interface', 'tags-interface'], ['client', 'server']);

	api.add_files(['viewer.html', 'viewer.js', 'viewer.less'], 'client');

	if (api.export) {
		api.export('Viewer');
	}
});
