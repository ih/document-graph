GroupsAPI = {
	groupProperties: ['name'],
	membershipProperties: ['groupId', 'memberId', 'role'],
	// add allow rules to Nodes that call the securityAPI or
	// each API should handle it's own security
	createGroup: function (groupData) {
		console.log('creating group');
		var groupId = Groups.insert(groupData);
		RecordsAPI.record({
			'objectId': groupId,
			'type': 'create',
			'userId': groupData.creatorId
		});
		// TODO should also be able to create non-creator initial members from
		// groupData
		GroupsAPI.joinGroup(groupId, groupData.creatorId, 'administrator');
	},
	joinGroup: function (groupId, memberId, role) {
		// TODO add a check that the caller has permission to add members to the
		// group (may need to make these meteor methods)
		var membershipData = {
			groupId: groupId,
			memberId: memberId,
			role: role
		};

		var membershipId = Memberships.insert(membershipData);
		RecordsAPI.record({
			'objectId': membershipId,
			'type': 'create',
			'memberId': memberId
		});

	},
	getMyGroups: function (memberId) {
		// this will have to change if the publication ever sends over other
		// user's groups
		return Groups.find().fetch();
	}
};




