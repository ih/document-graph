var state = new ReactiveDict();

Viewer = {
	initialize: function () {
		console.log('initialize the viewer');
	},
	// Consider making state read-only by having a function
	// readOnly(propertyName) = return state.get(propertyName)
	state: state
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
		state.set('selection', selectionData);
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
	console.log(selectedContent);
	removeSelectionMarkers();
	return {border: border, selectedContent: selectedContent};
}

/** Markers (special html tags) get inserted into the node content to
 indicate the location of the selection borders.
**/
function insertSelectionMarkers(selection) {
	var markers = createMarkers();
	// insert the opening marker at the beginning of the selection
	var range = selection.getRangeAt(0);
	range.insertNode($(markers.open)[0]);
	// insert the closing marker at the end of the selection
	range.collapse(false);
	range.insertNode($(markers.close)[0]);
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
}

function removeSelectionMarkers() {
	$('.selectionMarker').remove();
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
		$html.find(selector + ' .selectionMarker').each(function() {
			$(this).insertBefore($(this).parent());
		});
		return $html;
	}
}
