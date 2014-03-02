PrivacyEditor = {
	getPrivacySettings: function () {
		// assumes privacyOptions is a list containing the group id for
		// the logged in user
		var privacySettings = _.pluck(
			GroupsAPI.getMyGroups(Meteor.userId()), '_id');
		if ($('#privacy-editor').is(':checked')) {
			return ['public'].concat(privacySettings);
		}
		else {
			return privacySettings;
		}
	}
};

Template.privacyEditor.rendered = function () {
	console.log('privacy editor rendered');
	$('#privacy-editor').bootstrapSwitch();
};
