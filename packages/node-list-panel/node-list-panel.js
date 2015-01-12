NodeListPanel = {
	// better way than having this "global variable"?
	openStates: new ReactiveDict()
};

Template.nodeListPanel.created = function () {
	// if it's a left panel then initialize the sort property to rating
	this.sortProperty = new ReactiveVar('occurence');
	this.sortAscending = new ReactiveVar(true);
	NodeListPanel.openStates.set(this.data.direction, false);

	Tracker.autorun(function (computation) {
		if (Viewer.state.get('linkClicked')) {
			NodeListPanel.openStates.set('from', true);
		}
	});
};

Template.nodeListPanel.helpers({
	getLinkedNodes: function () {
		var sortProperty = Template.instance().sortProperty.get();
		var sortAscending = Template.instance().sortAscending.get();
		console.log('getting the linked nodes w/ sort order:' + sortProperty);
		console.log('ascending:' + sortAscending);
		var direction = Template.instance().data.direction;
		var links = Viewer.filterLinks(
			direction, Mondrian.getFocusedCellNodeId(), sortProperty,
			sortAscending, undefined, true);
		var otherDirection = GraphAPI.otherDirection(direction);
		return _.map(links, function (link) {
			var linkedNode = GraphAPI.getNode(link[otherDirection]);
			if (linkedNode) {
				linkedNode.link = link;
			}
			return linkedNode;
		});
	},
	hasLinks: function () {
		var direction = Template.instance().data.direction;
		var links = Viewer.filterLinks(
			direction, Mondrian.getFocusedCellNodeId());
		if (links.length === 0) {
			NodeListPanel.openStates.set(direction, false);
			var otherDirection = GraphAPI.otherDirection(direction);
			// if (!NodeListPanel.openStates.get(otherDirection)) {
			// 	Viewer.hideSelections();
			// }
		}
		return links.length > 0;
	},
	selected: function (optionProperty) {
		return optionProperty === Template.instance().sortProperty.get() ? 'selected' : '';
	},
	showCount: function () {
		return !NodeListPanel.openStates.get(Template.instance().data.direction);
	},
	sortDirection: function () {
		if (Template.instance().sortAscending.get()) {
			return 'glyphicon-arrow-down';
		}
		else {
			return 'glyphicon-arrow-up';
		}
	}
});

Template.nodeListPanel.events({
	'change .sort-property': function (event, templateInstance) {
		console.log('changing the sort order to: ' + event.target.value);
		templateInstance.sortProperty.set(event.target.value);
	},
	'click .close-panel': function (event, templateInstance) {
		NodeListPanel.openStates.set(templateInstance.data.direction, false);
		// if (!NodeListPanel.openStates.get(GraphAPI.otherDirection(templateInstance.data.direction))) {
		// 	Viewer.hideSelections();
		// }
	},
	'click .node-count': function (event, templateInstance) {
		NodeListPanel.openStates.set(templateInstance.data.direction, true);
		Viewer.showSelections();
	},
	'click .sort-direction': function (event, templateInstance) {
		templateInstance.sortAscending.set(
			!templateInstance.sortAscending.get());
	}
});

Template.nodePreview.events({
	'click .node-preview a': function (event, template) {
		event.preventDefault();
		Tracker.autorun(function (computation) {
			var clickedNode = GraphAPI.getNode(template.data._id);
			if (clickedNode) {
				console.log('clicked on node ' + template.data.id + ':' + JSON.stringify(clickedNode));
				Mondrian.setCellContent({templateName: 'viewer', context: clickedNode});

				computation.stop();
			}
		});
	},
	'click .unlink': function (event, templateInstance) {
		GraphAPI.deleteLink(templateInstance.data.link);
	}
});

Template.nodePreview.rendered = function () {
	if (this.data) {
		this.$('.title').css(
			'background-color', SelectionRendering.colorMap.get(this.data._id));
	}
	else {
		console.warn('data not loaded yet for node preview...');
	}
};
