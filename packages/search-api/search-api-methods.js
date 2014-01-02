var searchHostUrl =
		'http://api.searchbox.io/api-key/ce2b03bb86b96565d31457f952ddbae3';

Meteor.methods({
	index: function (collectionName, newDocument) {
		var url = searchHostUrl + '/' + collectionName + '/' + 
				collectionName.slice(0,- 1);
		console.log('meteor method indexing... ');
		console.log(newDocument);
		HTTP.post(url, {'data': newDocument}, function (error, result) {
			console.log(error);
			console.log(result);
			return result;
		});
	}
});
