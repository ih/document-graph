/**
The state of the viewer contains a selection object for when the user
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

Viewer = {
	initialize: function () {
		console.log('initialize the viewer');
	},
	// Consider making state read-only by having a function
	// readOnly(propertyName) = return state.get(propertyName)
	state: state,
	isShowingSelections: function () {
		return state.get('showingSelections');
	},
	showSelections: function () {
		state.set('showingSelections', true);
	},
	hideSelections: function () {
		state.set('showingSelections', false);
	}
};

Template.viewer.created = function () {
	state.set('showingSelections', false);
};

Template.viewer.rendered = function () {
	console.log('viewer rendered');
	console.log(this);
};

Template.viewer.getId = function () {
	return this._id;
};

Template.viewer.events({
	// TODO support keyboard highlighting
	'mouseup .content-viewer': function (event, template) {
        var selection = window.getSelection();

		var selectionData = getBorderAndSelectedContent(
			selection);
		selectionData.nodeId = this._id;
		state.set('selection', selectionData);
	},
	'mousedown .content-viewer': function(event, template) {
		removeSelectionMarkers();
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
function getBorderAndSelectedContent(selection) {
	// selection markers get inserted into the DOM through the range/selection
	// object. that's why we need to pass template instead of an html string
	// since getting the html has to happen after inserting the selection
	// markers
	var selectionMarkers = insertSelectionMarkers(selection);
	var contentHtmlString = $('.content-viewer pre').html();
	var nonAnnotatedMarkedContent = removeAnnotations(contentHtmlString);
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

function removeSelectionMarkers() {
	// http://stackoverflow.com/a/4232971
	$('.selection-marker').contents().unwrap();
	$('.close-selection-marker').remove();
}

/** Remove everything, but the original content and the selection markers in
 order to get an accurate snippet of content and its borders.
*/
function removeAnnotations(htmlString) {
	// TODO improve how annotations are specified instead of hardcoding classes
	htmlString = removeFromHtmlString(htmlString, '.fragment-indicator');
	htmlString = removeFromHtmlString(htmlString,  '.fragment-border');
	return htmlString;

	// from http://stackoverflow.com/a/12110097
	function removeFromHtmlString(htmlString, selector) {
		var $wrapped = $('<div>'+htmlString+'</div>');
		$wrapped = moveUpSelectionMarkers($wrapped, selector);
		$wrapped.find(selector).remove();
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
