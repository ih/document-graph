console.log('nodes server side');

Nodes = new Meteor.Collection('nodes');

Nodes.allow({
  insert: function (userId, doc) {
    console.log('checking permissions for insertion');
    console.log(userId);
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    console.log('checking permissions for udpating node ');
    console.log(doc);
    console.log('with modifier:');
    console.log(modifier);
    return PermissionsAPI.hasPermission(userId, 'update', doc._id);
  },
  remove: function (userId, doc) {
    console.log('deleting node:' + JSON.stringify(doc));
    return PermissionsAPI.hasPermission(userId, 'delete', doc._id);
  }
});

Meteor.publish('node', function (nodeId) {
  console.log('publishing a node ' + nodeId );
  console.log(Nodes.findOne(nodeId));
  if (PermissionsAPI.hasPermission(this.userId, 'read', nodeId)) {
    console.log('permission to publish node granted');
    return Nodes.find({'_id': nodeId});
  }
  else {
    console.log('permission to publish node denied');
    return Nodes.find({'_id': null});
  }
});
