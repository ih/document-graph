// this implementation duplicates a lot of functionality from the main system
// probably want to do this differently in the future or get rid of it
Meteor.startup(function () {
	var adminId = 'admin';
	console.log('inside the documentation package');
	// really should use an observer for this...
	if (!Meteor.users.findOne({username: 'admin'})) {
		var newAdminId = Accounts.createUser({
			username: 'admin',
			email: 'admin@memograph.link',
			password: 'password'
		});
		// do some hijinks to make the admin document id 'admin'
		var admin = Meteor.users.findOne({username: 'admin'});
		admin._id = adminId;
		Meteor.users.remove({username: 'admin'});
		Meteor.users.insert(admin);
		GroupsAPI.joinGroup('public', adminId);
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


		// make sure admin can modify
		PermissionsAPI.createPermission({
			actorId: adminId,
			actions: PermissionsAPI.ALL,
			resourceId: nodeId
		});

		// tag it
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
