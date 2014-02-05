var searchHostUrl =
		'http://api.searchbox.io/api-key/ce2b03bb86b96565d31457f952ddbae3';

function elasticSearchParse(httpResponse) {
	return _.map(httpResponse.data.hits.hits, function (hit) {
		console.log(hit);
		return {
			'title': hit._source.title, 'id': hit._source.objectId, 'type': hit._type};
	});
}

Meteor.methods({
	find: function (collectionName, queryString, resultsHandler) {
		var url = searchHostUrl + '/' + collectionName + '/_search?q=_all:' +
				queryString;
		console.log('meteor method searching... ');
		var results = elasticSearchParse(HTTP.get(url));
		return results;
	},
	index: function (collectionName, newDocument) {
		var url = searchHostUrl + '/' + collectionName + '/' +
				collectionName.slice(0, -1);
		console.log('meteor method indexing... ');
		console.log(newDocument);
		HTTP.post(url, {'data': newDocument}, function (error, result) {
			console.log(error);
			console.log(result);
			return result;
		});
	}
});
