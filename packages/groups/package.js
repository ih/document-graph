Package.describe({
	summary: "A module wrapping the groups collection.  The layer beneath the" +
		" api modules"
});

Package.on_use(function (api, where) {
	api.use(['memberships'],  ['server']);
	api.add_files(['groups-server.js'], ['server']);
	api.add_files(['groups-client.js'], ['client']);

	if (api.export) {
		api.export('Groups');
	}
});
