GraphAPI = {
	nodeProperties: ['nodeContent', 'title'],
	// add allow rules to Nodes that call the securityAPI or 
	// each API should handle it's own security
	createNode: function (nodeData, privacySettings) {
		console.log('createNode of the graphAPI');
		console.log(nodeData);
		var nodeId = Nodes.insert(nodeData);
		var recordId = RecordsAPI.record({
			'objectId': nodeId,
			'type': 'create',
			'userId': Meteor.userId()
		});

		// add the node to any non-public groups
		_.each(privacySettings, function (groupId) {
			GroupsAPI.joinGroup(groupId, nodeId);
		});

		// TODO remove if start using a crawler to index documents
		// using id instead of _id since that causes an error with elasticsearch
		// perhaps move this into the editor package so that the access
		// related tags can be added to search index document
		var searchDocument = _.extend(
			nodeData, {'objectId': nodeId, 'privacySettings': privacySettings});
		SearchAPI.index('nodes', searchDocument);
		return nodeId;
	},
	getNode: function (nodeId) {
		Meteor.subscribe('node', nodeId);
		return Nodes.findOne(nodeId);
	}
};


