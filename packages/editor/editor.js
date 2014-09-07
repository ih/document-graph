/**
 * Editor gets exported and acts as the interface to the editor component
 */
Template.editor.created = function () {
	this.state = new ReactiveDict();
	this.state.set('mode', 'create');
};

var Editor = {
	initialize: function (mode, params) {
		console.log('initializing the editor');
		// templateInstance.state.set('mode', mode);
		// TagEditor.initialize();
	},
	/**
	 * Allows the editor to be closed externally and clears the state
	 * e.g. clicking outside the editor
	 */
	close: function () {
	}
};

Template.editor.helpers({
	nodeContent: function () {
		return Template.instance().state.get('nodeContent');
	},
	title: function () {
		return Template.instance().state.get('title');
	}
});

Template.editor.events({
	'input .content': function (event, templateInstance) {
		templateInstance.state.set('nodeContent', event.target.value);
	},
	'input .title': function (event, templateInstance) {
		templateInstance.state.set('title', event.target.value);
	},
	'click .save': function (event, templateInstance) {
		if (templateInstance.state.get('mode') === 'create') {
			var privacySettings = PrivacyEditor.getPrivacySettings();
			// the keys property of a reactive dict is basically the plain dict
			var nodeId = GraphAPI.createNode(
				// TODO this.keys probably isn't right
				_.pick(templateInstance.state.keys, GraphAPI.nodeProperties), privacySettings);
			_.each(TagEditor.getTags(), function (tag) {
				TagsAPI.createTag({'objectId': nodeId, 'tag': tag});
			});
			resetEditor(templateInstance.state);
		}
	}
});

Template.editor.rendered = function () {
	$('textarea').autogrow();
};

function resetEditor(state) {
	// used for resetting the title input, would be nice if there was two-way
	// binding...
	$('input').val('');

	_.each(GraphAPI.nodeProperties, function (stateProperty) {
		// TODO figure out a better way to set the default value
		state.set(stateProperty, '');
	});
	TagEditor.clearTags();
	console.log('cleared state');
	console.log(state.keys);
}
