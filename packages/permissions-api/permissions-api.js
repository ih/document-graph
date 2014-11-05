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
		return Meteor.call('hasPermission', userId, action, resourceId);
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

