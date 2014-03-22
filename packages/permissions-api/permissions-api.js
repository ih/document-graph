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
	}
};

