Package.describe({
	summary: "A module wrapping the nodes collection.  The layer beneath the" +
		" api modules"
});

Package.on_use(function (api, where) {

	api.add_files(['nodes-server.js'], ['server']);
	api.add_files(['nodes-client.js'], ['client']);

	if (api.export) {
		api.export('Nodes');
	}
});
