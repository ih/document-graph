Package.describe({
	summary: "A module wrapping the memberships collection.  These models" +
		" connect a user to group and specify what role they have in the group"
});

Package.on_use(function (api, where) {

	api.add_files(['memberships.js'], ['server']);
	api.add_files(['memberships-client.js'], ['client']);

	if (api.export) {
		api.export('Memberships');
	}
});
