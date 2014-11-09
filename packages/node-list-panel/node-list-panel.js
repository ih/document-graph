NodeListPanel = {

};

Template.nodeListPanel.helpers({
	getLinkedNodes: function (direction) {
		var cellContent = Mondrian.getFocusedCellContent();
		console.log('cell content ' + JSON.stringify(cellContent));
		if (cellContent && _.has(cellContent.context, '_id')) {
			var nodeId = Mondrian.getFocusedCellContent().context._id;
			return GraphAPI.getNeighbors(nodeId, direction);
		}
		else {
			return [];
		}
	}
});


Template.nodeListPanel.isSelectionMade = function () {
	return Viewer.state.get('selection');
};

Template.nodeListPanel.events({
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
