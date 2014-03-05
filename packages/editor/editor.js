/**
 * Editor gets exported and acts as the interface to the editor component
 */
var state = new ReactiveDict();

Editor = {
	initialize: function (mode, params) {
		console.log('initializing the editor');
		state.set('mode', mode);
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
	nodeContent: function () {return state.get('nodeContent');},
	title: function () {return state.get('title');}
});

Template.editor.events({
	'input .content': function (event) {
		state.set('nodeContent', event.target.value);
	},
	'input .title': function (event) {
		state.set('title', event.target.value);
	},
	'click .save': function (event) {
		if (state.get('mode') === 'create') {
			var privacySettings = PrivacyEditor.getPrivacySettings();
			// the keys property of a reactive dict is basically the plain dict
			var nodeId = GraphAPI.createNode(
				_.pick(state.keys, GraphAPI.nodeProperties), privacySettings);
			_.each(TagEditor.getTags(), function (tag) {
				TagsAPI.createTag({'objectId': nodeId, 'tag': tag});
			});
			resetEditor();
		}
	}
});

Template.editor.rendered = function () {
	$('textarea').autogrow();
};

function resetEditor() {
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
