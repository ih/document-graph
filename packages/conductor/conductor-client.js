Template.registerHelper('count', function (countable) {
	return countable.length;
});

Template.layout.events({
	'click .create-node': function (event) {
		var newNodeData = makeNode();

		Mondrian.setCellContent(
			{templateName: 'editor', context: {node: newNodeData}});
	},
	'click .create-linked-node': function (event) {
		var selection = Viewer.state.get('selection');
		var newNodeData = makeNode('', selection.selectedContent);
		GraphAPI.connect(selection.nodeId, newNodeData._id, selection);

		Mondrian.divideCell(
			'auto', undefined, undefined,
			{templateName: 'editor', context: {node: newNodeData}});
	}
});

Template.layout.helpers({
	isSelectionMade: function () {
		return Viewer.state.get('selection');
	}
});

Template.layout.rendered = function () {
	// Editor.initialize('create');
};

console.log('in the conductor client ' + window.location.pathname);

function makeNode(content, title) {
	if (content === undefined) {
		content = '';
	}
	if (title === undefined) {
		content = '';
	}
	var newNodeData = {
		content: content,
		title: title
	};
	newNodeData._id = GraphAPI.createNode(newNodeData);
	PermissionsAPI.createPermission({
		actorId: Meteor.userId(),
		actions: PermissionsAPI.ALL,
		resourceId: newNodeData._id
	});

	return newNodeData;
}
