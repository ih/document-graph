NodeListPanel = {

};

Template.nodeListPanel.isSelectionMade = function () {
	return Viewer.state.get('selection');
};

Template.nodeListPanel.events({
	'click .create-linked-node': function (event) {
		console.log('clicked');

		Mondrian.divideCell(
			'vertical', undefined, undefined,
			{templateName: 'editor', context: {}});
	}
});
