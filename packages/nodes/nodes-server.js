console.log('nodes server side');

Nodes = new Meteor.Collection('nodes');

Nodes.allow({
	insert: function (userId, doc) {
		console.log('checking permissions for insertion');
		console.log(userId);
		return true;
	}
});

Meteor.publish('node', function (nodeId) {
	console.log('publishing a node ' + nodeId );
	console.log(Nodes.findOne(nodeId));
	if (PermissionsAPI.canRead(nodeId, this.userId)) {
		console.log('permission to publish node granted');
		return Nodes.find({'_id': nodeId});
	}
	else {
		console.log('permission to publish node denied');
		return Nodes.find({'_id': null});
	}
});
