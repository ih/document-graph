if (Meteor.isClient) {
	Editor.initialize('create');
	Template.hello.greeting = function () {
		return "Welcome to document-graph.";
	};

	Template.hello.events({
		'click input' : function () {
			// template data, if any, is available in 'this'
			if (typeof console !== 'undefined')
				console.log("You pressed the button");
			Editor.initialize('create');
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
	Accounts.onCreateUser(function (options, user) {
		console.log('user created!!!');
		if (options.profile) {
			user.profile = options.profile;
		}
		return user;
	});
}
