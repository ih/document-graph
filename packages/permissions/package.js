Package.describe({
	summary: 'An interface for determining and setting permissions'
});

Package.on_use(function (api, where) {
	api.use(['groups-api'], ['server']);
	api.add_files(['permissions.js'], ['server']);
	if (api.export) {
		api.export('PermissionsAPI');
	}
});
