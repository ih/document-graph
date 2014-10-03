/**
 * Editor gets exported and acts as the interface to the editor component
 *
 * TODO: move tag and privacy editor out into their own packages when it's
 * easy to access data from sub templates
 */

// maybe this isn't needed...
var Editor = {
	initialize: function (mode, params) {
		console.log('initializing the editor');
	}
};

Template.editor.events({
	'input .content': function (event, templateInstance) {
		templateInstance.nodeContent = event.target.value;
	},
	'input .title': function (event, templateInstance) {
		templateInstance.title = event.target.value;
	},
	'click .save': function (event, templateInstance) {
		var privacySettings = getPrivacySettings();
		// the keys property of a reactive dict is basically the plain dict
		var nodeData = _.pick(
			templateInstance, GraphAPI.nodeProperties);
		var nodeId = GraphAPI.createNode(nodeData, privacySettings);
		_.each(TagEditor.getTags(), function (tag) {
			TagsAPI.createTag({'objectId': nodeId, 'tag': tag});
		});
		resetEditor(templateInstance);
	}
});

Template.editor.rendered = function () {
	$('textarea').autogrow();
	$('#privacy-editor').bootstrapSwitch();
};

function resetEditor(templateInstance) {
	// used for resetting the title input, would be nice if there was two-way
	// binding...
	$('input').val('');

	_.each(GraphAPI.nodeProperties, function (nodeProperty) {
		// TODO figure out a better way to set the default value
		templateInstance[nodeProperty] = '';
	});
	TagEditor.clearTags();
	console.log('cleared state');
}

// TODO move this code back into a privacy-editor package eventually
function getPrivacySettings() {
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
