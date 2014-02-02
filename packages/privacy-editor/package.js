Package.describe({
	summary: "A module for creating and editing privacy settings"
});

Package.on_use(function (api, where) {
	api.use(
		['templating', 'bootstrap-switch', 'reactive-dict', 'groups-api',
		 'underscore'], ['client']);
	// refactor tag-it to be in its own package and have tag-editor depend on it
	api.add_files(['privacy-editor.html', 'privacy-editor.js'], 'client');

	if (api.export) {
		api.export('PrivacyEditor');
	}
});
