Package.describe({
	summary: "A module wrapping the groups collection.  The layer beneath the" +
		" api modules"
});

Package.on_use(function (api, where) {
	api.add_files(['groups.js'], ['client', 'server']);

	if (api.export) {
		api.export('Groups');
	}
});
