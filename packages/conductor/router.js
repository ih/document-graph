Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
	this.route('default', {
		path: '/'
	});
	this.route('viewer', {
		path: '/node/:_id',
		data: function () {
			console.log('setting data for router');
			var targetNode = GraphAPI.getNode(this.params._id);
			Mondrian.setFocusedCellContent(Template.viewer, targetNode);
			return targetNode;
		}});
});
