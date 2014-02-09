var state = new ReactiveDict();

PrivacyEditor = {
	initialize: function () {
		console.log('initializing the privacy editor');
		var privacyOptions = _.pluck(GroupsAPI.getMyGroups(Meteor.userId()), '_id');
		console.log('with privacy options');
		console.log(privacyOptions);
		state.set('privacyOptions', privacyOptions);
	},
	getPrivacySettings: function () {
		// assumes privacyOptions is a list containing the group id for
		// the logged in user
		if ($('#privacy-editor').is(':checked')) {
			return ['public'].concat(state.get('privacyOptions'));
		}
		else {
			return state.get('privacyOptions');
		}
	}
};

Template.privacyEditor.rendered = function () {
	console.log('privacy editor rendered');
	$('#privacy-editor').bootstrapSwitch();
};
