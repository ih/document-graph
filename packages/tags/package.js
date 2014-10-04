Package.describe({
	summary: "A module wrapping the tags collection.  The layer beneath the" +
		" api modules"
});

Package.on_use(function (api, where) {
	api.use(['permissions-api'], 'server');
	api.add_files(['tags-client.js'], 'client');
	api.add_files(['tags-server.js'], 'server');

	if (api.export) {
		api.export('Tags');
	}
});
