console.log('Tags server side');
Tags = new Meteor.Collection('tags');

Tags.allow({
	insert:  function (userId, doc) {
		// TODO check permission to tag item before writing; add canTag or 
		// canWrite to  permissions api
		console.log('allowing an insert into the tags collection');
		return true;
	}
});

Meteor.publish('tags', function (objectId) {
	if (PermissionsAPI.canRead(objectId, this.userId)) {
		console.log('permission to publish tags for object'+objectId+' granted');
		return Tags.find({'objectId': objectId});
	}
	else {
		console.log('permission to publish tags denied');
		return Nodes.find({'_id': null});
	}
});
