Package.describe({
	summary: "A module wrapping the records collection.  Records keep track " +
		"of actions taken on models along with the relevant metadata"
});

Package.on_use(function (api, where) {

  api.add_files(['records.js'], ['client', 'server']);

  if (api.export) {
	  api.export('Records');
  }
});
