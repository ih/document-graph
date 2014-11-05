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
	},
	hasPermission: function (userId, action, resourceId) {
		console.log('checking permission for ' + userId + ' to ' + action + ' ' + resourceId);
		var permission = Permissions.findOne({
			actorId: userId, actions: action, resourceId: resourceId});
		console.log(permission);
		if (!permission) {
			console.log('no individual permission so checking group roles... ');
			var userGroupRoles = GroupsAPI.getUserGroupRoles(userId);
			console.log(userGroupRoles);
			// TODO maybe there's a better way to do this if it turns out
			// to be a bottleneck/slow
			_.each(userGroupRoles, function (groupRole) {
				var groupRolePermission = Permissions.findOne({
					actorId: groupRole, actions: action, resourceId: resourceId});
				if (groupRolePermission) {
					permission = groupRolePermission;
				}
			});
		}
		console.log('the permission');
		console.log(permission);
		return !!permission;
	}
});
