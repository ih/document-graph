NodesAPI = {
	nodeProperties: ['content'],
	create: function (nodeData) {
		var nodeId = Nodes.insert(nodeData);
		var recordId = RecordsAPI.record({
			'objectId': nodeId,
			'type': 'create',
			'userId': Meteor.userId()
		});
	}
};


