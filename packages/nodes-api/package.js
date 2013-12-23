Package.describe({
	summary: "An interface for creating and performing operations on node data"
});

Package.on_use(function (api, where) {
	api.use(['nodes', 'records-api'], ['client', 'server']);
	api.add_files(['nodes-api.js'], ['client', 'server']);
	if (api.export) {
		api.export('NodesAPI');
	}
});
