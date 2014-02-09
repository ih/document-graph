// TODO maybe inject this into the package
// probably want to do this via meteor methods on the server so client
// doesn't see api key

SearchAPI = {
	find: function (
		collectionName, queryString, offset, pageSize, fields, resultsHandler) {
		Meteor.call(
			'find', collectionName, queryString, offset, pageSize, fields,
			resultsHandler);
	},
	index: function (collectionName, newDocument) {
		// no callback to make this a synchronous
		// call (http://docs.meteor.com/#meteor_call)
		// this is important because for nodes we want to create the search
		// document then add access information to the document right after
		Meteor.call('index', collectionName, newDocument);
	}
};
