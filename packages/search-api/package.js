Package.describe({
	summary: "An interface for searching through collections"
});

Package.on_use(function (api, where) {
	api.use(['http', 'permissions-api', 'tags-api'], ['server']);
	api.add_files(['search-api-methods.js'], ['server']);
	api.add_files(['search-api.js'], ['client', 'server']);
	if (api.export) {
		api.export('SearchAPI');
	}
});
