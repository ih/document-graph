/** A tag is a string associated with an object
*/
TagsAPI = {
	tagProperties: ['objectId', 'tag'],
	// add allow rules to Tags that call the securityAPI or 
	// each API should handle it's own security
	createTag: function (tagData) {
		var tagId = Tags.insert(tagData);
		var recordId = RecordsAPI.record({
			'objectId': tagId,
			'type': 'create',
			'userId': Meteor.userId()
		});

		// TODO index the tag if it isn't in the index already, useful
		// for autocomplete when adding tags to a node
		// also add the user's id to the search index document so autocomplete
		// can rank tags created by the user higher
		// SearchAPI.index('nodes', _.extend(nodeData, {'_id': nodeId}));
		return tagId;
	},
	getTags: function (objectId) {
		Meteor.subscribe('tags', objectId);
		return Tags.find({'objectId': objectId});
	}
};
