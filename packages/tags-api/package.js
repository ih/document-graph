Package.describe({
	summary: "An interface for performing operations related to tags"
});

Package.on_use(function (api, where) {
	api.use(['tags', 'records-api'], ['client', 'server']);
	api.add_files(['tags-api.js'], ['client', 'server']);
	if (api.export) {
		api.export('TagsAPI');
	}
});
