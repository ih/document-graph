NodeListPanel = {
  // better way than having this "global variable"?
  openStates: new ReactiveDict()
};

Tracker.autorun(function (computation) {
  if (Viewer.state.get('linkClickedEvent')) {
    console.log('click from node list');
    NodeListPanel.openStates.set('from', true);
  }
});

Template.nodeListPanel.created = function () {
  // if it's a left panel then initialize the sort property to rating
  this.sortProperty = new ReactiveVar('occurence');
  this.sortAscending = new ReactiveVar(true);
  NodeListPanel.openStates.set(this.data.direction, false);
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
        // for checking unlinking permissions
        linkedNode.originNodeId = Mondrian.getFocusedCellNodeId();
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
      //        Viewer.hideSelections();
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
    //  Viewer.hideSelections();
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
  'click .node-preview .panel-title, click .node-preview .open': function (
    event, templateInstance) {
    event.preventDefault();
    Tracker.autorun(function (computation) {
      var clickedNode = GraphAPI.getNode(templateInstance.data._id);
      if (clickedNode) {
        console.log('clicked on node ' + templateInstance.data.id + ':' + JSON.stringify(clickedNode));

        Mondrian.setCellContent({templateName: 'viewer', context: clickedNode});

        computation.stop();

        analytics.track('Open Preview in Existing Pane', {
          nodeId: templateInstance.data.id,
          title: clickedNode.title
        });
      }
    });
  },
  'click .open-new-pane': function (event, templateInstance) {
    Tracker.autorun(function (computation) {
      var clickedNode = GraphAPI.getNode(templateInstance.data._id);
      if (clickedNode) {

        Mondrian.divideCell(
          undefined, undefined, undefined,
          {templateName: 'viewer', context: clickedNode});

        computation.stop();

        analytics.track('Open Preview in New Pane', {
          nodeId: templateInstance.data.id,
          title: clickedNode.title
        });
      }
    });
  },
  'click .unlink': function (event, templateInstance) {
    GraphAPI.deleteLink(templateInstance.data.link);
  }
});

Template.nodePreview.helpers({
  canUnlink: function () {
    var linkedNodeId = Template.instance().data._id;
    var originNodeId = Template.instance().data.originNodeId;
    var canUpdateLinked = PermissionsAPI.hasPermission(
      Meteor.userId(), 'update', linkedNodeId);
    var canUpdateOrigin = PermissionsAPI.hasPermission(
      Meteor.userId(), 'update', originNodeId);
    return canUpdateLinked || canUpdateOrigin;
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
