GraphAPI = {
	nodeProperties: ['nodeContent', 'title'],
	// add allow rules to Nodes that call the securityAPI or 
	// each API should handle it's own security
	createNode: function (nodeData) {
		console.log('createNode of the graphAPI');
		console.log(nodeData);

		// TOOD make all this transactional node/recordcreation, permission 
		// setting, etc
		var nodeId = Nodes.insert(_.pick(nodeData, GraphAPI.nodeProperties));

		var recordId = RecordsAPI.record({
			'objectId': nodeId,
			'type': 'create',
			'userId': Meteor.userId()
		});

		_.each(nodeData.tags, function (tag) {
			TagsAPI.createTag({'objectId': nodeId, 'tag': tag});
		});

		// add the node to any non-public groups
		var permittedGroupIds = _.map(nodeData.permissions, function (permission) {
			var groupId = permission.id;
			if (permission.type === 'user') {
				// assumes one group for any user
				groupId = GroupsAPI.getMyGroups(permission.id)[0]['_id'];
			}
			GroupsAPI.joinGroup(groupId, nodeId);
			return groupId;
		});

		// TODO remove if start using a crawler to index documents
		// using id instead of _id since that causes an error with elasticsearch
		// perhaps move this into the editor package so that the access
		// related tags can be added to search index document
		var searchDocument = _.extend(
			nodeData, {'objectId': nodeId, 'privacySettings': permittedGroupIds});
		SearchAPI.index('nodes', searchDocument);
		return nodeId;
	},
	getNode: function (nodeId) {
		Meteor.subscribe('node', nodeId);
		return Nodes.findOne(nodeId);
	}
};


