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



Template.editor.preserve(['textarea']);

Template.editor.helpers({
	content: function () {return state.get('content');}
});

Template.editor.events({
	'input textarea': function (event) {
		state.set('content', event.target.value);
		// state.content = event.target.value;
	},
	'click .save': function (event) {
		console.log('clickity clicke');
		if (state.get('mode') === 'create') {
			// the keys property of a reactive dict is basically the plain dict
			NodesAPI.create(_.pick(state.keys, NodesAPI.nodeProperties));
		}
	}
});
