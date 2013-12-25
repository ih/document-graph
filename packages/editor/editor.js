/**
 * Editor gets exported and acts as the interface to the editor component
 */
var state = new ReactiveDict();

Editor = {
	initialize: function (mode, params) {
		state.set('mode', mode);
	},
	/**
	 * Allows the editor to be closed externally and clears the state
	 * e.g. clicking outside the editor
	 */
	close: function () {
	}
};

Template.editor.preserve(['textarea', 'input']);

Template.editor.helpers({
	content: function () {return state.get('content');},
	title: function () {return state.get('title');}
});

Template.editor.events({
	'input textarea': function (event) {
		state.set('content', event.target.value);
		// state.content = event.target.value;
	},
	'input input': function (event) {
		state.set('title', event.target.value);
		// state.content = event.target.value;
	},
	'click .save': function (event) {
		console.log('clickity clicke');
		if (state.get('mode') === 'create') {
			// the keys property of a reactive dict is basically the plain dict
			GraphAPI.createNode(_.pick(state.keys, GraphAPI.nodeProperties));
			resetEditor();
		}
	}
});

function resetEditor() {
	// reset the state
	_.each(GraphAPI.nodeProperties, function (stateProperty) {
		// TODO figure out a better way to set the default value
		state.set(stateProperty, '');
	});
}
