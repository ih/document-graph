NodeListPanel = {

};

Template.nodeListPanel.isSelectionMade = function () {
	return Viewer.state.get('selection');
};

Template.nodeListPanel.events({
	'click .create-node': function (event) {
		var newNodeData = {
			content: '',
			title: ''
		};
		newNodeData._id = GraphAPI.createNode(newNodeData);
		PermissionsAPI.createPermission({
			actorId: Meteor.userId(),
			actions: PermissionsAPI.ALL,
			resourceId: newNodeData._id
		});

		// is there a race condition where cell content is loaded before 
		// permission is created?
		Mondrian.setCellContent(
			{templateName: 'editor', context: {node: newNodeData}});
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
