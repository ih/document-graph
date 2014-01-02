TagEditor = {
	initialize: function () {
		console.log('yolo');
	},
	/** Return a list of strings that are the tags in the tag editor.
	 */
	// TODO pass in a selector for choosing the tag input field
	getTags: function () {
		return $('#myTags').tagit("assignedTags");
	},
	// TODO pass in a selector for choosing the tag input field
	clearTags: function () {
		return $("#myTags").tagit("removeAll");
	}
};

Template.tagEditor.rendered = function () {
	console.log('tag editor rendered');
	$('#myTags').tagit();
};

