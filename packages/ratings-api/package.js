Package.describe({
	summary: "An interface for assigning a rating to an object"
});

Package.on_use(function (api, where) {
	api.use(['ratings'], ['client', 'server']);
	api.add_files(['ratings-api.js'], ['client', 'server']);
	if (api.export) {
		api.export('RatingsAPI');
	}
});
