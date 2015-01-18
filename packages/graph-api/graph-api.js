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
	linkProperties: ['from', 'to', 'selection', 'createdAt'],
	nodeProperties: ['content', 'title', 'createdAt', 'hasBeenSaved'],
	// add allow rules to Nodes that call the securityAPI or
	// each API should handle it's own security
	createNode: function (nodeData) {
		console.log('createNode of the graphAPI');
		nodeData['createdAt'] = Utility.makeTimeStamp();
		// currently nodes get created and passed to the editor before a user
		// saves so there is potential for "junk" nodes to be present
		// having this property
		nodeData['hasBeenSaved'] = false;
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
			createdAt: Utility.makeTimeStamp()});
	},
	getNodeLinks: function (nodeId, direction, all) {
		var links = [];
		if (!direction) {
			console.log('getting all the node links');
			Meteor.subscribe('nodeLinks', nodeId, 'from');
			Meteor.subscribe('nodeLinks', nodeId, 'to');
			links = Links.find({$or: [{from: nodeId}, {to: nodeId}]}).fetch();
		}
		else {
			console.log('getting links in the ' + direction + ' direction');
			var selector = {};
			selector[direction] = nodeId;
			Meteor.subscribe('nodeLinks', nodeId, direction);
			links = Links.find(selector).fetch();
		}
		if (!all) {
			links = _.filter(links, function (link) {
				var neighborId = link[GraphAPI.otherDirection(direction)];
				return PermissionsAPI.hasPermission(
					Meteor.userId(), 'read', neighborId);
			});
		}
		return links;
	},
	// limit to server, used by deletion
	getAllNodeLinks: function (nodeId, direction) {
		return GraphAPI.getNodeLinks(nodeId, direction, true);
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
	isIntersecting: function (border1, border2) {
		var earlierBorder = border1.open < border2.open ? border1 : border2;
		var laterBorder = border1.open < border2.open ? border2 : border1;
		return earlierBorder.close >= laterBorder.open;
	},
	otherDirection: function (direction) {
		return direction === 'to' ? 'from' : 'to';
	},
	updateNode: function (nodeData) {
		// do this as a method for now since udpating whole document is not
		// allowed in allow
		nodeData['hasBeenSaved'] = true;
		Nodes.update(
			nodeData._id, {$set: _.pick(nodeData, GraphAPI.nodeProperties)});
	},
	updateLink: function (linkData) {
		Links.update(
			linkData._id, {$set: _.pick(linkData, GraphAPI.linkProperties)});
	},
	deleteLink: function (link) {
		if (!_.has(link, '_id')) {
			link = Links.findOne(link);
		}
		return Links.remove(link._id);
	},
	deleteNode: function (node) {
		return Nodes.remove(node._id);
	}
};
