Package.describe({
	summary: "A module wrapping the tags collection.  The layer beneath the" +
		" api modules"
});

Package.on_use(function (api, where) {

	api.add_files(['tags.js'], ['client', 'server']);

	if (api.export) {
		api.export('Tags');
	}
});
