Package.describe({
	summary: "An interface for determining permissions."
});

Package.on_use(function (api, where) {
	api.use(['groups-api'], ['server']);
	api.add_files(['permissions-api.js'], ['server']);
	if (api.export) {
		api.export('PermissionsAPI');
	}
});
