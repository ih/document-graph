GroupsAPI = {
	groupProperties: ['name'],
	membershipProperties: ['groupId', 'memberId', 'role'],
	// maybe this should be reactive one day...
	// http://robertdickert.com/blog/2013/11/14/why-is-my-meteor-app-not-updating-reactively/
	// add allow rules to Nodes that call the securityAPI or
	// each API should handle it's own security
	createGroup: function (groupData) {
		console.log('creating group');
		var groupId = Groups.insert(groupData);
		console.log('new group created');
		console.log(groupId);
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
		console.log('new membership created');
		console.log(membershipId);
		RecordsAPI.record({
			'objectId': membershipId,
			'type': 'create',
			'memberId': memberId
		});

	},
	getMyGroups: function (memberId) {
		// this will have to change if the publication ever sends over other
		// user's groups
		console.log('in getMyGroups');
		console.log(memberId);
		return Groups.find({'creatorId': memberId}).fetch();
	}
};
