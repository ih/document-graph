Meteor.methods({
	createPermission: function (permissionData) {
		console.log('adding a new permission for ' + permissionData.actorId);
		Permissions.insert(permissionData);
	},
	deletePermission: function (permissionData) {
		var targetPermission = Permissions.findOne(permissionData);
		return Tags.remove(targetTag._id);
	},
	getResourcePermissions: function (resourceId) {
		var permissions = Permissions.find({resourceId: resourceId}).fetch() || [];
		return permissions;
	},
	getUserPermissions: function (userId) {
		var permissions = Permissions.find({actorId: userId}).fetch() || [];
		var userGroupRoles = GroupsAPI.getUserGroupRoles(userId);
		_.each(userGroupRoles, function (groupRole) {
			permissions = permissions.concat(
				Permissions.find({actorId: groupRole}).fetch());
		});
		return permissions;
	}
});
