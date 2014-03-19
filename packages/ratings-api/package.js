Package.describe({
	summary: "An interface for assigning a rating to an object"
});

Package.on_use(function (api, where) {
	api.use(['permissions-api'], ['server']);
	api.add_files(['ratings-api.js', 'ratings-collections.js'],
				  ['client', 'server']);
	if (api.export) {
		api.export('RatingsAPI');
	}
});
