PermissionsAPI = {
	ALL: ['read', 'rate', 'multiple-rate', 'update', 'delete'],
	READ: ['read', 'rate'],
	permissionsProperties: ['actorId', 'actions', 'resourceId'],
	createPermission: function (permissionData) {
		return Meteor.call(
			'createPermission', _.pick(
				permissionData, PermissionsAPI.permissionsProperties));
	},
	deletePermission: function (permissionData) {
		return Meteor.call('deletePermission', permissionData);
	},
	getResourcePermissions: function (resourceId) {
		return Meteor.call('getResourcePermissions', resourceId);
	},
	getUserPermissions: function (userId) {
		return Meteor.call('getUserPermissions', userId);
	},
	hasPermission: function (userId, action, resourceId) {
		console.log('checking permission for ' + userId + ' to ' + action + ' ' + resourceId);
		var permission = Permissions.findOne({
			actorId: userId, actions: action, resourceId: resourceId});
		console.log(permission);
		if (!permission) {
			console.log('no individual permission so checking group roles... ');
			if (Meteor.isClient) {
				Meteor.subscribe('myGroupRolePermissions', resourceId);
			}
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
	},
	initialize: function () {
		try {
			GroupsAPI.createGroup({_id: 'public', name: 'public'});
		} catch (e) {
			console.log('public group already exists');
		}

		console.log('subscribing to my permissions');

		Meteor.users.find().observe({
			_suppress_initial: true,
			added: function (user) {
				// needs to be in server so it's only run once
				console.log('added new user');
				console.log(user);
				GroupsAPI.createGroup(
					{'creatorId': user._id, 'name': user.email +  ' group'});
				// Maybe this doesn't scale nicely so could special case public
				// group when interacting with groups
				GroupsAPI.joinGroup('public', user._id);
				console.log('test');
			}
		});
	}
};

