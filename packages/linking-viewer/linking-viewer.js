LinkingViewer = {};

Template.linkingViewer.rendered = function () {
	var selection = Viewer.state.get('selection');
	var content = this.data.content;
	var markedContent = content.slice(0, selection.border.open) + 
		'<span class="selection-marker">'  + 
		content.slice(selection.border.open, selection.border.close) + 
		'</span>' + content.slice(selection.border.close);
	this.$('.content').html(markedContent);
};

Template.linkingViewer.events({
	'click button.cancel-linking': function (event) {
		Viewer.state.set('linkMode', false);
		Viewer.state.set('selection', null);
		Mondrian.setCellContent({templateName: 'viewer', context: this});
	}
});
