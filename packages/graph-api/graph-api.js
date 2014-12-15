GraphAPI = {
	/**
	 from, to are node ids
	 Selection Object
	 {
		 border: {close: [index for selection end], open: [index of selection start]},
		 nodeId: [viewed node id],
		 selectedContent: [part of content that was selected]
	 }
	 */
	linkProperties: ['from', 'to', 'selection', 'createTime'],
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
		Links.insert({
			from: fromNodeId, to: toNodeId, selection: selectionData,
			createTime: (new Date()).toISOString()});
	},
	getNodeLinks: function (nodeId, direction) {
		var selector = {};
		selector[direction] = nodeId;
		Meteor.subscribe('nodeLinks', nodeId, direction);
		return Links.find(selector).fetch();
	},
	getNeighbors: function (nodeId, direction, justNodes) {
		var otherDirection = GraphAPI.otherDirection(direction);
		var links = GraphAPI.getNodeLinks(nodeId, direction);

		var neighborData = {};
		_.each(links, function (link) {
			var neighborId = link[otherDirection];
			neighborData[neighborId] = {
				link: link,
				node: GraphAPI.getNode(neighborId)
			};
		});
		if (justNodes) {
			return _.pluck(_.values(neighborData), 'node');
		}
		return neighborData;
	},
	/** Must be run in a reactive computation
	 */
	getNode: function (nodeId, callback) {
		if (Meteor.isClient) {
			Meteor.subscribe('node', nodeId);
		}
		return Nodes.findOne(nodeId);
	},
	otherDirection: function (direction) {
		return direction === 'to' ? 'from' : 'to';
	},
	updateNode: function (nodeData) {
		// do this as a method for now since udpating whole document is not
		// allowed in allow
		Nodes.update(
			nodeData._id, {$set: _.pick(nodeData, GraphAPI.nodeProperties)});
	},
	updateLink: function (linkData) {
		Links.update(
			linkData._id, {$set: _.pick(linkData, GraphAPI.linkProperties)});
	},
	deleteLink: function (link) {
		return Links.remove(link._id);
	},
	deleteNode: function (node) {
		return Nodes.remove(node._id);
	}
};
