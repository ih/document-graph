NodeListPanel = {

};

Template.nodeListPanel.isSelectionMade = function () {
	return Viewer.state.get('selection');
};

Template.nodeListPanel.events({
	'click .create-node': function (event) {
		var newNodeId = GraphAPI.createNode({
			nodeContent: '',
			title: '',
			permissions: {
				actorId: Meteor.userId(),
				actions: PermissionsAPI.ALL
			},
			tags: ['draft']
		});
		Mondrian.setCellContent(
			{templateName: 'editor', context: {'nodeId': newNodeId}});
	},
	'click .create-linked-node': function (event) {
		console.log('clicked');

		Mondrian.divideCell(
			'vertical', undefined, undefined,
			{
				templateName: 'editor',
				context: {
					'mode': 'create',
					'title': Viewer.state.get('selection')
				}
			});
	}
});
