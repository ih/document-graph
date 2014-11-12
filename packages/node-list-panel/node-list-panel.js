NodeListPanel = {

};

Template.nodeListPanel.helpers({
	getLinkedNodes: function () {
		var cellContent = Mondrian.getFocusedCellContent();
		console.log('cell content ' + JSON.stringify(cellContent));
		if (cellContent && _.has(cellContent.context, '_id')) {
			var nodeId = Mondrian.getFocusedCellContent().context._id;
			return GraphAPI.getNeighbors(
				nodeId, Template.instance().data.direction);
		}
		else {
			return [];
		}
	},
	isSelectionMade: function () {
		return Viewer.state.get('selection');
	},
	showCount: function () {
		return !Viewer.isShowingSelections();
	}
});


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
	},
	'click .node-count': function (event) {
		Viewer.showSelections();
	},
	'click .hide-selections': function (event) {
		Viewer.hideSelections();
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
