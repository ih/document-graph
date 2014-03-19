Package.describe({
	summary: "A module for users to rate things"
});

Package.on_use(function (api, where) {
	api.use(['templating', 'less', 'reactive-dict', 'ratings-api'],
			['client', 'server']);
	api.add_files(['ratings-interface.html', 'ratings-interface.js',
				   'ratings-interface.less'], 'client');

	if (api.export) {
		api.export('RatingsInterface');
	}
});
