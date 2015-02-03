Package.describe({
	summary:  "A module for creating and accessing content that documents the system "
});

Package.on_use(function (api) {
	api.use(['nodes', 'utility', 'permissions-api', 'groups-api', 'tags', 
			 'tags-api', 'search-api'],
			'server');
	api.add_files(['create-documentation.js'], 'server');
	api.add_files(['documentation.js'], 'client');

	if (api.export) {
		api.export('Documentation');
	}
});
