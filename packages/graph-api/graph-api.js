GraphAPI = {
	nodeProperties: ['content', 'title'],
	createNode: function (nodeData) {
		var nodeId = Nodes.insert(nodeData);
		var recordId = RecordsAPI.record({
			'objectId': nodeId,
			'type': 'create',
			'userId': Meteor.userId()
		});
		// TODO if start using a crawler to index documents
		SearchAPI.index('nodes', nodeData);
	}
};


