/**
 * Editor gets exported and acts as the interface to the editor component
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
		var privacySettings = PrivacyEditor.getPrivacySettings();
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
