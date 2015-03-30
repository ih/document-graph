Meteor.startup(function () {
  console.log('starting with segment' + Meteor.settings.public.segmentKey);
  analytics.load(Meteor.settings.public.segmentKey);

  Tracker.autorun(function () {
    var user = Meteor.user();
    if (user) {
      console.log('subscribing to my permissions');
      Meteor.subscribe('myPermissions');
      // TODO alias anonymous id w/ this one

      analytics.identify(user._id, {
        username: user.username,
        email: user.emails[0].address
      });
      // TODO move to account creation
      analytics.track('Logged In', {
        landingPage: document.URL
      });
    }
    else {
      console.log('setting up anonymous user');
      // http://www.mattzeunert.com/2014/10/29/tracking-anonymous-users-with-mixpanel.html
      var userId = localStorage.getItem('userId');
      if (!userId){
        userId = 'anonymous' + Math.round(Math.random() * 1000000000);
        userId = userId.toString();
        localStorage.setItem('userId', userId);
      }
      analytics.identify(userId, {
        username: userId,
        email: userId + '@anon.com'
      });
      analytics.track('Anonymous Visit', {
        landingPage: document.URL
      });
    }
  });
});

Template.layout.created = function () {

};

Template.registerHelper('count', function (countable) {
  return countable.length;
});

Template.registerHelper('isShowingSelections', function () {
  return Viewer.isShowingSelections();
});

Template.registerHelper('date', function (isoTimeStamp) {
  return isoTimeStamp.slice(0, 10);
});

Template.layout.events({
  'click .cancel-link': function (event, templateInstance) {
    event.preventDefault();
    var selection = Viewer.state.get('selection');
    Viewer.state.set('linkMode', false);
    Tracker.autorun(function (computation) {
      var node = GraphAPI.getNode(selection.nodeId);
      if (node) {
        Viewer.state.set('selection', null);
        Mondrian.setCellContent(
          {templateName: 'viewer', context: node});
        computation.stop();
      }
    });
  },
  'click .create-node': function (event) {
    event.preventDefault();
    var newNodeData = makeNode();

    Mondrian.setCellContent({
      templateName: 'editor',
      context: {node: newNodeData, mode: 'create'}});
  },
  'click .create-linked-node': function (event) {
    event.preventDefault();
    var selection = Viewer.state.get('selection');
    var newNodeData = makeNode('', selection.selectedContent);
    GraphAPI.connect(selection.nodeId, newNodeData._id, selection);

    Mondrian.divideCell(
      'auto', undefined, undefined, {
        templateName: 'editor',
        context: {node: newNodeData, mode: 'create'}});
  },
  'click .help': function (event, templateInstance) {
    event.preventDefault();
    if (!Meteor.user()) {
      ProductTour.startAnonymousTour();
    }
    else {
      ProductTour.startCompleteTour();
    }
  },
  'click .link-existing-node': function (event, templateInstance) {
    event.preventDefault();
    var selection = Viewer.state.get('selection');
    Viewer.state.set('linkMode', true);
    Tracker.autorun(function (computation) {
      var howToLinkNode = GraphAPI.getNode(Documentation.howToLinkId);
      if (howToLinkNode) {
        Mondrian.divideCell(
          undefined, undefined, undefined,
          {templateName: 'viewer', context: howToLinkNode});
        computation.stop();
      }
    });
  },
  'click .link': function (event, templateInstance) {
    event.preventDefault();
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
  },
  'click .toggle-selections': function (event, templateInstance) {
    event.preventDefault();
    if (Viewer.isShowingSelections()) {
      Viewer.hideSelections();
    }
    else {
      Viewer.showSelections();
    }
  }
});

Template.layout.helpers({
  getFocusedCellUrl: function () {
    var nodeId = Mondrian.getFocusedCellNodeId();
    if (nodeId) {
      return nodeId;
    }
    else {
      return '';
    }
  },
  isLinkMode: function () {
    return Viewer.state.get('linkMode');
  },
  isSelectionMade: Viewer.isSelectionMade,
  panelWidth: function (direction) {
    if (NodeListPanel.openStates.get(direction)) {
      return 'col-md-2';
    }
    else {
      return 'col-md-1';
    }
  },
  mainViewWidth: function () {
    if (NodeListPanel.openStates.get('to') && NodeListPanel.openStates.get('from')) {
      return 'col-md-8';
    }
    else if (NodeListPanel.openStates.get('to') || NodeListPanel.openStates.get('from')) {
      return 'col-md-9';
    }
    else {
      return 'col-md-10';
    }
  },
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
  Tracker.autorun(function () {
    if (!Meteor.userId()) {
      ProductTour.startAnonymousTour();
    }
    else {
      ProductTour.startWriteTour();
    }
  });
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
  TagsAPI.makeCreatorTag(newNodeData._id);

  return newNodeData;
}
