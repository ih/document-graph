GroupsAPI = {
	groupProperties: ['name'],
	membershipProperties: ['groupId', 'memberId', 'role'],
	// add allow rules to Nodes that call the securityAPI or
	// each API should handle it's own security
	createGroup: function (groupData) {
		var groupId = Groups.insert(groupData);
		RecordsAPI.record({
			'objectId': groupId,
			'type': 'create',
			'userId': Meteor.userId()
		});
		var membershipData = {
			groupId: groupId,
			memberId: Meteor.userId(),
			role: 'administrator'
		};
		// TODO should also be able to create non-creator initial members from
		// groupData
		var membershipId = Memberships.insert(membershipData);
		RecordsAPI.record({
			'objectId': membershipId,
			'type': 'create',
			'memberId': Meteor.userId()
		});
	}
};
