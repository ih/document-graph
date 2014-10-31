Meteor.methods({
	addPermission: function (actorId, actions, resource) {
		console.log('adding a new permission for ' + actorId);
		Permissions.insert({
			actorId: actorId, actions: actions, resource: resource});
	},
	hasPermission: function (userId, action, resource) {
		console.log('checking permission for ' + userId + ' to ' + action + ' ' + resource);
		var permission = Permissions.findOne({
			actorId: userId, actions: action, resource: resource});
		console.log(permission);
		if (!permission) {
			console.log('no individual permission so checking group roles... ');
			var userGroupRoles = GroupsAPI.getUserGroupRoles(userId);
			console.log(userGroupRoles);
			// TODO maybe there's a better way to do this if it turns out
			// to be a bottleneck/slow
			_.each(userGroupRoles, function (groupRole) {
				var groupRolePermission = Permissions.findOne({
					actorId: groupRole, actions: action, resource: resource});
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
