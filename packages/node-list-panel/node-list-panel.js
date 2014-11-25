NodeListPanel = {

};

Template.nodeListPanel.helpers({
	getLinkedNodes: function () {
		var direction = Template.instance().data.direction;
		var links = Viewer.filterLinks(
			direction, Mondrian.getFocusedCellNodeId());
		var otherDirection = GraphAPI.otherDirection(direction);
		return _.map(links, function (link) {
			return GraphAPI.getNode(link[otherDirection]);
		});
	},
	showCount: function () {
		return !Viewer.isShowingSelections();
	}
});


Template.nodeListPanel.events({
	'click .hide-selections': function (event) {
		Viewer.hideSelections();
	},
	'click .node-count': function (event) {
		Viewer.showSelections();
	}
});

Template.nodePreview.events({
	'click .node-preview a': function (event, template) {
		event.preventDefault();
		Tracker.autorun(function (computation) {
			var clickedNode = GraphAPI.getNode(template.data._id);
			if (clickedNode) {
				console.log('clicked on node ' + template.data.id + ':' + JSON.stringify(clickedNode));
				// Mondrian.setCellContent({templateName: 'viewer', context: clickedNode});
				Mondrian.divideCell(
					undefined, undefined, undefined,
					{templateName: 'viewer', context: clickedNode});
				computation.stop();
			}
		});
	}
});
