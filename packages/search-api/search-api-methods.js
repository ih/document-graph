var searchHostUrl =	'http://localhost:9200';
if (Meteor.settings.elasticSearchServer) {
	searchHostUrl =	Meteor.settings.elasticSearchServer;
}

console.log('Searching with ' + searchHostUrl);

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
	return {
		hits: _.map(httpResponse.data.hits.hits, function (hit) {
			return {
				'title': hit._source.title,
				'id': hit._source._id,
				'type': hit._type,
				'highlight': hit.highlight,
				'score': hit._score
			};
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
		// assumes user has read access for all their groups
		var userActorIds = PermissionsAPI.getUserActorIds(this.userId);
		console.log('searching');
		console.log(userActorIds);
		// remove date fields, TODO find a better way to do this
		// maybe make fields a dictionary keyed by field type
		fields = _.without(fields, 'createdAt');
		console.log(fields);
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
							'privacySettings': userActorIds,
							'minimum_should_match': 1
						}
					}
				}
			},
			'highlight': {
				'fields': {
					'title': {},
					'content': {},
					'tags': {}
				},
				'require_field_match': true
			}
		};
		console.log('meteor method searching... ');
		try {
			var results = elasticSearchParse(HTTP.get(url, {'data': queryData}));
		} catch (e) {
			console.log('error with search');
			console.log(JSON.stringify(e));
		}

		return results;
	},
	index: function (collectionName, newDocument) {
		var url = searchHostUrl + '/' + collectionName + '/' +
				collectionName.slice(0, -1) + '/' + newDocument._id;
		console.log('meteor method indexing... ');
		console.log(newDocument);
		// TODO remove if start using a crawler to index documents
		// using id instead of _id since that causes an error with elasticsearch
		// perhaps move this into the editor package so that the access
		// related tags can be added to search index document
		var permissions = PermissionsAPI.getResourcePermissions(newDocument._id);
		var readPermissions = _.filter(permissions, function (permission) {
			return _.contains(permission.actions, 'read');
		});
		var validActors = _.pluck(readPermissions, 'actorId');
		newDocument.privacySettings = validActors;
		newDocument.tags = _.pluck(TagsAPI.getTags(newDocument._id), 'label');
		console.log('about to put the document:' + JSON.stringify(newDocument));

		HTTP.put(url, {'data': newDocument}, function (error, result) {
			console.log(error);
			console.log(result);
			return result;
		});
	},
	remove: function (collectionName, document) {
		var url = searchHostUrl + '/' + collectionName + '/' + 
				collectionName.slice(0, -1) + '/' + document._id;
		HTTP.del(url);
	}
});
