/**
 The state of the viewer refers to the currently focused mondrian cell.

 It contains a selection object for when the user
 highlights some of the content of the viewed node.

 Selection Object
 {
 border: {close: [index for selection end], open: [index of selection start]},
 nodeId: [viewed node id],
 selectedContent: [part of content that was selected]
 }

 it also determines whether selections are being shown via the
 showingSelections boolean variable

 linkedClickEvent which holds the last time a link was clicked

 */

var state = new ReactiveDict();
state.set('colorMap', {});
state.set('showingSelections', true);

console.log('state initialized');

Viewer = {
  initialize: function () {
    console.log('initialize the viewer');
  },
  // Consider making state read-only by having a function
  // readOnly(propertyName) = return state.get(propertyName)
  state: state,
  isSelectionMade: function () {
    return state.get('selection') &&
      state.get('selection').selectedContent != '';
  },
  isShowingSelections: function () {
    return state.get('showingSelections');
  },
  showSelections: function () {
    state.set('showingSelections', true);
  },
  hideSelections: function () {
    state.set('showingSelections', false);
  },
  filterLinks: function (
    direction, nodeId, sortProperty, sortAscending, linkedNodeIds, bySelection) {
    if (nodeId) {
      console.log('getting links for viewer');
      var links = GraphAPI.getNodeLinks(nodeId, direction);
      if (!sortProperty) {
        sortProperty = 'occurence';
      }
      if (linkedNodeIds) {
        if (linkedNodeIds.constructor !== Array) {
          linkedNodeIds = [linkedNodeIds];
        }
        links = _.filter(links, function (link) {
          return _.contains(
            linkedNodeIds,
            link[GraphAPI.otherDirection(direction)]);
        });
      }

      // filter by tag (make function?)
      var activeLabels = TagsInterface.getActiveLabels();
      if (activeLabels.length > 0) {
        links = _.filter(links, function (link) {
          var neighborId = link[GraphAPI.otherDirection(direction)];
          var neighborTags = TagsAPI.getTags(neighborId);
          return _.intersection(
            activeLabels, _.pluck(neighborTags, 'label')).length > 0;
        });
      }

      // filter by selection
      // (only show links that intersect with the current selection)
      if (state.get('selection')) {
        var intersectingLinks = _.filter(links, function (link) {
          return GraphAPI.isIntersecting(
            state.get('selection').border, link.selection.border);
        });
        if (bySelection && intersectingLinks.length > 0) {
          links = intersectingLinks;
        }
      }

      // sorting related code
      if (sortProperty === 'rating') {
        _.each(links, function (link) {
          // sortBy is ascending and we want ratings to be descending
          link.rating = -1 * RatingsAPI.getCommunityRating(
            link[GraphAPI.otherDirection(direction)]);
        });
      }
      if (sortProperty === 'occurence') {
        _.each(links, function (link) {
          link.occurence = link.selection.border.open;
        });
      }
      links = _.sortBy(links, sortProperty);
      if (!sortAscending) {
        links.reverse();
      }
      return links;
    }
    else {
      return [];
    }
  }
};

Template.viewer.created = function () {
  var templateInstance = this;
  templateInstance.showUrl = new ReactiveVar(false);
};

Template.viewer.rendered = function () {
  var templateInstance = this;
  console.log('viewer rendered');
  console.log(templateInstance);
  templateInstance.$('.title').css(
    'background-color', SelectionRendering.colorMap.get(this.data._id));
};

Template.viewer.helpers({
  focusedNodeId: function () {
    // return a list
    return Mondrian.getFocusedCellNodeId();
  },
  displayedNodeIds: function () {
    return Mondrian.getAllCellNodeIds();
  },
  getNodeUrl: function () {
    return GraphAPI.getNodeUrl(Template.instance().data._id);
  },
  getPrivacyLevel: function () {
    var privacyLevel = PermissionsAPI.getPrivacyLevel(
      Template.instance().data._id);
    if (privacyLevel === PermissionsAPI.privacyLevels.GLOBAL) {
      return 'glyphicon-globe';
    }
    else {
      return 'glyphicon-user';
    }
  },
  isFocused: function () {
    return Mondrian.getFocusedCellNodeId() === Template.instance().data._id;
  },
  renderContent: function (linkedNodeIds) {
    var nodeId = Template.instance().data._id;
    var links = Viewer.filterLinks('from', nodeId, null, true, linkedNodeIds);
    if (state.get('selection') && nodeId === state.get('selection').nodeId) {
      return SelectionRendering.addSelections(
        Template.instance().data.content, links, state.get('selection'));
    }
    else {
      return SelectionRendering.addSelections(
        Template.instance().data.content, links);
    }
  },
  showUrl: function () {
    if (Template.instance().showUrl.get() || state.get('linkMode')) {
      return '';
    }
    else {
      return 'hidden';
    }
  },
  can: function (action) {
    var nodeId = Template.instance().data._id;
    return PermissionsAPI.hasPermission(Meteor.userId(), action, nodeId);
  }
});

Template.viewer.events({
  'click .edit-node': function (event, templateInstance) {
    Mondrian.setCellContent({
      templateName: 'editor',
      context: {node: templateInstance.data, mode: 'edit'}});
  },
  'click .delete-node': function (event, templateInstance) {
    GraphAPI.deleteNode(templateInstance.data);
    Mondrian.collapseCell();
    var nodeId = templateInstance.data._id;
    // delete the tags
    Utility.updateReferencedObjects(
      nodeId, [], TagsAPI.getTags, TagsAPI.createTag,
      TagsAPI.deleteAllTags);
    Utility.updateReferencedObjects(
      nodeId, [], RatingsAPI.getRatings, undefined,
      RatingsAPI.deleteRating);
    Utility.updateReferencedObjects(
      nodeId, [], GraphAPI.getAllNodeLinks, undefined, GraphAPI.deleteLink);

    // DELETING PERMISSIONS  MUST BE LAST!
    Utility.updateReferencedObjects(
      nodeId, [], PermissionsAPI.getResourcePermissions,
      PermissionsAPI.createPermission, PermissionsAPI.deletePermission);


    // delete the permissions
    SearchAPI.remove('nodes', templateInstance.data);
  },
  'click .selection-border': function (event, templateInstance) {
    // TODO keep track if this is a to or from selection
    console.log('clicked on selection border');
    state.set('linkClickedEvent', Date.now().toString());
  },
  'click .url-toggle': function (event, templateInstance) {
    templateInstance.showUrl.set(!templateInstance.showUrl.get());
  },
  'click .url-close, click .collapse-cell span': function (event, templateInstance) {
    templateInstance.showUrl.set(false);
  },
  'click .viewer': function (event, templateInstance) {
    if (state.get('selection') && this._id != state.get('selection').nodeId
        && !state.get('linkMode')) {
      state.set('selection', null);
    }
  },
  // TODO support keyboard highlighting
  'mouseup .content-viewer': function (event, templateInstance) {
    if (!state.get('linkMode')) {
      var selection = window.getSelection();

      var selectionData = getBorderAndSelectedContent(
        selection, templateInstance);
      selectionData.nodeId = this._id;
      state.set('selection', selectionData);
    }
  },
  'mousedown .content-viewer': function(event, templateInstance) {
    if (!state.get('linkMode')) {
      state.set('selection', null);
    }
  }
});

/** Getting the border and selected content is complicated by the fact that the
 content being selected may have additional annotations inserted for display
 purposes, but we don't want those factored in when computing the border or as
 part of the selected content.

 We'll want to remove the annotations, but still know where the selection was
 made in the original content.  To do this we insert special "selection" markers
 into the  annotated html then remove all annotations and what is remaining is
 the original content with the special markers around the selected content.
 **/
function getBorderAndSelectedContent(selection, templateInstance) {
  // selection markers get inserted into the DOM through the range/selection
  // object. that's why we need to pass template instead of an html string
  // since getting the html has to happen after inserting the selection
  // markers
  var $htmlCopy = templateInstance.$('.content-viewer pre').clone();
  var selectionMarkers = insertSelectionMarkers(selection, $htmlCopy);

  var nonAnnotatedMarkedContent = removeAnnotations($htmlCopy.html());
  var border = {
    'open': nonAnnotatedMarkedContent.indexOf(selectionMarkers.open),
    'close': nonAnnotatedMarkedContent.indexOf(selectionMarkers.close) -
      selectionMarkers.open.length
  };
  var selectedContent = nonAnnotatedMarkedContent.slice(
    border.open+selectionMarkers.open.length,
    border.close+selectionMarkers.open.length);
  console.log(border);
  console.log('selected content:'+selectedContent);



  // workaround for meteor bug with rendering when there is a selection?
  // if (selectedContent.length > 0) {
  //    templateInstance.$('.content-viewer pre').empty();
  // }


  // try to recreate and submit issue
  // var range = selection.getRangeAt(0);
  // range.deleteContents();
  // selection.removeAllRanges();
  return {border: border, selectedContent: selectedContent};
}

/** Markers (special html tags) get inserted into the node content to
 indicate the location of the selection borders.
 **/
function insertSelectionMarkers(selection, $htmlCopy) {
  var markers = createMarkers();
  // http://stackoverflow.com/a/9829634 to move the cursor to the end
  var range = selection.getRangeAt(0);

  if (range.collapsed) {
    // insert close marker first otherwise the offsets will be wrong
    insertMarker(markers.close, selection.anchorNode, selection.anchorOffset);
    insertMarker(markers.open, selection.anchorNode, selection.anchorOffset);
  }
  else {
    // insert close marker first otherwise the offsets will be wrong
    insertMarker(markers.close, range.endContainer, range.endOffset);
    insertMarker(markers.open, range.startContainer, range.startOffset);
  }


  return markers;

  function createMarkers() {
    // need a string that probably does not appear in the content
    // so that we can use indexOf to find it
    var uniqueString = new Date().getTime();
    var openMarker =
          '<span class="selectionMarker" id="open'+uniqueString+'"></span>';
    var closeMarker =
          '<span class="selectionMarker" id="close'+uniqueString+'"></span>';
    // [0] since they are jquery created and you need to extract the dom
    // node for insertNode
    return {open: openMarker, close: closeMarker};
  }

  function insertMarker(marker, rangeNode, rangeOffset) {
    // assumes rangeNode is uniquely identifiable in
    var parentSelector = Utility.getSelector(rangeNode.parentElement, $htmlCopy[0]);
    var indexOfNode = _.indexOf(rangeNode.parentElement.childNodes, rangeNode);


    var parentElementCopy = $htmlCopy[0];

    if (parentSelector != '') {
      // assumes rangeNode parent uniquely identifiable by tag name, id, and class name
      // TODO make more robust
      // can't use isEqualNode comparison between elements in $htmlCopy and
      // rangeNode. parentElement b/c the parent element copy changes as
      // markers get inserted
      parentElementCopy = _.filter(
        $htmlCopy.find(parentSelector), function (element) {
          return element.tagName === rangeNode.parentElement.tagName &&
            element.className === rangeNode.parentElement.className;
        })[0];
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Text.splitText
    var textNode = parentElementCopy.childNodes[indexOfNode];
    var replacementNode = textNode.splitText(rangeOffset);
    parentElementCopy.insertBefore($(marker)[0], replacementNode);
  }
}

/** Remove everything, but the original content and the selection markers in
 order to get an accurate snippet of content and its borders.
 */
function removeAnnotations(htmlString) {
  // TODO improve how annotations are specified instead of hardcoding classes
  htmlString = removeFromHtmlString(htmlString,  '.selection-border');
  return htmlString;

  // from http://stackoverflow.com/a/12110097
  function removeFromHtmlString(htmlString, selector) {
    var $wrapped = $('<div>'+htmlString+'</div>');
    $wrapped.find(selector).contents().unwrap();
    return $wrapped.html();
  }

  /** Don't want to remove selection markers that may end up inside the
   annotation tags **/
  function moveUpSelectionMarkers($html, selector) {
    $html.find(selector + ' .selection-marker').each(function() {
      $(this).insertBefore($(this).parent());
    });
    return $html;
  }
}
