PermissionsAPI = {
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

