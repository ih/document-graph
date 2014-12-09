Template.layout.created = function () {
	Tracker.autorun(function () {
		if (Meteor.userId()) {
			console.log('subscribing to my permissions');
			Meteor.subscribe('myPermissions');
		}
	});
};

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
	},
	'click .link-existing-node': function (event, templateInstance) {
		Viewer.state.set('linkMode', true);
		var selection = Viewer.state.get('selection');
		Tracker.autorun(function (computation) {
			var node = GraphAPI.getNode(selection.nodeId);
			if (node) {
				Mondrian.setCellContent(
					{templateName: 'linkingViewer', context: node});
				computation.stop();
			}
		});
	},
	'click .link': function (event, templateInstance) {
		var selection = Viewer.state.get('selection');
		var toNodeId = Mondrian.getFocusedCellNodeId();
		GraphAPI.connect(selection.nodeId, toNodeId, selection);
		Viewer.state.set('linkMode', false);
		Viewer.state.set('selection', null);
		Tracker.autorun(function (computation) {
			var node = GraphAPI.getNode(selection.nodeId);
			if (node) {
				Mondrian.setCellContent(
					{templateName: 'viewer', context: node});
				computation.stop();
			}
		});
	}
});

Template.layout.helpers({
	isLinkMode: function () {
		return Viewer.state.get('linkMode');
	},
	isSelectionMade: Viewer.isSelectionMade,
	validCell: function () {
		if (Mondrian.getFocusedCellNodeId()) {
			return '';
		}
		else {
			return 'disabled';
		}
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
