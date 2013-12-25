// TODO maybe inject this into the package
// probably want to do this via meteor methods on the server so client
// doesn't see api key

SearchAPI = {
	find: function (collectionName, queryString) {

	},
	index: function (collectionName, newDocument) {
		Meteor.call('index', collectionName, newDocument, function (error, result) {
			console.log(error);
			console.log(result);
		});
	}
};
