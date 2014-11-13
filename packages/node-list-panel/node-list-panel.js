NodeListPanel = {

};

Template.nodeListPanel.helpers({
	getLinkedNodes: function () {
		var direction = Template.instance().data.direction;
		var links = Viewer.filterLinks(direction);
		var otherDirection = GraphAPI.otherDirection(direction);
		return _.map(links, function (link) {
			return GraphAPI.getNode(link[otherDirection]);
		});
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
