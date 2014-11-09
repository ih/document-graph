GraphAPI = {
	linkProperties: ['from', 'to', 'selection'],
	nodeProperties: ['content', 'title'],
	// add allow rules to Nodes that call the securityAPI or
	// each API should handle it's own security
	createNode: function (nodeData) {
		console.log('createNode of the graphAPI');

		// TOOD make all this transactional node/recordcreation, permission
		// setting, etc
		var nodeId = Nodes.insert(_.pick(nodeData, GraphAPI.nodeProperties));

		var recordId = RecordsAPI.record({
			'objectId': nodeId,
			'type': 'create',
			'userId': Meteor.userId()
		});

		return nodeId;
	},
	connect: function (fromNodeId, toNodeId, selectionData) {
		Links.insert({from: fromNodeId, to: toNodeId, selection: selectionData});
	},
	getNeighbors: function (nodeId, direction) {
		var otherDirection = direction === 'to' ? 'from' : 'to' ;
		var selector = {};
		selector[direction] = nodeId;
		Meteor.subscribe('nodeLinks', nodeId, direction);
		var neighborIds = Links.find(selector).map(function (link) {
			return link[otherDirection];
		});
		return _.compact(_.map(neighborIds, function (neighborId) {
			return GraphAPI.getNode(neighborId);
		}));
	},
	getNode: function (nodeId) {
		Meteor.subscribe('node', nodeId);
		return Nodes.findOne(nodeId);
	},
	updateNode: function (nodeData) {
		// do this as a method for now since udpating whole document is not 
		// allowed in allow
		Nodes.update(
			nodeData._id, {$set: _.pick(nodeData, GraphAPI.nodeProperties)});
	}
};



