Package.describe({
	summary: "A module wrapping the permissions collection.  The layer beneath" +
		" the api modules"
});

Package.on_use(function (api, where) {
	api.add_files(['permissions-server.js'], ['server']);

	if (api.export) {
		api.export('Permissions');
	}
});
