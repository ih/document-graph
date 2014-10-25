/**
 * Editor gets exported and acts as the interface to the editor component
 *
 * TODO: move tag and privacy editor out into their own packages when it's
 * easy to access data from sub templates or even better create a
 * tags/privacy-ui package that has both editor and display
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
		// the keys property of a reactive dict is basically the plain dict
		var nodeData = _.pick(
			templateInstance, GraphAPI.nodeProperties);
		nodeData.permissions = getPermissions();
		nodeData.tags = getTags();

		var nodeId = GraphAPI.createNode(nodeData);

		resetEditor(templateInstance);
	}
});

Template.editor.rendered = function () {
	$('textarea').autogrow();
	$('#privacy-editor').bootstrapSwitch();
	$('#myTags').tagit();
};

function resetEditor(templateInstance) {
	// used for resetting the title input, would be nice if there was two-way
	// binding...
	$('input').val('');

	_.each(GraphAPI.nodeProperties, function (nodeProperty) {
		// TODO figure out a better way to set the default value
		templateInstance[nodeProperty] = '';
	});
	clearTags();
	console.log('cleared state');
}

// TODO move this code back into a privacy-editor package when UI is
// modularized
/** Return a list of objects with user access info
 {
 	id: [user or group id],
 	type: [group or user],
 	permissions: [read, edit, delete, expand/link, etc]
 }
 */
function getPermissions() {
	// currently assumes nodes are private/public, eventually will add
	// non-public shareable
	var entitiesWithAccess = [{
		id: Meteor.userId(),
		type: 'user',
		permissions: 'all'
	}];

	if ($('#privacy-editor').is(':checked')) {
		entitiesWithAccess = entitiesWithAccess.concat({
			id: 'public',
			type: 'group',
			'permissions': 'all'
		});
	}
	return entitiesWithAccess;
}

// TODO move this code back into a tag-editor package, also make the selector
// for #myTags limit to the scope of this template
function clearTags() {
	return $("#myTags").tagit("removeAll");
}

function getTags() {
	return $('#myTags').tagit("assignedTags");
}
