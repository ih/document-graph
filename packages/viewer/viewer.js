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
*/

var state = new ReactiveDict();
state.set('colorMap', {});

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
		direction, nodeId, sortProperty, sortAscending, linkedNodeIds) {
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

};

Template.viewer.rendered = function () {
	console.log('viewer rendered');
	console.log(this);
	this.$('.title').css('background-color', SelectionRendering.colorMap.get(this.data._id));
};



Template.viewer.helpers({
	focusedNodeId: function () {
		// return a list
		return Mondrian.getFocusedCellNodeId();
	},
	displayedNodeIds: function () {
		return Mondrian.getAllCellNodeIds();
	},
	isFocused: function () {
		return Mondrian.getFocusedCellNodeId() === Template.instance().data._id;
	},
	isShowingSelections: function () {
		return Viewer.isShowingSelections();// state.get('showingSelections');
	},
	renderContent: function (linkedNodeIds) {
		var nodeId = Template.instance().data._id;
		var links = Viewer.filterLinks('from', nodeId, null, true, linkedNodeIds);
		var renderedContent = SelectionRendering.addSelections(
			Template.instance().data.content, links);
		// var borderDictionary = createBorderDictionary(links);
        // var renderedContent = insertSelectionBorders(
		// 	Template.instance().data.content, borderDictionary);
		// var nodeIds = _.pluck(links, 'to');
		// renderedContent = addColors(nodeIds, renderedContent);
        return renderedContent;
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
			nodeId, [], GraphAPI.getNodeLinks, undefined, GraphAPI.deleteLink);

		// DELETING PERMISSIONS  MUST BE LAST!
		Utility.updateReferencedObjects(
			nodeId, [], PermissionsAPI.getResourcePermissions,
			PermissionsAPI.createPermission, PermissionsAPI.deletePermission);


		// delete the permissions
		SearchAPI.remove('nodes', templateInstance.data);
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
			removeSelectionMarkers(templateInstance);
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
	var selectionMarkers = insertSelectionMarkers(selection);
	var htmlContent = templateInstance.$('.content-viewer pre').html();
	var nonAnnotatedMarkedContent = removeAnnotations(htmlContent);
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

	// removeSelectionMarkers();
	return {border: border, selectedContent: selectedContent};
}

/** Markers (special html tags) get inserted into the node content to
 indicate the location of the selection borders.
**/
function insertSelectionMarkers(selection) {
	var markers = createMarkers();
	// http://stackoverflow.com/a/9829634 to move the cursor to the end
	var range = selection.getRangeAt(0);
	var selectedContent = range.toString();
	range.deleteContents();
	var selectionNode = $(
		markers.open + selectedContent + markers.close + '</span>')[0];
	range.insertNode(selectionNode);

	range.setStartAfter(selectionNode);
	range.setEndAfter(selectionNode);
	selection.removeAllRanges();
	selection.addRange(range);

	return markers;

	function createMarkers() {
		// need a string that probably does not appear in the content
		// so that we can use indexOf to find it
		var uniqueString = new Date().getTime();
		// this tag is closed when the dom node is created
		var openMarker =
			'<span class="selection-marker" id="open'+uniqueString+'">';
		var closeMarker = '<span class="close-selection-marker" id="close' +
				uniqueString + '"></span>';

		return {open: openMarker, close: closeMarker};
	}
}

function removeSelectionMarkers(templateInstance) {
	// http://stackoverflow.com/a/4232971
	templateInstance.$('.selection-marker').contents().unwrap();
	templateInstance.$('.close-selection-marker').remove();
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
