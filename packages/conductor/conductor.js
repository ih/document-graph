if (Meteor.isServer) {
	Meteor.startup(function () {
		console.log('conducting!')
		// code to run on server at startup
	});
	Accounts.onCreateUser(function (options, user) {
		console.log('user created!!!');
		GroupsAPI.createGroup();
		if (options.profile) {
			user.profile = options.profile;
		}
		return user;
	});
}

