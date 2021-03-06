/**
 * Editor gets exported and acts as the interface to the editor component
 *
 * TODO: move tag and privacy editor out into their own packages when it's
 * easy to access data from sub templates or even better create a
 * tags/privacy-ui package that has both editor and display
 */

// maybe this isn't needed...
var Editor = {
  initialize: function (mode, params) {
    console.log('initializing the editor');
  }
};

Template.editor.events({
  // make nodeData reactive for preview functionality
  'input .content': function (event, templateInstance) {
    var updatedLinks = adjustLinks(
      templateInstance.links.get(),
      templateInstance.data.reactiveNode.get('content'), event.target.value,
      event.target.selectionStart);
    templateInstance.links.set(updatedLinks);
    templateInstance.data.reactiveNode.set('content', event.target.value);
  },
  'input .title': function (event, templateInstance) {
    templateInstance.data.reactiveNode.set('title', event.target.value);
  },
  'click .cancel': function (event, templateInstance) {
    // needed to prevent focus onto this cell after it's been removed
    event.stopPropagation();
    var node = templateInstance.data.node;
    if (templateInstance.data.mode === 'create') {
      GraphAPI.deleteNode(node);
      Utility.updateReferencedObjects(
        node._id, [], TagsAPI.getTags, TagsAPI.createTag,
        TagsAPI.deleteAllTags);
      Utility.updateReferencedObjects(
        node._id, [], GraphAPI.getAllNodeLinks, undefined, GraphAPI.deleteLink);
      Mondrian.collapseCell();

      // DELETING PERMISSIONS  MUST BE LAST!
      Utility.updateReferencedObjects(
        node._id, [], PermissionsAPI.getResourcePermissions,
        PermissionsAPI.createPermission, PermissionsAPI.deletePermission);

    }
    else if (templateInstance.data.mode === 'edit') {
      Mondrian.setCellContent({
        templateName: 'viewer', context: node});
    }
    else {
      console.error('Editor in an unrecognized mode');
    }
  },
  'click .preview-off': function (event, templateInstance) {
    templateInstance.preview.set(false);
  },
  'click .preview-on': function (event, templateInstance) {
    templateInstance.preview.set(true);
  },

  'click .save': function (event, templateInstance) {
    // the keys property of a reactive dict is basically the plain dict
    var nodeData = templateInstance.data.reactiveNode;
    var updatedNodeData = {
      _id: nodeData.get('_id'),
      content: templateInstance.$('textarea.content').val(),
      title: templateInstance.$('input.title').val()
    };

    GraphAPI.updateNode(updatedNodeData);

    _.each(templateInstance.links.get(), function (link) {
      GraphAPI.updateLink(link);
    });

    Utility.updateReferencedObjects(
      nodeData.get('_id'), getTags(), TagsAPI.getTags, TagsAPI.createTag,
      TagsAPI.deleteTag);

    Utility.updateReferencedObjects(
      nodeData.get('_id'), getPermissions(),
      PermissionsAPI.getResourcePermissions,
      PermissionsAPI.createPermission,
      PermissionsAPI.deletePermission
    );

    // hack to index createdAt with the node
    Tracker.autorun(function (computation) {
      console.log('indexing the edit');
      // want to get the creation date
      var updatedNode = GraphAPI.getNode(nodeData.get('_id'));
      if (updatedNode) {
        // in case the above write isn't done before getNode returns
        _.extend(updatedNode, updatedNodeData);
        SearchAPI.index('nodes', updatedNode);
        computation.stop();
      }
    });


    if (templateInstance.data.mode === 'create') {
      analytics.track('Created Document');
    }
    else if (templateInstance.data.mode === 'edit') {
      analytics.track('Edited Document', {
        nodeId: updatedNodeData._id
      });
    }

    Mondrian.setCellContent({templateName: 'viewer', context: updatedNodeData});


    // TODO move these functions into their own packages when
    // privacy and tags become separate ui components
    function getPermissions() {
      // currently assumes nodes are private/public, eventually will add
      // non-public shareable
      var permissions = [{
        actorId: Meteor.userId(),
        actions: PermissionsAPI.ALL,
        resourceId: nodeData.get('_id')
      }];

      if ($('#privacy-editor').is(':checked')) {
        permissions = permissions.concat({
          actorId: GroupsAPI.combineGroupRole(
            'public', GroupsAPI.MEMBER),
          actions: PermissionsAPI.READ,
          resourceId: nodeData.get('_id')
        });
      }
      return permissions;
    }

    function getTags() {
      return _.map($('#myTags').tagit("assignedTags"), function (label) {
        return {objectId: nodeData.get('_id'), label: label};
      });
    }
  }
});

Template.editor.created = function () {
  var templateInstance = this;
  templateInstance.data.reactiveNode = Utility.makeReactive(
    templateInstance.data.node);
  templateInstance.links = new ReactiveVar();
  templateInstance.preview = new ReactiveVar();
  console.log('creating the editor with node ' + this.data.reactiveNode.get('_id'));
  // TODO check for tags/node properties in data.node
  // if they are not present fetch them from mongo
  // this.node = this.data.node;

};

Template.editor.helpers({
  editorWidth: function () {
    if (Template.instance().preview.get()) {
      return 'col-md-6';
    }
    else {
      return 'col-md-12';
    }
  },
  nodeContent: function () {
    return Template.instance().data.reactiveNode.get('content');
  },
  nodeTags: function () {
    return _.pluck(
      TagsAPI.getTags(
        Template.instance().data.reactiveNode.get('_id'), true), 'label');
  },
  nodeTitle: function () {
    return Template.instance().data.reactiveNode.get('title');
  },
  preview: function () {
    return Template.instance().preview.get();
  },
  previewWidth: function () {
    if (Template.instance().preview.get()) {
      return 'col-md-6';
    }
    else {
      return 'hidden';
    }
  },
  renderContent: function () {
    var templateInstance = Template.instance();

    console.log('rendering editor preview content');
    var links = templateInstance.links ? templateInstance.links.get() : undefined;
    var content = templateInstance.data.reactiveNode.get('content');
    if (links && content) {
      var newContent = SelectionRendering.addSelections(content, links);
      return newContent;
    }
    else {
      return templateInstance.data.reactiveNode.get('content');
    }
  }
});

Template.editor.rendered = function () {
  console.log('editor rendered');
  var templateInstance = this;
  templateInstance.$('textarea').autogrow({onInitialize: true});
  templateInstance.$('#privacy-editor').bootstrapSwitch();

  Tracker.autorun(function (computation) {
    console.log('setting links for editor');
    var links = GraphAPI.getNodeLinks(
      templateInstance.data.reactiveNode.get('_id'), 'from');
    templateInstance.links.set(links);
  });

  templateInstance.$('#myTags').tagit();
  Tracker.autorun(function (computation) {
    var privacyLevel = PermissionsAPI.getPrivacyLevel(
      templateInstance.data.reactiveNode.get('_id'));
    if (privacyLevel === PermissionsAPI.privacyLevels.GLOBAL) {
      templateInstance.$('#privacy-editor').bootstrapSwitch('setState', true);
    }
    else {
      templateInstance.$('#privacy-editor').bootstrapSwitch('setState', false);
    }
  });
};

function resetEditor(templateInstance) {
  // used for resetting the title input, would be nice if there was two-way
  // binding...
  $('input').val('');

  _.each(GraphAPI.nodeProperties, function (nodeProperty) {
    // TODO figure out a better way to set the default value
    templateInstance.data.reactiveNode.set(nodeProperty, '');
  });
  clearTags();
  console.log('cleared state');
}

function clearTags() {
  return $("#myTags").tagit("removeAll");
}

function adjustLinks(links, oldContent, newContent, newCaretPosition) {
  var changeLength = newContent.length - oldContent.length;
  if (changeLength === 0) {
    return links;
  }
  _.each(links, function (link) {
    link.selection.border.open = adjustBorder(link.selection.border.open);
    link.selection.border.close = adjustBorder(link.selection.border.close);
  });

  return links;

  function adjustBorder(borderPosition) {
    if (borderPosition >= newCaretPosition) {
      return borderPosition + changeLength;
    }
    else {
      return borderPosition;
    }
  }
}
