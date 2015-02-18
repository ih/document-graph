console.log('links server side');

Links = new Meteor.Collection('links');

Links.allow({
  insert: function (userId, doc) {
    console.log('checking permissions for link insertion');
    console.log(userId);
    return PermissionsAPI.hasPermission(userId, 'read', doc.from);
  },
  remove: function (userId, doc) {
    console.log('removing link:' + JSON.stringify(doc));
    return PermissionsAPI.hasPermission(userId, 'update', doc.from) ||
      PermissionsAPI.hasPermission(userId, 'update', doc.to);
  },
  update: function (userId, doc, fieldNames, modifier) {
    console.log('checking permissions for udpating link ');
    console.log(doc);
    console.log('with modifier:');
    console.log(modifier);
    // rethink the logic for this
    return PermissionsAPI.hasPermission(userId, 'read', doc.from) ||
      PermissionsAPI.hasPermission(userId, 'update', doc.to);
  }
});

Meteor.publish('link', function (linkId) {
  console.log('publishing a node ' + linkId );
  var link = Links.findOne(nodeId);
  console.log(link);
  if (PermissionsAPI.hasPermission(this.userId, 'read', link.from) &&
      PermissionsAPI.hasPermission(this.userId, 'read', link.to)) {
    console.log('permission to publish link granted');
    return Links.find(linkId);
  }
  else {
    console.log('permission to publish node denied');
    return Links.find(null);
  }
});

Meteor.publish('nodeLinks', function (nodeId, direction) {
  if (PermissionsAPI.hasPermission(this.userId, 'read', nodeId)) {
    var selector = {};
    selector[direction] = nodeId;
    console.log('Publishing links with selector:');
    console.log(selector);
    return Links.find(selector);
  }
  else {
    return Links.find(null);
  }
});
