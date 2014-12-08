console.log('howdy in the permisssions collection server side');

Permissions = new Meteor.Collection('permissions');

Meteor.publish('myPermissions', function () {
	// also want to publish permissions corresponding to this user's group roles
	console.log('publishing user ' + this.userId + 'permissions');
	return Permissions.find({actorId: this.userId});
});

Meteor.publish('myGroupRolePermissions', function (resourceId) {
	var userGroupRoles = GroupsAPI.getUserGroupRoles(userId);
	return Permissions.find(
		{actorId: {$in: userGroupRoles}, resourceId: resourceId});
});
