var searchHostUrl =
		'http://localhost:9200';
// 'http://api.searchbox.io/api-key/ce2b03bb86b96565d31457f952ddbae3';

Meteor.startup(function () {
	// set the mapping for elasticsearch
	console.log('setting up the elasticsearch mapping');
	// create index
	HTTP.put(searchHostUrl+'/nodes/node/0', {'data': {'node': 'start'}});
	// add mapping
	var mapping = {
		'node': {
			'properties': {
				'privacySettings': {'type': 'string', 'index': 'not_analyzed'}
			}
		}
	};
	HTTP.put(searchHostUrl+'/nodes/node/_mapping', {'data': mapping});
});

function elasticSearchParse(httpResponse) {
	console.log('parsing response');
	console.log(httpResponse);
	return {
		hits: _.map(httpResponse.data.hits.hits, function (hit) {
			console.log(hit);
			return {
				'title': hit._source.title,
				'id': hit._source.objectId,
				'type': hit._type,
				'highlight': hit.highlight};
		}),
		totalHitCount: httpResponse.data.hits.total
	};
}

Meteor.methods({
	find: function (
		collectionName, queryString, offset, pageSize, fields, resultsHandler) {
		var url = searchHostUrl + '/' + collectionName + '/_search';
		console.log('in find method');
		console.log(this.userId);
		var groupKeys = _.pluck(
			GroupsAPI.getMyGroups(this.userId), '_id');
		groupKeys.push('public');
		console.log('searching');
		console.log(groupKeys);
		var queryData = {
			'from': offset,
			'size': pageSize,
			'query': {
				'bool': {
					'should': {
						'multi_match': {
							'query': queryString,
							'fields': fields
						}
					},
					'must': {
						'terms': {
							'privacySettings': groupKeys,
							'minimum_should_match': 1
						}
					}
				}
			},
			'highlight': {
				'fields': {
					'title': {},
					'content': {}
				},
				'require_field_match': true
			}
		};
		console.log('meteor method searching... ');
		console.log(queryData);
		var results = elasticSearchParse(HTTP.get(url, {'data': queryData}));
		return results;
	},
	index: function (collectionName, newDocument) {
		var url = searchHostUrl + '/' + collectionName + '/' +
				collectionName.slice(0, -1) + '/' + newDocument.objectId;
		console.log('meteor method indexing... ');
		console.log(newDocument);
		HTTP.put(url, {'data': newDocument}, function (error, result) {
			console.log(error);
			console.log(result);
			return result;
		});
	}
});
