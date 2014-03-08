PermissionsAPI = {
	hasPermission: function (permission, objectId, userId) {
		console.log('checking ' + permission + ' permissions');
		if (!userId) {
			userId = Meteor.userId();
		}
		var objectGroupIds = GroupsAPI.getGroups(objectId, true);
		var userGroupIds =  GroupsAPI.getGroups(userId, true);
		console.log('groups for object');
		console.log(objectGroupIds);
		console.log('groups for user');
		console.log(userGroupIds);
		return _.intersection(objectGroupIds, userGroupIds).length > 0;
	}
};
