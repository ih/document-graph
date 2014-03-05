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
			console.log(GraphAPI.getNode(this.params._id));
			return GraphAPI.getNode(this.params._id);}});
});
