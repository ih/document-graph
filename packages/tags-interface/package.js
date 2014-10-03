Package.describe({
	summary: "A module for displaying tags.  For now this only includes the " +
		"the viewer, but in the future it should have the editor has well."
});

Package.on_use(function (api, where) {
	api.use(['templating', 'less', 'tags-api'], 'client');
	api.add_files(['tags-interface.html', 'tags-interface.js',
				   'tags-interface.less'], 'client');

	if (api.export) {
		api.export('TagsInterface');
	}
});
