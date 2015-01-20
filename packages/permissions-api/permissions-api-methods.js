Meteor.methods({
	createPermission: function (permissionData) {
		console.log('adding a new permission for ' + permissionData.actorId);
		Permissions.insert(permissionData);
	},
	deletePermission: function (permissionData) {
		// check that user has permission to be deleting
		var targetPermission = Permissions.findOne(permissionData);
		console.log('removing permission:' + JSON.stringify(targetPermission));
		return Permissions.remove(targetPermission._id);
	},
	getResourcePermissions: function (resourceId) {
		var permissions = Permissions.find({resourceId: resourceId}).fetch() || [];
		return permissions;
	},
	getUserActorIds: function (userId) {
		var userGroupRoles = GroupsAPI.getUserGroupRoles(userId);
		return userId ? [userId].concat(userGroupRoles) : userGroupRoles;
	},
	getUserPermissions: function (userId) {
		var permissions = Permissions.find({actorId: userId}).fetch() || [];
		var userGroupRoles = GroupsAPI.getUserGroupRoles(userId);
		_.each(userGroupRoles, function (groupRole) {
			// probably bad for public-member? currently only used by search
			// so could optimize by directly getting group roles in
			// search-api-methods.js
			permissions = permissions.concat(
				Permissions.find({actorId: groupRole}).fetch());
		});
		return permissions;
	}
});
