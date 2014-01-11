Package.describe({
  summary: "A module for coordinating other ui modules." + 
		"The highest level module. "
});

Package.on_use(function (api, where) {
  api.use(['templating', 'less', 'editor', 'groups-api', 'accounts-base'],
		  ['client', 'server']);

  api.add_files(['conductor.html', 'conductor.js'], ['client', 'server']);

  if (api.export) {
	  api.export('Conductor');
  }
});
