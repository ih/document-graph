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
	filterLinks: function (direction, nodeId, linkedNodeIds) {
		if (nodeId) {
			var links = GraphAPI.getNodeLinks(nodeId, direction);
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
			return links;
		}
		else {
			return [];
		}
	}
};

Template.viewer.created = function () {
	state.set('showingSelections', false);
};

Template.viewer.rendered = function () {
	console.log('viewer rendered');
	console.log(this);
	this.$('.title').css('background-color', state.get('colorMap')[this.data._id]);
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
		var links = Viewer.filterLinks('from', nodeId, linkedNodeIds);

		var borderDictionary = createBorderDictionary(links);
        var renderedContent = insertSelectionBorders(
			Template.instance().data.content, borderDictionary);
		var nodeIds = _.pluck(links, 'to');
		renderedContent = addColors(nodeIds, renderedContent);
        return renderedContent;
	},
	canUpdate: function () {
		var nodeId = Template.instance().data._id;
		return PermissionsAPI.hasPermission(Meteor.userId(), 'update', nodeId);
	}
});

/**
Border Dictionary structure:
{
 index in content: {open: [node id,... ], close: [node id,... ]},
...
}
*/
function createBorderDictionary(links) {
    var borderDictionary = {};
    _.each(links, function (link) {
        if (borderDictionary[link.selection.border.open] === undefined) {
            borderDictionary[link.selection.border.open] = {open : [],
															close : []};
        }
        if (borderDictionary[link.selection.border.close] === undefined) {
            borderDictionary[link.selection.border.close] = {open : [],
															 close : []};
        }
        borderDictionary[link.selection.border.open]['open'].push(link.to);
        borderDictionary[link.selection.border.close]['close'].push(link.to);
    });
    return borderDictionary;
}

function insertSelectionBorders (content, borderDictionary) {
    var newContent = '';
	var openSelections = [];
	var openSpanCount = 0;
    /*
     Insert selection borders by iterating over content instead of selections
     since adding borders will change the length of the new content and
     make the selection border information incorrect
     */
	for (var index = 0; index <= content.length; index++ ) {
		var character = content[index];
		// selectionList => {open: [id,... ],close: [id,... ]}
		var selectionList = borderDictionary[index];
        if (selectionList) {
			// TODO refactor the create of the border tag lists
			// create the html tags that represent borders of a selection
			var borders = _.map(_.range(openSpanCount), function () {
				return '</span>';
			});
			_.map(selectionList['close'], function(selectionId) {
				openSelections = _.without(openSelections, selectionId);
			});

			if (selectionList['open'].length > 0 ||
				(borders.length > 0 && openSelections.length > 0)) {
				var selectionIds = borders.length > 0 ?
						selectionList['open'].concat(openSelections) :
						selectionList['open'];
				var openBorderElement = '<span class="selection-border ' +
						selectionIds.join(' ') + '">';
				borders.push(openBorderElement);
				openSelections = openSelections.concat(selectionList['open']);
				openSpanCount += 1;
			}

			// insert the closing border html elements before the open ones for
			// asthetics
            _.each(borders, function(span) {
                newContent += span;
            });
        }
		// don't try to add any characters after content is over
		if (index < content.length) {
			newContent += character;
		}
	}
    return newContent;
}

function addColors(nodeIds, renderedContent) {
	var $wrapped = $('<div>'+renderedContent+'</div>');
    var colorMap = state.get('colorMap');
	_.each(nodeIds, function (nodeId) {
		if (colorMap[nodeId] === undefined) {
			var newColor = Utility.randomColor();
			colorMap[nodeId] = newColor;
		}
		$wrapped.find('span.'+nodeId).css('background-color', colorMap[nodeId]);
	});
	state.set('colorMap', colorMap);
	console.log('the color map:' + JSON.stringify(colorMap));
	return $wrapped.html();
}

Template.viewer.events({
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
