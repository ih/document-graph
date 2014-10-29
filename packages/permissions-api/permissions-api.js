PermissionsAPI = {
	permissionsProperties: ['actorId', 'action', 'resource'],
	addPermission: function (actorId, action, resource) {
		Permissions.insert({
			actorId: actorId, action: action, resource: resource});
	},
	hasPermission: function (userId, action, resource) {
		var permission = Permissions.findOne({
			actorId: userId, action: action, resource: resource});
		if (!permission) {
			var userGroupRoles = GroupsAPI.getMyGroupRoles(userId);
			// TODO maybe there's a better way to do this if it turns out
			// to be a bottleneck/slow
			_.each(userGroupRoles, function (groupRole) {
				var groupRolePermission = Permissions.findOne({
					actorId: groupRole, action: action, resource: resource});
				if (groupRolePermission) {
					permission = groupRolePermission;
				}
			});
		}
		return !!permission;
	},
	canRead: function (objectId, userId) {
		console.log('checking whether ' + userId + ' can read ' + objectId);
		if (!userId) {
			userId = Meteor.userId();
		}
		return GroupsAPI.isInSameGroup(userId, objectId);
	},
	canRate: function (objectId, userId) {
		console.log('checking whether ' + userId + ' can rate ' + objectId);
		return PermissionsAPI.canRead(objectId, userId);
	},
	isAdminOf: function (objectId, userId) {
		return GroupsAPI.isAdminOf(objectId, userId);
	},
	initialize: function () {
		try {
			GroupsAPI.createGroup({_id: 'public', name: 'public'});
		} catch (e) {
			console.log('public group already exists');
		}

		Meteor.users.find().observe({
			_suppress_initial: true,
			added: function (user) {
				// needs to be in server so it's only run once
				console.log('added new user');
				console.log(user);
				GroupsAPI.createGroup(
					{'creatorId': user._id, 'name': user.email +  ' group'});
				GroupsAPI.joinGroup('public', user._id);
				console.log('test');
			}
		});
	}
};

