Nodes = new Meteor.Collection('nodes');

Meteor.publish('node', function (nodeId) {
	console.log('publishing a node ' + nodeId );
	console.log(Nodes.findOne('_id'));
	return Nodes.find({'_id': nodeId});
});
