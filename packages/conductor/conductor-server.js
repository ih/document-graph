Meteor.startup(function () {
	console.log('conducting!');
	try {
		GroupsAPI.createGroup({_id: 'public', name: 'public'});
	} catch (e) {
		console.log('public group already exists');
	}


	//code to run on server at startup
	Meteor.users.find().observe({
		_suppress_initial: true,
		added: function (user) {
			// needs to be in server so it's only run once
			console.log('added new user');
			console.log(user);
			GroupsAPI.createGroup(
				{'creatorId': user._id, 'name': user.email +  ' group'});
			GroupsAPI.joinGroup('public', user._id);
			console.log('test');
		}
	});
});

// Meteor.startup(function () {
// 	console.log('conducting!');
// 	//code to run on server at startup
// 	Meteor.users.find().observe({
// 		_suppress_initial: true,
// 		added: function (user) {
// 			console.log('added new user');
// 			console.log(user);
// 			// doesn't trigger deps invalidation because called from server?
// 			GroupsAPI.createGroup({'creatorId': user._id});
// 			console.log('test');
// 		}
// 	});
// 	// Accounts.createUser = _.wrap(Accounts.createUser, function(createUser) {
// 	// 	// Store the original arguments
// 	// 	var args = _.toArray(arguments).slice(1),
// 	// 		user = args[0];
// 	// 	var origCallback = args[1];


// 	// 	var newUserId = createUser(user);
// 	// 	console.log('new user created');
// 	// 	console.log(newUserId);
// 	// });
// });



// // Accounts.onCreateUser(function (options, user) {
// // 	console.log('user created!!!');
// // 	GroupsAPI.createGroup();
// // 	if (options.profile) {
// // 		user.profile = options.profile;
// // 	}
// // 	return user;
// // });

