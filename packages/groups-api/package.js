Package.describe({
	summary: "An interface for creating and performing operations on groups"
});

Package.on_use(function (api, where) {
	api.use(['records-api', 'groups', 'memberships', 'accounts-base'], ['client', 'server']);
	api.add_files(['groups-api.js'], ['client', 'server']);
	if (api.export) {
		api.export('GroupsAPI');
	}
});
