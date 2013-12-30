GraphAPI = {
	nodeProperties: ['content', 'title'],
	// add allow rules to Nodes that call the securityAPI or 
	// each API should handle it's own security
	createNode: function (nodeData) {
		var nodeId = Nodes.insert(nodeData);
		var recordId = RecordsAPI.record({
			'objectId': nodeId,
			'type': 'create',
			'userId': Meteor.userId()
		});

		// TODO remove if start using a crawler to index documents
		SearchAPI.index('nodes', _.extend(nodeData, {'_id': nodeId}));
	}
};


