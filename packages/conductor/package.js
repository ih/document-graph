Package.describe({
	summary: "A module for coordinating other ui modules." +
		"The highest level module. "
});

Package.on_use(function (api, where) {
	api.use(['templating', 'less', 'editor', 'accounts-base', 
			 'accounts-password', 'search-interface', 'viewer', 'groups-api', 'graph-api'],
			['client']);
	api.use(['accounts-base', 'accounts-password','groups-api', 'underscore'],
			['server']);

	api.add_files(['conductor-server.js'], ['server']);
	api.add_files(['conductor.html', 'conductor-client.js'], ['client']);

	if (api.export) {
		api.export('Conductor');
	}
});
