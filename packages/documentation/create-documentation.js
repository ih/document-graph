Meteor.startup(function () {
	console.log('inside the documentation package');
	if (!Meteor.users.findOne({username: 'admin'})) {
		Accounts.createUser({
			username: 'admin',
			email: 'admin@memograph.link',
			password: 'password'
		});
	}
	// create a node for how to link
	if (!Nodes.findOne({_id: 'how-to-link'})) {
		console.log('generating docs');
		var nodeData = {
			_id: 'how-to-link',
			content: 'replace manually once created',
			title: 'Linking Instructions',
			createdAt: Utility.makeTimeStamp(),
			hasBeenSaved: true
		};
		var nodeId = Nodes.insert(nodeData);

		// make accessible to the public

		PermissionsAPI.createPermission({
			actorId: GroupsAPI.combineGroupRole('public', GroupsAPI.MEMBER),
			actions: PermissionsAPI.READ,
			resourceId: nodeId
		});

		// tag it
		var adminId = Meteor.users.findOne({username: 'admin'})._id;

		Tags.insert({
			createdAt: Utility.makeTimeStamp(),
			label: 'made by admin',
			objectId: nodeId,
			type: TagsAPI.SYSTEM,
			userId: adminId
		});

		Tags.insert({
			createdAt: Utility.makeTimeStamp(),
			label: 'documentation',
			objectId: nodeId,
			type: TagsAPI.SYSTEM,
			userId: adminId
		});


		SearchAPI.index('nodes', nodeData);
	}
});
