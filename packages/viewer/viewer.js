state = new ReactiveDict();

Viewer = {
	initialize: function () {
		console.log('initialize the viewer');
	}
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
		// TODO find a more robust way of getting contentHtml
		var contentHtmlString = $(template.find('pre')).html();
		var selectionData = getBorderAndSelectedContent(
			selection, contentHtmlString);
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
	var selectionMarkers = insertSelectionMarkers(selection);
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

