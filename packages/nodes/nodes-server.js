// console.log('node server!!!!!!');
Nodes = new Meteor.Collection('nodes');

Meteor.publish('node', function (nodeId) {
	console.log('publishing a node ' + nodeId );
	console.log(Nodes.findOne('_id'));
	if (PermissionsAPI.hasPermission('read', nodeId, this.userId)) {
		console.log('permission to publish node granted');
		return Nodes.find({'_id': nodeId});
	}
	else {
		console.log('permission to publish node denied');
		return Nodes.find({'_id': null});
	}
});
