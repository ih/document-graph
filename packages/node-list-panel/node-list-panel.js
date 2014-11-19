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
	showCount: function () {
		return !Viewer.isShowingSelections();
	}
});


Template.nodeListPanel.events({
	'click .node-count': function (event) {
		Viewer.showSelections();
	},
	'click .hide-selections': function (event) {
		Viewer.hideSelections();
	}
});

