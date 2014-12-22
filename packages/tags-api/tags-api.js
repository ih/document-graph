/** A tag is a string associated with an object
*/
TagsAPI = {
	tagProperties: ['objectId', 'label', 'type', 'createdAt'],
	USER: 'user',
	SYSTEM: 'system',
	tagTypes: ['user', 'system'],
	// add allow rules to Tags that call the securityAPI or
	// each API should handle it's own security
	createTag: function (tagData) {
		tagData.createdAt = Utility.makeTimeStamp();
		if (!_.has(tagData, 'type')) {
			tagData.type = TagsAPI.USER;
		};
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
	// deleting system tags should be more protected
	deleteTag: function (tagData, system) {
		// probably a better way to do this, maybe make deleteTag take tag _id
		if (!_.has(tagData, '_id')) {
			tagData = Tags.findOne(tagData);
		}

		if (tagData.type === TagsAPI.SYSTEM && !system) {
			console.warn('Cannot delete system tag');
			return false;
		}
		return Tags.remove(tagData._id);
	},
	deleteAllTags: function (tagData) {
		return TagsAPI.deleteTag(tagData, true);
	},
	getTags: function (objectId, userOnly) {
		Meteor.subscribe('tags', objectId);
		if (userOnly) {
			return Tags.find({objectId: objectId, type: TagsAPI.USER}).fetch();
		}
		return Tags.find({objectId: objectId}).fetch();
	},
	makeCreatorTag: function (resourceId) {
		TagsAPI.createTag({
			objectId: resourceId,
			label: 'made by ' + Meteor.user().username,
			type: TagsAPI.SYSTEM
		});
	}
};
