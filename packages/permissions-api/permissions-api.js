PermissionsAPI = {
	READ: ['read', 'rate'],
	ALL: ['read', 'rate', 'multiple-rate', 'update'],
	permissionsProperties: ['actorId', 'actions', 'resource'],
	addPermission: function (actorId, actions, resource) {
		return Meteor.call('addPermission', actorId, actions, resource);
	},
	hasPermission: function (userId, action, resource) {
		return Meteor.call('hasPermission', userId, action, resource);
	},
	getPermissions: function (userId) {
		var permissions = Permissions.find({actorId: userId}).fetch() || [];
		var userGroupRoles = GroupsAPI.getUserGroupRoles(userId);
		_.each(userGroupRoles, function (groupRole) {
			permissions = permissions.concat(
				Permissions.find({actorId: groupRole}).fetch());
		});
		return permissions;
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
				// Maybe this doesn't scale nicely so could special case public
				// group when interacting with groups
				GroupsAPI.joinGroup('public', user._id);
				console.log('test');
			}
		});
	}
};

