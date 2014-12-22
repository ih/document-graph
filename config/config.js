Meteor.startup(function () {
	if (Meteor.isClient) {
		console.log('setting client side settings');
		Accounts.ui.config({
			passwordSignupFields: 'USERNAME_AND_EMAIL'
		});
	}
});

