Package.describe({
	summary:  "A viewer for displaying a node that is being linked"
});

Package.on_use(function (api, where) {
	api.use(['templating', 'less', 'underscore', 'viewer', 'mondrian'],
			['client']);

	api.add_files(
		['linking-viewer.html', 'linking-viewer.js', 'linking-viewer.less'],
		'client');

	if (api.export) {
		api.export('LinkingViewer');
	}
});

