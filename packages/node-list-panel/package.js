Package.describe({
	summary: "Logic and presentation for the node list on either side of" + 
		" Mondrian"
});

Package.on_use(function (api, where) {
	api.use(['templating', 'less',  'mondrian', 'viewer'], ['client']);

	api.add_files(['node-list-panel.html', 'node-list-panel.js'], 'client');

	if (api.export) {
		api.export('NodeListPanel');
	}
});
