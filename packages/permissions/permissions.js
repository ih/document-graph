PermissionsAPI = {
	allActions: ['read', 'write'],
	hasPermission: function (actorId, targetId, actions) {
		// allows actions to be a single action for convenience
		[].concat(actions);
	}
};
