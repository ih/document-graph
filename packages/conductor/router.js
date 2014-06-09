// FOR A HACK SINCE ROUTER GETS CALLED MULTIPLE TIMES EVEN WHEN PATH HAS NOT 
// CHANGED
var currentPath;

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
			// this is reactive to getNode which might not be defined when first
			// called, should find a better solution
			if (targetNode && currentPath != window.location.pathname) {
				currentPath = window.location.pathname;
				console.log('new route!');
				Mondrian.setCellContent(
				 	{templateName: 'viewer', context: targetNode});
			}

			return targetNode;
		}});
});


