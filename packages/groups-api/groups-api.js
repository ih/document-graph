GroupsAPI = {
	ADMIN: 'administrator',
	MEMBER: 'member',
	groupProperties: ['name', 'creatorId'],
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
		GroupsAPI.joinGroup(groupId, groupData.creatorId, GroupsAPI.ADMIN);
	},
	joinGroup: function (groupId, memberId, role) {
		// TODO add a check that the caller has permission to add members to the
		// group (may need to make these meteor methods)
		if (!role) {
			role = GroupsAPI.MEMBER;
		}
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
	},
	getUserGroupRoles: function (userId) {
		var groupRoles;
		var memberships = Memberships.find({memberId: userId});
		memberships.forEach(function (membership) {
			groupRoles = groupRoles.concat(
				GroupsAPI.combineGroupRole(membership.groupId, membership.role));
		});
		return groupRoles;
	},
	combineGroupRole: function (groupId, role) {
		return groupId + '-' + role;
	},
	getGroups: function (memberId, idsOnly) {
		// only works properly on the server
		console.log('getting groups for ' + memberId);
		var memberships = Memberships.find({memberId: memberId}).fetch();
		var groupIds =  _.pluck(memberships, 'groupId');
		if (idsOnly) {
			return groupIds;
		}
		else {
			return Groups.find({_id: {$in: groupIds}}).fetch();
		}
	},
	isInSameGroup: function (id1, id2) {
		var id1GroupIds = GroupsAPI.getGroups(id1, true);
		var id2GroupIds =  GroupsAPI.getGroups(id2, true);
		console.log('groups for ' + id1);
		console.log(id1GroupIds);
		console.log('groups for ' + id2);
		console.log(id2GroupIds);
		return _.intersection(id1GroupIds, id2GroupIds).length > 0;
	},
	isAdminOf: function (objectId, userId) {
		var objectGroupIds = GroupsAPI.getGroups(objectId, true);
		var userAdminMemberships = Memberships.find(
			{memberId: userId, role: GroupsAPI.ADMIN}).fetch();
		return _.intersection(
			objectGroupIds, _.pluck(userAdminMemberships, 'groupId')).length > 0;
	}
};
