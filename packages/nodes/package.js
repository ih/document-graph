Package.describe({
	summary: "A module wrapping the nodes collection.  The layer beneath the" +
		" api modules"
});

Package.on_use(function (api, where) {

	api.add_files(['nodes.js'], ['client', 'server']);

	if (api.export) {
		api.export('Nodes');
	}
});
