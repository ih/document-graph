Package.describe({
	summary: "A module for coordinating other ui modules." +
		"The highest level module. "
});

Package.on_use(function (api, where) {
	api.use(['templating', 'less', 'editor', 'accounts-base', 'groups-api',
			 'accounts-password', 'search-interface', 'iron:router',
			 'viewer', 'graph-api', 'mondrian', 'node-list-panel'],
			['client']);
	api.use(['viewer', 'accounts-base', 'accounts-password','groups-api',
			 'underscore', 'search-api'],
			['server']);

	api.add_files(['conductor-server.js'], ['server']);
	api.add_files(
		['router.js', 'conductor.html', 'conductor-client.js', 'conductor.less'], ['client']);

	if (api.export) {
		api.export('Conductor');
	}
});
