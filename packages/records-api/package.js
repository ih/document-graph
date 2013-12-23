Package.describe({
	summary: "An interface for recording actions in the system along with" + 
		" relevant meta-data."
});

Package.on_use(function (api, where) {
	api.use('records', ['client', 'server']);
	api.add_files(['records-api.js'], ['client', 'server']);

	if (api.export) {
		api.export('RecordsAPI');
	}
});
